const uploadFile = require('../lib/uploadFile')
const uploadImage = require('../lib/uploadImage')
let fetch = require("node-fetch")

let handler = async (m, { conn, text, usedPrefix, command}) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!text) throw `Example ${usedPrefix} ${command} lann`;
  if (/video/g.test(mime) && (q.msg || q).seconds > 11) return m.reply('Maksimal 10 detik!')
  await m.reply(wait)
      
  try {
    let img = await q.download()
    if (!img) throw `Balas gambar/video/stiker dengan perintah ${usedPrefix} ${command}`

    let media = await uploadImage(img, "true")
    if (q.isAnimated === true) {
      let res = await fetch(`https://api.betabotz.eu.org/api/tools/webp2mp4?url=${media}&apikey=${lann}`)
      let json = await res.json()
      if (!json.result) throw 'Gagal mengubah stiker animasi ke video.'

      await conn.sendVideoAsSticker(m.chat, json.result, m, {
        packname: text || '',
        author: ''
      })
    } else {
      await conn.sendImageAsSticker(m.chat, img, m, {
        packname: text || '',
        author: ''
      })
    }
  } catch (e) {
    console.log(e)
    throw `Gagal! Balas gambar/video dengan caption *${usedPrefix} ${command}*`
  }
}

handler.help = ['wm', 'watermark']
handler.tags = ['sticker']
handler.command = /^wm|watermark?$/i

module.exports = handler