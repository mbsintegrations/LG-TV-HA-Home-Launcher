(function(root){
 'use strict';
 var options,service,preview=true,monitor=null,view=null,runner=null,runSerial=0,scriptLoading=false,loadWaiters=[];
 function config(){return {autoStart:false,measureDownloadLoadedLatency:false,measureUploadLoadedLatency:false,bandwidthAbortRequestDuration:12000,measurements:[{type:'latency',numPackets:6},{type:'download',bytes:100000,count:1,bypassMinDuration:true},{type:'download',bytes:1000000,count:2},{type:'download',bytes:5000000,count:2},{type:'upload',bytes:100000,count:1,bypassMinDuration:true},{type:'upload',bytes:1000000,count:2},{type:'upload',bytes:5000000,count:2}]};}
 function reading(n){return typeof n==='number'&&isFinite(n)&&n>=0?n:null;}
 function clean(r){var out={};['download','upload','latency','jitter'].forEach(function(k){out[k]=reading(r&&r[k]);});return out;}
 // One sequence at a time; cancelled/late callbacks can never overwrite a newer run.
 function TestRun(Engine,update,finished){var engine=null,deadline=null,closed=false;
  function stop(){if(closed)return;closed=true;clearTimeout(deadline);if(engine){engine.onResultsChange=engine.onFinish=engine.onError=function(){};engine.pause();}}
  this.stop=stop;
  this.start=function(){try{engine=new Engine(config());engine.onResultsChange=function(){if(!closed)update(clean(engine.results.getSummary()));};engine.onFinish=function(results){if(closed)return;var data=clean(results.getSummary());stop();finished(data.download!==null&&data.upload!==null&&data.latency!==null?null:'This browser could not provide reliable timing results.',data);};engine.onError=function(){if(closed)return;stop();finished('Test unavailable. Check internet access or try again.',null);};deadline=setTimeout(function(){if(closed)return;stop();finished('Test timed out. Try again when the connection is less busy.',null);},60000);engine.play();}catch(e){stop();finished('This browser does not support the embedded test yet.',null);}};
 }
 function Monitor(c,call,update){var active=false,busy=false,timer=null,epoch=0,cancelCurrent=null;
  function next(){timer=setTimeout(probe,c.interval*1000);}
  function probe(){if(!active||busy)return;busy=true;var generation=epoch,settled=false,watchdog=setTimeout(function(){finish({returnValue:false});},6500);
   function finish(r){if(settled)return;settled=true;clearTimeout(watchdog);cancelCurrent=null;if(!active||generation!==epoch)return;busy=false;update(r);next();}
   cancelCurrent=function(){settled=true;clearTimeout(watchdog);};
   call('luna://com.mbs.communityhome.network/probe',{},finish);
  }
  // Leave initial rendering and helper recovery clear; hiding cancels this timer too.
  this.start=function(){if(active||(!c.router&&!c.internet))return;active=true;epoch++;timer=setTimeout(probe,10000);};
  this.stop=function(){active=false;busy=false;epoch++;clearTimeout(timer);if(cancelCurrent)cancelCurrent();update(null);};
 }
 function n(tag,cls,value){var x=document.createElement(tag);x.className=cls||'';if(value!==undefined)x.textContent=value;return x;}
 function paintFooter(data){var box=document.getElementById('network-status');if(!box||!options)return;box.textContent='';box.hidden=!options.router&&!options.internet;if(box.hidden)return;
  function add(label,r){var span=n('span','network-reading'),value=reading(r&&r.ms);span.appendChild(n('span','',label+' '));span.appendChild(n('strong','',value!==null?(r.lessThan?'<':'')+value.toFixed(value<10?1:0)+' ms':r&&r.status==='timeout'?'No reply':data?'Unavailable':'—'));box.appendChild(span);}
  var method=options.method==='tcp'?'TCP latency':'ICMP ping';box.appendChild(n('span','network-method',method));if(options.router)add('Router',data&&data.router);if(options.internet)add('Internet',data&&data.internet);box.title=preview?'Sample readings only':method+' from this TV · Internet target '+options.internetTarget;
  if(preview)box.appendChild(n('span','network-sample','SAMPLE'));
 }
 function setMetrics(data){if(!view)return;['download','upload','latency','jitter'].forEach(function(k){var value=reading(data&&data[k]);view.values[k].textContent=value===null?'—':k==='download'||k==='upload'?(value/1000000).toFixed(1):value.toFixed(1);});}
 function state(message,running){if(!view)return;var focusWasCancel=document.activeElement===view.cancel;view.status.textContent=message;view.start.disabled=running;view.cancel.hidden=!running;view.progress.className='network-progress'+(running?' working':'');if(running)view.cancel.focus();else if(focusWasCancel)view.start.focus();}
 function stop(){runSerial++;if(runner){runner.stop();runner=null;}if(view)state('Test cancelled. No result saved.',false);}
 function loadEngine(cb){if(root.CloudflareSpeedTest){cb(null);return;}loadWaiters.push(cb);if(scriptLoading)return;scriptLoading=true;var script=document.createElement('script');script.src='cloudflare-engine.js';var timeout=setTimeout(function(){done(Error('load'));},12000),complete=false;
  function done(error){if(complete)return;complete=true;clearTimeout(timeout);scriptLoading=false;var list=loadWaiters;loadWaiters=[];list.forEach(function(f){f(error);});}
  script.onload=function(){done(root.CloudflareSpeedTest?null:Error('engine'));};script.onerror=function(){done(Error('load'));};document.head.appendChild(script);
 }
 function start(){stop();var serial=runSerial;setMetrics(null);state(preview?'Sample test · checking latency…':'Preparing Cloudflare test…',true);if(monitor)monitor.stop();
  function finish(error,data){if(serial!==runSerial||!view)return;runner=null;state(error||(preview?'Sample complete · no network traffic':'Test complete'),false);if(data)setMetrics(data);if(!error){var at=Date.now();view.last.textContent=(preview?'Sample result · ':'Last tested · ')+new Date(at).toLocaleTimeString();if(!preview)try{localStorage.setItem('home-speedtest-result',JSON.stringify({at:at,values:clean(data)}));}catch(ignore){}}if(monitor&&!document.hidden)monitor.start();}
  if(preview){var timers=[];runner={stop:function(){timers.forEach(clearTimeout);}};timers.push(setTimeout(function(){if(serial!==runSerial||!view)return;setMetrics({latency:18.4,jitter:2.1});state('Sample test · measuring download…',true);},900));timers.push(setTimeout(function(){if(serial!==runSerial||!view)return;setMetrics({download:93400000,latency:18.4,jitter:2.1});state('Sample test · measuring upload…',true);},2100));timers.push(setTimeout(function(){finish(null,{download:93400000,upload:27600000,latency:18.4,jitter:2.1});},3300));return;}
  loadEngine(function(error){if(serial!==runSerial||!view)return;if(error){finish('Could not load the local speed-test engine.',null);return;}state('Measuring your TV’s connection…',true);runner=new TestRun(root.CloudflareSpeedTest,setMetrics,finish);runner.start();});
 }
 function open(container){close();view={values:{}};container.appendChild(n('div','network-eyebrow network-accent',preview?'SAMPLE TEST':'POWERED BY CLOUDFLARE'));
  container.appendChild(n('p','network-intro',preview?'Try the complete experience. These are sample results, not a test of this computer or your TV.':'Measure this TV’s internet connection without leaving Home.'));
  var grid=n('div','network-metrics');[['download','Download','Mbps'],['upload','Upload','Mbps'],['latency','Latency','ms'],['jitter','Jitter','ms']].forEach(function(row){var card=n('div','network-metric');card.appendChild(n('div','network-muted',row[1]));view.values[row[0]]=n('strong','network-result-value','—');card.appendChild(view.values[row[0]]);card.appendChild(n('span','network-unit network-muted',row[2]));grid.appendChild(card);});container.appendChild(grid);
  view.progress=n('div','network-progress');view.progress.appendChild(n('span'));container.appendChild(view.progress);view.status=n('div','network-state',preview?'Ready to try a sample test':'Ready when you are');view.status.setAttribute('role','status');container.appendChild(view.status);
  var actions=n('div','network-actions');view.start=n('button','network-button primary',preview?'Start sample test':'Start test');view.start.onclick=start;view.cancel=n('button','network-button','Cancel test');view.cancel.hidden=true;view.cancel.onclick=function(){stop();if(monitor&&!document.hidden)monitor.start();};actions.appendChild(view.start);actions.appendChild(view.cancel);container.appendChild(actions);
  view.last=n('div','network-last network-muted','No test run yet');container.appendChild(view.last);container.appendChild(n('p','network-footnote network-muted','A short, lightweight test. Very fast connections may read lower than their full capacity. Internet latency here is HTTP response timing to Cloudflare; the footer uses separately labelled TCP latency or ICMP ping.'));
  container.appendChild(n('p','network-footnote network-muted',preview?'No external requests run in this sample. On TV, Cloudflare receives your public IP and test measurements.':'Starting contacts Cloudflare and shares test measurements for network-quality insights. Usually up to about 25 MB of test payload, plus retries and overhead. It may briefly affect streaming.'));
  if(!preview)try{var saved=JSON.parse(localStorage.getItem('home-speedtest-result'));if(saved&&typeof saved.at==='number'&&saved.at>0&&saved.at<=Date.now()){setMetrics(saved.values);view.last.textContent='Last result · '+new Date(saved.at).toLocaleString();}}catch(ignore){}
  view.start.focus();
 }
 function close(){stop();view=null;if(monitor&&!document.hidden)monitor.start();}
 function init(profile,call,isPreview){options=profile.network;service=call;preview=isPreview;if(preview){paintFooter({router:{ms:2.1},internet:{ms:18.4}});return;}paintFooter(null);monitor=new Monitor(options,service,paintFooter);if(!document.hidden)monitor.start();}
 var api={init:init,open:open,close:close,TestRun:TestRun,Monitor:Monitor,config:config,clean:clean};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else{root.HomeNetwork=api;document.addEventListener('visibilitychange',function(){if(document.hidden){stop();if(monitor)monitor.stop();}else if(monitor)monitor.start();});root.addEventListener('pagehide',function(){stop();if(monitor)monitor.stop();});root.addEventListener('pageshow',function(){if(monitor&&!document.hidden)monitor.start();});}
}(this));
