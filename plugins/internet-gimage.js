const { googleImage }  =require('@bochilteam/scraper')
let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Use example ${usedPrefix}${command} Minecraft`
    const res = await googleImage(text)
    let image = pickRandom(res)
    let link = image
    let caption = `*GOOGLE IMAGE*
    
*Result:* ${text}
*Source:* Google
`
 conn.sendFile(m.chat, link, null, caption, m)
}
handler.help = ['gimage <query>', 'image <query>']
handler.tags = ['internet', 'tools']
handler.command = /^(gimage|image)$/i

module.exports = handler

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}
