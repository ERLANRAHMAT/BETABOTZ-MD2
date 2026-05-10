let maxWarnLink = Number(global.maxwarn);

async function checkAntiLink(m, { conn, isAdmin, isBotAdmin }) {
  if (m.isBaileys || m.fromMe || !m.isGroup) return false;
  let chat = global.db.data.chats[m.chat]
  let user = global.db.data.users[m.sender]
  const isGroupLink = /(chat.whatsapp.com\/([0-9A-Za-z]{20,24}))/i.test(m.text)

  if (chat.antiLink && isGroupLink) {
    if (typeof user.warnLink !== "number") user.warnLink = 0;
    await conn.sendMessage(m.chat, { delete: m.key })
    user.warnLink += 1
    if (user.warnLink < maxWarnLink) {
      return true;
    } else {
      let ownerGroup = m.chat.split`-`[0] + "@s.whatsapp.net";
      let botJid = conn.user.jid;
      if (m.sender === ownerGroup || m.sender === botJid) {
        user.warnLink = 0;
        m.reply('Tidak bisa mengeluarkan owner atau bot.');
      } else {
        user.warnLink = 0;
        await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
      }
    }
    return true; 
  }
  return false;
}

async function checkAntilinkCh (m, { conn, isAdmin, isBotAdmin }) {
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
     return true;
    } else {
      let ownerGroup = m.chat.split`-`[0] + "@s.whatsapp.net";
      let botJid = conn.user.jid;
      if (m.sender === ownerGroup || m.sender === botJid) {
        user.warnLink = 0;
        return m.reply('Tidak bisa mengeluarkan owner atau bot.');
      }
      user.warnLink = 0;
      await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
    }
  }
  return true
}

// isi array ini dengan fungsi yang mau di tambah sebelum afk jalan
let antiChecks = [
  checkAntiLink,
  checkAntilinkCh
];

let handler = async (m, { conn, text, isAdmin, isBotAdmin }) => {
  for (let check of antiChecks) {
    if (await check(m, { conn, isAdmin, isBotAdmin })) return;
  }
  let user = global.db.data.users[m.sender]
  user.afk = + new Date
  user.afkReason = text
  m.reply(`@${m.sender.split`@`[0]} sekarang AFK ${text ? '\nDengan Alasan : ' + text : 'Tanpa Alasan'}
`)
}
handler.help = ['afk [alasan]']
handler.tags = ['main']
handler.command = /^afk$/i

module.exports = handler
