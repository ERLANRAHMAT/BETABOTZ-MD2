var fetch = require('node-fetch');
var handler = async (m, {
 text, 
 usedPrefix, 
 command
 }) => {
if (!text) throw `Masukkan pertanyaan!\n\n*Contoh:* Siapa presiden Indonesia? `
await m.reply(wait)
  var js = await fetch(API('lann', '/api/search/openai-chat', { text: `${text}`, apikey: lann }))
var json = await js.json()
  await m.reply(json.message)
}      
handler.command = handler.help = ['ai','openai','chatgpt'];
handler.tags = ['info'];
handler.premium = false
module.exports = handler;
