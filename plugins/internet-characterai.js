const fetch = require('node-fetch')

let handler = async (m, { text }) => {
  if (!text) throw(`Input Text Dan Karakter!\nExample: .cai hai kamu siapa|Kirito`)    
  try {
    let [ q, k ] = text.split('|')
    m.reply(`Tunggu sebentar...`)
    let js = await fetch(API('lann', '/api/search/c-ai', { prompt: q, char: k, apikey: lann}))
    let json = await js.json()
    m.reply(json.message)
  } catch (error) {
    console.error(error)
    m.reply('Terjadi kesalahan saat menjalankan perintah.')
  }
}

handler.command = handler.help = ['cai']
handler.tags = ["internet"]
handler.owner = false
handler.limit = false
handler.group = false
handler.private = false

module.exports = handler;
