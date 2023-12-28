const fetch = require('node-fetch');

let handler = async (m, { conn }) => {
const res = await(await fetch(API('lann', '/api/random/bijak', { apikey: lann }))).json();
let anu =`─────〔 *Kata Bijak* 〕─────

${res.result}
`
m.reply(anu) 
}
handler.help = ['katabijak']
handler.tags = ['quotes']
handler.command = /^(katabijak)$/i
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
