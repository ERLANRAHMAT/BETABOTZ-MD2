let fetch = require('node-fetch')
let handler = async (m, { conn, text }) => {
let tio = await fetch(API('lann', '/api/wallpaper/meme', { apikey: lann }))
let json = await tio.buffer();
await conn.sendFile(m.chat, json, 'file.jpg', wm, m)
}
handler.command = /^(meme)$/i
handler.tags = ['fun']
handler.help = ['meme']
handler.limit = true
module.exports = handler
