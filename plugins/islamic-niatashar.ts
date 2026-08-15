// @ts-nocheck
// Converted from plugins-esm - automated
import fetch from 'node-fetch';
let handler: WaPlugin = async (m, { conn, usedPrefix, command }) => {
try {
  let res = await fetch(
    `https://api.betabotz.eu.org/api/muslim/niatashar?&apikey=${lann}`,
  );
  let json = await res.json();
  global.anu = [
    `―-NIAT ASHAR-―\n\n${json.result[0].name}\n\nArab: ${json.result[0].arabic}\n\nLatin: ${json.result[0].latin}\n\nTerjemahan: ${json.result[0].terjemahan}`,
  ];
  conn.reply(m.chat, `${global.anu}`);
} catch (e) {
  console.log(e);
  throw e;
}
}
  
    handler.help = ['niatashar']
    handler.tags = ['islamic']
    handler.command = /^(niatashar)$/i
    handler.group = true
    
    
    



//danaputra133

export default handler;
