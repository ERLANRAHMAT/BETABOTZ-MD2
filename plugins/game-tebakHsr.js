  import fetch from "node-fetch";

  let timeout = 100000;
  let poin = 10000;
  let handler = async (m, { conn, usedPrefix }) => {
    conn.tebakhsr = conn.tebakhsr ? conn.tebakhsr : {}
    let id = m.chat
    if (id in conn.tebakhsr) {
      conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakhsr[id][0])
      return;
    }
    let src = await (await fetch(`https://api.danafxc.my.id/api/proxy/games?q=tebakHsr&apikey=${dana}`)).json()
    let json = src
    if (!json) throw "Terjadi kesalahan, ulangi lagi perintah!"
    let caption = `
  ≡ _GAME TEBAK HSR_

  ┌─⊷ *SOAL*
  ▢ Penjelasan: *${json.deskripsi}*
  ▢ Region: *${json.region}*
  ▢ Element : *${json.element}*
  ▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
  ▢ Bonus: ${poin} money
  ▢ Ketik ${usedPrefix}hsr untuk bantuan
  ▢ *REPLAY* pesan ini untuk\nmenjawab
  └──────────────
      `.trim();
    let caption2 = `Waktu habis!\nJawabannya adalah *${json.jawaban}*`;
    conn.tebakhsr[id] = [
      await conn.sendMessage(m.chat, { image: { url: json.imgFilter }, caption: caption}, { quoted: m }),
      json, poin,
      setTimeout(() => {
        if (conn.tebakhsr[id]) conn.sendMessage(m.chat,  { image: { url: json.img }, caption: caption2},{ quoted: m }, conn.tebakhsr[id][0])
        delete conn.tebakhsr[id]
      }, timeout)
    ]
  }

  handler.help = ['tebakhsr']
  handler.tags = ['game']
  handler.command = /^tebakhsr/i
  handler.limit = false
  handler.group = true

  export default handler;