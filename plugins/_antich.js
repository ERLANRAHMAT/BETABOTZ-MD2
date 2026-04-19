
let maxWarnLink = 3;
let handler = m => m

handler.before = async function (m, { isAdmin, isBotAdmin, conn }) {
  if (m.isBaileys || m.fromMe || !m.isGroup || isAdmin) return true
  let chat = global.db.data.chats[m.chat]
  let user = global.db.data.users[m.sender]
  if (!user) return true
  if (typeof user.warnLink !== 'number') user.warnLink = 0
  const isChLink = /whatsapp\.com\/channel\/([0-9A-Za-z]+)/i.test(m.text)

  if (chat.antilinkch && isChLink) {
    if (isAdmin) return m.reply('*Eh sorry admin, kamu mah bebas kirim link.*')
    await conn.sendMessage(m.chat, { delete: m.key })
    user.warnLink += 1
    if (user.warnLink < maxWarnLink) {
      m.reply(`⚠️ *PERINGATAN LINK CHANNEL!*
▢ *Pengguna:* @${m.sender.split('@')[0]}
▢ *Peringatan:* ${user.warnLink}/${maxWarnLink}
Jika mencapai ${maxWarnLink} kali, Anda akan dikeluarkan dari grup.`, null, { mentions: [m.sender] })
    } else {
      let ownerGroup = m.chat.split`-`[0] + "@s.whatsapp.net";
      let botJid = conn.user.jid;
      if (m.sender === ownerGroup || m.sender === botJid) {
        user.warnLink = 0;
        return m.reply('Tidak bisa mengeluarkan owner atau bot.');
      }
      user.warnLink = 0;
      m.reply(`⛔ Pengguna @${m.sender.split('@')[0]} telah mencapai batas peringatan link channel dan akan dikeluarkan.`, null, { mentions: [m.sender] })
      await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
    }
  }
  return true
}

module.exports = handler
