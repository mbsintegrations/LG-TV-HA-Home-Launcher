(function(){
 'use strict';
 var tileId='home.network.speedtest';
 window.HomeNetworkSetup={render:function(ui){
  var p=ui.profile,c=p.network,x=ui.panel('Speed test inside Home','Cloudflare runs inside a screen that matches your launcher. No browser switch, Home Assistant add-on or separate server.');
  var enabled=p.apps.some(function(a){return a.id===tileId;});
  var toggle=ui.check(x,'Show Speed Test in my app tiles',enabled,function(on){
   if(on&&p.apps.length>=8){toggle.checked=false;ui.status('Your eight tiles are in use. Remove one in Apps & inputs, then enable Speed Test.',true);return;}
   if(on&&!enabled)p.apps.splice(p.apps.length-1,0,{label:'Speed Test',id:tileId,style:'text',appearance:'text',logo:''});
   if(!on)p.apps=p.apps.filter(function(a){return a.id!==tileId;});ui.render();
  });
  if(!enabled&&p.apps.length>=8){toggle.disabled=true;x.appendChild(ui.node('div','callout','All eight app slots are in use. Remove one in Apps & inputs to make room for Speed Test.'));}
  x.appendChild(ui.node('p','','Uses one of your eight app slots. Move or rename it in Apps & inputs. Tests start only when you press Start.'));
  var line=ui.node('div','button-line');
  if(enabled)line.appendChild(ui.button('Try the sample test',async function(){if(await ui.save())document.getElementById('preview').src='/preview/?network=1&v='+Date.now();},'primary'));
  line.appendChild(ui.button('Show home screen',async function(){await ui.save();},'quiet'));x.appendChild(line);
  x.appendChild(ui.node('div','callout','The configurator uses sample readings. The installed TV app measures its own connection.'));
  x.appendChild(ui.node('p','','The live test contacts Cloudflare, which sees your public IP and collects test measurements for network-quality insights. It never receives your HA token or selected entities. A short test can use tens of MB and may briefly affect streaming.'));
  var link=ui.node('a','doc-link','Cloudflare speed-test information');link.href='https://speed.cloudflare.com/about/';link.target='_blank';link.rel='noopener noreferrer';x.appendChild(link);
  x=ui.panel('Small network readings','Choose either or both. Measurements come from the TV itself and only run while Home is visible. They are independent of Home Assistant.');
  ui.check(x,'Show router latency in the footer',c.router,function(v){c.router=v;ui.render();});
  if(c.router)ui.field(x,'Router address (optional)',c.routerAddress,function(v){c.routerAddress=v;},{placeholder:'Automatic — use the TV’s gateway',help:'Leave empty to detect the router from webOS. You can enter a private IPv4 address if needed.'});
  ui.check(x,'Show internet latency in the footer',c.internet,function(v){c.internet=v;ui.render();});
  if(c.internet)ui.field(x,'Internet target',c.internetTarget,function(v){c.internetTarget=v;},{values:[['1.1.1.1','Cloudflare · 1.1.1.1'],['8.8.8.8','Google · 8.8.8.8']]});
  if(c.router||c.internet)ui.field(x,'Check every',String(c.interval),function(v){c.interval=Number(v);},{values:[['15','15 seconds'],['30','30 seconds · recommended'],['60','60 seconds']]});
  if(c.router||c.internet)ui.field(x,'Latency method',c.method,function(v){c.method=v;ui.render();},{values:[['tcp','TCP connection latency · recommended'],['icmp','ICMP ping · requires TV permission']]});
  if(c.router&&c.method==='tcp')ui.field(x,'Router TCP port',String(c.routerPort),function(v){c.routerPort=Number(v);},{values:[['443','443 · HTTPS'],['80','80 · HTTP'],['53','53 · DNS']],help:'Choose a port your router accepts from the TV network. Only a TCP connection is opened; no login or web request is sent.'});
  x.appendChild(ui.node('p','','TCP latency measures connection setup time, not ICMP ping. Internet checks use port 443. The footer clearly labels the selected method. A blocked or closed port cannot produce a measurement and does not prove the internet is down.'));
  x.appendChild(ui.node('div','callout','Some webOS models block ICMP for non-root apps. TCP avoids that permission requirement. Readings always come from the TV, never HA or your PC.'));
 }};
}());
