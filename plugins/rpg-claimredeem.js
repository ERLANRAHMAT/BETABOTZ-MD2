const axios = require('axios');
const fs = require('fs');

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const user = global.db.data.users[m.sender]
  const lastDeliveryTime = user.lastredeem || 0
  const currentTime = new Date().getTime()
  const timeDiff = currentTime - lastDeliveryTime
  
  // Cooldown check (5 minutes)
  if (timeDiff < 300000) {
    const remainingTime = 300000 - timeDiff
    const remainingTimeString = clockString(remainingTime)
    return conn.reply(m.chat, `Kamu sudah melakukan redeem baru-baru ini. Tunggu ${remainingTimeString} lagi sebelum bisa redeem kembali.`, m, {
      contextInfo: {
        externalAdReply: {
          title: "Betabotz-MD2",
          body: "Redeem Code Bot Whatsapp",
          thumbnail: await axios.get("https://www.pic.surf/3wrz", { responseType: "arraybuffer" }).then(res => res.data),
          sourceUrl: global.gc,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    })
  }

  if (!db.data.redeem || !db.data.redeem.code) {
    return conn.reply(m.chat, '❌ Tidak ada redeem code yang aktif saat ini', m)
  }

  if (new Date().getTime() > db.data.redeem.expires) {
    return conn.reply(m.chat, '❌ Redeem code sudah kadaluarsa', m)
  }

  if (!text) {
    return conn.reply(m.chat, `Contoh penggunaan: ${usedPrefix + command} ${db.data.redeem.code}`, m)
  }

  if (text !== db.data.redeem.code) {
    return conn.reply(m.chat, '❌ Kode redeem salah', m)
  }

  const reward = db.data.redeem.reward || {
    limit: 0,
    exp: 0,
    money: 0
  }

  user.limit += reward.limit
  user.exp += reward.exp
  user.money += reward.money
  user.lastredeem = Date.now()

  const successMessage = `🎉 Redeem Berhasil! Kamu Mendapatkan:
  
➕ Limit: ${reward.limit}
➕ Exp: ${reward.exp}
➕ Money: ${reward.money}

*By Bot Whatsapp*`

  conn.reply(m.chat, successMessage, m, {
    contextInfo: {
      externalAdReply: {
        title: "Betabotz-MD2",
        body: "Redeem Code By Bot Whatsapp",
        thumbnail: await axios.get("https://www.pic.surf/3wrz", { responseType: "arraybuffer" }).then(res => res.data),
        sourceUrl: global.gc,
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  })
}

handler.help = ["claimredeem *[code redeem]*"]
handler.tags = ["rpg"]
handler.command = ["claimredeem"]
module.exports = handler

function clockString(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [d, ' *Hari*\n ', h, ' *Jam*\n ', m, ' *Menit*\n ', s, ' *Detik*'].map(v => v.toString().padStart(2, 0)).join('')
}
