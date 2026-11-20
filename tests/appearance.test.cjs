'use strict';
// Day/night appearance (profile.appearanceSchedule): validation, decision and generated sheets.
// Entities are fictitious.
var test=require('node:test'),assert=require('node:assert/strict'),P=require('../app/profile'),T=require('../scripts/theme.cjs'),example=require('../config.example.json');
function copy(){return JSON.parse(JSON.stringify(example));}
function scheduled(extra){var p=copy();p.theme='sand';p.appearanceSchedule={night:{theme:'monochrome'},sunEntity:'sun.example',dayFrom:'07:30',nightFrom:'19:30'};if(extra)extra(p);return P.validate(p);}
function at(iso){return Date.parse(iso);}
function sun(state,rising,setting){var a={};if(rising)a.next_rising=rising;if(setting)a.next_setting=setting;return {state:state,attributes:a};}
function hm(s){return P.hhmm(s);}

test('Without the block: nothing is added, the look is the profile one and the night sheet is an empty placeholder',function(){
 var p=P.validate(copy());assert.equal(p.appearanceSchedule,undefined);assert.ok(!('appearanceSchedule' in p));
 assert.equal(P.appearanceMode(p,null,Date.now(),600),null);assert.equal(P.appearance(p,null),p.theme);assert.equal(P.appearance(p,'night'),p.theme);
 assert.ok(P.entities(p).every(function(e){return e.indexOf('sun.')!==0||e===p.weatherSun;}));
 var sheets=T.sheets(p);assert.equal(sheets['theme.css'],T.theme(p));assert.doesNotMatch(sheets['theme-night.css'],/[{}]/);
});

test('Validation: defaults, palettes, sun entity, 24-hour times',function(){
 var p=copy();p.appearanceSchedule={night:{theme:'ocean'}};P.validate(p);
 assert.deepEqual(p.appearanceSchedule,{night:{theme:'ocean'},sunEntity:'sun.sun',dayFrom:'07:00',nightFrom:'19:00'});
 p=copy();p.appearanceSchedule={night:{theme:'dusk'},sunEntity:''};P.validate(p);assert.ok(P.entities(p).every(function(e){return e.indexOf('sun.')!==0;}));
 assert.ok(P.entities(scheduled()).indexOf('sun.example')!==-1);
 var bad=[
  function(p){p.appearanceSchedule.night.theme='neon';},
  function(p){p.appearanceSchedule.night.finish='soigne';},
  function(p){p.appearanceSchedule.sunEntity='light.example';},
  function(p){p.appearanceSchedule.dayFrom='7:30';},
  function(p){p.appearanceSchedule.nightFrom='24:00';},
  function(p){p.appearanceSchedule.nightFrom='07:30';},   // same as dayFrom
  function(p){p.appearanceSchedule.extra=1;},
  function(p){p.appearanceSchedule.night.layout='dock';},
  function(p){p.appearanceSchedule.night=undefined;},
  function(p){p.appearanceSchedule='night';}
 ];
 bad.forEach(function(alter,i){var p=copy();p.theme='sand';p.appearanceSchedule={night:{theme:'monochrome'},sunEntity:'sun.example',dayFrom:'07:30',nightFrom:'19:30'};alter(p);assert.throws(function(){P.validate(p);},undefined,'case '+i);});
});

test('Sun up = day look, sun down = night look, whatever the fixed hours say',function(){
 var p=scheduled(),now=at('2026-11-19T15:00:00+01:00');
 var up=P.sunPlan(sun('above_horizon','2026-11-20T08:20:00+01:00','2026-11-19T17:20:00+01:00'),now);
 assert.equal(P.appearanceMode(p,up,now,hm('22:00')),'day');
 var down=P.sunPlan(sun('below_horizon','2026-11-20T08:20:00+01:00','2026-11-20T17:19:00+01:00'),now);
 assert.equal(P.appearanceMode(p,down,now,hm('12:00')),'night');
 assert.equal(P.appearance(p,'day'),'sand');assert.equal(P.appearance(p,'night'),'monochrome');
 assert.equal(P.sunPlan(sun('unavailable'),now),null);assert.equal(P.sunPlan(undefined,now),null);assert.equal(P.sunPlan(sun('unknown'),now),null);
});

