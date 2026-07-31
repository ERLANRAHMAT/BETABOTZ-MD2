let handler = async (m, { conn, text, isROwner, isOwner, usedPrefix, command }) => {
  if (text) {
    if (isROwner) global.conn.welcome = text
    else if (isOwner) conn.welcome = text
    global.db.data.chats[m.chat].sWelcome = text
    m.reply('*Pesan Welcome Berhasil Diatur!*\n\nPesan ini akan otomatis dikirim ketika ada anggota baru yang bergabung ke dalam grup.')
  } else {
    throw `⚠️ *Teks welcome belum dimasukkan!*\n\n*Cara Penggunaan:*\n${usedPrefix + command} <teks welcome>\n\n*Contoh:*\n${usedPrefix + command} Halo @user, selamat datang di grup @subject! Jangan lupa baca rules di deskripsi ya: @desc\n\n┌─⊷ *VARIABEL TERSEDIA*\n▢ *@user* : Untuk tag (mention) member baru\n▢ *@subject* : Untuk menampilkan nama grup\n▢ *@desc* : Untuk menampilkan deskripsi grup\n└──────────────`
  }
}

handler.help = ['setwelcome <teks>']
handler.tags = ['owner', 'group']
handler.command = /^setwelcome$/i
handler.botAdmin = true

export default handler