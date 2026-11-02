'use strict';
var fs=require('fs'),cp=require('child_process'),Service=require('/usr/lib/node_modules/webos-service'),policy=require('./policy'),processState=require('./process-state');
var root=__dirname,data=root+'/state',params=JSON.parse(process.argv[2]||'{}');
var service=new Service('com.mbs.communityhomehelper'),child=null,ready=false,stopping=false,launching=false,watch=null,timer=null,buffer='',lastAck=0,reporting=false,lastLease=0,starting=false;
var options=JSON.parse(fs.readFileSync(root+'/options.json','utf8'));
var lastTurn=Date.now(),suspensionAt=0,suspensionGap=0,exitInfo=null;
function observeTurn(){var at=Date.now(),gap=at-lastTurn;if(gap>=10000){suspensionAt=at;suspensionGap=gap;}lastTurn=at;}
var screen=policy.screen(options.watchedApps),logFile=data+'/controller.log',shared='/media/developer/apps/usr/palm/services/com.mbs.communityhome.helper/state',lastReport='',lastStatus='',parentTick=processState.read(process.pid).tick,workerTick=null;
function now(){var t=process.hrtime();return t[0]*1000+t[1]/1e6;}
function log(event,detail){try{if(fs.existsSync(logFile)&&fs.statSync(logFile).size>65536)fs.writeFileSync(logFile,'');fs.appendFileSync(logFile,JSON.stringify({time:Date.now(),event:event,detail:detail})+'\n');}catch(ignore){}}
function block(){try{fs.writeFileSync(data+'/blocked','paused');}catch(ignore){}}
function status(){try{var key=String(child&&child.pid)+':'+String(ready&&!stopping);if(key===lastStatus)return;lastStatus=key;fs.writeFileSync(data+'/status.json',JSON.stringify({pid:process.pid,worker:child&&child.pid,active:ready&&!stopping,at:Date.now()}));}catch(ignore){}}
function report(phase,done){try{var c=JSON.parse(fs.readFileSync(shared+'/control.json','utf8'));if(c.session!==params.session){done(true,false);return;}var key=phase+':'+String(child&&child.pid);if(key!==lastReport){fs.writeFileSync(shared+'/native-status.json.tmp',JSON.stringify({session:params.session,at:Date.now(),pid:process.pid,parentTick:parentTick,worker:child&&child.pid,workerTick:workerTick,active:phase==='active',released:phase==='released',exit:phase==='released'?exitInfo:null}),{mode:432});fs.renameSync(shared+'/native-status.json.tmp',shared+'/native-status.json');lastReport=key;}done(true,c.enabled&&!c.paused);}catch(e){log('state-error',e.code);done(false);}}
function launch(id,done){var settled=false,t=setTimeout(function(){if(!settled){settled=true;done(false);}},3000);service.call('luna://com.webos.applicationManager/launch',{id:id},function(m){if(settled)return;settled=true;clearTimeout(t);log('launch',{id:id,success:!!(m.payload&&m.payload.returnValue)});done(!!(m.payload&&m.payload.returnValue));});}
function home(reason){if(stopping||launching||fs.existsSync(data+'/blocked'))return;screen.resume();launching=true;log(reason);launch('com.mbs.communityhome',function(ok){launching=false;if(!ok)stop(true);});}
function lgHome(){if(stopping)return;screen.escape();if(launching){setTimeout(lgHome,100);return;}launching=true;log('lg-home-escape');launch('com.webos.app.home',function(ok){launching=false;if(!ok)stop(true);});}
function finish(code,signal){if(stopping==='finished')return;observeTurn();var wasReady=ready;exitInfo={code:code,signal:signal||null,suspensionGapMs:suspensionAt&&Date.now()-suspensionAt<10000?suspensionGap:0,recoverable:!!(wasReady&&(!stopping||stopping==='suspension')&&!signal&&(code===20||code===0&&stopping==='suspension')&&!(params.trialSeconds>0))};stopping='finished';clearInterval(timer);if(watch)watch.close();block();ready=false;status();log('worker-exit',exitInfo);
 function end(){report('released',function(){try{fs.unlinkSync(data+'/controller.pid');}catch(ignore){}process.exit(code===22?0:(code||0));});}
 var until=now()+3200;
 function complete(){if(code===22&&launching&&now()<until){setTimeout(complete,50);return;}if(code===22)launch('com.webos.app.home',function(){end();});else end();}
 if(!wasReady){complete();return;}
 var cleaned=false,cleanup=cp.spawn(root+'/relay',['cleanup'],{stdio:'ignore'}),guard=setTimeout(function(){cleanup.kill('SIGKILL');},1500);
 function cleanedUp(){if(cleaned)return;cleaned=true;clearTimeout(guard);complete();}
 cleanup.on('exit',cleanedUp);cleanup.on('error',cleanedUp);
}
function stop(pause,reason){if(stopping)return;stopping=reason||true;if(pause)block();if(watch)watch.close();if(child){child.stdin.end('Q');setTimeout(function(){try{child.kill('SIGKILL');}catch(ignore){}},1500);}else finish(0);}
process.on('SIGTERM',function(){stop(true);});process.on('SIGINT',function(){stop(true);});
process.on('uncaughtException',function(e){log('exception',String(e));stop(true);});
fs.writeFileSync(data+'/controller.pid',String(process.pid));log('start',{uid:process.getuid(),gid:process.getgid(),trialSeconds:params.trialSeconds||0});
service.activityManager.create('mbs-home-helper',function(){});
if(params.diagnostic&&params.safetyCheck){require('./safety-check')(root,log,function(pass){log('relay-self-test-complete',{pass:pass});process.exit(pass?0:1);});return;}
if(params.diagnostic){['com.webos.applicationManager/getForegroundAppInfo','com.webos.applicationManager/dev/running','com.webos.surfacemanager/getForegroundAppInfo'].forEach(function(uri){service.call('luna://'+uri,{},function(m){log('foreground-probe',{uri:uri,result:m.payload});});});setTimeout(function(){process.exit(0);},10000);return;}
if(params.resume){try{fs.unlinkSync(data+'/blocked');}catch(ignore){}}
if(!params.session||fs.existsSync(data+'/blocked')){finish(0);return;}
function startWorker(){
 child=cp.spawn(root+'/relay',[],{stdio:['pipe','pipe','pipe']});workerTick=processState.read(child.pid).tick;lastAck=now();status();report('starting',function(){});
 child.stdin.on('error',function(){});child.on('error',function(){finish(1);});child.on('exit',finish);
 child.stderr.on('data',function(b){log('worker-error',String(b));});
 child.stdout.on('data',function(b){buffer+=b;var i;while((i=buffer.indexOf('\n'))>=0){var line=buffer.slice(0,i);buffer=buffer.slice(i+1);if(line==='P'){lastAck=now();continue;}log('worker',line);if(line==='READY'){ready=true;lastAck=now();status();}if(line==='HOME'&&ready)home('home-key');if(line==='LGHOME'&&ready)lgHome();}});
 watch=require('./ha-watch')(root,log,function(id){if(screen.next(id,now())&&ready)home('app-exit');},function(){screen.reset();});
}
function lease(){if(reporting||stopping)return;reporting=true;report(ready?'active':'starting',function(ok,allowed){reporting=false;if(stopping)return;if(!ok||!allowed){log('lease-ended');stop(true);return;}lastLease=now();if(!child&&!starting){starting=true;if(params.openHome===false){startWorker();return;}launch('com.mbs.communityhome',function(ok){if(stopping)return;if(ok)startWorker();else stop(true);});}});}
lastLease=now();lease();
 timer=setInterval(function(){observeTurn();if(stopping)return;var suspended=suspensionAt&&Date.now()-suspensionAt<10000;if(fs.existsSync(data+'/blocked')||policy.expired(lastLease,now())){stop(true,suspended?'suspension':null);return;}if(child){if(policy.expired(lastAck,now())){if(suspended){stop(true,'suspension');return;}log('watchdog');child.kill('SIGKILL');return;}child.stdin.write('P');status();}lease();},400);
if(params.trialSeconds>0)setTimeout(function(){log('trial-ended');stop(true);},Math.min(params.trialSeconds,120)*1000);



