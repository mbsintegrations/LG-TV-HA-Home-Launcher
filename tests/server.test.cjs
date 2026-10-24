'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{once}=require('node:events'),{createServer}=require('../wizard/server.cjs'),example=require('../config.example.json');
test('Local wizard authenticates requests, only discovers, and never exposes its HA credential',async()=>{
 const calls=[],secret='synthetic-test-credential-never-a-real-token',server=createServer({fetch:async(url,options)=>{calls.push({url,options});return new Response(JSON.stringify([{entity_id:'light.living_room',state:'on',attributes:{friendly_name:'Test light',private_attribute:'not-returned'}}]));}});server.listen(0,'127.0.0.1');await once(server,'listening');const base='http://127.0.0.1:'+server.address().port;
 try{const html=await(await fetch(base)).text(),csrf=/name="setup-session" content="([^"]+)"/.exec(html)[1],headers={'Content-Type':'application/json','X-Setup-Session':csrf,Origin:base};
  assert.equal((await fetch(base+'/api/state')).status,403);assert.equal((await fetch(base+'/api/state',{headers:{...headers,Origin:'https://evil.invalid'}})).status,403);
  const hostStatus=await new Promise((resolve,reject)=>{require('node:http').get(base+'/api/state',{headers:{...headers,Host:'evil.invalid'}},r=>{r.resume();resolve(r.statusCode);}).on('error',reject);});assert.equal(hostStatus,403);
  const discovery=await fetch(base+'/api/discover',{method:'POST',headers,body:JSON.stringify({url:'https://ha.example.com',token:secret})});const d=await discovery.text();assert.equal(discovery.status,200);assert.ok(!d.includes(secret));assert.ok(!d.includes('private_attribute'));assert.equal(calls.length,1);assert.equal(calls[0].url,'https://ha.example.com/api/states');assert.equal(calls[0].options.redirect,'error');
  assert.equal((await fetch(base+'/api/control',{method:'POST',headers,body:'{}'})).status,404);
  for(const url of ['/api/state','/preview/connection.json','/preview/profile.json','/preview/app.js']){const t=await(await fetch(base+url,{headers})).text();assert.ok(!t.includes(secret));}
  assert.deepEqual(await(await fetch(base+'/preview/connection.json')).json(),{});
  assert.equal((await fetch(base+'/private/connection.json')).status,404);
  const svg=await fetch(base+'/preview/logos/netflix.svg');assert.equal(svg.status,200);assert.match(svg.headers.get('content-type'),/image\/svg\+xml/);assert.match(await svg.text(),/<svg/);
  const jpg=await fetch(base+'/preview/logos/disney.jpg');assert.equal(jpg.status,200);assert.match(jpg.headers.get('content-type'),/image\/jpeg/);
  const wordmark=await fetch(base+'/preview/logos/wordmarks/netflix.svg');assert.equal(wordmark.status,200);assert.match(wordmark.headers.get('content-type'),/image\/svg\+xml/);assert.notEqual(await wordmark.text(),require('node:fs').readFileSync(require('node:path').join(__dirname,'../app/logos/netflix.svg'),'utf8'));
  assert.equal((await fetch(base+'/preview/logos/not-a-logo.svg')).status,404);
  assert.equal((await fetch(base+'/api/profile',{method:'POST',headers,body:JSON.stringify({...example,token:secret})})).status,400);
  const changed=structuredClone(example);changed.title='Test bedroom';assert.equal((await fetch(base+'/api/profile',{method:'POST',headers,body:JSON.stringify(changed)})).status,200);assert.equal((await(await fetch(base+'/preview/profile.json')).json()).title,'Test bedroom');
  const build=await fetch(base+'/api/build',{method:'POST',headers,body:JSON.stringify({profile:example})});assert.equal(build.status,400);assert.match((await build.json()).error,/missing example entities/);
  await fetch(base+'/api/disconnect',{method:'POST',headers,body:'{}'});assert.equal((await(await fetch(base+'/api/state',{headers})).json()).connected,false);assert.equal(calls.length,1);
 }finally{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
});
test('A failed HA discovery clears previous auth and never follows redirects',async()=>{const server=createServer({fetch:async()=>{throw Error('network detail');}});server.listen(0,'127.0.0.1');await once(server,'listening');const base='http://127.0.0.1:'+server.address().port;try{const html=await(await fetch(base)).text(),csrf=/name="setup-session" content="([^"]+)"/.exec(html)[1];const r=await fetch(base+'/api/discover',{method:'POST',headers:{'Content-Type':'application/json','X-Setup-Session':csrf},body:JSON.stringify({url:'https://ha.example.com',token:'synthetic-credential-only-for-test'})});assert.equal(r.status,400);assert.doesNotMatch(await r.text(),/network detail/);}finally{server.closeAllConnections();await new Promise(r=>server.close(r));}});
