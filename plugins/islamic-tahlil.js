let fetch = require('node-fetch')
let handler = async (m, { conn, usedPrefix, command }) => {
try {
  await m.reply(wait)
  let res = await fetch(`https://api.betsabotz.eu.org/api/muslim/tahlil?text=adam&apikey=${lann}`);
  let json = await res.json()
  global.anu = [
       `―-TAHLIL-―\n\nSource: ${json.result.source}\n\nBased_on: ${json.result.based_on}\n\nId: ${json.result.data[0].id}\n\nTitle: ${json.result.data[0].title}\n\nArabic: ${json.result.data[0].arabic}\n\ntranslation: ${json.result.data[0].translation}`, 
       `―-TAHLIL-―\n\nSource: ${json.result.source}\n\nBased_on: ${json.result.based_on}\n\nId: ${json.result.data[1].id}\n\nTitle: ${json.result.data[1].title}\n\nArabic: ${json.result.data[1].arabic}\n\ntranslation: ${json.result.data[1].translation}`, 
       `―-TAHLIL-―\n\nSource: ${json.result.source}\n\nBased_on: ${json.result.based_on}\n\nId: ${json.result.data[2].id}\n\nTitle: ${json.result.data[2].title}\n\nArabic: ${json.result.data[2].arabic}\n\ntranslation: ${json.result.data[2].translation}`, 

    ]
conn.reply(m.chat,`${pickRandom(global.anu)}`);;
} catch (e) {
throw `Internal server eror!`
  }
}
  
    handler.help = ['tahlil']
    handler.tags = ['islamic']
    handler.command = /^(tahlil)$/i
    handler.group = true
    
    module.exports = handler

    function pickRandom(list) {
      return list[Math.floor(list.length * Math.random())]
    }
    

//danaputra133