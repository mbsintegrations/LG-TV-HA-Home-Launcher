'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),P=require('../app/profile'),H=require('../app/hdmi'),example=require('../config.example.json');
const copy=()=>structuredClone(example),app=n=>fs.readFileSync(path.join(__dirname,'../app',n),'utf8');

test('hdmiPreview is optional, off by default, and validates input and label',()=>{
  let p=P.validate(copy());assert.deepEqual(p.hdmiPreview,{input:'',label:''});
  for(const ok of ['','hdmi:1','hdmi:2','hdmi:3','hdmi:4']){p=copy();p.hdmiPreview={input:ok,label:'Set-top box'};P.validate(p);}
  for(const bad of ['hdmi:0','hdmi:5','HDMI:3','hdmi:3 ','av:1','ext://hdmi:3','hdmi:10','x']){p=copy();p.hdmiPreview={input:bad,label:''};assert.throws(()=>P.validate(p),bad);}
  p=copy();p.hdmiPreview={input:'hdmi:3'};assert.equal(P.validate(p).hdmiPreview.label,'');
  p=copy();p.hdmiPreview={input:'hdmi:3',label:'x'.repeat(29)};assert.throws(()=>P.validate(p));
  p=copy();p.hdmiPreview={input:'hdmi:3',label:'a',extra:1};assert.throws(()=>P.validate(p));
  p=copy();p.hdmiPreview='hdmi:3';assert.throws(()=>P.validate(p));
});

test('The HDMI card takes the Temperatures slot: active only with an input and a visible Temperatures card',()=>{
  const p=copy();p.hdmiPreview={input:'hdmi:2',label:''};assert.equal(P.hdmiActive(P.validate(p)),true);
  p.cards.visible=['laundry','energy'];assert.equal(P.hdmiActive(P.validate(p)),false);
  p.cards.visible=['temperatures'];p.hdmiPreview.input='';assert.equal(P.hdmiActive(P.validate(p)),false);
});

test('Slot substitution: temperature sensors are not subscribed while the preview is active, and return when it is off',()=>{
  const p=P.validate(copy()),sensors=p.temperatures.map(t=>t.entity);assert.ok(sensors.length>0);
  for(const s of sensors)assert.ok(P.entities(p).includes(s));
  p.hdmiPreview={input:'hdmi:1',label:''};for(const s of sensors)assert.ok(!P.entities(p).includes(s));
  assert.equal(p.temperatures.length,sensors.length,'sensor settings are kept');
  p.hdmiPreview.input='';for(const s of sensors)assert.ok(P.entities(p).includes(s));
});

test('Plan: off, placeholder (desktop/configurator) or video (TV); never a video off the TV',()=>{
  const p=copy();p.hdmiPreview={input:'hdmi:3',label:'Set-top box'};
  assert.deepEqual(H.plan(p,true),{mode:'video',n:3,input:'hdmi:3',src:'ext://hdmi:3',appId:'com.webos.app.hdmi3',label:'Set-top box'});
  assert.equal(H.plan(p,false).mode,'placeholder');assert.equal(H.plan(p,false).src,'ext://hdmi:3');
  p.hdmiPreview.label='  ';assert.equal(H.plan(p,true).label,'HDMI 3');
  for(const layout of ['classic','dock','weather','sidebar','panorama','custom']){p.layout=layout;assert.equal(H.plan(p,true).mode,'video',layout);}
  p.cards={visible:['laundry','energy']};assert.equal(H.plan(p,true).mode,'off');
  p.cards={visible:['temperatures']};p.hdmiPreview.input='';assert.equal(H.plan(p,true).mode,'off');assert.equal(H.plan(null,true).mode,'off');
});

