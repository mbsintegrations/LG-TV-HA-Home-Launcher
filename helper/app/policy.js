'use strict';
exports.screen=function(watched){
 var previous=null,gap=null;
 watched=watched||[];
 return {reset:function(){previous=null;gap=null;},next:function(id,now){
  if(id===''){if(gap===null)gap=now;return false;}
  var open=id==='com.webos.app.home'&&watched.indexOf(previous)!==-1&&(gap===null||now-gap<2500);
  previous=id;gap=null;return open;
 }};
};
exports.expired=function(last,now){return now-last>2500;};
exports.shouldBlock=function(code,signal){return !!signal||code!==25;};
