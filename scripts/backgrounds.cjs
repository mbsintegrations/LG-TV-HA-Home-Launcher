'use strict';
// Verify imported JPEG headers as well as the browser-generated uploads. No SVG or remote URLs.
function validateImages(profile){
 for(const image of profile.design.background.images){
  const b=Buffer.from(image.data.slice(23),'base64');
  if(b.length>450*1024||b.length<20||b[0]!==255||b[1]!==216||b[b.length-2]!==255||b[b.length-1]!==217)throw Error('Invalid background JPEG');
  let found=false,pos=2;
  while(pos+4<=b.length){if(b[pos++]!==255)throw Error('Invalid JPEG marker');while(b[pos]===255)pos++;const marker=b[pos++];if(marker===218||marker===217)break;const len=b.readUInt16BE(pos);if(len<2||pos+len>b.length)throw Error('Invalid JPEG segment');
   if(marker===192||marker===194){if(len<8||b[pos+2]!==8||b.readUInt16BE(pos+3)!==1080||b.readUInt16BE(pos+5)!==1920)throw Error('Backgrounds must be optimized to 1920 × 1080 in the configurator');found=true;}
   else if(marker>=193&&marker<=207&&![196,200,204].includes(marker))throw Error('Unsupported JPEG encoding');pos+=len;
  }
  if(!found)throw Error('Background JPEG dimensions are missing');
 }
}
module.exports={validateImages};
