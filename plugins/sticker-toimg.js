const uploadImage = require('../lib/uploadFile');

let handler = async (m, { conn, usedPrefix, command }) => {
  if (!m.quoted) throw `Balas stiker dengan caption *${usedPrefix + command}*`;
  let mime = m.quoted.mimetype || '';
  if (!/webp/.test(mime)) throw `Balas stiker dengan caption *${usedPrefix + command}*`;
  let media = await m.quoted.download();
  let out = Buffer.alloc(0);
  if (/webp/.test(mime)) {
    out = await uploadImage(media);
  }
  await conn.sendMessage(m.chat, { image: { url: out }, caption: '*DONE*' }, { quoted: m });
}

handler.help = ['toimg (reply)'];
handler.tags = ['sticker'];
handler.command = ['toimg'];

module.exports = handler;
