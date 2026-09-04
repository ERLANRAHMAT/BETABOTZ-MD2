import uploadFile from '../lib/uploadFile.js';
import fetch from 'node-fetch';
import { stickerToMp4 } from '../lib/sticker-convert.js?v=6';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  
  if (!text) throw `Format salah!\n\nContoh penggunaan:\n*${usedPrefix + command} Packname | Author*\n(Atau balas gambar/video/stiker)`;
  if (!mime) throw `Balas gambar/video/stiker dengan perintah ${usedPrefix + command}`;
  if (/video/g.test(mime) && (q.msg || q).seconds > 11) return m.reply('Maksimal 10 detik!');

  let parts = text.split(/[|•]/).map(v => v.trim());
  let packname = parts[0] || text;
  let author = parts[1] || ''; 
  await m.reply(wait);
  
  try {
    let img = await q.download?.();
    if (!img) throw `Gagal mengunduh media, pastikan kamu membalas gambar/video/stiker.`;

    let media = await uploadFile(img);
    let isAnimated = (q.msg || q).isAnimated === true;

    if (isAnimated || /video/g.test(mime)) {
      let videoResult = null;

      try {
        let res = await fetch(`https://api.betabotz.eu.org/api/tools/webp2mp4?url=${media}&apikey=${lann}`);
        let json = await res.json();
        if (json && json.result) {
          videoResult = json.result;
        }
      } catch (apiErr) {
        console.warn('API Betabotz gagal, beralih ke konversi lokal...', apiErr);
      }

      if (!videoResult) {
        try {
          videoResult = await stickerToMp4(img);
        } catch (localErr) {
          console.error('Konversi lokal stickerToMp4 gagal:', localErr);
        }
      }

      if (!videoResult) throw "Gagal mengubah stiker animasi ke video.";

      await conn.sendVideoAsSticker(m.chat, videoResult, m, {
        packname: packname,
        author: author,
      });
    } else {
      await conn.sendImageAsSticker(m.chat, img, m, {
        packname: packname,
        author: author,
      });
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
}

handler.help = ['wm', 'watermark'];
handler.tags = ['sticker'];
handler.command = /^wm|watermark?$/i;

export default handler;