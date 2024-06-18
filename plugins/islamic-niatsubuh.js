let fetch = require('node-fetch')
let handler = async (m, { conn, usedPrefix, command }) => {
try {
  let res = await fetch(`https://api.betabotz.eu.org/api/muslim/niatshubuh?&apikey=${lann}`);
  let json = await res.json()
  global.anu = [
       `―-NIAT SUBUH-―\n\n${json.result[0].name}\n\nArab: ${json.result[0].arabic}\n\nLatin: ${json.result[0].latin}\n\nTerjemahan: ${json.result[0].terjemahan}`, 
    ]
conn.reply(m.chat,`${(global.anu)}`);;
} catch (e) {
throw `Internal server eror!`
  }
}
  
    handler.help = ['niatshubuh']
    handler.tags = ['islamic']
    handler.command = /^(niatshubuh)$/i
    handler.group = true
    
    module.exports = handler
    



//danaputra133