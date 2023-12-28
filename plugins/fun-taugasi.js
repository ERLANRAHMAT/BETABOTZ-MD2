const fetch = require('node-fetch');
let handler  = async (m, { conn }) => {
const res = await(await fetch(API('lann', '/api/random/taugasih', { apikey: lann }))).json();
  conn.reply(m.chat,`“${res.taugasih}”`, m)
}
handler.help = ['taugasih']
handler.tags = ['fun']
handler.command = /^(taugasih)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false
handler.limit = true
handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler
