'use strict';
const fs=require('node:fs'),path=require('node:path'),P=require('../app/profile');
function stage(profile,folder){P.validate(profile);if(!profile.network.router&&!profile.network.internet)return null;const dir=path.join(folder,'network-service');fs.mkdirSync(dir,{recursive:true});fs.cpSync(path.join(__dirname,'../network-service'),dir,{recursive:true});fs.writeFileSync(path.join(dir,'network.json'),JSON.stringify(profile.network),'utf8');return dir;}
module.exports={stage};
