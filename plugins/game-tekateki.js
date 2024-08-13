let fs = require('fs')
let fetch = require('node-fetch')

let timeout = 100000
let poin = 500
let handler = async (m, { conn, usedPrefix }) => {
    conn.tekateki = conn.tekateki ? conn.tekateki : {}
    let id = m.chat
    if (id in conn.tekateki) {
        if (conn.tekateki[id].length !== 0) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tekateki[id][0])
        delete conn.tekateki[id]
        throw false
    }
    conn.tekateki[id] = []
    let src = await (await fetch(`https://api.betabotz.eu.org/api/game/tekateki?apikey=${lann}`)).json()
    let json = src[Math.floor(Math.random() * src.length)]

    let caption = `
*TEKA TEKI*

${json.data.pertanyaan}
┌─⊷ *SOAL*
▢ Waktu jawab *${(timeout / 1000).toFixed(2)} detik*
▢ Bonus: ${poin} kredit sosial!
▢ Bantuan ${usedPrefix}tete
▢ *Balas/ replay soal ini untuk menjawab*
└──────────────
`.trim()
conn.tekateki[id] = [
    await conn.reply(m.chat, caption, m),
    json, poin,
    setTimeout(() => {
        if (conn.tekateki[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.data.jawaban}*`, conn.tekateki[id][0])
        delete conn.tekateki[id]
    }, timeout)
]
}
handler.help = ['tekateki']
handler.tags = ['game']
handler.command = /^tekateki/i
handler.group = true

module.exports = handler