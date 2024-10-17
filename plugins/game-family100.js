let fs = require('fs')
let fetch = require('node-fetch')
let winScore = 500
async function handler(m) {
    conn.family = conn.family ? conn.family : {}
    let id = m.chat
    if (id in conn.family) {
        if (conn.family[id].id !== undefined) return conn.reply(m.chat, 'Masih ada kuis yang belum terjawab di chat ini' + '\nKetik *Nyerah* untuk mengakhiri / *tunggu 5 detik*', conn.family[id].msg)
        delete conn.family[id]
        throw false
    }
    conn.family[id] = {}
    let src = await (await fetch(`https://api.betabotz.eu.org/api/game/family100-2?apikey=${lann}`)).json()
    let json = src[Math.floor(Math.random() * src.length)]

    let caption = `

 ┌─⊷ *SOAL*
▢ *Soal:* ${json.soal}
▢ Terdapat *${json.jawaban.length}* jawaban${json.jawaban.find(v => v.includes(' ')) ? `
▢ (beberapa jawaban terdapat spasi)
▢ ketik *MENYERAH* tanpa replay soal jika menyerah
▢ replay soal saat akan *MENJAWAB*
└──────────────
`: ''}

+${winScore} kredit sosial! tiap jawaban benar
    `.trim()
    conn.family[id] = {
        id,
        msg: await m.reply(caption),
        ...json,
        terjawab: Array.from(json.jawaban, () => false),
        winScore,
    }
}
handler.help = ['family100']
handler.tags = ['game']
handler.group = true
handler.command = /^family100$/i

module.exports = handler

//danaputra_133