(function(root){
 'use strict';
 var P=typeof module!=='undefined'&&module.exports?require('./profile'):root.HomeProfile;
 // Reused from our Home dashboard energy illustration; no vendor branding.
 var houseArtwork="      <defs><linearGradient id=\"wall\" x2=\"1\" y2=\"1\"><stop stop-color=\"#fafcfd\"/><stop offset=\"1\" stop-color=\"#c9d9e4\"/></linearGradient><linearGradient id=\"side\" x2=\"1\" y2=\".7\"><stop stop-color=\"#b8cbdc\"/><stop offset=\"1\" stop-color=\"#e6eff6\"/></linearGradient><linearGradient id=\"roof\" x2=\".5\" y2=\"1\"><stop stop-color=\"#eff7fa\"/><stop offset=\"1\" stop-color=\"#bacbdb\"/></linearGradient><linearGradient id=\"glass\" x2=\"1\" y2=\"1\"><stop stop-color=\"#a5c5d6\"/><stop offset=\"1\" stop-color=\"#e9f2f7\"/></linearGradient><linearGradient id=\"panel\" x2=\"1\" y2=\"1\"><stop stop-color=\"#4b789a\"/><stop offset=\"1\" stop-color=\"#36536d\"/></linearGradient></defs>      <ellipse cx=\"389\" cy=\"384\" rx=\"208\" ry=\"28\" fill=\"#839eb8\" opacity=\".15\"/>      <path d=\"M164 345 L382 225 L607 355 L395 442 Z\" fill=\"#d5e2ec\"/><path d=\"M164 345 L395 430 L607 355 L607 362 L395 444 L164 353Z\" fill=\"#bdcddd\"/>      <path d=\"M216 235 L387 291 L387 398 L216 337Z\" fill=\"url(#wall)\"/><path d=\"M387 291 L548 223 L548 337 L387 398Z\" fill=\"url(#side)\"/>      <path d=\"M387 291 L467 164 L548 223Z\" fill=\"#d5e2ec\"/><path d=\"M204 236 L288 121 L467 164 L387 291Z\" fill=\"url(#roof)\"/><path d=\"M204 236 L387 291 L392 285 L210 230Z\" fill=\"#f9fcfd\"/><path d=\"M387 291 L467 164 L556 224 L550 229 L467 174 L392 296Z\" fill=\"#eaf2f7\"/>      <g stroke=\"#aec2d2\" stroke-width=\".8\" opacity=\".65\"><path d=\"M227 238L308 126M250 245L329 132M273 252L350 137M296 259L371 142M319 266L392 148M342 273L413 152M365 280L434 158\"/></g><g data-part=\"solar\">      <g fill=\"url(#panel)\" stroke=\"#c8dbe8\" stroke-width=\"1.5\"><path d=\"M278 175L303 140L347 151L323 187Z\"/><path d=\"M325 188L350 152L394 162L370 201Z\"/><path d=\"M372 202L398 164L440 174L416 215Z\"/><path d=\"M247 219L275 180L321 192L294 232Z\"/><path d=\"M298 233L325 193L370 206L343 247Z\"/><path d=\"M347 248L374 207L415 220L389 260Z\"/></g></g><g data-part=\"solar\">      <g fill=\"none\" stroke=\"#90aec8\" stroke-width=\".6\" opacity=\".7\"><path d=\"M289 158L333 169M337 171L382 181M384 184L429 195M260 199L307 212M311 213L357 226M361 227L402 241\"/></g></g>      <path d=\"M424 286L513 248L513 332L424 374Z\" fill=\"url(#glass)\" stroke=\"#f2f7fb\" stroke-width=\"6\"/><path d=\"M454 274L454 359M483 261L483 346M424 326L513 288\" stroke=\"#eff5f9\" stroke-width=\"4\"/>      <path d=\"M233 258L272 270L272 306L233 293Z\" fill=\"url(#glass)\" stroke=\"#eff5f9\" stroke-width=\"4\"/><path d=\"M292 278L326 289L326 325L292 313Z\" fill=\"url(#glass)\" stroke=\"#eff5f9\" stroke-width=\"4\"/>      <path d=\"M330 307L355 316L355 381L330 372Z\" fill=\"#9eb7cb\" stroke=\"#edf5f9\" stroke-width=\"3\"/><g data-part=\"battery\">      <g><path d=\"M365 328L396 317L420 326L388 338Z\" fill=\"#fff\"/><path d=\"M365 328L388 338L388 402L365 393Z\" fill=\"#f3f8fb\"/><path d=\"M388 338L420 326L420 391L388 402Z\" fill=\"#d1e1ea\"/><path d=\"M365 350L388 359L420 347M365 371L388 380L420 369\" fill=\"none\" stroke=\"#a9c2cf\"/><rect x=\"373\" y=\"336\" width=\"3\" height=\"5\" rx=\"1\" fill=\"#15c6b5\"/></g></g><g data-part=\"charger2\">      <g><path d=\"M496 329L519 318L530 325L508 337Z\" fill=\"#fff\"/><path d=\"M496 329L508 337L508 375L496 368Z\" fill=\"#eff6f9\"/><path d=\"M508 337L530 325L530 362L508 375Z\" fill=\"#bfd4e1\"/><path d=\"M514 346L514 366L543 383\" fill=\"none\" stroke=\"#7c9eb7\" stroke-width=\"2\"/></g></g><g data-part=\"charger1\">      <g><path d=\"M228 307L239 310L239 337L228 333Z\" fill=\"#eefaff\" stroke=\"#bed5e2\"/><path d=\"M232 317L235 318\" stroke=\"#1cbfb3\" stroke-width=\"2\"/><path d=\"M234 328C252 343 254 351 235 361\" fill=\"none\" stroke=\"#7592aa\" stroke-width=\"2\"/></g></g><g data-part=\"car\">      <g><path d=\"M198 351L231 332L276 345L296 368L269 388L217 371Z\" fill=\"#e5edf3\" stroke=\"#bdcfdd\"/><path d=\"M225 336L244 329L271 340L261 352Z\" fill=\"#a9c4d6\"/><path d=\"M208 352L224 345L260 357L274 369L256 376L220 365Z\" fill=\"#f9fcfd\"/><ellipse cx=\"222\" cy=\"370\" rx=\"6\" ry=\"9\" fill=\"#6c839b\"/><ellipse cx=\"275\" cy=\"378\" rx=\"6\" ry=\"9\" fill=\"#6c839b\"/></g></g>";
 var names={solar:'Solar',battery:'Battery',grid:'Grid',home:'Home',charger1:'Charger 1',charger2:'Charger 2'};
 function nodes(profile,states,live,demo){
  var out=[];
  P.powerKeys.forEach(function(key){
   var m=profile.energy[key],state=states[m.entity];
   if(!m.entity||(live&&!state))return;
   var value=live||demo?P.power(state||{state:'unavailable',attributes:{}},m):null;
   var active=value!==null&&Math.abs(value)>=.02,toward=key==='solar'||(key==='grid'&&value>0)||(key==='battery'&&value<0)||((key==='charger1'||key==='charger2')&&value<0);
   var status=value===null?'Unavailable':!active?'Idle':key==='grid'?(value>0?'Importing':'Exporting'):key==='battery'?(value>0?'Charging':'Supplying'):key==='solar'?'Generating':key==='home'?'Household load':value>0?'Charging':'Supplying';
   if(key==='battery'&&profile.energy.soc&&(live||demo)){var soc=P.numeric((states[profile.energy.soc]||{}).state);if(soc!==null)status=Math.round(soc)+'% · '+status;}
   out.push({key:key,label:m.label||names[key],value:value,active:active,toward:toward,status:status});
  });return out;
 }
 function svg(tag,attrs,parent,value){var e=document.createElementNS('http://www.w3.org/2000/svg',tag);Object.keys(attrs||{}).forEach(function(k){e.setAttribute(k,attrs[k]);});if(value!==undefined)e.textContent=value;if(parent)parent.appendChild(e);return e;}
 var colors={solar:'#e4bd60',grid:'#7db9f3',battery:'#81d6b1',charger1:'#acacfa',charger2:'#7dd6df'};
 function build(host,list){
  host.textContent='';var width=Math.max(900,Math.round(host.clientWidth/Math.max(1,host.clientHeight)*280)),cx=width/2;
  var rootSvg=svg('svg',{viewBox:'0 0 '+width+' 280',role:'img','aria-label':'House energy flow'},host),refs={};
  if(!list.length){svg('text',{x:cx,y:145,'text-anchor':'middle','class':'house-label'},rootSvg,'No power sensors available');host._energyRefs={};host._energySignature='';return;}
  var lines=svg('g',{'class':'house-paths'},rootSvg),left=list.filter(function(n){return n.key==='charger1'||n.key==='charger2';});
  var positions={solar:{x:cx-225,y:0,anchor:'middle',tip:[cx+15,85]},home:{x:cx+225,y:0,anchor:'middle'},battery:{x:width-15,y:100,anchor:'end',tip:[cx+7,205]},grid:{x:width-15,y:195,anchor:'end',tip:[cx+130,220]}};
  left.forEach(function(n,i){positions[n.key]={x:15,y:left.length===1?120:90+i*100,anchor:'start',tip:[cx-155,170+i*25]};});
  list.forEach(function(n){
   var pos=positions[n.key],group=svg('g',{'class':'house-reading','data-energy-node':n.key},rootSvg),label=svg('text',{x:pos.x,y:pos.y+16,'text-anchor':pos.anchor,'class':'house-label'},group),power=svg('text',{x:pos.x,y:pos.y+47,'text-anchor':pos.anchor,'class':'house-power'},group),status=svg('text',{x:pos.x,y:pos.y+67,'text-anchor':pos.anchor,'class':'house-state'},group);
   if(n.key==='battery'){label.setAttribute('y',pos.y+4);power.setAttribute('y',pos.y+31);status.setAttribute('y',pos.y+50);}
   refs[n.key]={group:group,label:label,power:power,status:status};
   if(n.key!=='home'){
    var startX=pos.anchor==='start'?pos.x+170:pos.anchor==='end'?pos.x-170:pos.x,startY=n.key==='solar'?pos.y+70:n.key==='battery'?pos.y-10:pos.y+40;
    var end=pos.tip,d='M '+startX+' '+startY+' H '+((startX+end[0])/2)+' V '+end[1]+' H '+end[0];
    svg('path',{d:d,'class':'house-wire',stroke:colors[n.key]},lines);refs[n.key].flow=svg('path',{d:d,'class':'house-current',stroke:colors[n.key]},lines);
   }
  });
  var house=svg('g',{'class':'energy-house-art',transform:'translate('+(cx-285)+' -70) scale(.74)'},rootSvg);
  var parsed=new DOMParser().parseFromString('<svg xmlns="http://www.w3.org/2000/svg">'+houseArtwork+'</svg>','image/svg+xml');
  var children=parsed.documentElement.childNodes;
  for(var j=0;j<children.length;j++)house.appendChild(document.importNode(children[j],true));
  var parts=house.querySelectorAll('[data-part]');
  for(var k=0;k<parts.length;k++){var part=parts[k].getAttribute('data-part'),present=list.some(function(n){return part==='car'?(n.key==='charger1'||n.key==='charger2'):n.key===part;});if(!present)parts[k].parentNode.removeChild(parts[k]);}
  // Readings remain above artwork and pipes, with no enclosing metric boxes.
  list.forEach(function(n){rootSvg.appendChild(refs[n.key].group);});
  host._energyRefs=refs;host._energySignature=list.map(function(n){return n.key;}).join(',');
 }
 function render(host,profile,states,live,demo){
  var list=nodes(profile,states,live,demo),signature=list.map(function(n){return n.key;}).join(',');
  if(host._energySignature!==signature||!host._energyRefs)build(host,list);
  list.forEach(function(n){var r=host._energyRefs[n.key];r.label.textContent=n.label;r.power.textContent=n.value===null?'— kW':Math.abs(n.value).toFixed(2)+' kW';if(r.status)r.status.textContent=n.status;if(r.flow)r.flow.setAttribute('class','house-current'+(n.active?' running':'')+(n.toward?'':' outward'));r.group.setAttribute('aria-label',n.label+' '+r.power.textContent+' '+n.status);});
  host.setAttribute('data-live',live||demo?'true':'false');
 }
 if(typeof document!=='undefined')document.addEventListener('visibilitychange',function(){document.body.classList.toggle('energy-hidden',document.hidden);});
 var api={nodes:nodes,render:render};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.HomeEnergy=api;
}(this));
