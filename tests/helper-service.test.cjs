'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
function harness(saved){
 const methods={},calls=[],timers=[],files={};let time=10000,dead=false;
 if(saved)files['/service/state/control.json']=JSON.stringify(saved);
 const service={register:(n,f)=>methods[n]=f,call:(uri,payload,cb)=>{calls.push({uri,payload});cb({payload:{returnValue:true}});}};
 vm.runInNewContext(fs.readFileSync(require.resolve('../helper/service/service.js'),'utf8'),{__dirname:'/service',Date:{now:()=>time},setTimeout:f=>(timers.push(f),f),require:n=>n==='./process-state'?{read:()=>dead?{gone:true}:{tick:'tick',state:'S'},matches:(p,t)=>p.tick===t,gone:p=>!!p.gone}:n==='fs'?{readFileSync:p=>{if(p.includes('boot_id'))return 'boot-one';if(!(p in files))throw Error('missing');return files[p];},writeFileSync:(p,v)=>files[p]=v,renameSync:(a,b)=>{files[b]=files[a];delete files[a];}}:n==='crypto'?{randomBytes:()=>({toString:()=> 'session-test'})}:function(){return service;}});
 function request(n,payload={}){const result=[];methods[n]({payload,respond:r=>result.push(r)});return result;}
 return {request,calls,timers,setDead:()=>dead=true,advance:n=>time+=n,saved:()=>JSON.parse(files['/service/state/control.json']),report:(r)=>files['/service/state/native-status.json']=JSON.stringify({session:'session-test',at:time,pid:1,worker:2,parentTick:'tick',workerTick:'tick',...r})};
}
test('Unconfigured/paused helper never starts from launcher ensure',()=>{const h=harness();assert.equal(h.request('ensure')[0].state.paused,true);assert.equal(h.calls.length,0);});
test('Pause only succeeds after native worker confirms release',()=>{const h=harness();h.request('resume');h.report({active:true});assert.equal(h.request('status')[0].state.active,true);const p=h.request('pause');assert.equal(p.length,0);assert.equal(h.saved().paused,true);h.timers.shift()();assert.equal(p.length,0);h.report({released:true});h.timers.shift()();assert.equal(p[0].returnValue,true);assert.equal(p[0].state.running,false);h.request('ensure');assert.equal(h.calls.length,1);});
test('Old native session cannot claim active or confirm remote release',()=>{const h=harness();h.request('resume');h.report({session:'old',active:true,released:true});assert.equal(h.request('status')[0].state.active,false);const p=h.request('pause');h.advance(5000);h.timers.shift()();assert.equal(p[0].returnValue,false);});
test('Lost controller is paused without an automatic restart loop',()=>{const h=harness();h.request('resume');h.advance(6000);assert.equal(h.request('ensure')[0].returnValue,false);h.request('ensure');assert.equal(h.calls.length,1);assert.equal(h.saved().paused,true);});
test('New boot permits startup only if helper was not explicitly paused',()=>{for(const paused of [true,false]){const h=harness({boot:'previous',enabled:true,paused,released:false,started:1});h.request('ensure');assert.equal(h.calls.length,paused?0:1);}});
test('Status becomes inactive after native processes exit',()=>{const h=harness();h.request('resume');h.report({active:true});assert.equal(h.request('status')[0].state.active,true);h.setDead();h.advance(5000);const s=h.request('status')[0].state;assert.equal(s.active,false);assert.equal(s.running,false);});
test('Every control command stays private to the launcher package',()=>{const meta=JSON.parse(fs.readFileSync(require.resolve('../helper/service/services.json'),'utf8'));assert.deepEqual(meta.services[0].commands.filter(c=>c.public),[]);assert.equal(meta.services[0].name,'com.mbs.communityhome.helper');});