test('HA lost: the last sun reading carries on through its next event, then the fixed hours take over',function(){
 var p=scheduled(),read=at('2026-11-19T15:00:00+01:00');
 var plan=P.sunPlan(sun('above_horizon','2026-11-20T08:20:00+01:00','2026-11-19T17:20:00+01:00'),read);
 // Wi-Fi drop at 16:00, HA restart at 18:00: no fallback to 19:30, the sunset at 17:20 is still honoured.
 assert.equal(P.appearanceMode(p,plan,at('2026-11-19T16:00:00+01:00'),hm('16:00')),'day');
 assert.equal(P.appearanceMode(p,plan,at('2026-11-19T17:20:00+01:00'),hm('17:20')),'night');
 assert.equal(P.appearanceMode(p,plan,at('2026-11-19T18:00:00+01:00'),hm('18:00')),'night');
 assert.equal(P.appearanceMode(p,plan,at('2026-11-20T08:19:00+01:00'),hm('08:19')),'night');
 // Past the second event the reading says nothing any more: fixed hours.
 assert.equal(P.appearanceMode(p,plan,at('2026-11-20T08:20:00+01:00'),hm('08:20')),'day');
 assert.equal(P.appearanceMode(p,plan,at('2026-11-20T20:00:00+01:00'),hm('20:00')),'night');
 // Inconsistent attributes never invert the meaning of the events: after a rising it is day.
 var odd=P.sunPlan(sun('above_horizon','2026-11-19T16:00:00+01:00','2026-11-19T17:00:00+01:00'),read);
 assert.equal(P.planMode(odd,at('2026-11-19T16:30:00+01:00')),'day');
 // No next_rising / next_setting: the reading is trusted for 12 hours.
 var bare=P.sunPlan(sun('below_horizon'),read);
 assert.equal(P.appearanceMode(p,bare,read+11*3600000,hm('12:00')),'night');
 assert.equal(P.appearanceMode(p,bare,read+12*3600000,hm('12:00')),'day');
});

test('Never any sun reading (HA unreachable since start, or no sun entity): fixed hours, in either order',function(){
 var p=scheduled();
 [['07:29','night'],['07:30','day'],['12:00','day'],['19:29','day'],['19:30','night'],['00:00','night']].forEach(function(c){assert.equal(P.appearanceMode(p,null,Date.now(),hm(c[0])),c[1],c[0]);});
 // dayFrom later than nightFrom (a night-shift household): day from 22:00 to 06:00.
 var q=scheduled(function(p){p.appearanceSchedule.dayFrom='22:00';p.appearanceSchedule.nightFrom='06:00';});
 [['21:59','night'],['22:00','day'],['02:00','day'],['05:59','day'],['06:00','night']].forEach(function(c){assert.equal(P.appearanceMode(q,null,Date.now(),hm(c[0])),c[1],c[0]);});
 // An empty sun entity ignores any plan.
 var r=scheduled(function(p){p.appearanceSchedule.sunEntity='';}),now=at('2026-11-19T15:00:00+01:00');
 var down=P.sunPlan(sun('below_horizon','2026-11-20T08:20:00+01:00','2026-11-20T17:19:00+01:00'),now);
 assert.equal(P.appearanceMode(r,down,now,hm('15:00')),'day');
});

test('Minutes of the day are read in the profile time zone, midnight included',function(){
 assert.equal(P.minutesOfDay(new Date('2026-11-19T18:30:00Z'),'Europe/Paris'),19*60+30);
 assert.equal(P.minutesOfDay(new Date('2026-11-19T23:05:00Z'),'Europe/Paris'),5);
 assert.equal(P.minutesOfDay(new Date('2026-07-01T05:00:00Z'),'America/New_York'),60);
 assert.equal(P.hhmm('23:59'),1439);assert.equal(P.hhmm('24:00'),null);assert.equal(P.hhmm(730),null);
});

