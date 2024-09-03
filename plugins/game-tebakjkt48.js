let timeout = 100000
let poin = 500
let src
let handler = async (m, { conn, usedPrefix }) => {
  conn.tebakjkt = conn.tebakjkt ? conn.tebakjkt : {}
  let id = m.chat
  if (id in conn.tebakjkt) {
    conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakjkt[id][0])
    throw false
  }
  if (!src) src = await (await fetch(`https://api.betabotz.eu.org/api/game/tebakjkt48?apikey=${lann}`)).json()
  let json = src[Math.floor(Math.random() * src.length)]
  if (!json) throw "Terjadi kesalahan, ulangi lagi perintah!"
  let caption = `
≡ _GAME TEBAK GAMBAR_

┌─⊷ *SOAL*
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Bonus: ${poin} kredit sosial!
▢ Ketik ${usedPrefix}jkcu untuk clue jawaban
▢ *REPLAY* pesan ini untuk\nmenjawab
└──────────────

    `.trim()
  conn.tebakjkt[id] = [
    await conn.sendMessage(m.chat, { image: { url: json.img }, caption: caption}, { quoted: m }),
    json, poin,
    setTimeout(() => {
      if (conn.tebakjkt[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakjkt[id][0])
      delete conn.tebakjkt[id]
    }, timeout)
  ]
}

handler.help = ['tebakjkt']
handler.tags = ['game']
handler.command = /^tebakjkt/i
handler.limit = false
handler.group = true

module.exports = handler