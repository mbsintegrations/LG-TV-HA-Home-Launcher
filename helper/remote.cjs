'use strict';
// Explicit manual commands only. No auto-discovery, installation, or retries.
const path=require('node:path'),{spawnSync}=require('node:child_process'),{packager}=require('../scripts/build.cjs');
const actions={
 identity:'id; uname -m; /usr/bin/node --version; cat /proc/bus/input/devices',
 probe:'cat /media/developer/apps/usr/palm/applications/com.mbs.communityhomehelper/state/identity.json',
 status:"luna-send-pub -n 1 luna://com.mbs.communityhome.helper/status '{}'",
 trial:"luna-send-pub -n 1 luna://com.mbs.communityhome.helper/resume '{\"trialSeconds\":120}'",
 pause:"luna-send-pub -n 1 luna://com.mbs.communityhome.helper/pause '{}'",
 enable:"luna-send-pub -n 1 luna://com.mbs.communityhome.helper/resume '{\"trialSeconds\":0}'",
 logs:'tail -n 35 /media/developer/apps/usr/palm/applications/com.mbs.communityhomehelper/state/controller.log',
 safety:"luna-send-pub -n 1 luna://com.webos.applicationManager/launch '{\"id\":\"com.mbs.communityhomehelper\",\"params\":{\"diagnostic\":true,\"safetyCheck\":true}}'"
};
if(require.main===module){const [device,action]=process.argv.slice(2);if(!device||!Object.hasOwn(actions,action)){console.error('Usage: node helper/remote.cjs YOUR_PAIRED_TV '+Object.keys(actions).join('|'));process.exitCode=1;}else{const cli=path.join(path.dirname(packager()),'ares-novacom.js');const r=spawnSync(process.execPath,[cli,'--device',device,'--run',actions[action]],{stdio:'inherit',windowsHide:true,timeout:20000});if(r.error||r.status!==0)process.exitCode=1;}}
module.exports={actions};
