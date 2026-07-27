let handler = async (m, { conn }) => {
  try {
  let user = global.db.data.users[m.sender]
  if (!user.pasangan || user.pasangan === "") {
    return conn.reply(m.chat, "Kamu sedang jomblo, gak ada yang perlu diputusin", m)
  }

  let ex = user.pasangan
  let pasangan = global.db.data.users[ex]

  user.pasangan = ""
  if (pasangan) pasangan.pasangan = ""

  conn.reply(m.chat, `Berhasil putus dengan @${ex.split('@')[0]}\n\nSemoga cepat move on ya`, m, {
    mentions: [ex]
  })
  } catch (e) {
    console.log(e);
    throw e;
  }
  
}

handler.help = ['putus']
handler.tags = ['fun']
handler.command = /^(putus)$/i
handler.group = true
export default handler