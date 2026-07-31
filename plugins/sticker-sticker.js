import fs from 'fs';
import sharp from 'sharp';
let handler = async (m, { conn, command, usedPrefix }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (/image/.test(mime)) {
    let media = await q.download()


    let processedMedia = await sharp(media)
      .resize(512, 512, { 
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 } 
      })
      .png() 
      .toBuffer()

    let encmedia = await conn.sendImageAsSticker(m.chat, processedMedia, m, { packname: global.packname, author: global.author })
    await fs.unlinkSync(encmedia)
  } else if (/video/.test(mime)) {
    if ((q.msg || q).seconds > 7) return m.reply('Maksimal 6 detik!')
    let media = await q.download()

    let encmedia = await conn.sendVideoAsSticker(m.chat, media, m, { packname: global.packname, author: global.author })
    await fs.unlinkSync(encmedia)
  } else {
    throw `Kirim gambar/video dengan caption ${usedPrefix + command}\nDurasi video 1-6 detik.`
  }
}

handler.help = ['sticker']
handler.tags = ['sticker']
handler.command = /^(stiker|s|sticker)$/i
handler.limit = true
export default handler
