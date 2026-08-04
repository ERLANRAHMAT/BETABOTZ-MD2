import fetch from 'node-fetch';
import uploadImage from '../lib/uploadImage.js';

async function handler(m, { conn, usedPrefix, command }) {
  try {
    m.reply(`Tunggu sebentar, sedang memproses...`);
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || q.mediaType || '';
    if (/^image/.test(mime) && !/webp/.test(mime)) {
      const img = await q.download();
      const out = await uploadImage(img);
      const api = await fetch(`https://api.betabotz.eu.org/api/tools/remini?url=${out}&apikey=${lann}`);
      const image = await api.json();
      const { url } = image 
       conn.sendFile(m.chat, url, null, wm, m);
    } else {
      m.reply(`Kirim gambar dengan caption *${usedPrefix + command}* atau tag gambar yang sudah dikirim.`);
    }
  } catch (e) {
      console.log(e);
      throw e;
    }
}

handler.help = ['remini'];
handler.tags = ['tools'];
handler.command = ['remini'];
handler.premium = false;
handler.limit = false;

export default handler;
