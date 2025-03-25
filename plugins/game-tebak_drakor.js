let timeout = 100000
let poin = 10000
let src
let handler = async (m, { conn, usedPrefix }) => {
  conn.tebakdrakor = conn.tebakdrakor ? conn.tebakdrakor : {}
  let id = m.chat
  if (id in conn.tebakdrakor) {
    conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakdrakor[id][0])
    throw false
  }
  if (!src) src = await (await fetch(`https://api.betabotz.eu.org/api/game/tebakdrakor?apikey=${lann}`)).json()
  let json = src[Math.floor(Math.random() * src.length)]
  if (!json) throw "Terjadi kesalahan, ulangi lagi perintah!"
  let caption = `
≡ _GAME TEBAK DRAKOR_

┌─⊷ *SOAL*
▢ Penjelasan: *${json.deskripsi}*
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Bonus: ${poin} money
▢ Ketik ${usedPrefix}tdkt untuk clue jawaban
▢ *REPLAY* pesan ini untuk\nmenjawab
└──────────────

    `.trim()
  conn.tebakdrakor[id] = [
    await conn.sendMessage(m.chat, { image: { url: json.img }, caption: caption}, { quoted: m }),
    json, poin,
    setTimeout(() => {
      if (conn.tebakdrakor[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakdrakor[id][0])
      delete conn.tebakdrakor[id]
    }, timeout)
  ]
}

handler.help = ['tebakdrakor']
handler.tags = ['game']
handler.command = /^tebakdrakor/i
handler.limit = false
handler.group = true

module.exports = handler