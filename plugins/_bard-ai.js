var fetch = require('node-fetch');

var handler = async (m, {
 text, 
 usedPrefix, 
 command
 }) => {
if (!text) throw `Masukkan pertanyaan!\n\n*Contoh:* Siapa presiden Indonesia? `
await m.reply(wait)
  var js = await fetch(API('lann', '/api/search/bard-ai', { apikey: lann, text: `${text}` }))
var json = await js.json()
try {
  await conn.sendMessage(m.chat, {
text: json.message,
contextInfo: {
externalAdReply: { 
title: 'Bard-Ai',
body: '',
thumbnailUrl: "https://telegra.ph/file/35cad7ee8a8250020ecc7.jpg",
sourceUrl: "https://api.betabotz.eu.org",
mediaType: 1,
renderLargerThumbnail: true
}}}, { quoted: m})
} catch (err) {
m.reply(`${eror}`)
}}
handler.command = handler.help = ['bard','gbard','goobard'];
handler.tags = ['info'];
handler.limit = 3
module.exports = handler;
