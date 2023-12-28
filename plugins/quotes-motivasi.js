const fetch = require('node-fetch');

let handler = async (m, { conn }) => {
const res = await(await fetch(API('lann', '/api/random/motivasi', { apikey: lann }))).json();
let anu =`─────〔 *Motivasi* 〕─────

${res.result}
`
m.reply(anu) 
}
handler.help = ['motivasi']
handler.tags = ['quotes']
handler.command = /^(motivasi)$/i
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
  
