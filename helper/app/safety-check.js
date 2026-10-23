'use strict';
var cp=require('child_process');
module.exports=function(root,log,done){
 function exercise(mode,expected,next){var p=cp.spawn(root+'/relay',[],{stdio:['pipe','pipe','pipe']}),output='',start=Date.now(),ready=false;
  var guard=setTimeout(function(){p.kill('SIGKILL');},4000);p.stdin.on('error',function(){});
  p.stdout.on('data',function(b){output+=b;if(!ready&&output.indexOf('READY')!==-1){ready=true;if(mode==='pipe-close')p.stdin.end();}});
  p.on('exit',function(code,signal){clearTimeout(guard);var pass=ready&&code===expected;log('relay-self-test',{test:mode,ready:ready,code:code,signal:signal,elapsedMs:Date.now()-start,pass:pass});if(!pass){done(false);return;}next();});
 }
 exercise('pipe-close',24,function(){exercise('missed-heartbeat',20,function(){done(true);});});
};
