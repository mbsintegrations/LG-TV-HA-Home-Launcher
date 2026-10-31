'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{EventEmitter}=require('node:events');
function harness(trial=0,openHome=true){
 let time=100000,tick;const shared='/media/developer/apps/usr/palm/services/com.mbs.communityhome.helper/state',files={
  '/helper/options.json':JSON.stringify({watchedApps:['youtube.leanback.v4']}),
  [shared+'/control.json']:JSON.stringify({session:'one',enabled:true,paused:false})
 },children=[],launches=[];
 const fileApi={readFileSync:p=>{if(!(p in files))throw Error('Missing '+p);return files[p];},writeFileSync:(p,v)=>files[p]=v,appendFileSync:(p,v)=>files[p]=(files[p]||'')+v,existsSync:p=>p in files,statSync:p=>({size:(files[p]||'').length}),renameSync:(a,b)=>{files[b]=files[a];delete files[a];},unlinkSync:p=>delete files[p]};
 const service={activityManager:{create:()=>{}},call:(uri,p,cb)=>{launches.push(p.id);cb({payload:{returnValue:true}});}};
 const cp={spawn:(path,args)=>{const c=new EventEmitter();c.pid=children.length+2;c.stdout=new EventEmitter();c.stderr=new EventEmitter();c.stdin=new EventEmitter();c.stdin.write=()=>{};c.stdin.end=v=>c.ended=v;c.kill=()=>{};c.args=args;children.push(c);return c;}};
 const context={__dirname:'/helper',Date:{now:()=>time},setTimeout:()=>1,clearTimeout:()=>{},setInterval:f=>(tick=f,1),clearInterval:()=>{},process:{argv:['node','controller',JSON.stringify({session:'one',trialSeconds:trial,openHome})],pid:1,getuid:()=>5000,getgid:()=>5000,hrtime:()=>[Math.floor(time/1000),(time%1000)*1e6],on:()=>{},exit:()=>{}},require:n=>n==='fs'?fileApi:n==='child_process'?cp:n==='./policy'?require('../helper/app/policy'):n==='./process-state'?{read:()=>({tick:'tick'})}:n==='./ha-watch'?()=>({close:()=>{}}):function(){return service;}};
 vm.runInNewContext('(function(){'+fs.readFileSync(require.resolve('../helper/app/controller.js'),'utf8')+'\n}());',context);
 const worker=children[0];worker.stdout.emit('data','READY\n');
 return {worker,launches,advance:n=>time+=n,tick:()=>tick(),nativeBlock:()=>files['/helper/state/blocked']='stopped',finish:(code,signal)=>{worker.emit('exit',code,signal);const cleanup=children[1];if(cleanup)cleanup.emit('exit',0);return JSON.parse(files[shared+'/native-status.json']);}};
}
test('Native heartbeat timeout after suspension is recorded regardless of callback order',()=>{
 for(const timerFirst of [false,true]){const h=harness();h.advance(60000);h.nativeBlock();if(timerFirst)h.tick();const r=h.finish(20);assert.equal(r.released,true);assert.equal(r.exit.recoverable,true);assert.equal(r.exit.suspensionGapMs,60000);}
});
test('Controller releases a stale worker after suspension before requesting recovery',()=>{
 const h=harness();h.advance(60000);h.tick();assert.equal(h.worker.ended,'Q');const r=h.finish(0);assert.equal(r.exit.recoverable,true);assert.equal(r.exit.suspensionGapMs,60000);
});
test('Long Home and trials retain their explicit stop behavior even across a long gap',()=>{
 const h=harness();h.advance(60000);const r=h.finish(22);assert.equal(r.exit.recoverable,false);assert.equal(h.launches.at(-1),'com.webos.app.home');
 const trial=harness(120);trial.advance(60000);assert.equal(trial.finish(20).exit.recoverable,false);
});
test('Short heartbeat stalls have no suspension evidence and signals cannot recover',()=>{
 const h=harness();h.advance(3000);assert.equal(h.finish(20).exit.suspensionGapMs,0);
 const killed=harness();killed.advance(60000);assert.equal(killed.finish(null,'SIGKILL').exit.recoverable,false);
});

test('Automatic startup can attach the remote without changing the foreground app',()=>{const h=harness(0,false);assert.equal(h.launches.length,0);h.worker.stdout.emit('data','HOME\n');assert.equal(h.launches.at(-1),'com.mbs.communityhome');});
