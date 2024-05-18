const fetch = require('node-fetch');

let handler = async (m, {
  conn,
  text,
  usedPrefix,
  command
}) => {
  if (command == 'tiktokslide' || command == 'ttslide') { // Fixed the condition for 'tiktokslide' and 'ttslide' commands
    if (!text) throw `Masukkan URL!\n\ncontoh: ${usedPrefix + command} https://vt.tiktok.com/ZSY8XX78X/`;
    try {
      const api = await fetch(`https://api.betabotz.eu.org/api/download/ttslide?url=${text}&apikey=${lann}`);
      const res = await api.json();
      for (let i of res.result.images) {
        await sleep(3000);
        conn.sendMessage(m.chat,{ image :{ url : i } , caption : `*Title*: ${res.result.title}` }, { quoted: m });
        await sleep(5000);
        conn.sendMessage(m.chat, { audio: { url: res.result.audio[0] }, mimetype: 'audio/mpeg' }, { quoted: m });         
      }
    } catch (e) {
      console.log(e);
      throw `🚩 *Terjadi kesalahan!*`;
    }
  }
  if (command == 'douyinslide' || command == 'douyinfoto') { // Fixed the condition for 'douyinslide' and 'douyinfoto' commands
    if (!text) throw `Masukkan URL!\n\ncontoh: ${usedPrefix + command} https://v.douyin.com/i2bPkLLo/`;
    try {
      const api = await fetch(`https://api.betabotz.eu.org/api/download/douyin-slide?url=${text}&apikey=${lann}`);
      const res = await api.json();
      for (let i of res.result.images) {
        await sleep(3000);
        conn.sendMessage(m.chat,{ image :{ url : i } , caption : `*Title*: ${res.result.title}` }, { quoted: m });
        await sleep(5000);
        conn.sendMessage(m.chat, { audio: { url: res.result.audio[0] }, mimetype: 'audio/mpeg' }, { quoted: m });         
      }
    } catch (e) {
      console.log(e);
      throw `🚩 *Terjadi kesalahan!*`;
    }
  }
};

handler.command = handler.help = ['douyinslide', 'douyinfoto','ttslide','tiktokslide'];
handler.tags = ['downloader'];
handler.limit = true;

module.exports = handler;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
