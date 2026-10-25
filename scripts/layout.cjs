'use strict';
const fs=require('node:fs'),path=require('node:path');
function layout(p,c){const name=p.layout||'classic';if(!['classic','dock','weather','sidebar','panorama','custom'].includes(name))throw Error('Unknown layout');const read=n=>fs.readFileSync(path.join(__dirname,'../app/layout-'+n+'.css'),'utf8');let css=name==='classic'?'':read('layouts')+'\n'+read(name);css+='\n'+read('weather-art');if(name==='weather')css+='\n'+read('weather-panel');if(name==='panorama')css+='\n'+read('panorama');css+='\n'+read('adaptive');return css.replace(/@BG@/g,c.background).replace(/@SURFACE@/g,c.surface).replace(/@ACCENT@/g,c.accent).replace(/@MUTED@/g,c.muted).replace(/@TEXT@/g,c.text);}
module.exports={layout};
