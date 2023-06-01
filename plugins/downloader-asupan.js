const fetch = require('node-fetch');

let handler = async(m, { conn }) => {
const pan = ['rikagusriani', 'santuy', 'ukhty', 'bocil', 'gheayubi', 'euni']
const asu = pan[Math.floor(Math.random() * pan.length)]
const asupan = await fetch(API('lann', `/api/asupan/${asu}`, { apikey: lann }));     
  await conn.sendFile(m.chat, await asupan.buffer(), 'asupan.mp4', '', m)
}
handler.help = ['asupan']
handler.tags = ['asupan']
handler.command = /^asupan$/i
handler.owner = false
handler.premium = false
handler.group = false
handler.private = false
module.exports = handler