'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{once}=require('node:events'),P=require('../app/profile'),X=require('../app/image'),{createServer}=require('../wizard/server.cjs'),example=require('../config.example.json');
const copy=()=>structuredClone(example);
const IMG='image.front_door_snapshot';

test('Existing profiles without an image block stay valid and disabled',()=>{const p=P.validate(copy());assert.deepEqual(p.image,{entity:'',title:'Camera'});assert.ok(!P.entities(p).includes(IMG));assert.equal(P.imageActive(p),false);});
test('Image block accepts image.*, camera.* or empty and rejects everything else',()=>{for(const ok of [IMG,'camera.garden','']){const p=copy();p.image={entity:ok,title:'Front door'};P.validate(p);}
 for(const bad of ['sensor.x','light.x','image.x;y','IMAGE.x']){const p=copy();p.image={entity:bad,title:'T'};assert.throws(()=>P.validate(p));}
 let p=copy();p.image={entity:IMG,title:''};assert.throws(()=>P.validate(p));p=copy();p.image={entity:IMG,title:'T',extra:1};assert.throws(()=>P.validate(p));p=copy();p.image={entity:IMG,title:'x'.repeat(29)};assert.throws(()=>P.validate(p));p=copy();p.image={entity:IMG};assert.equal(P.validate(p).image.title,'Camera');});
test('The image replaces the energy mappings in the subscription and follows the Energy card visibility',()=>{const q=copy();q.energy.enabled=true;q.energy.solar.entity='sensor.sol';P.validate(q);assert.ok(P.entities(q).includes('sensor.sol'));
 q.image={entity:IMG,title:'T'};assert.ok(P.entities(q).includes(IMG));assert.ok(!P.entities(q).includes('sensor.sol'));assert.equal(P.imageActive(q),true);
 q.cards.visible=['temperatures'];assert.ok(!P.entities(q).includes(IMG));assert.equal(P.imageActive(q),false);});

test('Image time: short time today, short date otherwise, empty when not a timestamp',()=>{const o={locale:'en-GB',timeZone:'Europe/Paris',hour12:false,now:new Date('2026-11-19T12:00:00Z')};
 assert.equal(X.formatImageTime('2026-11-19T16:07:03',o),'16:07');assert.equal(X.formatImageTime('2026-11-18T16:07:03',o),'18/11 16:07');
 assert.equal(X.formatImageTime('2026-11-19T15:07:03+00:00',o),'16:07');assert.equal(X.formatImageTime('2026-11-19T15:07:03.123456+00:00',o),'16:07');assert.equal(X.formatImageTime('2026-11-18T22:30:00Z',o),'18/11 23:30');
 assert.equal(X.formatImageTime('2026-11-19T15:07:03Z',{...o,locale:'en-US',hour12:true}),'04:07 PM');
 for(const bad of ['idle','unavailable','unknown','',undefined,null,'2026-13-45T99:99:99'])assert.equal(X.formatImageTime(bad,o),'');});
test('Image source: HTTP origin derived from the websocket address, entity_picture path constrained',()=>{assert.equal(X.haHttpOrigin('wss://ha.example.com/api/websocket'),'https://ha.example.com');assert.equal(X.haHttpOrigin('ws://192.0.2.2:8123/api/websocket'),'http://192.0.2.2:8123');assert.equal(X.haHttpOrigin(''),'');assert.equal(X.haHttpOrigin('https://x'),'');
 const pic='/api/image_proxy/'+IMG+'?token=abc123&time=1';assert.equal(X.imageSource({state:'t',attributes:{entity_picture:pic}},'https://ha.example.com'),'https://ha.example.com'+pic);
 for(const bad of ['https://evil.example/x.jpg','//evil.example/x','/local/x.jpg','/api/image_proxy/../states','javascript:alert(1)',undefined])assert.equal(X.imageSource({state:'t',attributes:{entity_picture:bad}},'https://ha.example.com'),'');assert.equal(X.imageSource({state:'t',attributes:{entity_picture:pic}},''),'');
 const a={state:'2026-11-19T16:07:03',attributes:{entity_picture:pic}};assert.equal(X.imageKey(a),X.imageKey(structuredClone(a)));assert.notEqual(X.imageKey(a),X.imageKey({...a,state:'2026-11-19T16:08:00'}));assert.notEqual(X.imageKey(a),X.imageKey({...a,attributes:{entity_picture:pic+'2'}}));assert.equal(X.imageKey(undefined),'');});

