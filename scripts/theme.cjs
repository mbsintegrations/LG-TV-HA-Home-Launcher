'use strict';
const palettes={
 forest:{background:'#142522',surface:'#203730',accent:'#e5cb91',text:'#edf2e9',muted:'#b1c2b4'},
 slate:{background:'#182436',surface:'#2a3c51',accent:'#adc9f2',text:'#eff3fa',muted:'#b5c4d7'},
 ocean:{background:'#082b38',surface:'#134555',accent:'#79d4cc',text:'#eef9f6',muted:'#accdd2'},
 dusk:{background:'#291e32',surface:'#433047',accent:'#e6b9ce',text:'#fbf0f6',muted:'#c9b4cf'},
 sand:{background:'#eee8da',surface:'#faf5e9',accent:'#866333',text:'#322c23',muted:'#706453'},
 monochrome:{background:'#18191a',surface:'#2b2d2e',accent:'#efefdf',text:'#f2f2ec',muted:'#bcbdb6'}
};
function alpha(hex,a){return 'rgba('+[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)).join(',')+','+a+')';}
function theme(p){const c=p.theme==='custom'?p.customColors:palettes[p.theme];if(!c||Object.values(c).some(v=>!/^#[0-9a-f]{6}$/i.test(v)))throw Error('Invalid theme colours');return `/* Generated only from validated hex colours; no external resources. */
html,body{background:${c.background};color:${c.text}}
body #screen,body.theme-slate #screen{background:linear-gradient(120deg,${c.background},${c.surface})}
body .app,body .home-card,body .control,body .control.gate,body.theme-slate .app,body.theme-slate .home-card,body.theme-slate .control,body .dialog{background:${c.surface};border-color:${alpha(c.muted,.33)};color:${c.text}}
body .focusable:focus{border-color:${c.accent}!important;background-color:${c.surface}!important;box-shadow:0 0 0 4px ${alpha(c.accent,.33)}}
body .control.on{border-color:${c.accent};background:${c.surface}}
body .control-name,body .control.gate .control-name,body .card-top,body .node-power,body .brand.lg,body #weather-condition,body .detail-row strong{color:${c.text}}
body .room,body .header-right,body .connection,body .weather-place,body #weather-detail,body .section-label>span,body .control-status,body .room-stat span,body .card-bottom,body .node-label,body .node-state,body .energy-note,body footer,body .input-label,body .laundry-name,body .laundry-time,body .credits{color:${c.muted}}
body .control.on .control-status,body .active .node-state,body #preview-note{color:${c.accent}}
body .energy-node,body .energy-node.active{background:${c.background};border-color:${c.muted}}
body .energy-node.active{border-color:${c.accent}}
body .text-action,body .key{color:${c.muted};border-color:${c.muted}}
body .laundry-icon,body .laundry-icon:before,body .laundry-icon:after{border-color:${c.muted}}
body .control-symbol{border-color:${c.muted}}body .control-symbol:before{background:${c.muted};border-color:${c.surface}}
body .energy-bus:before,body .energy-bus span{background:${c.muted}}
body .dialog-action{background:${c.surface};color:${c.text};border-color:${c.accent}}
body .dialog-heading button{color:${c.text};border-color:${c.muted}}
body .sun{background:radial-gradient(ellipse,${alpha(c.accent,.13)},transparent 70%)}
`+require('./layout.cjs').layout(p,c)+require('./design.cjs').design(p,c);}
module.exports={theme,palettes};
