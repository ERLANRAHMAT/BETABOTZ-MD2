const fetch = require('node-fetch');
let handler = async (m, { conn }) => {
  const q = [
    //tambahin sendiri saya ga pernah nontooon
    'japanese',
    'boobs'
  ];
  const pick = q[Math.floor(Math.random() * q.length)];
  try {
    const res = await fetch(`https://api.betabotz.eu.org/api/search/xnxx?query=${pick}&apikey=${lann}`);
    const api = await res.json();
    
    const ranData = await getRandomResult(api);
    
    let capt = `乂 *R A N D O M B O K E P*\n\n`;
    capt += `  ◦ Title : ${ranData.title}\n`;
    capt += `  ◦ Views : ${ranData.views}\n`;
    capt += `  ◦ Quality : ${ranData.quality}\n`;
    capt += `  ◦ Duration : ${ranData.duration}\n`;
    capt += `  ◦ Link : ${ranData.link}\n`;

    const getDl = await (await fetch(`https://api.betabotz.eu.org/api/download/xnxxdl?url=${ranData.link}&apikey=${lann}`)).json();
    conn.sendFile(m.chat, getDl.result.url, null, capt, m);
  } catch (error) {
    throw `🚩 *Data Tidak Ditemukan*`
  }
}
handler.help = handler.command = ['randombokep'];
handler.tags = ['internet'];
handler.premium = true;
handler.limit = 500;

module.exports = handler;

function getRandomResult(data) {
  const results = data.result;
  const randomIndex = Math.floor(Math.random() * results.length);
  return results[randomIndex];
}
