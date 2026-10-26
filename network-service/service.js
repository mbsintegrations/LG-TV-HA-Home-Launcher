'use strict';
// Read-only, short-lived service. No shell, privilege changes, scans or background loop.
var fs=require('fs'),cp=require('child_process'),net=require('net'),Service=require('webos-service'),probe=require('./probe'),config=require('./network.json');
var service=new Service('com.mbs.communityhome.network'),busy=false,lastAt=0,last=null;
var binary=fs.existsSync('/bin/ping')?'/bin/ping':'/usr/bin/ping';
service.register('probe',function(message){
 if(busy){message.respond({returnValue:false,errorText:'A check is already running'});return;}
 if(last&&Date.now()-lastAt<Math.max(15000,config.interval*1000-1000)){message.respond(last);return;}
 busy=true;var result={returnValue:true},count=0,finished=false;
 function finish(){if(finished)return;finished=true;busy=false;result.at=Date.now();lastAt=result.at;last=result;message.respond(result);}
 function run(address){var tasks=[];if(config.router)tasks.push(['router',address]);if(config.internet)tasks.push(['internet',config.internetTarget]);count=tasks.length;if(!count){finish();return;}tasks.forEach(function(task){function received(r){result[task[0]]=r;if(--count===0)finish();}if(config.method==='tcp')probe.tcp(net,task[1],task[0]==='router'?config.routerPort:443,task[0],received);else probe.ping(cp.spawn,binary,task[1],task[0],received);});}
 if(!config.router||config.routerAddress){run(config.routerAddress);return;}
 var received=false,handle,timer=setTimeout(function(){gateway(null);},1500);
 function gateway(payload){if(received)return;received=true;clearTimeout(timer);if(handle)try{handle.cancel();}catch(ignore){}var address='',wired=payload&&payload.wired,wifi=payload&&payload.wifi;if(wired&&wired.state==='connected')address=wired.gateway||'';else if(wifi&&wifi.state==='connected')address=wifi.gateway||'';run(address);}
 try{handle=service.call('luna://com.palm.connectionmanager/getStatus',{},function(response){gateway(response.payload);});}catch(e){gateway(null);}
});
