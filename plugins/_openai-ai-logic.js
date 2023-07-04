var fetch = require('node-fetch');
var util = require('util');
var handler = async (m, {
 text, 
 usedPrefix, 
 command
 }) => {
if (!text) throw `Masukkan pertanyaan!\n\n*Contoh:* Siapa Kamu? `
//Set Logic Disini 
let logic = 'Hai Saya Adalah BetaBotz-Md Bot Whatsapp Yang Dikembangkan Oleh Lann,Saya Bernama Betabotz-Md,Saya Dibuat Oleh Lann Dengan Penuh Kesempurnaan Yang Tiada Taraa,Jika Kamu Ingin Mencari Tau Lebih Dalam Tentang Ownerku Visit https://api.betabotz.org'
await m.reply(wait)
  var js = await fetch(API('lann', '/api/search/openai-logic', { text: `${text}`, logic: `${logic}`, apikey: lann }))
var json = await js.json()
try {
  await m.reply(json.message)
} catch (err ) {
m.reply(util.format(json))
}}
handler.command = handler.help = ['ai2','openai2','chatgpt2'];
handler.tags = ['info'];
handler.premium = false
module.exports = handler;
