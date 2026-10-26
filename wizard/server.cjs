'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {build,endpoint,packager}=require('../scripts/build.cjs'),P=require('../app/profile'),root=path.resolve(__dirname,'..');
const example=JSON.parse(fs.readFileSync(path.join(root,'config.example.json'),'utf8'));
function createServer(options={}){
 const csrf=crypto.randomBytes(32).toString('hex');let profile=P.validate(structuredClone(example)),connection=null,entities=[],building=false;const downloads=new Map();
 const fetcher=options.fetch||fetch;
 function send(res,status,data,type='application/json'){res.writeHead(status,{'Content-Type':type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','X-Frame-Options':'SAMEORIGIN','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'self'"});res.end(type==='application/json'?JSON.stringify(data):data);}
 async function json(req){if(req.headers['content-type']!=='application/json')throw Error('Expected JSON');let size=0,chunks=[];for await(const b of req){size+=b.length;if(size>4*1024*1024)throw Error('Request too large');chunks.push(b);}return JSON.parse(Buffer.concat(chunks).toString('utf8'));}
 const server=http.createServer(async(req,res)=>{
  const address=server.address(),origin='http://127.0.0.1:'+address.port;if(req.headers.host!=='127.0.0.1:'+address.port){send(res,403,{error:'Use '+origin});return;}
  const u=new URL(req.url,origin);try{
   if(u.pathname.startsWith('/api/')){
    if(req.headers['x-setup-session']!==csrf||req.headers.origin&&req.headers.origin!==origin){send(res,403,{error:'Reload setup to restore the local session'});return;}
    if(req.method==='GET'&&u.pathname==='/api/state'){let tools=true;try{packager();}catch{tools=false;}send(res,200,{profile,entities,connected:!!connection,buildTools:tools,palettes:require('../scripts/theme.cjs').palettes});return;}
    if(req.method==='GET'&&u.pathname.startsWith('/api/download/')){const item=downloads.get(u.pathname.slice('/api/download/'.length));if(!item){send(res,404,{error:'Build not found in this session'});return;}res.writeHead(200,{'Content-Type':'application/octet-stream','Content-Disposition':'attachment; filename="'+item.filename+'"','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});fs.createReadStream(item.artifact).pipe(res);return;}
    if(req.method!=='POST'){send(res,405,{error:'POST required'});return;}
    const body=await json(req);
    if(u.pathname==='/api/disconnect'){connection=null;entities=[];send(res,200,{ok:true});return;}
    if(u.pathname==='/api/discover'){
     connection=null;entities=[];const ep=endpoint(body.url,body.allowHttp===true);if(typeof body.token!=='string'||body.token.length<20||body.token.length>8192||/\s/.test(body.token))throw Error('Enter your Home Assistant access token');
     let r;try{r=await fetcher(ep.base+'/api/states',{headers:{Authorization:'Bearer '+body.token},redirect:'error',signal:AbortSignal.timeout(15000)});}catch{throw Error('Cannot reach Home Assistant. Check its address, certificate and local network access. Redirects are not followed.');}
     if(r.status===401)throw Error('Home Assistant rejected the token');if(!r.ok)throw Error('Home Assistant returned HTTP '+r.status);
     const length=Number(r.headers.get('content-length')||0);if(length>12*1024*1024)throw Error('Home Assistant response too large');let size=0,parts=[];for await(const b of r.body){size+=b.length;if(size>12*1024*1024)throw Error('Home Assistant response too large');parts.push(b);}const data=JSON.parse(Buffer.concat(parts).toString('utf8'));if(!Array.isArray(data))throw Error('The address did not return a Home Assistant entity list');
     entities=data.filter(s=>s&&typeof s.entity_id==='string'&&/^[a-z_]+\.[a-z0-9_]+$/.test(s.entity_id)).map(s=>({id:s.entity_id,label:String((s.attributes||{}).friendly_name||s.entity_id).slice(0,120),unit:String((s.attributes||{}).unit_of_measurement||'').slice(0,20),deviceClass:String((s.attributes||{}).device_class||'').slice(0,40)}));
     connection={url:ep.url,token:body.token,allowHttp:body.allowHttp===true};send(res,200,{entities,connected:true});return;
    }
    if(u.pathname==='/api/profile'){P.validate(body);require('../scripts/backgrounds.cjs').validateImages(body);profile=structuredClone(body);const missing=entities.length?P.entities(profile).filter(id=>!entities.some(e=>e.id===id)):[];send(res,200,{ok:true,missing});return;}
    if(u.pathname==='/api/build'){
     if(building){send(res,409,{error:'A build is already running'});return;}P.validate(body.profile);const demo=body.demo===true;if(!demo&&!connection)throw Error('Connect to Home Assistant first, or build a sample package');
     if(!demo){const missing=P.entities(body.profile).filter(id=>!entities.some(e=>e.id===id));if(missing.length)throw Error('Replace missing example entities before building: '+missing.join(', '));}
     building=true;try{const result=await build(body.profile,connection,{demo});downloads.set(result.id,result);send(res,200,{id:result.id,filename:result.filename,sha256:result.sha256,private:result.private});}finally{building=false;}return;
    }
    send(res,404,{error:'Unknown setup action'});return;
   }
   if(req.method!=='GET'){send(res,405,{error:'GET required'});return;}
   if(u.pathname==='/preview/profile.json'){send(res,200,profile);return;}
   if(u.pathname==='/preview/connection.json'){send(res,200,{});return;}
   if(u.pathname==='/preview/theme.css'){send(res,200,require('../scripts/theme.cjs').theme(P.validate(profile)),'text/css');return;}
   const files={'/':'wizard/index.html','/wizard.js':'wizard/wizard.js','/network-setup.js':'wizard/network-setup.js','/wizard.css':'wizard/wizard.css','/design.js':'app/design.js','/customizer.js':'wizard/customizer.js','/customizer.css':'wizard/customizer.css','/profile.js':'app/profile.js','/preview/':'app/index.html'};
   for(const name of ['app.js','energy.js','energy.css','network.js','network.css','cloudflare-engine.js','design.js','background.js','weather.js','ha.js','helper.js','profile.js','style.css','community.css','icon.png'])files['/preview/'+name]='app/'+name;
   let relative=files[u.pathname];
   if(P.logoKeys.some(k=>['app-logo','logo'].some(mode=>[false,true].some(light=>'/preview/'+P.logoFile(k,mode,light)===u.pathname))))relative='app/'+u.pathname.slice('/preview/'.length);
   if(u.pathname==='/docs/')relative='docs/INDEX.md';
   if(/^\/docs\/[A-Z0-9-]+\.(md|txt)$/.test(u.pathname))relative=u.pathname.slice(1);
   if(!relative||!fs.existsSync(path.join(root,relative))){send(res,404,'Not found','text/plain');return;}
   let content=fs.readFileSync(path.join(root,relative)),ext=path.extname(relative),type={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.md':'text/plain; charset=utf-8','.txt':'text/plain; charset=utf-8'}[ext];
   if(relative==='wizard/index.html')content=content.toString().replace('__SETUP_SESSION__',csrf);
   if(relative==='app/index.html')content=content.toString().replace('__HA_ORIGIN__','').replace('__NETWORK_ORIGIN__','');
   send(res,200,content,type);
  }catch(e){send(res,400,{error:e instanceof SyntaxError?'Invalid JSON':e.message});}
 });return server;
}
module.exports={createServer};
if(require.main===module){const port=Number(process.env.PORT||8780);const server=createServer();server.listen(port,'127.0.0.1',()=>console.log('Home Launcher setup: http://127.0.0.1:'+server.address().port+'/ (local only; no TV changes)'));server.on('error',e=>{console.error(e.code==='EADDRINUSE'?'Port is in use. Choose another PORT.':e.code);process.exitCode=1;});}
