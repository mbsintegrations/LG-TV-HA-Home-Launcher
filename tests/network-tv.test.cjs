'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{EventEmitter}=require('node:events'),probe=require('../network-service/probe');
test('TCP latency closes successful and refused sockets without sending application data',async()=>{
 for(const event of ['connect','error']){
  const socket=new EventEmitter();let destroyed=false;socket.destroy=()=>{destroyed=true;};socket.write=()=>assert.fail('Probe must not send application data');
  const net={connect(opts){assert.deepEqual(opts,{host:'1.1.1.1',port:443});queueMicrotask(()=>socket.emit(event));return socket;}};
  const result=await new Promise(resolve=>probe.tcp(net,'1.1.1.1',443,'internet',resolve));assert.equal(result.method,'tcp');assert.ok(destroyed);assert.equal(result.status,event==='connect'?'ok':'unavailable');assert.equal(result.ms===null,event!=='connect');
 }
 probe.tcp({connect(){assert.fail('Unsafe target');}},'example.org',443,'internet',r=>assert.equal(r.status,'unavailable'));
 probe.tcp({connect(){assert.fail('Unsafe port');}},'1.1.1.1',22,'internet',r=>assert.equal(r.status,'unavailable'));
});
test('Cloudflare latency works without Chromium 53 nextHopProtocol or transferSize fields',async()=>{
 const ctx={URL,URLSearchParams,Headers,Request,Response,Blob,AbortController,ArrayBuffer,Uint8Array,TextEncoder,TextDecoder,console:{log(){},warn(){}},setTimeout,clearTimeout,setInterval,clearInterval,location:{origin:'file://com.mbs.communityhome'},performance:{now:()=>Date.now(),clearResourceTimings(){},setResourceTimingBufferSize(){},getEntriesByName:()=>[{requestStart:10,responseStart:40,responseEnd:41,startTime:9,connectStart:9,connectEnd:10,secureConnectionStart:9}]},fetch:async()=>new Response('',{status:200,headers:{'server-timing':'cfSpeedWorker;dur=2'}})};
 ctx.self=ctx.window=ctx;vm.createContext(ctx);vm.runInContext(fs.readFileSync('app/cloudflare-engine.js','utf8'),ctx);
 const engine=new ctx.CloudflareSpeedTest({autoStart:false,logAimApiUrl:null,measurements:[{type:'latency',numPackets:1}]});
 const summary=await new Promise((resolve,reject)=>{const timer=setTimeout(()=>{engine.pause();reject(Error('Engine failed to finish'));},2000);engine.onError=e=>{clearTimeout(timer);engine.pause();reject(Error(e));};engine.onFinish=r=>{clearTimeout(timer);resolve(r.getSummary());};engine.play();});assert.ok(Number.isFinite(summary.latency));assert.ok(summary.latency>0);
});
