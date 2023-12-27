let handler = async (m, { conn, command }) => {
if (!m.quoted) throw 'Reply pesan yang ingin dihapus'
try {
let nay = m.message.extendedTextMessage.contextInfo.participant
let nayla = m.message.extendedTextMessage.contextInfo.stanzaId
return conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: nayla, participant: nay }})
 } catch {
return conn.sendMessage(m.chat, { delete: m.quoted.vM.key })
}
}
handler.help = ['del', 'delete']
handler.tags = ['tools']
handler.botAdmin = false
handler.limit = 5
handler.admin = false

handler.command = /^del(ete)?$/i

module.exports = handler
