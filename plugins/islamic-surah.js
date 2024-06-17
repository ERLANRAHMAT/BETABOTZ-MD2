let fetch = require('node-fetch')
let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!text) throw `Masukkan No Surah!\n\ncontoh: ${usedPrefix + command} 2`;
try {
  await m.reply(wait)
  let res = await fetch(`https://api.betabotz.eu.org/api/muslim/surah?no=${text}&apikey=${lann}`);
  if (!text) throw `Masukkan No Surah!\n\ncontoh: ${usedPrefix + command} 2 `;
  let json = await res.json()
  global.anu = [
       `―-SURAH-―\n\nArab: ${json.result[0].arab}\n\nRumi: ${json.result[0].rumi}\n\nLatin: ${json.result[0].latin}`, 
       `―-SURAH-―\n\nArab: ${json.result[1].arab}\n\nRumi: ${json.result[0].rumi}\n\nLatin: ${json.result[1].latin}`, 
       `―-SURAH-―\n\nArab: ${json.result[2].arab}\n\nRumi: ${json.result[0].rumi}\n\nLatin: ${json.result[2].latin}`, 
       `―-SURAH-―\n\nArab: ${json.result[3].arab}\n\nRumi: ${json.result[0].rumi}\n\nLatin: ${json.result[3].latin}`, 
       `―-SURAH-―\n\nArab: ${json.result[4].arab}\n\nRumi: ${json.result[0].rumi}\n\nLatin: ${json.result[4].latin}`, 
       `―-SURAH-―\n\nArab: ${json.result[5].arab}\n\nRumi: ${json.result[0].rumi}\n\nLatin: ${json.result[5].latin}`, 
       `―-SURAH-―\n\nArab: ${json.result[6].arab}\n\nRumi: ${json.result[0].rumi}\n\nLatin: ${json.result[6].latin}`, 
       `―-SURAH-―\n\nArab: ${json.result[7].arab}\n\nRumi: ${json.result[0].rumi}\n\nLatin: ${json.result[7].latin}`, 
       `―-SURAH-―\n\nArab: ${json.result[8].arab}\n\nRumi: ${json.result[0].rumi}\n\nLatin: ${json.result[8].latin}`, 
       `―-SURAH-―\n\nArab: ${json.result[9].arab}\n\nRumi: ${json.result[0].rumi}\n\nLatin: ${json.result[9].latin}`, 
    ]
conn.reply(m.chat,`${pickRandom(global.anu)}`);;
} catch (e) {
throw `Internal server eror!\n\nulangi lagi perintah dengan nomor surat lain!`
  }
}
  
    handler.help = ['surah']
    handler.tags = ['islamic']
    handler.command = /^(surah)$/i
    handler.group = true
    
    module.exports = handler

    function pickRandom(list) {
      return list[Math.floor(list.length * Math.random())]
    }
    



//danaputra133