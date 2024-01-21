const fetch = require("node-fetch")
const util = require("util")

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `Use example ${usedPrefix}${command} https://www.instagram.com/p/ByxKbUSnubS/?utm_source=ig_web_copy_link`
    m.reply(wait)
     const url = args[0];
     let re = await fetch(`https://api.betabotz.eu.org/api/download/igdowloader?url=${url}&apikey=${lann}`)
     let message = await re.json()  
    try {             
        for (let i of message.message ) {
            conn.sendFile(m.chat, i._url, null, `*Instagram Downloader*`, m)
        }
    } catch(err) {
        m.reply(`${eror}`)
    }
}

handler.help = ['ig'].map(v => v + ' <url>')
handler.tags = ['downloader']
handler.command = /^(Instagram|ig|igdl|igstory)$/i
handler.limit = true

module.exports = handler
