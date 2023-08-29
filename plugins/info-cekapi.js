const fetch = require('node-fetch')
const util = require('util')

let handler = async (m, { text }) => {
if(!text) throw(`Masukan Apikeynya`)
  let f = await fetch(`https://api.betabotz.org/api/checkkey?apikey=${text}`)
  let p = await f.json()
  m.reply(util.format(p))
}

handler.command = ['cekapi']
handler.tags = ['restapi']

handler.limit = false
handler.group = false
handler.private = true

module.exports = handler;
  
