'use strict';
var fs=require('fs'),WebSocket=require('ws');
// Outbound, authenticated HA connection only. No listener, SSAP pairing or TLS bypass.
module.exports=function(root,log,onApp,onReset){
 var cfg=JSON.parse(fs.readFileSync(root+'/ha-config.json','utf8'));
 var stopped=false,socket=null,retry=null,beat=null,deadline=null,state=null,sequence=0,alive=false;
 function reset(){state=null;onReset();}
 function connect(){
  if(stopped)return;reset();
  var s=new WebSocket(cfg.url,{ca:fs.readFileSync(root+'/ca.pem','utf8').match(/-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/g),rejectUnauthorized:true,perMessageDeflate:false,maxPayload:65536,handshakeTimeout:8000});s.maxPayload=65536;socket=s;
  function send(m){if(s.readyState===1)s.send(JSON.stringify(m));}
  deadline=setTimeout(function(){s.terminate();},12000);
  s.on('message',function(raw){
   var m;try{m=JSON.parse(String(raw));}catch(e){s.terminate();return;}
   if(m.type==='auth_required')send({type:'auth',access_token:cfg.token});
   else if(m.type==='auth_invalid'){log('ha-auth-failed');stopped=true;s.terminate();}
   else if(m.type==='auth_ok')send({id:++sequence,type:'subscribe_entities',entity_ids:[cfg.tvEntity]});
   else if(m.type==='result'&&m.success===false){log('ha-subscription-failed');s.terminate();}
   else if(m.type==='pong')alive=true;
   else if(m.type==='event'){
    clearTimeout(deadline);if(!beat){log('ha-connected');alive=true;beat=setInterval(function(){if(!alive){s.terminate();return;}alive=false;send({id:++sequence,type:'ping'});},10000);}
    var ev=m.event||{},id=cfg.tvEntity;
    if(ev.r&&ev.r.indexOf(id)!==-1){reset();return;}
    if(ev.a&&ev.a[id])state=ev.a[id];
    if(ev.c&&ev.c[id]&&state){var change=ev.c[id],plus=change['+']||{},minus=change['-']||{};
     if(plus.s!==undefined)state.s=plus.s;
     if(plus.a){state.a=state.a||{};Object.keys(plus.a).forEach(function(k){state.a[k]=plus.a[k];});}
     if(minus.a)(minus.a||[]).forEach(function(k){delete state.a[k];});
    }
    if(!state||['off','unavailable','unknown'].indexOf(state.s)!==-1){reset();return;}
    if(state.a&&typeof state.a.app_id==='string')onApp(state.a.app_id);
   }
  });
  s.on('error',function(e){log('ha-error',e.code||'connection');});
  s.on('close',function(){clearTimeout(deadline);clearInterval(beat);beat=null;reset();if(!stopped)retry=setTimeout(connect,10000);});
 }
 connect();return {close:function(){stopped=true;clearTimeout(retry);clearTimeout(deadline);clearInterval(beat);if(socket)socket.terminate();}};
};
