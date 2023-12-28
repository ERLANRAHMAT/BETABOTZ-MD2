let fetch = require('node-fetch')
let handler = async (m, { conn, text }) => {
let tio = await fetch(API('lann', '/api/wallpaper/darkjokes', { apikey: lann }))
let json = await tio.buffer();
await conn.sendFile(m.chat, json, 'file.jpg', wm, m)
}
handler.command = /^(darkjokes)$/i
handler.tags = ['fun']
handler.help = ['darkjokes']
handler.limit = true
module.exports = handler
