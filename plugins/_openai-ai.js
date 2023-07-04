var fetch = require('node-fetch');
var util = require('util');
var handler = async (m, {
 text, 
 usedPrefix, 
 command
 }) => {
if (!text) throw `Masukkan pertanyaan!\n\n*Contoh:* Siapa presiden Indonesia? `
await m.reply(wait)
  var js = await fetch(API('lann', '/api/search/openai-chat', { text: `${text}`, apikey: lann }))
var json = await js.json()
try {
  await m.reply(json.message)
} catch (err) {
m.reply(util.format(js))
}}
handler.command = handler.help = ['ai','openai','chatgpt'];
handler.tags = ['info'];
handler.premium = false
module.exports = handler;
