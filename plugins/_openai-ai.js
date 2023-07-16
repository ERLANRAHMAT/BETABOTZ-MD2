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
  await conn.sendMessage(m.chat, {
text: json.message,
contextInfo: {
externalAdReply: { 
title: 'Chat GPT',
body: '',
thumbnailUrl: "https://telegra.ph/file/7a385897829927b981dfa.jpg",
sourceUrl: "https://api.betabotz.org",
mediaType: 1,
renderLargerThumbnail: true
}}}, { quoted: m})
} catch (err) {
m.reply(util.format(js))
}}
handler.command = handler.help = ['ai','openai','chatgpt'];
handler.tags = ['info'];
handler.limit = 3
module.exports = handler;
