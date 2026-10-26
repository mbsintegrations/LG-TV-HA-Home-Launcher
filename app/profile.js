(function(root){
  'use strict';
  var powerKeys=['solar','battery','grid','home','charger1','charger2'];
  // IDs are editable starting points, not an app-installation service.
  var appCatalog=[
    {key:'speedtest',label:'Speed Test',id:'home.network.speedtest',style:'text',logo:'speedtest',note:'Built into Home. Opens the optional Cloudflare test without leaving the launcher.'},
    {key:'youtube',label:'YouTube',id:'youtube.leanback.v4',style:'youtube'},
    {key:'kids',label:'YouTube Kids',id:'youtube.leanback.kids.v4',style:'text',note:'Legacy standalone app: availability varies. If missing, use a child profile inside YouTube; this tile cannot select that profile.'},
    {key:'netflix',label:'Netflix',id:'netflix',style:'netflix'},
    {key:'disney',label:'Disney+',id:'com.disney.disneyplus-prod',style:'text'},
    {key:'prime',label:'Prime Video',id:'amazon',style:'prime'},
    {key:'smarters',label:'IPTV Smarters',id:'com.iptvsmarters.app',style:'text',note:'Uses the vendor app artwork. Check the installed app ID on your TV.'},
    {key:'appletv',label:'Apple TV (app)',id:'com.apple.appletv',style:'text',note:'Opens the installed Apple TV streaming app, not an HDMI device. Some TVs use com.apple.appletv.web; check your installed app ID.'},
    {key:'hulu',label:'Hulu',id:'hulu',style:'text'},
    {key:'max',label:'Max / HBO Max',id:'com.wbd.stream',style:'text',note:'Some installations use com.hbo.hbomax. Use the ID reported by your TV.'},
    {key:'paramount',label:'Paramount+',id:'com.cbs-all-access.webapp.prod',style:'text'},
    {key:'plex',label:'Plex',id:'cdp-30',style:'plex'},
    {key:'jellyfin',label:'Jellyfin',id:'org.jellyfin.webos',style:'text'},
    {key:'livetv',label:'Live TV',id:'com.webos.app.livetv',style:'text',note:'Opens the TV tuner. Channels require an aerial/cable connection and tuning in LG settings.'},
    {key:'guide',label:'TV Guide',id:'com.webos.service.iepg',style:'text',note:'Guide IDs vary by webOS version. Some TVs use com.webos.app.tvguide. If neither works, choose the Home Assistant remote Guide button below.'},
    {key:'hdmi1',label:'HDMI 1',id:'com.webos.app.hdmi1',style:'input',logo:'input'},
    {key:'hdmi2',label:'HDMI 2',id:'com.webos.app.hdmi2',style:'input',logo:'input'},
    {key:'hdmi3',label:'HDMI 3',id:'com.webos.app.hdmi3',style:'input',logo:'input'},
    {key:'hdmi4',label:'HDMI 4',id:'com.webos.app.hdmi4',style:'input',logo:'input'}
  ];
  var logoKeys=['speedtest','youtube','kids','netflix','disney','prime','smarters','appletv','hulu','max','paramount','plex','jellyfin','livetv','guide','input'];
  function appPreset(id){for(var i=0;i<appCatalog.length;i++)if(appCatalog[i].id===id)return appCatalog[i];return null;}
  function appLogo(a){var preset=appPreset(a.id);return a.logo===undefined?(preset?(preset.logo||preset.key):''):a.logo;}
  function logoFile(key,appearance,light){if(logoKeys.indexOf(key)===-1)return '';if(key==='smarters')return 'logos/smarters.png';return appearance==='logo'||appearance==='logo-label'?'logos/wordmarks/'+(light&&['youtube','kids','jellyfin'].indexOf(key)!==-1?'light/':'')+key+'.svg':'logos/'+key+(key==='disney'?'.jpg':'.svg');}
  var appearances=[['text','Text Only'],['logo','Logo'],['logo-label','Logo and Text'],['app-logo','App Logo'],['app-logo-label','App Logo and Text']];
  function object(v){return v&&typeof v==='object'&&!Array.isArray(v);}
  function keys(v,allowed,path){if(!object(v))throw Error(path+' must be an object');Object.keys(v).forEach(function(k){if(allowed.indexOf(k)===-1)throw Error(path+': unexpected field '+k);});}
  function str(v,path,max,empty){if(typeof v!=='string'||v.length>(max||80)||(!empty&&!v.trim())||/[\u0000-\u001f]/.test(v))throw Error(path+' is invalid');}
  function choice(v,list,path){if(list.indexOf(v)===-1)throw Error(path+' must be '+list.join(' / '));}
  function entity(v,path,domains,optional){str(v,path,160,optional);if(!v&&optional)return;if(!/^[a-z_]+\.[a-z0-9_]+$/.test(v)||(domains&&domains.indexOf(v.split('.')[0])===-1))throw Error(path+' must be a '+(domains||['valid']).join(' / ')+' entity');}
  function array(v,path,max){if(!Array.isArray(v)||v.length>max)throw Error(path+' must contain at most '+max+' items');}
  function label(v,path){str(v,path,28,false);}
  function privateIPv4(v){var a=String(v).split('.');if(a.length!==4||a.some(function(x){return !/^(0|[1-9][0-9]{0,2})$/.test(x)||Number(x)>255;}))return false;a=a.map(Number);return (a[0]===10||a[0]===172&&a[1]>=16&&a[1]<=31||a[0]===192&&a[1]===168)&&a[3]>0&&a[3]<255;}
  function validate(p){
    keys(p,['schemaVersion','title','location','locale','timeZone','timeFormat','layout','weatherSun','theme','customColors','cards','design','network','apps','weather','temperatures','controls','energy','laundry','helper'],'Profile');
    if(p.schemaVersion!==1)throw Error('Unsupported profile version. Expected 1.');
    label(p.title,'Room name');str(p.location,'Location',40,true);str(p.locale,'Locale',30);str(p.timeZone,'Time zone',80);
    try{new Intl.DateTimeFormat(p.locale,{timeZone:p.timeZone}).format(new Date());}catch(e){throw Error('Locale or time zone is not supported');}
    choice(p.timeFormat,['12','24'],'Clock format');if(p.layout===undefined)p.layout='classic';choice(p.layout,['classic','dock','weather','sidebar','panorama','custom'],'Layout');if(p.weatherSun===undefined)p.weatherSun='';entity(p.weatherSun,'Day/night entity',['sun'],true);
    choice(p.theme,['forest','slate','ocean','dusk','sand','monochrome','custom'],'Theme');
    if(!p.customColors)p.customColors={background:'#142522',surface:'#203730',accent:'#e5cb91',text:'#edf2e9',muted:'#b1c2b4'};
    keys(p.customColors,['background','surface','accent','text','muted'],'Custom colours');['background','surface','accent','text','muted'].forEach(function(k){if(typeof p.customColors[k]!=='string'||!/^#[0-9a-fA-F]{6}$/.test(p.customColors[k]))throw Error('Custom '+k+' must be a six-digit hex colour');});
    if(!p.cards)p.cards={temperaturesTitle:'Room temperatures',statusTitle:'Appliances & status',energyTitle:'Energy flow',energyStyle:'flow'};
    keys(p.cards,['temperaturesTitle','statusTitle','energyTitle','energyStyle'],'Card titles');['temperaturesTitle','statusTitle','energyTitle'].forEach(function(k){label(p.cards[k],'Card title');});choice(p.cards.energyStyle,['flow','house','list'],'Energy layout');
    var D=typeof module!=='undefined'&&module.exports?require('./design'):root.HomeDesign;if(!p.design)p.design=D.defaults();D.validate(p.design);
    if(p.network===undefined)p.network={router:false,routerAddress:'',internet:false,internetTarget:'1.1.1.1',interval:30};
    keys(p.network,['router','routerAddress','internet','internetTarget','interval','method','routerPort'],'Network');
    if(p.network.method===undefined)p.network.method='tcp';if(p.network.routerPort===undefined)p.network.routerPort=443;
    choice(p.network.method,['tcp','icmp'],'Latency method');choice(p.network.routerPort,[443,80,53],'Router TCP port');
    if(typeof p.network.router!=='boolean'||typeof p.network.internet!=='boolean')throw Error('Network options must be boolean');
    str(p.network.routerAddress,'Router address',15,true);
    if(p.network.routerAddress&&!privateIPv4(p.network.routerAddress))throw Error('Router address must be a private IPv4 address, or empty for automatic detection');
    choice(p.network.internetTarget,['1.1.1.1','8.8.8.8'],'Internet ping target');
    choice(p.network.interval,[15,30,60],'Network check interval');
    array(p.apps,'Apps',8);if(!p.apps.length)throw Error('Add at least LG Home');var seen={};
    p.apps.forEach(function(a,i){keys(a,['label','id','style','appearance','logo','guideMode','tvEntity'],'App '+i);label(a.label,'App label');str(a.id,'App ID',100);if(!/^[a-z0-9][a-z0-9._-]+$/.test(a.id)||seen[a.id])throw Error('App IDs must be valid and unique');seen[a.id]=true;choice(a.style,['youtube','netflix','plex','prime','input','lg','text'],'App style');if(a.appearance===undefined)a.appearance='text';choice(a.appearance,appearances.map(function(x){return x[0];}),'Tile appearance');if(a.logo!==undefined)choice(a.logo,[''].concat(logoKeys),'App logo');if(a.guideMode!==undefined){choice(a.guideMode,['app','home-assistant'],'Guide method');if(a.id==='com.webos.app.home')throw Error('LG Home must use native launch');}if(a.guideMode==='home-assistant')entity(a.tvEntity,'LG TV for Guide',['media_player']);else if(a.tvEntity!==undefined)throw Error('TV entity is only used by the HA Guide button');});
    if(p.apps[p.apps.length-1].id!=='com.webos.app.home')throw Error('Keep LG Home as the last app for recovery');
    entity(p.weather,'Weather',['weather'],true);array(p.temperatures,'Temperatures',12);
    p.temperatures.forEach(function(t){keys(t,['label','entity'],'Temperature');label(t.label,'Temperature label');entity(t.entity,'Temperature',['sensor']);});
    array(p.controls,'Controls',6);seen={};
    p.controls.forEach(function(c){keys(c,['label','type','entity','openScript','closeScript','openState'],'Control');label(c.label,'Control label');choice(c.type,['switch','cover','gate','script'],'Control type');entity(c.entity,'Control',c.type==='switch'?['light','switch']:c.type==='cover'?['cover']:c.type==='gate'?['binary_sensor']:['script']);if(seen[c.entity])throw Error('Each control entity may appear only once');seen[c.entity]=true;
      if(c.type==='gate'){entity(c.openScript,'Open script',['script']);entity(c.closeScript,'Close script',['script']);choice(c.openState,['on','off'],'Gate open state');}
      else if(c.openScript!==undefined||c.closeScript!==undefined||c.openState!==undefined)throw Error('Only a gate control uses gate scripts');
    });
    keys(p.energy,['enabled','soc'].concat(powerKeys),'Energy');if(typeof p.energy.enabled!=='boolean')throw Error('Energy enabled must be boolean');entity(p.energy.soc,'Battery percentage',['sensor'],true);
    powerKeys.forEach(function(k){var x=p.energy[k];keys(x,['entity','unit','invert','label'],'Energy '+k);if(x.label!==undefined)label(x.label,'Power label');entity(x.entity,'Energy '+k,['sensor'],true);choice(x.unit,['auto','W','kW'],'Power unit');if(typeof x.invert!=='boolean')throw Error('Invert must be boolean');});
    array(p.laundry,'Status items',4);p.laundry.forEach(function(a){keys(a,['label','status','remaining','remainingFormat'],'Status item');label(a.label,'Status label');entity(a.status,'Status entity',['sensor','binary_sensor','climate','fan','humidifier','vacuum','water_heater','switch','light','cover']);entity(a.remaining,'Detail sensor',['sensor','binary_sensor'],true);choice(a.remainingFormat,['none','finish_time','minutes','text'],'Detail format');});
    keys(p.helper,['enabled'],'Helper');if(typeof p.helper.enabled!=='boolean')throw Error('Helper enabled must be boolean');
    return p;
  }
  function entities(p){var out=[];function add(x){if(x&&out.indexOf(x)===-1)out.push(x);}add(p.weather);if(p.weather)add(p.weatherSun);p.apps.forEach(function(a){if(a.guideMode==='home-assistant')add(a.tvEntity);});p.temperatures.forEach(function(t){add(t.entity);});p.controls.forEach(function(c){add(c.entity);if(c.type==='gate'){add(c.openScript);add(c.closeScript);}});if(p.energy.enabled){powerKeys.forEach(function(k){add(p.energy[k].entity);});add(p.energy.soc);}p.laundry.forEach(function(a){add(a.status);add(a.remaining);});return out;}
  function numeric(v){return v!==null&&v!==undefined&&v!==''&&isFinite(Number(v))?Number(v):null;}
  function power(state,mapping){var n=state&&numeric(state.state);if(n===null||n===undefined)return null;var unit=mapping.unit==='auto'?(state.attributes||{}).unit_of_measurement:mapping.unit;if(unit!=='W'&&unit!=='kW')return null;return n*(unit==='W'?0.001:1)*(mapping.invert?-1:1);}
  function intent(c,s){if(!s||s==='unavailable'||s==='unknown')return null;if(c.type==='switch')return s==='on'?'off':s==='off'?'on':null;if(c.type==='cover')return s==='closed'?'open':s==='open'?'close':null;if(c.type==='gate')return s==='on'||s==='off'?(s===c.openState?'close':'open'):null;return c.type==='script'&&s==='off'?'run':null;}
  function command(c,desired){var service,domain,id=c.entity;if(c.type==='switch'&&['on','off'].indexOf(desired)!==-1){domain=id.split('.')[0];service='turn_'+desired;}else if(c.type==='cover'&&['open','close'].indexOf(desired)!==-1){domain='cover';service=desired+'_cover';}else if(c.type==='gate'&&['open','close'].indexOf(desired)!==-1){domain='script';service='turn_on';id=desired==='open'?c.openScript:c.closeScript;}else if(c.type==='script'&&desired==='run'){domain='script';service='turn_on';}else throw Error('Invalid control action');return {type:'call_service',domain:domain,service:service,target:{entity_id:id}};}
  var api={privateIPv4:privateIPv4,validate:validate,entities:entities,power:power,numeric:numeric,intent:intent,command:command,powerKeys:powerKeys,appCatalog:appCatalog,appPreset:appPreset,appLogo:appLogo,logoFile:logoFile,logoKeys:logoKeys,appearances:appearances};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.HomeProfile=api;
}(this));