test('Two complete sheets: each is exactly what a single-palette build would ship, for every palette',function(){
 Object.keys(T.palettes).concat(['custom']).forEach(function(name){
  var p=scheduled(function(p){p.appearanceSchedule.night.theme=name;}),s=T.sheets(p),single=copy();
  single.theme=name;P.validate(single);
  assert.equal(s['theme.css'],T.theme(scheduled()));assert.equal(s['theme-night.css'],T.theme(single),name);
 });
 var css=T.sheets(scheduled());assert.notEqual(css['theme.css'],css['theme-night.css']);
});

test('The page links both sheets, switches them without transition and recomputes logos',function(){
 var fs=require('node:fs'),path=require('node:path'),read=function(n){return fs.readFileSync(path.join(__dirname,'../app',n),'utf8');};
 var html=read('index.html');assert.match(html,/<link rel="stylesheet" href="theme\.css" id="theme-day"><link rel="stylesheet" href="theme-night\.css" id="theme-night" media="not all">/);
 assert.ok(fs.existsSync(path.join(__dirname,'../app/theme-night.css')));
 assert.match(read('style.css'),/body\.appearance-switch \*\{-webkit-transition:none!important;transition:none!important\}/);
 var js=read('app.js');assert.match(js,/b\.classList\.add\('appearance-switch'\);sheetsFor\(m\);/);assert.match(js,/P\.logoFile\(t\.logo,t\.appearance,light\)/);
});

test('A sun plan read back from storage at cold start is kept only if well formed, and still expires',function(){
 var now=at('2026-11-19T15:00:00+01:00'),plan=P.sunPlan(sun('above_horizon','2026-11-20T08:20:00+01:00','2026-11-19T17:20:00+01:00'),now),back=JSON.parse(JSON.stringify(plan)),p=scheduled();
 assert.ok(P.validPlan(back));assert.ok(P.validPlan(JSON.parse(JSON.stringify(P.sunPlan(sun('below_horizon'),now)))));
 // Cold start at 18:00, HA not answered yet: the stored plan says night although the fixed hours (19:30) still say day.
 assert.equal(P.appearanceMode(p,back,at('2026-11-19T18:00:00+01:00'),hm('18:00')),'night');
 assert.equal(P.appearanceMode(p,back,at('2026-11-21T18:00:00+01:00'),hm('18:00')),'day');
 [null,'x',{},{mode:'dusk',flip:null,then:null,until:1},{mode:'day',flip:'1',then:'night',until:2},{mode:'day',flip:1,then:'evening',until:2},{mode:'day',flip:null,then:null,until:Infinity}].forEach(function(bad,i){assert.equal(P.validPlan(bad),false,'case '+i);});
});

test('While connected, the live reading wins over the extrapolated plan (a TV clock running ahead changes nothing)',function(){
 var p=scheduled(),read=at('2026-11-19T15:00:00+01:00'),plan=P.sunPlan(sun('above_horizon','2026-11-20T08:20:00+01:00','2026-11-19T17:20:00+01:00'),read);
 var tvClockAhead=at('2026-11-19T17:25:00+01:00');
 assert.equal(P.appearanceMode(p,plan,tvClockAhead,hm('17:25')),'night');                                     // HA unreachable: extrapolated
 assert.equal(P.appearanceMode(p,plan,tvClockAhead,hm('17:25'),sun('above_horizon','2026-11-20T08:20:00+01:00','2026-11-19T17:20:00+01:00')),'day'); // HA says the sun is still up
 assert.equal(P.appearanceMode(p,null,read,hm('12:00'),sun('below_horizon')),'night');
 assert.equal(P.appearanceMode(p,plan,read,hm('12:00'),sun('unavailable')),'day');                            // unusable live state: plan
 var off=scheduled(function(p){p.appearanceSchedule.sunEntity='';});assert.equal(P.appearanceMode(off,null,read,hm('12:00'),sun('below_horizon')),'day');
});

test('The clock tick re-evaluates the schedule, so the palette flips without any HA update (sample preview, no credentials)',function(){
  var js=require('node:fs').readFileSync(require('node:path').join(__dirname,'../app/app.js'),'utf8');assert.match(js,/function clock\(\)\{if\(!p\)return;applyAppearance\(\);/);assert.match(js,/setInterval\(clock,10000\)/);
});
