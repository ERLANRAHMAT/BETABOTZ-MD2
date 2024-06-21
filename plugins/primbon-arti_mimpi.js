let fetch = require('node-fetch')
let handler = async (m, { conn, text, usedPrefix, command }) => {
// if (!text) throw `Masukkan Nama!\n\ncontoh: ${usedPrefix + command} "dana"`;
if (!text) throw `Masukkan Mimpi kamu!\n\ncontoh: ${usedPrefix + command} mandi `;
try {
  await m.reply(wait)
  let res = await fetch(`https://api.betabotz.eu.org/api/primbon/artimimpi?mimpi=${text}&apikey=${lann}`);
  let json = await res.json()
  let anu = [
       `―-ARTI MIMPI-―\n\nMimpi: ${json.result.message.mimpi}\n\nArti: ${json.result.message.arti}`, 
    ]
conn.reply(m.chat,`${(anu)}`);;
} catch (e) {
throw `Internal server eror!\n\nulangi lagi perintah`
  }
}
  
    handler.help = ['artimimpi']
    handler.tags = ['fun']
    handler.command = /^(artimimpi)$/i
    handler.group = true
    
    module.exports = handler
    



//danaputra133