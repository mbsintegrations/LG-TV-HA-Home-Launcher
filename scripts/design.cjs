'use strict';
const fs=require('node:fs'),path=require('node:path');
function alpha(hex,a){return 'rgba('+[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)).join(',')+','+a+')';}
function design(p,c){if(!p.design)return '';const d=p.design,s=d.cards,selectors={apps:'.app',controls:'.control',temperatures:'.temperatures',laundry:'.laundry',energy:'.energy'};let css='\n'+fs.readFileSync(path.join(__dirname,'../app/design.css'),'utf8');
 for(const [key,sel] of Object.entries(selectors)){const color=s.colors[key]||c.surface,opacity=s.finish==='solid'?1:s.opacity/100,scope='body #screen '+sel;
  let bg=alpha(color,opacity),border=alpha(c.muted,.4),shadow='none';
  if(s.finish==='outline'){border=c.accent;shadow='inset 0 0 0 1px '+alpha(c.accent,.5);}
  if(s.finish==='glass'){bg='linear-gradient(135deg,rgba(255,255,255,.20),rgba(255,255,255,.02) 45%,rgba(255,255,255,.07)), '+bg;border='rgba(255,255,255,.55)';shadow='inset 0 1px 0 rgba(255,255,255,.65), inset 0 -1px 0 rgba(255,255,255,.12), 0 8px 18px rgba(0,0,0,.18)';}
  css+=`${scope}{background:${bg};border-radius:${s.radius}px;border-color:${border};box-shadow:${shadow};${s.accent?'border-top:4px solid '+c.accent+';':''}}\n${scope}:focus{background:${bg}!important;outline:3px solid ${c.accent};outline-offset:3px}\n`;
  if(s.finish==='glass')css+=`${scope}{position:${p.layout==='sidebar'&&['temperatures','laundry','energy'].includes(key)?'absolute':'relative'};z-index:0}body.has-frost #screen ${sel}{background:transparent}body.has-frost #screen ${sel}:before{content:'';position:absolute;left:0;top:0;right:0;bottom:0;border-radius:inherit;pointer-events:none;z-index:-1;background:${bg}}\n`;
  if(s.colors[key]){const rgb=[1,3,5].map(i=>parseInt(color.slice(i,i+2),16)),light=rgb[0]*.299+rgb[1]*.587+rgb[2]*.114>155,text=light?'#18212b':'#f5f7fc',muted=light?'#344250':'#d3dde9';css+=`${scope},${scope} .card-top,${scope} .control-name,${scope} .room-stat strong,${scope} .laundry-state,${scope} .app-logo-label,${scope} .brand.lg{color:${text}}${scope} .control-status,${scope} .room-stat span,${scope} .laundry-name,${scope} .laundry-time,${scope} .text-action,${scope} .input-label{color:${muted}}\n`;if(key==='apps')css+=`${scope}.wordmark-mode:not(.logo-netflix):not(.logo-youtube):not(.logo-kids):not(.logo-jellyfin) .app-logo,${scope}.app-icon-mode:not(.logo-disney) .app-logo{filter:${light?'brightness(0)':'none'}}\n`;}
 }
 css+=`body #screen .hero,body #screen .weather{border-radius:${s.radius}px}body #screen .energy-node{border-radius:${Math.min(18,s.radius)}px}\n`;
 if(p.layout!=='sidebar'){d.cardOrder.forEach((id,i)=>{css+=`body #screen #${id}{order:${i};margin-left:0;margin-right:18px}\n`;});css+='body #screen .home-cards{margin-right:-18px}\n';}
 const visible=(d.cardOrder||['temperatures','laundry','energy']).filter(k=>(!p.cards.visible||p.cards.visible.includes(k))&&(k==='temperatures'?p.temperatures.length:k==='laundry'?p.laundry.length||p.calendar&&p.calendar.enabled:p.energy.enabled));
 if(p.cards.arranged&&p.layout==='sidebar'){
  const positions=visible.length===1?[{left:414,top:732,width:1434,height:262}]:visible.length===2?[{left:414,top:732,width:700,height:262},{left:1132,top:732,width:716,height:262}]:[{left:414,top:732,width:625,height:262},{left:1070,top:732,width:778,height:262},{left:1070,top:333,width:778,height:360}];
  visible.forEach((id,i)=>{const r=positions[i];css+=`body.layout-sidebar #screen #${id}{left:${r.left}px;top:${r.top}px;right:auto;width:${r.width}px;height:${r.height}px;margin:0}
`;if(id==='energy'&&r.height<300)css+='body.layout-sidebar #screen #energy .energy-diagram{height:160px;margin-top:12px}body.layout-sidebar #screen #energy .energy-row{height:72px}body.layout-sidebar #screen #energy .energy-bus{top:72px;height:16px}body.layout-sidebar #screen #energy .energy-bus span{height:16px}body.layout-sidebar #screen #energy .energy-bus:before{top:8px}body.layout-sidebar #screen #energy .energy-node{padding:6px 8px}body.layout-sidebar #screen #energy .node-power{font-size:20px;margin-top:3px}body.layout-sidebar #screen #energy .node-state{font-size:11px;margin-top:2px}\n';});
 }else if(p.cards.arranged){visible.forEach(id=>{css+=`body #screen #${id}{flex:1;min-width:0;width:auto}
`;});}
 if(p.layout==='custom'){

  css+=fs.readFileSync(path.join(__dirname,'../app/layout-custom.css'),'utf8');let y=126;const heights={hero:190,apps:166,controls:150,cards:310},sels={hero:'.hero',apps:'.watch',controls:'.controls-section',cards:'.home-cards'};
  const visible=d.rows.filter(k=>k!=='controls'||p.controls.length).filter(k=>k!=='cards'||p.temperatures.length||p.laundry.length||p.calendar&&p.calendar.enabled||p.energy.enabled);
  for(const k of visible){css+=`body.layout-custom #screen ${sels[k]}{top:${y}px;height:${heights[k]}px}\n`;y+=heights[k]+18;}
 }
 return css;
}
module.exports={design};
