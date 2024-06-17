let fetch = require('node-fetch')
let handler = async (m, { conn, usedPrefix, command }) => {
try {
    await m.reply(wait)
  let res = await fetch(`https://api.betabotz.eu.org/api/muslim/wirid?text=adam&apikey=${lann}`);
  let json = await res.json()
  global.anu = [
    `―-WIRID-―\n\nId: ${json.result.data[0].id}\n\nWaktu: ${json.result.data[0].times}\n\nArabic: ${json.result.data[0].arabic}`, 
    `―-WIRID-―\n\nId: ${json.result.data[1].id}\n\nWaktu: ${json.result.data[1].times}\n\nArabic: ${json.result.data[1].arabic}`, 
    `―-WIRID-―\n\nId: ${json.result.data[2].id}\n\nWaktu: ${json.result.data[2].times}\n\nArabic: ${json.result.data[2].arabic}`, 

    ]
conn.reply(m.chat,`${pickRandom(global.anu)}`);;
} catch (e) {
throw `Internal server eror!`
  }
}
  
    handler.help = ['wirid']
    handler.tags = ['islamic']
    handler.command = /^(wirid)$/i
    handler.group = true
    
    module.exports = handler

    function pickRandom(list) {
      return list[Math.floor(list.length * Math.random())]
    }
    



//danaputra133