// Minimal DOM double: enough to see which elements are created, attached and released.
function fakeDoc(){const made=[];function el(tag){const n={tag,attrs:{},children:[],listeners:{},parentNode:null,paused:false,loaded:0,
  setAttribute(k,v){n.attrs[k]=v;},removeAttribute(k){delete n.attrs[k];},appendChild(c){c.parentNode=n;n.children.push(c);return c;},removeChild(c){n.children.splice(n.children.indexOf(c),1);c.parentNode=null;},
  addEventListener(t,f){(n.listeners[t]=n.listeners[t]||[]).push(f);},pause(){n.paused=true;},load(){n.loaded++;},play(){return {then(){}};}};
  Object.defineProperty(n,'firstChild',{get(){return n.children[0]||null;}});made.push(n);return n;}
  return {createElement:el,made};}
test('Video is created with the webOS external source, autoplay and muted',()=>{
  const d=fakeDoc(),r=H.create(d,'ext://hdmi:3');assert.equal(r.video.tag,'video');assert.equal(r.source.attrs.type,'service/webos-external');assert.equal(r.source.attrs.src,'ext://hdmi:3');
  assert.ok('autoplay' in r.video.attrs&&'muted' in r.video.attrs);assert.equal(r.video.muted,true);assert.equal(r.video.children[0],r.source);
});
test('Preview keeps one video, stop() releases it completely, start() recreates it, errors fall back',()=>{
  const d=fakeDoc(),frame=d.createElement('div'),states=[],pv=new H.Preview(d,frame,'ext://hdmi:2',s=>states.push(s));
  pv.start();pv.start();assert.equal(frame.children.length,1);assert.equal(pv.active(),true);const first=frame.children[0];
  pv.stop();assert.equal(frame.children.length,0);assert.equal(first.paused,true);assert.equal(first.children.length,0);assert.ok(first.loaded>=1);assert.ok(!('src' in first.attrs));assert.equal(pv.active(),false);
  pv.start();assert.equal(frame.children.length,1);assert.notEqual(frame.children[0],first);
  frame.children[0].children[0].listeners.error[0]();assert.equal(frame.children.length,0);assert.equal(states[states.length-1],'failed');pv.stop();assert.equal(states[states.length-1],'failed');
});
test('A NotSupportedError from play() releases the video and reports failure',()=>{
  const d=fakeDoc(),frame=d.createElement('div'),states=[],pv=new H.Preview(d,frame,'ext://hdmi:1',s=>states.push(s));
  const orig=d.createElement;d.createElement=function(tag){const n=orig(tag);if(tag==='video')n.play=()=>({then(_,no){no({name:'NotSupportedError'});}});return n;};
  pv.start();assert.equal(frame.children.length,0);assert.equal(pv.active(),false);assert.equal(states[states.length-1],'failed');
});

test('The page has no video markup; the CSP allows ext: only when the preview is active',()=>{
  const html=app('index.html');assert.doesNotMatch(html,/<video|<source|ext:\/\/hdmi/i);assert.match(html,/media-src 'self' file: __HDMI_MEDIA__;/);assert.match(html,/<script src="hdmi\.js">/);
  const sub=(profile)=>html.replace('__HDMI_MEDIA__',P.hdmiActive(profile)?'ext:':'');
  const p=P.validate(copy());assert.doesNotMatch(sub(p),/ext:/);
  p.hdmiPreview={input:'hdmi:1',label:''};assert.match(sub(p),/media-src 'self' file: ext:;/);
  const build=fs.readFileSync(path.join(__dirname,'../scripts/build.cjs'),'utf8');assert.match(build,/replace\('__HDMI_MEDIA__',P\.hdmiActive\(profile\)\?'ext:':''\)/);
});
test('Preview lifecycle hooks are wired for hide, page hide/show and overlays',()=>{
  const js=app('app.js');
  assert.match(js,/visibilitychange[\s\S]*hdmiPreview\.stop\(\)/);assert.match(js,/pagehide[\s\S]*hdmiPreview\.stop\(\)/);assert.match(js,/pageshow[\s\S]*hdmiPreview\.start\(\)/);
  assert.match(js,/function dialog\([^)]*\)\{[^}]*hdmiPreview\.stop\(\)/);assert.match(js,/function closeDialog\(\)\{[^}]*hdmiPreview\.start\(\)/);
});
