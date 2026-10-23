(function(root){
  'use strict';
  var powerKeys=['solar','battery','grid','home','charger1','charger2'];
  function object(v){return v&&typeof v==='object'&&!Array.isArray(v);}
  function keys(v,allowed,path){if(!object(v))throw Error(path+' must be an object');Object.keys(v).forEach(function(k){if(allowed.indexOf(k)===-1)throw Error(path+': unexpected field '+k);});}
  function str(v,path,max,empty){if(typeof v!=='string'||v.length>(max||80)||(!empty&&!v.trim())||/[\u0000-\u001f]/.test(v))throw Error(path+' is invalid');}
  function choice(v,list,path){if(list.indexOf(v)===-1)throw Error(path+' must be '+list.join(' / '));}
  function entity(v,path,domains,optional){str(v,path,160,optional);if(!v&&optional)return;if(!/^[a-z_]+\.[a-z0-9_]+$/.test(v)||(domains&&domains.indexOf(v.split('.')[0])===-1))throw Error(path+' must be a '+(domains||['valid']).join(' / ')+' entity');}
  function array(v,path,max){if(!Array.isArray(v)||v.length>max)throw Error(path+' must contain at most '+max+' items');}
  function label(v,path){str(v,path,28,false);}
  function validate(p){
    keys(p,['schemaVersion','title','location','locale','timeZone','timeFormat','theme','customColors','cards','apps','weather','temperatures','controls','energy','laundry','helper'],'Profile');
    if(p.schemaVersion!==1)throw Error('Unsupported profile version. Expected 1.');
    label(p.title,'Room name');str(p.location,'Location',40,true);str(p.locale,'Locale',30);str(p.timeZone,'Time zone',80);
    try{new Intl.DateTimeFormat(p.locale,{timeZone:p.timeZone}).format(new Date());}catch(e){throw Error('Locale or time zone is not supported');}
    choice(p.timeFormat,['12','24'],'Clock format');choice(p.theme,['forest','slate','ocean','dusk','sand','monochrome','custom'],'Theme');
    if(!p.customColors)p.customColors={background:'#142522',surface:'#203730',accent:'#e5cb91',text:'#edf2e9',muted:'#b1c2b4'};
    keys(p.customColors,['background','surface','accent','text','muted'],'Custom colours');['background','surface','accent','text','muted'].forEach(function(k){if(typeof p.customColors[k]!=='string'||!/^#[0-9a-fA-F]{6}$/.test(p.customColors[k]))throw Error('Custom '+k+' must be a six-digit hex colour');});
    if(!p.cards)p.cards={temperaturesTitle:'Room temperatures',statusTitle:'Appliances & status',energyTitle:'Energy flow',energyStyle:'flow'};
    keys(p.cards,['temperaturesTitle','statusTitle','energyTitle','energyStyle'],'Card titles');['temperaturesTitle','statusTitle','energyTitle'].forEach(function(k){label(p.cards[k],'Card title');});choice(p.cards.energyStyle,['flow','list'],'Energy layout');
    array(p.apps,'Apps',8);if(!p.apps.length)throw Error('Add at least LG Home');var seen={};
    p.apps.forEach(function(a,i){keys(a,['label','id','style'],'App '+i);label(a.label,'App label');str(a.id,'App ID',100);if(!/^[a-z0-9][a-z0-9._-]+$/.test(a.id)||seen[a.id])throw Error('App IDs must be valid and unique');seen[a.id]=true;choice(a.style,['youtube','netflix','plex','prime','input','lg','text'],'App style');});
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
  function entities(p){var out=[];function add(x){if(x&&out.indexOf(x)===-1)out.push(x);}add(p.weather);p.temperatures.forEach(function(t){add(t.entity);});p.controls.forEach(function(c){add(c.entity);if(c.type==='gate'){add(c.openScript);add(c.closeScript);}});if(p.energy.enabled){powerKeys.forEach(function(k){add(p.energy[k].entity);});add(p.energy.soc);}p.laundry.forEach(function(a){add(a.status);add(a.remaining);});return out;}
  function numeric(v){return v!==null&&v!==undefined&&v!==''&&isFinite(Number(v))?Number(v):null;}
  function power(state,mapping){var n=state&&numeric(state.state);if(n===null||n===undefined)return null;var unit=mapping.unit==='auto'?(state.attributes||{}).unit_of_measurement:mapping.unit;if(unit!=='W'&&unit!=='kW')return null;return n*(unit==='W'?0.001:1)*(mapping.invert?-1:1);}
  function intent(c,s){if(!s||s==='unavailable'||s==='unknown')return null;if(c.type==='switch')return s==='on'?'off':s==='off'?'on':null;if(c.type==='cover')return s==='closed'?'open':s==='open'?'close':null;if(c.type==='gate')return s==='on'||s==='off'?(s===c.openState?'close':'open'):null;return c.type==='script'&&s==='off'?'run':null;}
  function command(c,desired){var service,domain,id=c.entity;if(c.type==='switch'&&['on','off'].indexOf(desired)!==-1){domain=id.split('.')[0];service='turn_'+desired;}else if(c.type==='cover'&&['open','close'].indexOf(desired)!==-1){domain='cover';service=desired+'_cover';}else if(c.type==='gate'&&['open','close'].indexOf(desired)!==-1){domain='script';service='turn_on';id=desired==='open'?c.openScript:c.closeScript;}else if(c.type==='script'&&desired==='run'){domain='script';service='turn_on';}else throw Error('Invalid control action');return {type:'call_service',domain:domain,service:service,target:{entity_id:id}};}
  var api={validate:validate,entities:entities,power:power,numeric:numeric,intent:intent,command:command,powerKeys:powerKeys};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.HomeProfile=api;
}(this));
