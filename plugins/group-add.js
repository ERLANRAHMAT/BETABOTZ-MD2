// ARTINYA APA BANG MESI
// ini hadi?bukan bng
let fetch = require('node-fetch')
const { default: getBinaryNodeChild, getBinaryNodeChildren } = require('@adiwajshing/baileys')
let handler = async (m, { conn, text, participants, usedPrefix, command }) => {
  try {
  let _participants = participants.map(user => user.jid)
  let users = (await Promise.all(
    text.split(',')
      .map(v => v.replace(/[^0-9]/g, ''))
      .filter(v => v.length > 4 && v.length < 20 && !_participants.includes(v + '@s.whatsapp.net'))
      .map(async v => [
        v,
        await conn.onWhatsApp(v + '@s.whatsapp.net')
      ])
  )).filter(v => v[1]).map(v => v[0] + '@c.us')
  let response = await conn.query({
        tag: 'iq',
        attrs: {
            type: 'set',
            xmlns: 'w:g2',
            to: m.chat,
        },
        content: users.map(jid => ({
            tag: 'add',
            attrs: {},
            content: [{ tag: 'participant', attrs: { jid } }]
}))})
    const pp = await conn.profilePictureUrl(m.chat).catch(_ => null)
    const jpegThumbnail = pp ? await (await fetch(pp)).buffer() : Buffer.alloc(0)
    const add = getBinaryNodeChild(response, 'add')
    const participant = getBinaryNodeChildren(add, 'participant')
    for (const user of participant.filter(item => item.attrs.error == 403)) {
        const content = getBinaryNodeChild(user, 'add_request')
        const invite_code = content.attrs.code
        const invite_code_exp = content.attrs.expiration
        let teks = `SUCCES`
        m.reply(teks, null, {
        mentions: conn.parseMention(teks)
})}
} catch (e) {
throw m.reply('Gak bisa cok!')}
}
handler.help = ['add', '+'].map(v => v + ' nomor,nomor')
handler.tags = ['admin']
handler.command = /^(add|\+)$/i

handler.group = true
handler.admin = true
handler.botAdmin = true
handler.limit = true
handler.owner = true

module.exports = handler
