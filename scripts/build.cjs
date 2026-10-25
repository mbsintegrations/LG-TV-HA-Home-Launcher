'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{spawn}=require('node:child_process');
const P=require('../app/profile'),root=path.resolve(__dirname,'..');
function endpoint(value,allowHttp=false){
 let u;try{u=new URL(value);}catch{throw Error('Enter a full Home Assistant URL, such as https://home.example.com');}
 if(u.username||u.password||u.search||u.hash||!['http:','https:','ws:','wss:'].includes(u.protocol))throw Error('Use an HTTP(S) Home Assistant address without credentials or query parameters');
 u.protocol=u.protocol==='wss:'?'https:':u.protocol==='ws:'?'http:':u.protocol;
 if(/[<>"'\s]/.test(u.origin))throw Error('Use a valid Home Assistant hostname or IP address');
 if(u.pathname!=='/'&&u.pathname!=='/api/websocket')throw Error('Use the Home Assistant base URL without a path');
 if(u.protocol==='http:'&&!allowHttp)throw Error('Plain HTTP exposes the token on the network. Explicitly allow it only on a trusted local network.');
 u.pathname='/';const base=u.origin;return {base,url:base.replace(/^http/,'ws')+'/api/websocket',origin:base.replace(/^http/,'ws')};
}
function validateConnection(c){if(!c||typeof c.token!=='string'||c.token.length<20||c.token.length>8192||/[\s\x00-\x1f]/.test(c.token))throw Error('A valid private HA token is required');return {...endpoint(c.url,!!c.allowHttp),token:c.token};}
function packager(){if(process.env.WEBOS_PACKAGER){const p=path.resolve(process.env.WEBOS_PACKAGER);if(fs.existsSync(p))return p;}const p=path.join(root,'node_modules/@webos-tools/cli/bin/ares-package.js');if(!fs.existsSync(p))throw Error('Build tools are missing. Run npm ci --ignore-scripts in the project folder, then restart setup.');return p;}
async function pack(args){const cli=packager();await new Promise((resolve,reject)=>{const child=spawn(process.execPath,[cli,...args],{cwd:root,windowsHide:true,stdio:['ignore','pipe','pipe']});let output='';const timer=setTimeout(()=>{child.kill();reject(Error('Packaging timed out'));},90000);child.stdout.on('data',b=>{output=(output+b).slice(-4000);});child.stderr.on('data',b=>{output=(output+b).slice(-4000);});child.on('error',()=>{clearTimeout(timer);reject(Error('Could not run the webOS packager'));});child.on('exit',code=>{clearTimeout(timer);if(code!==0)reject(Error('Packaging failed. Verify the official build tools are installed.'));else resolve();});});}
async function build(profile,connection,{demo=false}={}){
 P.validate(profile);require('./backgrounds.cjs').validateImages(profile);if(profile.helper.enabled)throw Error('Build the base launcher with Helper disabled. The manual helper build adds its service after you verify TV-specific permissions.');
 const ha=demo?null:validateConnection(connection),id=crypto.randomBytes(8).toString('hex'),folder=path.join(root,'private','builds',id),stage=path.join(folder,'app');
 fs.mkdirSync(stage,{recursive:true,mode:0o700});
 for(const n of fs.readdirSync(path.join(root,'app')))if(/\.(js|css|html|json|png)$/.test(n))fs.copyFileSync(path.join(root,'app',n),path.join(stage,n));
 fs.cpSync(path.join(root,'app/logos'),path.join(stage,'logos'),{recursive:true});
 const html=fs.readFileSync(path.join(stage,'index.html'),'utf8').replace('__HA_ORIGIN__',ha?ha.origin:'');fs.writeFileSync(path.join(stage,'index.html'),html);fs.writeFileSync(path.join(stage,'theme.css'),require('./theme.cjs').theme(profile));
 fs.writeFileSync(path.join(stage,'profile.json'),JSON.stringify(profile,null,2),{mode:0o600});fs.writeFileSync(path.join(stage,'connection.json'),JSON.stringify(ha?{url:ha.url,token:ha.token}:{}),{mode:0o600});
 await pack(['--no-minify',stage,'-o',folder]);const filename=fs.readdirSync(folder).find(n=>n.endsWith('.ipk'));if(!filename)throw Error('Packager returned no IPK');const artifact=path.join(folder,filename);fs.chmodSync(artifact,0o600);
 const sha256=crypto.createHash('sha256').update(fs.readFileSync(artifact)).digest('hex');
 fs.writeFileSync(path.join(folder,'SHA256SUMS.txt'),sha256+'  '+filename+'\n');fs.writeFileSync(path.join(folder,'profile.json'),JSON.stringify(profile,null,2),{mode:0o600});
 return {id,folder,artifact,filename,sha256,private:!demo};
}
module.exports={build,pack,packager,endpoint,validateConnection};
if(require.main===module){(async()=>{const args=process.argv.slice(2),demo=args.includes('--demo'),file=args.find(a=>!a.startsWith('--'));if(!file)throw Error('Usage: npm run build -- path/to/profile.json [--demo]. For a live build put connection JSON in private/connection.json.');const p=JSON.parse(fs.readFileSync(file,'utf8'));const c=demo?null:JSON.parse(fs.readFileSync(path.join(root,'private/connection.json'),'utf8'));const r=await build(p,c,{demo});console.log(JSON.stringify({file:r.artifact,sha256:r.sha256,containsCredential:r.private}));})().catch(e=>{console.error(e.message);process.exitCode=1;});}
