let handler = async (m, { conn, usedPrefix, command }) => {
    let users = global.db.data.users;
    let count = 0;

    for (let jid in users) {
        let user = users[jid];
        let hasWarn = (user.warn && user.warn > 0) || (user.warnLink && user.warnLink > 0);
        
        if (hasWarn) {
            user.warn = 0;
            user.warnLink = 0;
            count++;
        }
    }

    await m.reply(`Berhasil mereset jumlah warning seluruh pengguna menjadi 0.\nTotal akun yang dibersihkan: *${count} pengguna*`);
}

handler.help = ['resetwarn'];
handler.tags = ['owner'];
handler.command = /^resetwarn$/i;
handler.owner = true; 
handler.group = true;

export default handler;