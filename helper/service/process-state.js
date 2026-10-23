'use strict';
var fs=require('fs');
exports.read=function(pid){if(!pid)return {gone:true};try{var raw=fs.readFileSync('/proc/'+pid+'/stat','utf8'),f=raw.slice(raw.lastIndexOf(')')+2).split(' ');return {tick:f[19],state:f[0]};}catch(e){return {gone:e.code==='ENOENT',unknown:e.code!=='ENOENT'};}};
exports.matches=function(current,tick){return !!(current.tick&&current.tick===tick&&current.state!=='Z'&&current.state!=='T'&&current.state!=='t');};
exports.gone=function(current,tick){return !!(current.gone||current.state==='Z'||(current.tick&&current.tick!==tick));};
