let handler = async (m, { conn, participants, usedPrefix, command }) => {
    if (!m.isGroup) {
        return m.reply('Perintah ini hanya dapat digunakan di dalam grup!');
    }

    let usersWithWarn = participants.filter(p => {
        let jid = p.id || p.jid;
        let userDb = global.db.data.users[jid];
        return userDb && userDb.warn && userDb.warn > 0;
    });

    if (usersWithWarn.length === 0) {
        return m.reply('✨ Tidak ada anggota di grup ini yang memiliki catatan peringatan (warn).');
    }

    let maxWarn = global.maxwarn || 3; 
    let text = `*DAFTAR PERINGATAN ANGGOTA GRUP*\n\n`;
    let mentions = [];

    for (let i = 0; i < usersWithWarn.length; i++) {
        let jid = usersWithWarn[i].id || usersWithWarn[i].jid;
        let warnCount = global.db.data.users[jid].warn;
        
        text += `*${i + 1}.* @${jid.split('@')[0]}\n`;
        text += `   ◦  *Peringatan:* ${warnCount}/${maxWarn}\n\n`;
        mentions.push(jid);
    }

    text += `> _Gunakan *${usedPrefix}delwarn @user* untuk mengurangi peringatan._`;

    await conn.sendMessage(m.chat, { text: text.trim(), mentions }, { quoted: m });
}

handler.help = ['listwarn'];
handler.tags = ['group'];
handler.command = /^listwarn$/i;
handler.group = true;
handler.admin = true; 

export default handler;