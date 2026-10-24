(function(){
 'use strict';
 var ns='http://www.w3.org/2000/svg';
 function svgNode(tag,a,parent){var e=document.createElementNS(ns,tag);Object.keys(a).forEach(function(k){e.setAttribute(k,a[k]);});if(parent)parent.appendChild(e);return e;}
 var labels={'clear-night':'Clear night',partlycloudy:'Partly cloudy','lightning-rainy':'Thunderstorms','snowy-rainy':'Sleet','windy-variant':'Windy and cloudy',exceptional:'Severe weather',unavailable:'Weather unavailable',unknown:'Weather unavailable'};
 function draw(state,nightOverride,layout){var area=document.getElementById('weather-art');if(!area){area=document.createElement('div');area.id='weather-art';area.setAttribute('aria-hidden','true');document.getElementById('weather').appendChild(area);}area.textContent='';
 var condition=state.state,night=condition==='clear-night'||nightOverride===true||(state.attributes||{}).is_daytime===false,storm=condition==='lightning'||condition==='lightning-rainy',rain=condition==='rainy'||condition==='pouring'||condition==='lightning-rainy'||condition==='snowy-rainy',snow=condition==='snowy'||condition==='snowy-rainy',clear=condition==='sunny'||condition==='clear-night',unknown=['unavailable','unknown','exceptional'].indexOf(condition)!==-1;
 var weather=document.getElementById('weather');weather.setAttribute('data-sky',unknown?'unknown':night?'night':storm?'storm':rain?'rain':condition==='cloudy'||condition==='fog'?'cloudy':'day');
 if(layout==='panorama')document.querySelector('.welcome').style.color=(night||storm||rain||unknown)?'#f1f7ff':'#203e59';
 var svg=svgNode('svg',{viewBox:'0 0 320 240',role:'presentation'},area),defs=svgNode('defs',{},svg);
 function gradient(id,top,bottom){var g=svgNode('linearGradient',{id:id,x1:'0',y1:'0',x2:'.6',y2:'1'},defs);svgNode('stop',{offset:'0','stop-color':top},g);svgNode('stop',{offset:'1','stop-color':bottom},g);}
 gradient('wx-sun','#ffe8a1','#ffb237');gradient('wx-cloud',night?'#c5d2ed':'#ffffff',night?'#7389ad':'#c2d7eb');gradient('wx-moon','#fcf5d5','#c6dcff');
 if(!unknown&&(clear||condition==='partlycloudy')){
 if(night){svgNode('path',{d:'M162 27a69 69 0 1 0 64 104A74 74 0 0 1 162 27Z',fill:'url(#wx-moon)'},svg);[[242,39,4],[265,88,3],[97,43,2],[67,105,3]].forEach(function(s){svgNode('path',{d:'M'+s[0]+' '+(s[1]-s[2]*2)+'l'+s[2]+' '+s[2]*1.3+' '+s[2]*1.5+' '+s[2]*.7+'-'+s[2]*1.5+' '+s[2]*.7+'-'+s[2]+' '+s[2]*1.3+'-'+s[2]+'-'+s[2]*1.3+'-'+s[2]*1.5+'-'+s[2]*.7+' '+s[2]*1.5+'-'+s[2]*.7+'Z',fill:'#eff5ff'},svg);});}
 else{var cx=clear?160:115,cy=clear?115:85;svgNode('circle',{cx:cx,cy:cy,r:70,fill:'#ffcc66',opacity:'.08'},svg);for(var i=0;i<8;i++){var a=i*Math.PI/4;svgNode('line',{x1:cx+Math.cos(a)*58,y1:cy+Math.sin(a)*58,x2:cx+Math.cos(a)*70,y2:cy+Math.sin(a)*70,stroke:'#ffd174','stroke-width':5,'stroke-linecap':'round'},svg);}svgNode('circle',{cx:cx,cy:cy,r:45,fill:'url(#wx-sun)'},svg);}}
 if(!clear&&!unknown&&condition!=='windy'){svgNode('path',{d:'M77 161c-25 0-41-17-41-38 0-20 16-36 36-38 9-31 34-49 65-42 22 4 35 18 41 39 26-2 48 16 48 41 0 22-18 38-42 38Z',fill:night?'#566e94':'#9fb9d0',opacity:'.55',transform:'translate(42 5) scale(.85)'},svg);svgNode('path',{d:'M79 184c-29 0-47-17-47-41 0-23 18-41 41-43 11-34 40-53 74-44 22 5 39 23 44 46 30-7 58 15 58 43 0 23-19 39-46 39Z',fill:'url(#wx-cloud)',transform:'translate(31 0)'},svg);}
 if(rain){[116,157,198,239].forEach(function(x,i){svgNode('line',{x1:x,y1:198+(i%2)*4,x2:x-9,y2:218+(i%2)*4,stroke:'#6fb8fa','stroke-width':6,'stroke-linecap':'round'},svg);});}
 if(storm)svgNode('path',{d:'M166 147h32l-19 35h22l-49 54 13-43h-22Z',fill:'#ffcf68'},svg);
 if(snow||condition==='hail'){[110,163,216].forEach(function(x){svgNode('circle',{cx:x,cy:209,r:5,fill:'#d8efff'},svg);if(snow)svgNode('path',{d:'M'+x+' 200v18m-8-14 16 10m-16 0 16-10',stroke:'#d8efff','stroke-width':2},svg);});}
 if(condition==='fog'||condition==='windy'||condition==='windy-variant'){[0,1,2].forEach(function(i){svgNode('path',{d:'M'+(55+i*13)+' '+(170+i*20)+'h'+(185-i*24),stroke:night?'#a4b8d8':'#c5d7e7','stroke-width':7,'stroke-linecap':'round'},svg);});}
 if(unknown){svgNode('circle',{cx:160,cy:115,r:55,fill:'none',stroke:'#a8bac9','stroke-width':4},svg);svgNode('path',{d:'M160 78v50m0 20v3',stroke:'#a8bac9','stroke-width':7,'stroke-linecap':'round'},svg);}
 document.getElementById('weather-condition').textContent=labels[condition]||(condition.charAt(0).toUpperCase()+condition.slice(1));
 }
 window.HomeWeather={render:draw};
})();
