'use strict';
function privateIPv4(v){var a=String(v).split('.');if(a.length!==4||a.some(function(x){return !/^(0|[1-9][0-9]{0,2})$/.test(x)||Number(x)>255;}))return false;a=a.map(Number);return (a[0]===10||a[0]===172&&a[1]>=16&&a[1]<=31||a[0]===192&&a[1]===168)&&a[3]>0&&a[3]<255;}
function allowed(address,kind){return kind==='router'?privateIPv4(address):kind==='internet'&&['1.1.1.1','8.8.8.8'].indexOf(address)!==-1;}
function parse(output,code){var match=/time([=<])\s*([0-9]+(?:\.[0-9]+)?)\s*ms/i.exec(output);if(code===0&&match)return {status:'ok',ms:Number(match[2]),lessThan:match[1]==='<'};if(code===1)return {status:'timeout',ms:null};return {status:'unavailable',ms:null};}
function ping(spawn,binary,address,kind,callback){if(!allowed(address,kind)){callback({status:'unavailable',ms:null});return;}var child,done=false,output='',timer;
 function finish(result){if(done)return;done=true;clearTimeout(timer);callback(result);}
 try{child=spawn(binary,['-n','-c','1','-W','2',address],{stdio:['ignore','pipe','pipe'],env:{PATH:'/usr/bin:/bin',LC_ALL:'C'}});}catch(e){finish({status:'unavailable',ms:null});return;}
 timer=setTimeout(function(){try{child.kill('SIGKILL');}catch(ignore){}finish({status:'timeout',ms:null});},3000);
 child.stdout.on('data',function(chunk){output=(output+String(chunk)).slice(-4096);});
 child.stderr.on('data',function(){});
 child.on('error',function(){finish({status:'unavailable',ms:null});});
 child.on('close',function(code){finish(parse(output,code));});
}
function tcp(net,address,port,kind,callback){
 if(!allowed(address,kind)||[443,80,53].indexOf(port)===-1||kind==='internet'&&port!==443){callback({status:'unavailable',ms:null,method:'tcp'});return;}
 var socket,done=false,timer,started=process.hrtime();
 function finish(status){if(done)return;done=true;clearTimeout(timer);var elapsed=process.hrtime(started);if(socket)socket.destroy();callback({status:status,ms:status==='ok'?elapsed[0]*1000+elapsed[1]/1000000:null,method:'tcp'});}
 try{socket=net.connect({host:address,port:port});socket.once('connect',function(){finish('ok');});socket.once('error',function(){finish('unavailable');});socket.once('close',function(){if(!done)finish('unavailable');});timer=setTimeout(function(){finish('timeout');},2500);}catch(e){finish('unavailable');}
}
module.exports={privateIPv4:privateIPv4,allowed:allowed,parse:parse,ping:ping,tcp:tcp};
