(function(root){
 'use strict';
 function start(settings,cards){
  var layer=document.getElementById('photo-background'),shade=document.getElementById('photo-shade'),index=0,timer=null,images=settings.images;
  function show(){if(images.length){layer.style.backgroundImage='url("'+images[index].data+'")';if(cards&&cards.finish==='glass')frost(images[index].data,settings);}}
  function stop(){clearInterval(timer);timer=null;}
  function resume(){stop();if(!document.hidden&&images.length>1&&settings.rotation)timer=setInterval(function(){index=(index+1)%images.length;show();},settings.rotation*1000);}
  if(images.length){document.body.classList.add('has-background');layer.style.opacity=(settings.opacity===undefined?100:settings.opacity)/100;shade.style.opacity=settings.dim/100;show();resume();}
  document.addEventListener('visibilitychange',function(){if(document.hidden)stop();else resume();});root.addEventListener('pagehide',stop);root.addEventListener('pageshow',resume);
 }
 // A single small blurred wallpaper is shared by every glass surface. This avoids
 // relying on backdrop-filter, which older webOS engines cannot render.
 function blurPixels(data,w,h,r){
  var temp=new Uint8ClampedArray(data.length),out=new Uint8ClampedArray(data.length),x,y,c,k,sum,at;
  for(y=0;y<h;y++)for(c=0;c<3;c++){
   sum=0;for(k=-r;k<=r;k++)sum+=data[(y*w+Math.max(0,Math.min(w-1,k)))*4+c];
   for(x=0;x<w;x++){at=(y*w+x)*4;temp[at+c]=sum/(2*r+1);temp[at+3]=255;sum+=data[(y*w+Math.min(w-1,x+r+1))*4+c]-data[(y*w+Math.max(0,x-r))*4+c];}
  }
  for(x=0;x<w;x++)for(c=0;c<3;c++){
   sum=0;for(k=-r;k<=r;k++)sum+=temp[(Math.max(0,Math.min(h-1,k))*w+x)*4+c];
   for(y=0;y<h;y++){at=(y*w+x)*4;out[at+c]=sum/(2*r+1);out[at+3]=255;sum+=temp[(Math.min(h-1,y+r+1)*w+x)*4+c]-temp[(Math.max(0,y-r)*w+x)*4+c];}
  }
  return out;
 }
 var frostRequest=0;
 function frost(source,settings){
  var request=++frostRequest,img=new Image();
  img.onload=function(){
   if(request!==frostRequest)return;
   try{
    var canvas=document.createElement('canvas');canvas.width=320;canvas.height=180;
    var ctx=canvas.getContext('2d');ctx.fillStyle=getComputedStyle(document.body).backgroundColor;ctx.fillRect(0,0,320,180);
    ctx.globalAlpha=(settings.opacity===undefined?100:settings.opacity)/100;ctx.drawImage(img,0,0,320,180);ctx.globalAlpha=1;
    ctx.fillStyle='rgba(0,0,0,'+settings.dim/100+')';ctx.fillRect(0,0,320,180);
    var pixels=ctx.getImageData(0,0,320,180);pixels.data.set(blurPixels(blurPixels(pixels.data,320,180,3),320,180,3));ctx.putImageData(pixels,0,0);
    var texture=canvas.toDataURL('image/jpeg',.9),screen=document.getElementById('screen'),screenRect=screen.getBoundingClientRect(),scale=screenRect.width/1920;
    var surfaces=document.querySelectorAll('.app,.control,.temperatures,.laundry,.energy');
    for(var i=0;i<surfaces.length;i++){
     var card=surfaces[i];if(!card.offsetWidth)continue;
     var pane=card.querySelector('.frost-pane');if(!pane){pane=document.createElement('span');pane.className='frost-pane';pane.setAttribute('aria-hidden','true');card.insertBefore(pane,card.firstChild);}
     // Offset coordinates ignore the remote-focus transform and remain stable.
     var x=0,y=0,el=card;while(el&&el!==screen){x+=el.offsetLeft;y+=el.offsetTop;el=el.offsetParent;}
     if(!el){var rect=card.getBoundingClientRect();x=(rect.left-screenRect.left)/scale;y=(rect.top-screenRect.top)/scale;}
     pane.style.backgroundImage='url("'+texture+'")';pane.style.backgroundPosition=(-x)+'px '+(-y)+'px';
    }
    document.body.classList.add('has-frost');canvas.width=0;canvas.height=0;
   }catch(e){document.body.classList.remove('has-frost');}
   img.onload=null;img.src='';
  };
  img.src=source;
 }
 root.HomeBackground={start:start,blurPixels:blurPixels};
}(this));
