'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
function harness(saved,deferred=false){
 const methods={},calls=[],timers=[],files={},replies=[];let time=10000,dead=false,suspended=false,serial=0;
 if(saved)files['/service/state/control.json']=JSON.stringify(saved);
 const service={activityManager:{},register:(n,f)=>methods[n]=f,call:(uri,payload,cb)=>{calls.push({uri,payload:JSON.parse(JSON.stringify(payload))});if(deferred)replies.push(cb);else cb({payload:{returnValue:true}});}};
 vm.runInNewContext(fs.readFileSync(require.resolve('../helper/service/service.js'),'utf8'),{__dirname:'/service',Date:{now:()=>time},setTimeout:(f,ms)=>(f.delay=ms,timers.push(f),f),clearTimeout:f=>{const i=timers.indexOf(f);if(i>=0)timers.splice(i,1);},require:n=>n==='./recovery'?require('../helper/service/recovery'):n==='./process-state'?{read:()=>dead?{gone:true}:{tick:'tick',state:suspended?'T':'S'},matches:(p,t)=>p.tick===t&&p.state!=='T',gone:p=>!!p.gone}:n==='fs'?{readFileSync:p=>{if(p.includes('boot_id'))return 'boot-one';if(!(p in files))throw Error('missing');return files[p];},writeFileSync:(p,v)=>files[p]=v,renameSync:(a,b)=>{files[b]=files[a];delete files[a];}}:n==='crypto'?{randomBytes:()=>({toString:()=> 'session-'+(++serial)})}:function(){return service;}});
 function request(n,payload={}){const result=[];methods[n]({payload,respond:r=>result.push(r)});return result;}
 return {request,calls,timers,replies,setDead:()=>dead=true,setSuspended:()=>suspended=true,advance:n=>time+=n,saved:()=>JSON.parse(files['/service/state/control.json']),report:(r)=>files['/service/state/native-status.json']=JSON.stringify({session:JSON.parse(files['/service/state/control.json']).session,at:time,pid:1,worker:2,parentTick:'tick',workerTick:'tick',...r})};
}
test('Unconfigured/paused helper never starts from launcher ensure',()=>{const h=harness();assert.equal(h.request('ensure')[0].state.paused,true);assert.equal(h.calls.length,0);});
test('Pause only succeeds after native worker confirms release',()=>{const h=harness();h.request('resume');h.report({active:true});assert.equal(h.request('status')[0].state.active,true);const p=h.request('pause');assert.equal(p.length,0);assert.equal(h.saved().paused,true);h.timers.shift()();assert.equal(p.length,0);h.report({released:true});h.timers.shift()();assert.equal(p[0].returnValue,true);assert.equal(p[0].state.running,false);h.request('ensure');assert.equal(h.calls.length,1);});
test('Old native session cannot claim active or confirm remote release',()=>{const h=harness();h.request('resume');h.report({session:'old',active:true,released:true});assert.equal(h.request('status')[0].state.active,false);const p=h.request('pause');h.advance(5000);h.timers.shift()();assert.equal(p[0].returnValue,false);});
test('An acknowledged launch without a controller retries once in the same session, then pauses',()=>{const h=harness();h.request('resume');assert.equal(h.request('status')[0].state.running,false);assert.equal(h.request('status')[0].state.starting,true);h.advance(10000);h.timers.shift()();assert.equal(h.calls.length,2);assert.equal(h.calls[1].payload.params.session,h.calls[0].payload.params.session);assert.equal(h.calls[1].payload.params.openHome,false);h.advance(15000);h.timers.shift()();assert.equal(h.saved().paused,true);assert.equal(h.saved().starting,false);h.request('ensure');assert.equal(h.calls.length,2);assert.equal(h.timers.length,0);});
test('New boot permits startup only if helper was not explicitly paused',()=>{for(const paused of [true,false]){const h=harness({boot:'previous',enabled:true,paused,released:false,started:1});h.request('ensure');assert.equal(h.calls.length,paused?0:1);if(!paused)assert.equal(h.calls[0].payload.params.openHome,false);}});
test('Status becomes inactive after native processes exit',()=>{const h=harness();h.request('resume');h.report({active:true});assert.equal(h.request('status')[0].state.active,true);h.setDead();h.advance(5000);const s=h.request('status')[0].state;assert.equal(s.active,false);assert.equal(s.running,false);});
test('Every control command stays private to the launcher package',()=>{const meta=JSON.parse(fs.readFileSync(require.resolve('../helper/service/services.json'),'utf8'));assert.deepEqual(meta.services[0].commands.filter(c=>c.public),[]);assert.equal(meta.services[0].name,'com.mbs.communityhome.helper');});

