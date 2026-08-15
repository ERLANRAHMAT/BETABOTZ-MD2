

let maxWarnLink = Number(global.maxwarn);
let handler: WaPlugin = (m) => m
handler.before = async function (m, { isAdmin, isBotAdmin, conn }) {
  if (m.fromMe || m.fromMe || !m.isGroup ) return true;
  let chat = global.db.data.chats[m.chat]
  let user = global.db.data.users[m.sender]
  const isGroupLink = /(chat.whatsapp.com\/([0-9A-Za-z]{20,24}))/i.test(m.text)

  if (chat.antiLink && isGroupLink) {
    if (typeof user.warnLink !== "number") user.warnLink = 0;
    await conn.sendMessage(m.chat, { delete: m.key })
    user.warnLink += 1
    if (user.warnLink < maxWarnLink) {
      m.reply(`⚠️ *PERINGATAN LINK GRUP!*
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
      m.reply(`⛔ Pengguna @${m.sender.split('@')[0]} telah mencapai batas peringatan link grup dan akan dikeluarkan.`, null, { mentions: [m.sender] })
      await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
    }
  }
  return true
}

export default handler;
