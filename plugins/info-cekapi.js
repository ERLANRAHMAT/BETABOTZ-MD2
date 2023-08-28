const fetch = require('node-fetch')

let handler = async (m, { text }) => {
if(!text) throw(`Masukan Apikeynya`)
  let f = await fetch(API('lann', '/api/checkkey', { text: ${text }`))
  let p = await f.json()
  m.reply(p)
}

handler.command = ['cekapi']
handler.tags = ['restapi']

handler.limit = false
handler.group = false
handler.private = true

module.exports = handler;
