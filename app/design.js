(function(root){
 'use strict';
 var rows=['hero','apps','controls','cards'],cards=['temperatures','laundry','energy'];
 function defaults(){return {background:{images:[],rotation:0,dim:45,opacity:100},cards:{finish:'solid',opacity:95,radius:24,accent:false,colors:{apps:'',controls:'',temperatures:'',laundry:'',energy:''}},rows:rows.slice(),cardOrder:cards.slice()};}
 function keys(o,allowed){if(!o||typeof o!=='object'||Array.isArray(o)||Object.keys(o).some(function(k){return allowed.indexOf(k)===-1;}))throw Error('Invalid customizer settings');}
 function number(n,min,max){if(typeof n!=='number'||!isFinite(n)||Math.floor(n)!==n||n<min||n>max)throw Error('Customizer value outside allowed range');}
 function order(a,allowed){if(!Array.isArray(a)||a.length!==allowed.length||allowed.some(function(k){return a.indexOf(k)===-1;}))throw Error('Invalid layout order');}
 function validate(d){
  keys(d,['background','cards','rows','cardOrder']);keys(d.background,['images','rotation','dim','opacity']);keys(d.cards,['finish','opacity','radius','accent','colors']);
  order(d.rows,rows);order(d.cardOrder,cards);if(d.background.opacity===undefined)d.background.opacity=100;number(d.background.opacity,0,100);number(d.background.dim,0,85);number(d.cards.opacity,10,100);
  if([0,30,60,120,300].indexOf(d.background.rotation)===-1||[0,12,24,36].indexOf(d.cards.radius)===-1||['solid','tinted','outline','glass'].indexOf(d.cards.finish)===-1||typeof d.cards.accent!=='boolean')throw Error('Invalid card or rotation option');
  keys(d.cards.colors,['apps','controls'].concat(cards));['apps','controls'].concat(cards).forEach(function(k){if(typeof d.cards.colors[k]!=='string'||(d.cards.colors[k]&&!/^#[0-9a-f]{6}$/i.test(d.cards.colors[k])))throw Error('Invalid card colour');});
  var images=d.background.images;if(!Array.isArray(images)||images.length>5)throw Error('Choose at most five backgrounds');
  images.forEach(function(im){keys(im,['name','data']);if(typeof im.name!=='string'||!im.name.length||im.name.length>80||/[\x00-\x1f]/.test(im.name))throw Error('Invalid background name');if(typeof im.data!=='string'||im.data.length>614423||!/^data:image\/jpeg;base64,\/9j\/[A-Za-z0-9+/]*={0,2}$/.test(im.data))throw Error('Backgrounds must be optimized JPEG images, at most 450 KB each');});return d;
 }
 var api={defaults:defaults,validate:validate};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.HomeDesign=api;
}(this));
