let fetch = require('node-fetch');

let handler = async (m, { text, conn, usedPrefix, command }) => {
  if (!text) throw `*🚩 Contoh:* ${usedPrefix + command} Lathi`;  
  let teks = '';
  try {
    const api = await fetch(`https://api.betabotz.eu.org/api/search/spotify?query=${text}&apikey=${lann}`);
    let json = await api.json();
    let res = json.result.data;    
    for (let i in res) {
      teks += `*${parseInt(i) + 1}.* *Title:* ${res[i].title}\n`;
      teks += `*Duration:* ${res[i].duration}\n`;
      teks += `*Popularity:* ${res[i].popularity}\n`;
      teks += `*Link:* ${res[i].url}\n\n`;
    }     
    await conn.relayMessage(m.chat, {
     extendedTextMessage:{
                text: teks,
                mentions: [m.sender]
    }}, {})
  } catch (e) {
    throw `🚩 *Gagal Memuat Data!*`;
  }
};

handler.command = handler.help = ['spotifysearch'];
handler.tags = ['downloader'];
handler.premium = false;
handler.group = false;
handler.limit = true

module.exports = handler;
