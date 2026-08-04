let handler = async (m, { conn, command, usedPrefix, text }) => {
  let user = global.db.data.users[m.sender];
    user.catatan = user.catatan || [];

    if (user.catatan.length === 0) return m.reply('Kamu belum punya catatan!');
    if (!text) {
      let txt = '🗒️ *Daftar Catatan* 🗒️\n\n';
      user.catatan.forEach((ct, i) => {
        txt += `[${i + 1}]. ${ct.title}\n`;
      });
      txt += `\nPenggunaan: ${usedPrefix}hapuscatatan 1`;
      return m.reply(txt);
    }
  try {
    
    let n = Number(text.split('|')[0]) - 1;
    if (isNaN(n) || n < 0 || n >= user.catatan.length) {
      return m.reply('❌ Catatan tidak ditemukan!');
    }
    user.catatan.splice(n, 1);

    conn.reply(m.chat, `✅ Berhasil menghapus catatan!`, m, false, {
      contextInfo: {
        mentionedJid: conn.parseMention(text)
      }
    });
  } catch (e) {
    console.log(e);
    throw e;
  }
}

handler.help = ['hapuscatatan title'];
handler.tags = ['internet']; 
handler.command = /^hapuscatatan$/i;

export default handler;