/*
    made by adrianMD
    ch: https://whatsapp.com/channel/0029VaWXWTD8kyyOvgdf1o3x
    
    do not remove the watermark!! 
    
Thank you for using this code ^-^
edit dikit sama dana
*/
let fetch = require('node-fetch')

let fs = require('fs')
let timeout = 120000
let poin = 500
let handler = async (m, { conn, usedPrefix }) => {
    conn.tebakheroml = conn.tebakheroml ? conn.tebakheroml: {}
    let id = 'tebakheroml-' + m.chat
    if (id in conn.tebakheroml) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakheroml[id][0])
    let src = await (await fetch(`https://api.betabotz.eu.org/api/game/tebakheroml?apikey=${lann}`)).json()
    let json = src[Math.floor(Math.random() * src.length)]
    let caption = `
*${json.deskripsi}*
┌─⊷ *SOAL*
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Ketik *${usedPrefix}temel* untuk bantuan
▢ Bonus: *${poin} Exp*
▢ *replay soal dengan nyerah untuk menyerah*
└──────────────

*[ Note ]*
reply pesan ini untuk menjawab
`.trim()
    conn.tebakheroml[id] = [
        await conn.sendFile(m.chat, json.img, 'tebakheroml.jpg', caption, m),
        json, poin,
        setTimeout(() => {
            if (conn.tebakheroml[id]) conn.sendFile(m.chat, json.fullimg, 'heroml.jpg', `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakheroml[id][0])
            delete conn.tebakheroml[id]
        }, timeout)
    ]
}
handler.help = ['tebakheroml']
handler.tags = ['game']
handler.command = /^tebakheroml$/i

handler.group = true
handler.limit = true

module.exports = handler