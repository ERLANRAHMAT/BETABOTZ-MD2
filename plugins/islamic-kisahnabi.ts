
import fetch from 'node-fetch';
let handler: WaPlugin = async (m, { conn, usedPrefix, command }) => {
try {
  let res = await fetch(
    `https://api.betabotz.eu.org/api/muslim/kisahnabi2?&apikey=${lann}`,
  );
  let json = await res.json();
  global.anu = [
    `―-KISAH NABI 2-―\n\n${json.result[0].name}\n\nTahun kelahiran: ${json.result[0].thn_kelahiran}\n\nUsia: ${json.result[0].usia}\n\n\nStory: ${json.result[0].description}`,
  ];
  conn.reply(m.chat, `${global.anu}`);
} catch (e) {
  console.log(e);
  throw e;
}
}
  
    handler.help = ['kisahnabi2']
    handler.tags = ['islamic']
    handler.command = /^(kisahnabi2)$/i
    handler.group = true
    
    
    



//danaputra133

export default handler;