async function withServer(fetchImpl,fn){const server=createServer({fetch:fetchImpl});server.listen(0,'127.0.0.1');await once(server,'listening');const base='http://127.0.0.1:'+server.address().port;try{const csrf=/name="setup-session" content="([^"]+)"/.exec(await(await fetch(base)).text())[1];await fn(base,csrf,{'Content-Type':'application/json','X-Setup-Session':csrf});}finally{server.closeAllConnections();await new Promise(r=>server.close(r));}}
test('/api/live-image serves only the configured image entity, with the session, and never exposes the token',async()=>{
 const calls=[],secret='synthetic-test-credential-never-a-real-token',png=Buffer.from([137,80,78,71,13,10,26,10]);
 await withServer(async(url,options)=>{calls.push({url,options});if(url.endsWith('/api/states'))return new Response(JSON.stringify([{entity_id:IMG,state:'2026-11-19T16:07:03',attributes:{entity_picture:'/api/image_proxy/x?token=t'}}]));return new Response(png,{headers:{'content-type':'image/png'}});},async(base,csrf,headers)=>{
  const profile=copy();profile.image={entity:IMG,title:'Front door'};
  assert.equal((await fetch(base+'/api/profile',{method:'POST',headers,body:JSON.stringify(profile)})).status,200);
  const url=e=>base+'/api/live-image?entity='+encodeURIComponent(e)+'&session='+csrf;
  assert.equal((await fetch(url(IMG))).status,400,'no HA connection');
  await fetch(base+'/api/discover',{method:'POST',headers,body:JSON.stringify({url:'https://ha.example.com',token:secret})});
  const ok=await fetch(url(IMG));assert.equal(ok.status,200);assert.equal(ok.headers.get('content-type'),'image/png');assert.equal(ok.headers.get('cache-control'),'no-store');assert.deepEqual(Buffer.from(await ok.arrayBuffer()),png);
  const call=calls.at(-1);assert.equal(call.url,'https://ha.example.com/api/image_proxy/'+IMG);assert.equal(call.options.headers.Authorization,'Bearer '+secret);assert.equal(call.options.redirect,'error');
  const n=calls.length;for(const other of ['image.other','camera.garden','sensor.temperature','../states',IMG+'x'])assert.equal((await fetch(url(other))).status,403);assert.equal((await fetch(base+'/api/live-image')).status,403);assert.equal(calls.length,n,'no HA call for another entity');
  assert.equal((await fetch(base+'/api/live-image?entity='+IMG)).status,403,'session required');assert.equal((await fetch(base+'/api/live-image?entity='+IMG+'&session=wrong')).status,403);assert.equal((await fetch(url(IMG),{headers:{Origin:'https://evil.invalid'}})).status,403);
  const hostStatus=await new Promise((resolve,reject)=>{require('node:http').get(url(IMG),{headers:{Host:'evil.invalid'}},r=>{r.resume();resolve(r.statusCode);}).on('error',reject);});assert.equal(hostStatus,403);
  assert.equal((await fetch(url(IMG),{method:'POST',headers,body:'{}'})).status>=400,true);
  const live=await fetch(base+'/api/live-preview',{method:'POST',headers,body:'{}'}),body=await live.text(),j=JSON.parse(body);assert.equal(live.status,200);assert.doesNotMatch(body,new RegExp(secret+'|entity_picture'));
  assert.equal(j.imageSrc,'/api/live-image?entity='+encodeURIComponent(IMG)+'&session='+csrf+'&v='+encodeURIComponent('2026-11-19T16:07:03'));
  // camera.* goes through camera_proxy
  profile.image.entity='camera.garden';await fetch(base+'/api/profile',{method:'POST',headers,body:JSON.stringify(profile)});assert.equal((await fetch(url('camera.garden'))).status,200);assert.equal(calls.at(-1).url,'https://ha.example.com/api/camera_proxy/camera.garden');assert.equal((await fetch(url(IMG))).status,403);
  profile.image.entity=IMG;await fetch(base+'/api/profile',{method:'POST',headers,body:JSON.stringify(profile)});
 });
});
test('/api/live-image refuses non-image and failing HA responses',async()=>{let mode='html';await withServer(async(url)=>mode==='html'?new Response('<html></html>',{headers:{'content-type':'text/html'}}):new Response('no',{status:404}),async(base,csrf,headers)=>{
 const profile=copy();profile.image={entity:IMG,title:'T'};await fetch(base+'/api/profile',{method:'POST',headers,body:JSON.stringify(profile)});await fetch(base+'/api/discover',{method:'POST',headers,body:JSON.stringify({url:'https://ha.example.com',token:'synthetic-test-credential-never-a-real-token'})});
 const url=base+'/api/live-image?entity='+encodeURIComponent(IMG)+'&session='+csrf;assert.equal((await fetch(url)).status,400);mode='404';assert.equal((await fetch(url)).status,400);});});
test('/api/live-image refuses when the image card is disabled',async()=>{await withServer(async()=>new Response('x'),async(base,csrf)=>{assert.equal((await fetch(base+'/api/live-image?entity='+IMG+'&session='+csrf)).status,403);});});
test('The TV page and the preview ship the image files and drop the CSP placeholder',async()=>{await withServer(async()=>new Response('[]'),async(base)=>{for(const f of ['image.js','image.css'])assert.equal((await fetch(base+'/preview/'+f)).status,200);const html=await(await fetch(base+'/preview/')).text();assert.match(html,/image\.js/);assert.doesNotMatch(html,/__HA_IMAGE_ORIGIN__/);});});
test('The TV build allows images from the HA origin only when the image card is active',async()=>{const fs=require('node:fs'),{build}=require('../scripts/build.cjs'),made=[];
 try{for(const [entity,visible,expected] of [[IMG,['temperatures','laundry','energy'],true],['',['temperatures','laundry','energy'],false],[IMG,['temperatures'],false]]){const p=copy();p.image={entity,title:'T'};p.cards.visible=visible;const r=await build(p,{url:'http://192.0.2.2:8123',allowHttp:true,token:'synthetic-test-credential-never-a-real-token'});made.push(r.folder);
  const html=fs.readFileSync(require('node:path').join(r.folder,'app','index.html'),'utf8'),csp=/Content-Security-Policy" content="([^"]+)"/.exec(html)[1],img=/img-src ([^;]+)/.exec(csp)[1].trim();
  assert.equal(img,expected?"'self' file: data: http://192.0.2.2:8123":"'self' file: data:");assert.doesNotMatch(html,/__HA_IMAGE_ORIGIN__/);assert.ok(fs.existsSync(require('node:path').join(r.folder,'app','image.js')));}}
 finally{for(const f of made)fs.rmSync(f,{recursive:true,force:true});}});
