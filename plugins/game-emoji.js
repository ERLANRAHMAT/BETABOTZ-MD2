/*
wa.me/6282285357346
github: https://github.com/sadxzyq
Instagram: https://instagram.com/tulisan.ku.id
*/

let fetch = require('node-fetch')
let timeout = 120000
let hadiah = 1000
let handler = async (m, { conn, command, usedPrefix }) => {
let imgr = "https://emoji.aranja.com/static/emoji-data/img-apple-160/"

    conn.tebakemoji = conn.tebakemoji ? conn.tebakemoji : {}
    let id = m.chat
    if (id in conn.tebakemoji) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakemoji[id][0])
        throw false
    }
    let src = await (await fetch('https://emoji-api.com/emojis?access_key=3382611aba5d901f9a450497d5c85fc616acdfee')).json()
  let json = src[Math.floor(Math.random() * src.length)]
  let caption = `*${command.toUpperCase()}*
*Emoji apakah ini:* ${json.character}

Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}hemo untuk bantuan
Bonus: ${hadiah} Kredit sosial\n
REPLAY SOAL UNTUK MENJAWAB
*E06-E08 di awal (spasi) lalu jawaban*\n

    `.trim()
    conn.tebakemoji[id] = [
        await conn.sendFile(m.chat, imgr + json.codePoint.toLowerCase() + ".png", '', caption, m),
        
        json, hadiah,
        setTimeout(() => {
            if (conn.tebakemoji[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${(json.unicodeName)}*`, conn.tebakemoji[id][0])
            delete conn.tebakemoji[id]
        }, timeout)
    ]
}
handler.help = ['tebakemoji']
handler.tags = ['game']
handler.command = /^tebakemoji/i
handler.group = true


module.exports = handler

//danaputra133
