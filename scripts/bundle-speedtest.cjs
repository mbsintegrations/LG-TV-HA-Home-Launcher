'use strict';
const fs=require('node:fs'),path=require('node:path'),babel=require('@babel/core'),esbuild=require('esbuild');
const root=path.resolve(__dirname,'..'),temporary=path.join(root,'.build/speedtest');fs.mkdirSync(temporary,{recursive:true});
// Transpile the pinned official engine with compatibility fixes for TV browsers.
// TV packaged apps may have location.origin === 'null'; the endpoints stay absolute.
const engine=fs.readFileSync(require.resolve('@cloudflare/speedtest'),'utf8');
if(!engine.includes('perf.nextHopProtocol.match('))throw Error('Review upstream resource timing compatibility');
const source=engine.replace('perf.nextHopProtocol.match(','(perf.nextHopProtocol || "").match(').replaceAll('window.location.origin',"(window.location.origin === 'null' ? 'https://speed.cloudflare.com' : window.location.origin)");
const compatible=babel.transformSync(source,{babelrc:false,configFile:false,targets:{chrome:'53'},presets:[[require.resolve('@babel/preset-env'),{modules:false}]],plugins:[[require.resolve('babel-plugin-polyfill-corejs3'),{method:'usage-global',version:require('core-js/package.json').version}]],comments:false}).code;
fs.writeFileSync(path.join(temporary,'engine.mjs'),compatible);
fs.writeFileSync(path.join(temporary,'entry.mjs'),`import {AbortController as PolyfillController} from 'abortcontroller-polyfill/dist/cjs-ponyfill.js';
import {fetch as xhrFetch,Headers,Request,Response} from 'whatwg-fetch';
import Engine from './engine.mjs';
if(!window.AbortController){window.AbortController=PolyfillController;window.fetch=xhrFetch;window.Headers=Headers;window.Request=Request;window.Response=Response;}
window.CloudflareSpeedTest=Engine;`);
const result=esbuild.buildSync({entryPoints:[path.join(temporary,'entry.mjs')],bundle:true,format:'iife',target:'es2015',write:false,minify:false,legalComments:'inline'});
const final=babel.transformSync(result.outputFiles[0].text,{babelrc:false,configFile:false,presets:[[require.resolve('@babel/preset-env'),{targets:{ie:'11'},modules:false}]],comments:true,compact:true}).code;
require('acorn').parse(final,{ecmaVersion:5});
fs.writeFileSync(path.join(root,'app/cloudflare-engine.js'),'/* Cloudflare speedtest 1.15.0; bundled locally. See docs/NETWORK-LICENSES.txt. */\n'+final+'\n');
let licenses='Bundled for the optional embedded test. No runtime CDN scripts.\nRebuild: node scripts/bundle-speedtest.cjs\n\n';
for(const name of ['@cloudflare/speedtest','core-js','whatwg-fetch','abortcontroller-polyfill','@babel/core','esbuild']){const dir=path.join(root,'node_modules',name),file=fs.readdirSync(dir).find(n=>/^LICENSE(?:\.txt|\.md)?$/i.test(n));if(!file)throw Error('Missing licence: '+name);licenses+=name+'\n'+fs.readFileSync(path.join(dir,file),'utf8')+'\n\n';}
licenses=licenses.trimEnd()+'\n';
fs.writeFileSync(path.join(root,'docs/NETWORK-LICENSES.txt'),licenses);
fs.writeFileSync(path.join(root,'app/THIRD-PARTY-NOTICES.txt'),licenses);
console.log('Cloudflare ES5 bundle: '+Math.round(Buffer.byteLength(final)/1024)+' KiB. Physical browser capability checks still required.');
