'use strict';
var fs=require('fs'),crypto=require('crypto'),Service=require('webos-service'),processState=require('./process-state'),recovery=require('./recovery');
var service=new Service('com.mbs.communityhome.helper'),data=__dirname+'/state',file=data+'/control.json';
// The normal five-second JS-service idle timeout is shorter than cold startup.
// Keep this finite; the native controller, not this service, owns the remote.
service.activityManager.idleTimeout=35;
var verification=null;
function read(){try{return JSON.parse(fs.readFileSync(file,'utf8'));}catch(e){return {enabled:false,paused:true,released:true};}}
var s=read(),boot=fs.readFileSync('/proc/sys/kernel/random/boot_id','utf8').trim();
if(s.boot!==boot){s.released=true;s.active=false;}
function save(){fs.writeFileSync(file+'.tmp',JSON.stringify(s),{mode:416});fs.renameSync(file+'.tmp',file);}
function nativeReport(){try{return JSON.parse(fs.readFileSync(data+'/native-status.json','utf8'));}catch(e){return null;}}
function cancelVerification(){if(verification){clearTimeout(verification.timer);verification=null;}}
function refresh(){s.active=false;s.running=false;var r=nativeReport();if(!r)return;
 if(!s.session||r.session!==s.session||s.boot!==boot)return;
 var parent=processState.read(r.pid),worker=processState.read(r.worker);
 s.at=r.at;s.active=!!(r.active&&processState.matches(parent,r.parentTick)&&processState.matches(worker,r.workerTick));
 s.running=!!(!r.released&&(processState.matches(parent,r.parentTick)||processState.matches(worker,r.workerTick)));
 if(s.active)s.at=Date.now();
 if(s.active&&s.starting){s.starting=false;s.confirmedAt=Date.now();cancelVerification();save();}
 var exited=processState.gone(parent,r.parentTick)&&processState.gone(worker,r.workerTick)&&Date.now()-r.at>4000;
 if((r.released||exited)&&!s.released){s.recoveryPending=recovery.allowed(s,r,Date.now());s.released=true;s.paused=!s.recoveryPending;s.starting=false;cancelVerification();save();}
}
function state(){refresh();return {enabled:!!s.enabled,paused:!!s.paused,active:!!(s.active&&!s.paused&&Date.now()-s.at<2500),running:!!s.running,starting:!!(s.starting&&!s.paused),error:s.lastError};}
function respond(m,ok,error){m.respond({returnValue:ok,state:state(),errorText:error});}
service.register('status',function(m){respond(m,true);});
function verifyStartup(){
 if(verification||!s.starting||s.paused)return;
 var session=s.session,task={timer:null};verification=task;
 function fail(message){if(s.session!==session||s.paused||!s.starting)return;s.paused=true;s.starting=false;s.lastError=message;var r=nativeReport();if(!r||r.session!==session)s.released=true;save();cancelVerification();}
 function check(){
  if(s.session!==session){cancelVerification();return;}
  refresh();if(verification!==task)return;if(s.paused||!s.starting){cancelVerification();return;}
  var elapsed=Date.now()-s.started,r=nativeReport();
  if(elapsed>=25000){fail('Helper did not confirm startup; select Resume Home button');return;}
  // Reuse the same session: a delayed first launch cannot create a competing owner.
  // Never retry if a controller has reported for this session (even if not ready).
  if(elapsed>=10000&&s.launchAttempts===1&&(!r||r.session!==session)){
   s.launchAttempts=2;s.launchParams.openHome=false;save();
   service.call('luna://com.webos.applicationManager/launch',{id:'com.mbs.communityhomehelper',params:s.launchParams},function(reply){if(!reply.payload||!reply.payload.returnValue)fail('Helper retry was rejected; select Resume Home button');});
  }
  if(verification===task)task.timer=setTimeout(check,500);
 }
 task.timer=setTimeout(check,500);
}
function start(m,resume){
 try{
  refresh();
  if(s.starting&&!s.paused){verifyStartup();respond(m,true);return;}
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
  cancelVerification();s={enabled:true,paused:false,released:false,active:false,boot:boot,started:Date.now(),lastRecoveryAt:lastRecoveryAt,session:crypto.randomBytes(16).toString('hex'),starting:true,launchAttempts:1};
  s.launchParams={resume:!!(resume||recovering||coldStart),openHome:!!resume&&m.payload.keepForeground!==true,session:s.session,trialSeconds:Math.max(0,Math.min(120,Number(m.payload.trialSeconds)||0))};save();verifyStartup();var session=s.session;
  service.call('luna://com.webos.applicationManager/launch',{id:'com.mbs.communityhomehelper',params:s.launchParams},function(r){
   if(s.session!==session||s.paused||!s.starting||s.launchAttempts!==1)return;
   if(!r.payload||!r.payload.returnValue){s.paused=true;s.released=true;s.starting=false;s.lastError='Helper launch failed';cancelVerification();save();}
  });
  // Acknowledgement is not readiness; state.starting remains true until verified.
  respond(m,!s.paused,s.lastError);
 }catch(e){respond(m,false,'Helper start failed: '+e.code);}
}
service.register('ensure',function(m){start(m,false);});service.register('resume',function(m){start(m,true);});
service.register('pause',function(m){
 try{cancelVerification();s.paused=true;s.starting=false;save();var deadline=Date.now()+4500;
  function check(){refresh();if(s.released){respond(m,true);return;}if(Date.now()>=deadline){respond(m,false,'Remote release not confirmed; hold Home for two seconds');return;}setTimeout(check,100);}check();
 }catch(e){respond(m,false,'Could not pause helper: '+e.code);}
});
