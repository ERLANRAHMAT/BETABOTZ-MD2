let fetch = require('node-fetch')
let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!text) throw `Masukkan kisah nabi yang ingin kamu cari!\n\ncontoh: ${usedPrefix + command} ISA`;
try {
  await m.reply(wait)
  let res = await fetch(`https://api.betabotz.eu.org/api/muslim/kisahnabi?nabi=${text}&apikey=${lann}`);
  let json = await res.json()
  global.anu = [
       `―-KISAH NABI-―\n\nNama: ${json.result.name}\n\nKelaharian: ${json.result.kelahiran}\n\nWafat usia: ${json.result.wafat_usia}\n\nSinggah: ${json.result.singgah}\n\nkisah: ${json.result.kisah}`, 
    ]
conn.reply(m.chat,`${(global.anu)}`);;
} catch (e) {
throw `Internal server eror!\n\nulangi lagi perintah dengan kisah lain!`
  }
}
  
    handler.help = ['kisahnabi']
    handler.tags = ['islamic']
    handler.command = /^(kisahnabi)$/i
    handler.group = true
    
    module.exports = handler

    function pickRandom(list) {
      return list[Math.floor(list.length * Math.random())]
    }
    



//danaputra133