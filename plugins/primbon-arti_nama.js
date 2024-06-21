let fetch = require('node-fetch')
let handler = async (m, { conn, text, usedPrefix, command }) => {
// if (!text) throw `Masukkan Nama!\n\ncontoh: ${usedPrefix + command} "dana"`;
if (!text) throw `Masukkan Nama!\n\ncontoh: ${usedPrefix + command} Budi `;
try {
  await m.reply(wait)
  let res = await fetch(`https://api.betabotz.eu.org/api/primbon/artinama?nama=${text}&apikey=${lann}`);
  let json = await res.json()
  let anu = [
       `―-ARTI NAMA-―\n\nNama: ${json.result.message.nama}\n\nArti: ${json.result.message.arti}`, 
    ]
conn.reply(m.chat,`${(anu)}`);;
} catch (e) {
throw `Internal server eror!\n\nulangi lagi perintah`
  }
}
  
    handler.help = ['artinama']
    handler.tags = ['fun']
    handler.command = /^(artinama)$/i
    handler.group = true
    
    module.exports = handler
    



//danaputra133