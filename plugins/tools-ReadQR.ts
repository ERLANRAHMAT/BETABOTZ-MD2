// @ts-nocheck
// Converted from plugins-esm - automated
import fetch from 'node-fetch';
import uploadImage from '../lib/uploadImage.js';

async function handler(m, { conn, usedPrefix, command }) {
  try {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || q.mediaType || '';
    if (/^image/.test(mime) && !/webp/.test(mime)) {
      const img = await q.download();
      const out = await uploadImage(img);
      const api = await fetch(`https://api.betabotz.eu.org/api/tools/decode-qr?url=${out}&apikey=${lann}`);
      const image = await api.json();
      const result = image.result;
      await m.reply(result);
    } else {
      m.reply(`Kirim gambar dengan caption *${usedPrefix + command}* atau tag gambar yang sudah dikirim.`);
    }
  } catch (e) {
      console.log(e);
      throw e;
    }
}

handler.help = handler.command = ['decodeqr', 'readqr'];
handler.tags = ['tools'];
handler.premium = false;
handler.limit = false;

export default handler;
