const fetch = require("node-fetch")

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `Use example ${usedPrefix}${command} https://www.instagram.com/p/ByxKbUSnubS/?utm_source=ig_web_copy_link`
   const url = args[0];
   const re = await fetch(API('lann', '/api/download/igdowloader', { url: url, apikey: lann }))
   let message = await re.json()
   for (let i of message.message.url ) {
    conn.sendFile(m.chat, i, null, `*Instagram Downloader*`, m)
    }
}

handler.help = ['ig'].map(v => v + ' <url>')
handler.tags = ['downloader']
handler.command = /^(Instagram|ig|igdl|igstory)$/i
handler.limit = true
module.exports = handler
