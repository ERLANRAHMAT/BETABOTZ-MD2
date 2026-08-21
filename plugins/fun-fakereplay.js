let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Format:\n${usedPrefix + command} <nomor/tag> | <pesan target> | <pesan balasan>\nContoh:\n${usedPrefix + command} 6281289694906 | Kamu telat | Maaf pak\n${usedPrefix + command} @6281289694906 | Hey | Sorry I'm late`;

  let split = text.split('|').map(v => v.trim())
  let [nomor, quote, ...balasan] = split
  balasan = balasan.join('|').trim()

  if (!nomor || !quote || !balasan) throw `Format salah!\n${usedPrefix + command} <nomor/tag> | <pesan target> | <pesan balasan>`

  let jid;
  if (m.mentionedJid && m.mentionedJid.length > 0) {
      jid = m.mentionedJid[0];
  } else {
      nomor = nomor.replace(/[^0-9]/g, '')
      if (nomor.length < 8) throw 'Nomor kependekan. Minimal 8 digit + kode negara atau Tag usernya langsung!'
      jid = nomor + '@s.whatsapp.net'
  }

  await conn.sendMessage(m.chat, { 
    text: balasan 
  }, { 
    quoted: {
      key: {
        remoteJid: m.chat,
        fromMe: false,
        id: 'FAKE' + Date.now(),
        participant: jid
      },
      message: {
        conversation: quote
      },
      participant: jid
    }
  })
}

handler.help = ['fq <nomor/tag> | <pesan target> | <pesan balasan>']
handler.tags = ['tools']
handler.command = /^fq|fakereplyq$/i
handler.limit = true

export default handler