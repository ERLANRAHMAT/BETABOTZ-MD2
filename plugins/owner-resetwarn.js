let handler = async (m, { conn, usedPrefix, command }) => {
    let users = global.db.data.users;
    let count = 0;

    for (let jid in users) {
        if (users[jid].warn && users[jid].warn > 0) {
            users[jid].warn = 0;
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