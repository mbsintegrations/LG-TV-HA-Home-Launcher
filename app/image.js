(function(root){
 'use strict';
 // Pure helpers for the optional image card. ES5 only (LG webOS Chromium 38).
 var ISO=/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?$/;
 function parseStamp(value){
  var m=ISO.exec(String(value===undefined||value===null?'':value).trim()),zone,date;
  if(!m||Number(m[2])<1||Number(m[2])>12||Number(m[3])<1||Number(m[3])>31||Number(m[4])>23||Number(m[5])>59||Number(m[6]||0)>59)return null;
  zone=m[7];
  if(zone){if(zone!=='Z'&&zone.length===5)zone=zone.slice(0,3)+':'+zone.slice(3);date=new Date(Date.parse(m[1]+'-'+m[2]+'-'+m[3]+'T'+m[4]+':'+m[5]+':'+(m[6]||'00')+zone));}
  else date=new Date(Date.UTC(Number(m[1]),Number(m[2])-1,Number(m[3]),Number(m[4]),Number(m[5]),Number(m[6]||0)));
  if(isNaN(date.getTime()))return null;
  // Without an offset the digits are shown as written (formatted as UTC), never shifted.
  return {date:date,zone:m[7]?undefined:'UTC'};
 }
 function dayKey(date,timeZone){return date.toLocaleDateString('en-GB',{timeZone:timeZone,year:'numeric',month:'2-digit',day:'2-digit'});}
 // "HH:MM", prefixed with "DD/MM " when the image is not from today. Empty string if not a timestamp.
 function formatImageTime(value,opts){
  opts=opts||{};
  var p=parseStamp(value),now=opts.now||new Date(),tz=opts.timeZone,time,day;
  if(!p)return '';
  try{
   time=p.date.toLocaleTimeString(opts.locale,{hour:'2-digit',minute:'2-digit',timeZone:p.zone||tz,hour12:opts.hour12===true});
   if(dayKey(p.date,p.zone||tz)===dayKey(now,tz))return time;
   day=p.date.toLocaleDateString(opts.locale,{day:'2-digit',month:'2-digit',timeZone:p.zone||tz});
  }catch(e){
   time=('0'+p.date.getHours()).slice(-2)+':'+('0'+p.date.getMinutes()).slice(-2);
   return time;
  }
  return day+' '+time;
 }
 // ws(s)://host[:port]/api/websocket -> http(s)://host[:port]
 function haHttpOrigin(url){var m=/^(wss?):\/\/([^\/?#\s]+)/i.exec(String(url||''));return m?(m[1].toLowerCase()==='wss'?'https':'http')+'://'+m[2]:'';}
 var PICTURE=/^\/api\/(?:image|camera)_proxy\/[a-z0-9_.]+(?:\?[A-Za-z0-9_=&%.:+\-]*)?$/;
 // Absolute URL of the picture the TV must load, or '' when the state has no usable entity_picture.
 function imageSource(state,origin){var pic=state&&state.attributes&&state.attributes.entity_picture;return typeof pic==='string'&&origin&&PICTURE.test(pic)?origin+pic:'';}
 // Change detector: the <img> is reloaded only when this value changes.
 function imageKey(state){return state?String(state.state)+'|'+String((state.attributes||{}).entity_picture||''):'';}
 var api={formatImageTime:formatImageTime,haHttpOrigin:haHttpOrigin,imageSource:imageSource,imageKey:imageKey};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.HomeImage=api;
}(this));
