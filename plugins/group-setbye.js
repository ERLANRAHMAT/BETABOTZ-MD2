let handler = async (m, { conn, text, isROwner, isOwner, usedPrefix, command }) => {
  if (text) {
    if (isROwner) global.conn.bye = text
    else if (isOwner) conn.bye = text
    global.db.data.chats[m.chat].sBye = text
    m.reply('*Pesan Bye Berhasil Diatur!*\n\nPesan ini akan otomatis dikirim ketika ada anggota yang keluar dari grup.')
  } else {
    throw `⚠️ *Teks bye belum dimasukkan!*\n\n*Cara Penggunaan:*\n${usedPrefix + command} <teks bye>\n\n*Contoh:*\n${usedPrefix + command} Selamat tinggal @user, semoga sukses selalu!\n\n┌─⊷ *VARIABEL TERSEDIA*\n▢ *@user* : Untuk tag (mention) member yang keluar\n└──────────────`
  }
}

handler.help = ['setbye <teks>']
handler.tags = ['owner', 'group']
handler.command = /^setbye$/i
handler.botAdmin = true

export default handler