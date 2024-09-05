const fetch = require('node-fetch');
const uploadImage = require('../lib/uploadImage.js');

async function handler(m, { conn, usedPrefix, command, text }) {
  try {   
   
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || q.mediaType || '';
    if (/^image/.test(mime) && !/webp/.test(mime)) {
      if (!text) throw `Masukan Text!\n\ncontoh:\n${usedPrefix + command} YHAHAH WAHYU`;
      m.reply(`Tunggu ya kak :) *semakin tinggi scale yang di input semakin lama proses nya.*`);
      const img = await q.download();
      const out = await uploadImage(img);
      const api = await fetch(`https://api.betabotz.eu.org/api/tools/remini-v4?url=${out}&resolusi=${text}&apikey=${lann}`);
      const image = await api.json();
      const { url } = image 
       conn.sendFile(m.chat, url, null, wm, m);
    } else {
      m.reply(`Masukan foto/ Resolusi scale!\n\ncontoh:${usedPrefix + command} 2 \nuntuk scale dari foto yang akan di up ada list ini\n\nScale 2 = low, 4 = medium, 6 = high, 8 = extream, 16 = awesome\n\n Jika gagal ulangi lagi dengan scale yang lebih rendah`);
    }
  } catch (e) {
    console.error(e);
    m.reply(`Masukan foto/ Resolusi scale!\n\ncontoh:${usedPrefix + command} 2 \nuntuk scale dari foto yang akan di up ada list ini\n\nScale 2 = low, 4 = medium, 6 = high, 8 = extream, 16 = awesome\n\n Jika gagal ulangi lagi dengan scale yang lebih rendah`);
  }
}

handler.help = ['remini2 <scale>'];
handler.tags = ['tools'];
handler.command = ['remini2'];
handler.premium = false;
handler.limit = false;
handler.group = true;

module.exports = handler;