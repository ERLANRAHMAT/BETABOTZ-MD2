import fetch from 'node-fetch';
let timeout = 100000
let poin = 10000
let handler = async (m, { conn, usedPrefix }) => {
    try {
        conn.fisika = conn.fisika ? conn.fisika : {}
    let id = m.chat
    if (id in conn.fisika) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.fisika[id][0])
        return;
    }
    let src = await (await fetch(`https://api.danafxc.my.id/api/proxy/games?q=fisika&apikey=${dana}`)).json()
    let json = src
    let options = json.pilihan.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join('\n')
    let caption = `
${json.soal}

${options}

┌─⊷ *SOAL*
▢ Level: *${json.level}*
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Bonus: ${poin} money
▢ Ketik ${usedPrefix}fska untuk clue jawaban
▢ *Balas/ replay soal ini untuk menjawab dengan a, b, c, atau d*
└──────────────
`.trim();
    conn.fisika[id] = [
        await conn.reply(m.chat, caption, m),
        json, poin,
        setTimeout(() => {
            if (conn.fisika[id]) {
                conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.fisika[id][0])
                delete conn.fisika[id]
            }
        }, timeout)
    ]
    } catch (e) {
        if (e !== false) {
            console.log(e);
            throw e;
        }
    }
}
handler.help = ['fisika']
handler.tags = ['game']
handler.command = /^fisika/i
handler.register = false
handler.group = true

export default handler

// tested di bileys versi 6.5.0 dan sharp versi 0.30.5
// danaputra133