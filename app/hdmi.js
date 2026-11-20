(function(root){
 'use strict';
 // Optional live HDMI input preview card. ES5 only (LG webOS Chromium 38).
 // webOS lets a web app show a physical input through a <video> whose <source> has
 // type "service/webos-external" and an ext://hdmi:N address (webOSBrew, "Input/TV embedding").
 var SOURCE_TYPE='service/webos-external',INPUT=/^hdmi:([1-4])$/;
 // Pure decision: what the card must show. The card takes the Temperatures slot, so it needs that
 // card to be visible. Only a real TV (onTv) may create the <video>; the desktop preview and the
 // configurator get a static placeholder.
 function plan(profile,onTv){
  var h=profile&&profile.hdmiPreview,m=h&&INPUT.exec(String(h.input||'')),v=profile&&profile.cards&&profile.cards.visible;
  if(!profile||!m||(v&&v.indexOf('temperatures')===-1))return {mode:'off',n:0,input:'',src:'',appId:'',label:''};
  return {mode:onTv?'video':'placeholder',n:Number(m[1]),input:h.input,src:'ext://hdmi:'+m[1],appId:'com.webos.app.hdmi'+m[1],label:(typeof h.label==='string'&&h.label.trim())||'HDMI '+m[1]};
 }
 // <video autoplay muted><source type="service/webos-external" src="ext://hdmi:N"></video>
 function create(doc,src){
  var video=doc.createElement('video'),source=doc.createElement('source');
  video.setAttribute('autoplay','');video.setAttribute('muted','');video.autoplay=true;video.muted=true;video.defaultMuted=true;video.className='hdmi-video';
  source.setAttribute('type',SOURCE_TYPE);source.setAttribute('src',src);video.appendChild(source);
  return {video:video,source:source};
 }
 // Owns at most one <video> inside the frame. stop() releases it completely so the TV decoder is free.
 function Preview(doc,frame,src,onState){
  var current=null;
  function state(s){if(onState)onState(s);}
  function fail(){if(!current)return;release();state('failed');}
  function release(){
   var v=current;if(!v)return;current=null;
   try{v.video.pause();}catch(e){}
   try{while(v.video.firstChild)v.video.removeChild(v.video.firstChild);v.video.removeAttribute('src');if(v.video.load)v.video.load();}catch(e){}
   if(v.video.parentNode)v.video.parentNode.removeChild(v.video);
  }
  return {
   start:function(){
    var made,played;if(current)return;
    made=create(doc,src);current=made;
    // "error" does not bubble: listen on the <source> as well as on the <video>.
    made.video.addEventListener('error',fail,false);made.source.addEventListener('error',fail,false);
    made.video.addEventListener('playing',function(){if(current===made)state('playing');},false);
    made.video.addEventListener('loadeddata',function(){if(current===made)state('playing');},false);
    frame.appendChild(made.video);state('starting');
    try{played=made.video.play();if(played&&typeof played.then==='function')played.then(null,function(err){if(current===made&&err&&err.name==='NotSupportedError')fail();});}catch(e){}
   },
   stop:function(){if(current){release();state('stopped');}},
   active:function(){return !!current;}
  };
 }
 var api={plan:plan,create:create,Preview:Preview,SOURCE_TYPE:SOURCE_TYPE};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.HomeHdmi=api;
}(this));
