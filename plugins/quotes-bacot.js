const fetch = require('node-fetch');

let handler = async (m, { conn }) => {
const res = await(await fetch(API('lann', '/api/random/bacot', { apikey: lann }))).json();
let anu =`─────〔 *Bacot* 〕─────

${res.hasl}
`
m.reply(anu) 
}
handler.help = ['bacot']
handler.tags = ['quotes']
handler.command = /^(bacot)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false
handler.register = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler
