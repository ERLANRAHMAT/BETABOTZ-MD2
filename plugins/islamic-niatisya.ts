
import fetch from 'node-fetch';
let handler: WaPlugin = async (m, { conn, usedPrefix, command }) => {
try {
  let res = await fetch(
    `https://api.betabotz.eu.org/api/muslim/niatisya?&apikey=${lann}`,
  );
  let json = await res.json();
  global.anu = [
    `―-NIAT ISYA-―\n\n${json.result[0].name}\n\nArab: ${json.result[0].arabic}\n\nLatin: ${json.result[0].latin}\n\nTerjemahan: ${json.result[0].terjemahan}`,
  ];
  conn.reply(m.chat, `${global.anu}`);
} catch (e) {
  console.log(e);
  throw e;
}
}
  
    handler.help = ['niatisya']
    handler.tags = ['islamic']
    handler.command = /^(niatisya)$/i
    handler.group = true
    
    
    



//danaputra133

export default handler;
