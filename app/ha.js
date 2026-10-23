(function(root){
 'use strict';
 var api=typeof module!=='undefined'&&module.exports?require('./profile'):root.HomeProfile;
 function Connection(connection,profile,onData,onStatus){
  var socket=null,running=false,authenticated=false,subscribed=false,states={},requests={},seq=0,retry=null,heartbeat=null,authTimer=null,backoff=1000,lastSeen=0,subscription=0,pending={},allowed=api.entities(profile);
  function emit(){onData(states,authenticated&&subscribed&&Date.now()-lastSeen<45000);}
  function request(command,cb){if(!socket||socket.readyState!==1||!authenticated){cb({success:false});return;}command.id=++seq;var id=seq;requests[id]={cb:cb,timer:setTimeout(function(){if(requests[id]){delete requests[id];cb({success:false});}},8000)};try{socket.send(JSON.stringify(command));}catch(e){clearTimeout(requests[id].timer);delete requests[id];cb({success:false});}return id;}
  function clear(){clearTimeout(authTimer);clearInterval(heartbeat);authenticated=false;subscribed=false;Object.keys(requests).forEach(function(id){var r=requests[id];delete requests[id];clearTimeout(r.timer);r.cb({success:false});});}
  function connect(){
   if(!running)return;if(!connection.url||!connection.token){onStatus('Setup required');return;}states={};onStatus('Connecting to home');
   try{socket=new WebSocket(connection.url);}catch(e){onStatus('Connection unavailable');retry=setTimeout(connect,30000);return;}var current=socket;
   authTimer=setTimeout(function(){current.close();},12000);
   current.onmessage=function(e){if(current!==socket)return;var m;try{m=JSON.parse(e.data);}catch(ignore){return;}
    if(m.type==='auth_required'){current.send(JSON.stringify({type:'auth',access_token:connection.token}));return;}
    if(m.type==='auth_invalid'){running=false;onStatus('Token rejected · run setup');current.close();return;}
    if(m.type==='auth_ok'){
     clearTimeout(authTimer);authenticated=true;backoff=1000;
     // Public documented HA API: subscribe before the snapshot to avoid missed changes.
     subscription=request({type:'subscribe_events',event_type:'state_changed'},function(r){if(!r.success){current.close();return;}request({type:'get_states'},function(r){if(!r.success){current.close();return;}(r.result||[]).forEach(function(s){if(allowed.indexOf(s.entity_id)!==-1)states[s.entity_id]=s;});subscribed=true;lastSeen=Date.now();onStatus('Home connected');emit();});});
     heartbeat=setInterval(function(){request({type:'ping'},function(r){if(r.type==='pong'){lastSeen=Date.now();emit();}else current.close();});},20000);return;
    }
    if(m.type==='event'&&m.id===subscription){var d=(m.event||{}).data||{};if(allowed.indexOf(d.entity_id)!==-1){if(d.new_state)states[d.entity_id]=d.new_state;else delete states[d.entity_id];lastSeen=Date.now();emit();}return;}
    if(requests[m.id]&&(m.type==='result'||m.type==='pong')){var r=requests[m.id];delete requests[m.id];clearTimeout(r.timer);r.cb(m);}
   };
   current.onerror=function(){};
   current.onclose=function(){if(current!==socket)return;clear();emit();if(running){onStatus('Home connection paused');retry=setTimeout(connect,backoff);backoff=Math.min(backoff*2,30000);}};
  }
  this.start=function(){if(running)return;running=true;connect();};
  this.stop=function(){running=false;clearTimeout(retry);clear();if(socket){socket.onclose=null;socket.close();socket=null;}emit();};
  this.connected=function(){return authenticated&&subscribed&&Date.now()-lastSeen<45000;};
  this.control=function(index,desired,cb){
   var c=profile.controls[index],now=Date.now();if(!c||!this.connected()){cb({error:'Home connection unavailable'});return;}
   if(pending[index]>now){cb({error:'Request already sent · please wait'});return;}
   if(api.intent(c,(states[c.entity]||{}).state)!==desired){cb({error:'State changed · select again'});return;}
   if(c.type==='gate'&&[c.openScript,c.closeScript].some(function(id){return !states[id]||['unavailable','unknown'].indexOf(states[id].state)!==-1;})){cb({error:'Gate script unavailable'});return;}
   pending[index]=now+(c.type==='switch'?8000:30000);
   request(api.command(c,desired),function(r){
    if(!r.success){cb({error:'Request not confirmed · check the device before retrying'});return;}
    if(c.type!=='switch'){cb({accepted:true});return;}
    var deadline=Date.now()+5000;function check(){if((states[c.entity]||{}).state===desired){pending[index]=0;cb({confirmed:true});return;}if(!authenticated||Date.now()>deadline){cb({error:'Request accepted · device state not confirmed'});return;}setTimeout(check,200);}check();
   });
  };
 }
 if(typeof module!=='undefined'&&module.exports)module.exports={Connection:Connection};else root.HomeHA={Connection:Connection};
}(this));
