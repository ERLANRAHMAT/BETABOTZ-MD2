
import uploadFile from '../lib/uploadFile.ts';
import fetch from 'node-fetch';

let handler: WaPlugin = async (m, { conn, text, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  
  if (!text) throw `Example ${usedPrefix}${command} lann`;
  if (!mime) throw `Balas gambar/video/stiker dengan perintah ${usedPrefix}${command}`;
  if (/video/g.test(mime) && (q.msg || q).seconds > 11) return m.reply('Maksimal 10 detik!');
  await m.reply(wait);
  try {
    let img = (await q.download?.()) as Buffer;
    if (!img) throw `Gagal mengunduh media, pastikan kamu membalas gambar/video/stiker.`;

    let media = await uploadFile(img);
    let isAnimated = (q.msg || q).isAnimated === true;

    if (isAnimated || /video/g.test(mime)) {
      let res = await fetch(`https://api.betabotz.eu.org/api/tools/webp2mp4?url=${media}&apikey=${global.lann}`);
      let json = await res.json();
      if (!json.result) throw "Gagal mengubah stiker animasi ke video.";

      await conn.sendVideoAsSticker(m.chat, json.result, m, {
        packname: text || "",
        author: "",
      });
    } else {
      await conn.sendImageAsSticker(m.chat, img, m, {
        packname: text || "",
        author: "",
      });
    }
  } catch (e) {
    console.log(e);
    if (e !== false) throw e;
  }
}

handler.help = ['wm', 'watermark'];
handler.tags = ['sticker'];
handler.command = /^wm|watermark?$/i;

export default handler;
