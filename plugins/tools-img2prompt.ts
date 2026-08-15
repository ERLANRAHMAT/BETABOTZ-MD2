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
      const api = await fetch(`https://api.betabotz.eu.org/api/tools/img2prompt?url=${out}&apikey=${lann}`);
      const res = await api.json();
      await conn.sendMessage(m.chat, {
    text: res.result
}, {
    quoted: m
})
    } else {
      m.reply(`Kirim gambar dengan caption *${usedPrefix + command}* atau tag gambar yang sudah dikirim.`);
    }
  } catch (e) {
      console.log(e);
      throw e;
    }
}

handler.help = ['img2prompt'];
handler.tags = ['tools'];
handler.command = ['img2prompt'];
handler.premium = false;
handler.limit = false;
handler.group = true;

export default handler;
