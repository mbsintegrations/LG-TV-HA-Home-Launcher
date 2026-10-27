'use strict';
var fs=require('fs'),crypto=require('crypto'),Service=require('webos-service'),processState=require('./process-state'),recovery=require('./recovery');
var service=new Service('com.mbs.communityhome.helper'),data=__dirname+'/state',file=data+'/control.json';
function read(){try{return JSON.parse(fs.readFileSync(file,'utf8'));}catch(e){return {enabled:false,paused:true,released:true};}}
var s=read(),boot=fs.readFileSync('/proc/sys/kernel/random/boot_id','utf8').trim();
if(s.boot!==boot){s.released=true;s.active=false;}
function save(){fs.writeFileSync(file+'.tmp',JSON.stringify(s),{mode:416});fs.renameSync(file+'.tmp',file);}
function refresh(){var r;try{r=JSON.parse(fs.readFileSync(data+'/native-status.json','utf8'));}catch(e){return;}
 if(!s.session||r.session!==s.session||s.boot!==boot)return;
 var parent=processState.read(r.pid),worker=processState.read(r.worker);
 s.at=r.at;s.active=!!(r.active&&processState.matches(parent,r.parentTick)&&processState.matches(worker,r.workerTick));
 if(s.active)s.at=Date.now();
 var exited=processState.gone(parent,r.parentTick)&&processState.gone(worker,r.workerTick)&&Date.now()-r.at>4000;
 if((r.released||exited)&&!s.released){s.recoveryPending=recovery.allowed(s,r,Date.now());s.released=true;s.paused=!s.recoveryPending;save();}
}
function state(){refresh();return {enabled:!!s.enabled,paused:!!s.paused,active:!!(s.active&&!s.paused&&Date.now()-s.at<2500),running:!s.released};}
function respond(m,ok,error){m.respond({returnValue:ok,state:state(),errorText:error});}
service.register('status',function(m){respond(m,true);});
function start(m,resume){
 try{
  refresh();
  if(!s.released&&Date.now()-(s.at||s.started)<5000){respond(m,true);return;}
  if(!resume&&(s.paused||!s.enabled)){respond(m,true);return;}
  if(!resume&&!s.released){
   // On wake, Home may run before the old controller receives its child-exit event.
   // Give that controller a bounded opportunity to report release; never take over
   // a remote whose previous owner is still present or whose identity is unknown.
   var pending;try{pending=JSON.parse(fs.readFileSync(data+'/native-status.json','utf8'));}catch(ignore){}
   if(pending&&pending.session===s.session&&pending.active&&!(processState.gone(processState.read(pending.worker),pending.workerTick)&&processState.gone(processState.read(pending.pid),pending.parentTick))){
    if(!s.releaseWaitStarted){s.releaseWaitStarted=Date.now();save();}
    if(Date.now()-s.releaseWaitStarted<15000){respond(m,true);return;}
   }
   s.paused=true;save();respond(m,false,'Helper stopped responding; resume explicitly');return;
  }
  var recovering=!resume&&s.recoveryPending,coldStart=!resume&&s.boot!==boot;
  if(recovering&&!coldStart){var r=JSON.parse(fs.readFileSync(data+'/native-status.json','utf8'));if(r.session!==s.session||!r.released||Date.now()-r.at<3000||!processState.gone(processState.read(r.pid),r.parentTick)||!processState.gone(processState.read(r.worker),r.workerTick)){respond(m,true);return;}}
  var lastRecoveryAt=resume?0:recovering?Date.now():(s.lastRecoveryAt||0);
  s={enabled:true,paused:false,released:false,active:false,boot:boot,started:Date.now(),lastRecoveryAt:lastRecoveryAt,session:crypto.randomBytes(16).toString('hex')};save();
  service.call('luna://com.webos.applicationManager/launch',{id:'com.mbs.communityhomehelper',params:{resume:!!(resume||recovering||coldStart),session:s.session,trialSeconds:Math.max(0,Math.min(120,Number(m.payload.trialSeconds)||0))}},function(r){
   if(!r.payload||!r.payload.returnValue){s.paused=true;s.released=true;save();respond(m,false,'Helper launch failed');return;}respond(m,true);
  });
 }catch(e){respond(m,false,'Helper start failed: '+e.code);}
}
service.register('ensure',function(m){start(m,false);});service.register('resume',function(m){start(m,true);});
service.register('pause',function(m){
 try{s.paused=true;save();var deadline=Date.now()+4500;
  function check(){refresh();if(s.released){respond(m,true);return;}if(Date.now()>=deadline){respond(m,false,'Remote release not confirmed; hold Home for two seconds');return;}setTimeout(check,100);}check();
 }catch(e){respond(m,false,'Could not pause helper: '+e.code);}
});