const suspension={code:20,signal:null,suspensionGapMs:60000,recoverable:true};
test('Suspension recovery waits for release and both processes to exit, then clears the native block once',()=>{
 const h=harness();h.request('resume');h.report({released:true,exit:suspension});h.request('ensure');assert.equal(h.calls.length,1);
 h.advance(4000);h.request('ensure');assert.equal(h.calls.length,1);
 h.setDead();h.request('ensure');assert.equal(h.calls.length,2);assert.equal(h.calls[1].payload.params.resume,true);assert.ok(h.saved().lastRecoveryAt);
 h.request('ensure');assert.equal(h.calls.length,2);
 h.report({released:true,exit:suspension});h.advance(4000);h.request('ensure');assert.equal(h.calls.length,2);assert.equal(h.saved().paused,true);
 h.advance(300000);h.request('ensure');assert.equal(h.calls.length,2,'Repeated failures stay paused even after cooldown');
});
test('A later independent suspension may recover after the five-minute cooldown',()=>{
 const h=harness();h.request('resume');h.report({released:true,exit:suspension});h.setDead();h.advance(4000);h.request('ensure');
 h.advance(300000);h.report({released:true,exit:suspension});h.advance(4000);h.request('ensure');assert.equal(h.calls.length,3);
});
test('Explicit pause wins over a pending suspension recovery',()=>{
 const h=harness();h.request('resume');h.report({released:true,exit:suspension});h.request('status');h.request('pause');h.setDead();h.advance(4000);h.request('ensure');assert.equal(h.calls.length,1);assert.equal(h.saved().paused,true);
});
test('Long Home, short stalls, signals, trials and missing exit evidence never auto-resume',()=>{
 for(const exit of [undefined,{...suspension,code:22},{...suspension,suspensionGapMs:2500},{...suspension,signal:'SIGKILL'},{...suspension,recoverable:false},{...suspension,suspensionGapMs:Infinity}]){
  const h=harness();h.request('resume');h.report({released:true,exit});h.setDead();h.advance(4000);h.request('ensure');assert.equal(h.calls.length,1);assert.equal(h.saved().paused,true);
 }
});


test('Ensure before the suspended controller reports release waits without cancelling recovery',()=>{const h=harness();h.request('resume');h.report({active:true});h.request('status');h.setSuspended();h.advance(60000);h.request('ensure');assert.equal(h.saved().paused,false);assert.equal(h.calls.length,1);h.report({released:true,exit:suspension});h.setDead();h.advance(4000);h.request('ensure');assert.equal(h.calls.length,2);});
test('A suspended controller that never reports release is paused after the bounded wait',()=>{const h=harness();h.request('resume');h.report({active:true});h.request('status');h.setSuspended();h.advance(60000);h.request('ensure');h.advance(15000);h.request('ensure');assert.equal(h.saved().paused,true);assert.equal(h.calls.length,1);});

test('Native readiness ends startup verification and cancels its retry',()=>{const h=harness();h.request('resume');h.report({active:true});const state=h.request('status')[0].state;assert.equal(state.active,true);assert.equal(state.starting,false);assert.equal(state.running,true);assert.equal(h.timers.length,0);h.advance(30000);h.request('ensure');assert.equal(h.calls.length,1);});
test('A starting controller prevents a duplicate launch, even when readiness times out',()=>{const h=harness();h.request('resume');h.report({active:false});h.advance(10000);h.timers.shift()();assert.equal(h.calls.length,1);h.advance(15000);h.timers.shift()();assert.equal(h.saved().paused,true);assert.equal(h.saved().released,false);assert.equal(h.calls.length,1);});
test('Pausing a pending startup cancels its automatic retry',()=>{const h=harness();h.request('resume');h.request('pause');assert.ok(h.timers.every(f=>f.delay!==500));h.advance(30000);while(h.timers.length)h.timers.shift()();assert.equal(h.calls.length,1);assert.equal(h.saved().paused,true);});
test('Stale active status from an old session cannot count as running',()=>{const h=harness();h.request('resume');h.report({session:'previous-boot',active:true});const state=h.request('status')[0].state;assert.equal(state.running,false);assert.equal(state.active,false);h.advance(10000);h.timers.shift()();assert.equal(h.calls.length,2);});

test('A missing LG launch callback cannot leave the client request or startup watchdog pending forever',()=>{const h=harness(undefined,true);assert.equal(h.request('resume').length,1);h.advance(10000);h.timers.shift()();assert.equal(h.calls.length,2);h.advance(15000);h.timers.shift()();assert.equal(h.saved().paused,true);assert.equal(h.timers.length,0);});
test('A late failed launch callback cannot pause a now-active helper',()=>{const h=harness(undefined,true);h.request('resume');h.report({active:true});h.request('status');h.replies[0]({payload:{returnValue:false}});assert.equal(h.saved().paused,false);assert.equal(h.request('status')[0].state.active,true);});
test('An old launch rejection cannot cancel the same-session retry',()=>{const h=harness(undefined,true);h.request('resume');h.advance(10000);h.timers.shift()();h.replies[0]({payload:{returnValue:false}});assert.equal(h.saved().paused,false);h.replies[1]({payload:{returnValue:false}});assert.equal(h.saved().paused,true);});

test('Explicit maintenance resume can preserve the foreground app',()=>{const h=harness();h.request('resume',{keepForeground:true});assert.equal(h.calls[0].payload.params.openHome,false);assert.equal(h.calls[0].payload.params.resume,true);});

test('A boot during pending startup gets a fresh session and deadline without clearing intentional pause',()=>{
 for(const paused of [false,true]){
  const h=harness({boot:'previous',enabled:true,paused,released:false,starting:true,started:1,session:'previous-session',launchAttempts:2,releaseWaitStarted:1});
  h.request('ensure');assert.equal(h.calls.length,paused?0:1);
  if(paused){assert.equal(h.request('status')[0].state.starting,false);continue;}
  assert.notEqual(h.saved().session,'previous-session');assert.equal(h.saved().started,10000);assert.equal(h.saved().launchAttempts,1);
  assert.equal(h.calls[0].payload.params.openHome,false);assert.equal(h.calls[0].payload.params.resume,true);
  h.report({active:true});assert.equal(h.request('status')[0].state.active,true);
 }
});
