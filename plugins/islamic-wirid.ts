
import fetch from 'node-fetch';
let handler: WaPlugin = async (m, { conn, usedPrefix, command }) => {
try {
  await m.reply(wait);
  let res = await fetch(
    `https://api.betabotz.eu.org/api/muslim/wirid?text=adam&apikey=${lann}`,
  );
  let json = await res.json();
  global.anu = [
    `―-WIRID-―\n\nId: ${json.result.data[0].id}\n\nWaktu: ${json.result.data[0].times}\n\nArabic: ${json.result.data[0].arabic}`,
    `―-WIRID-―\n\nId: ${json.result.data[1].id}\n\nWaktu: ${json.result.data[1].times}\n\nArabic: ${json.result.data[1].arabic}`,
    `―-WIRID-―\n\nId: ${json.result.data[2].id}\n\nWaktu: ${json.result.data[2].times}\n\nArabic: ${json.result.data[2].arabic}`,
  ];
  conn.reply(m.chat, `${pickRandom(global.anu)}`);
} catch (e) {
  console.log(e);
  throw e;
}
}
  
    handler.help = ['wirid']
    handler.tags = ['islamic']
    handler.command = /^(wirid)$/i
    handler.group = true
    
    

    function pickRandom(list) {
      return list[Math.floor(list.length * Math.random())]
    }
    



//danaputra133

export default handler;
