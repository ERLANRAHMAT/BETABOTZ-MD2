let handler = async (m, { conn, usedPrefix, command }) => {
    if (!m.isGroup) {
        return m.reply('Perintah ini hanya dapat digunakan di dalam grup!');
    }

    try {
        let groupMetadata = await conn.groupMetadata(m.chat).catch(() => null);
        if (!groupMetadata) return m.reply('❌ Gagal mengambil data grup.');

        let participants = groupMetadata.participants || [];
        let usersWithWarn = [];

        for (let p of participants) {
            let jid = p.id || p.jid;
            if (!jid) continue;

            let cleanNumber = jid.split('@')[0].replace(/[^0-9]/g, '');

            let matchedKey = Object.keys(global.db.data.users || {}).find(key => 
                key.replace(/[^0-9]/g, '') === cleanNumber
            );

            if (matchedKey) {
                let userDb = global.db.data.users[matchedKey];
                if (userDb && typeof userDb.warn === 'number' && userDb.warn > 0) {
                    usersWithWarn.push({
                        jid: jid,
                        warn: userDb.warn
                    });
                }
            }
        }

        if (usersWithWarn.length === 0) {
            return m.reply('✨ Tidak ada anggota di grup ini yang memiliki catatan peringatan (warn).');
        }

        let maxWarn = global.maxwarn || 3; 
        let text = `*DAFTAR PERINGATAN ANGGOTA GRUP*\n\n`;
        let mentions = [];

        for (let i = 0; i < usersWithWarn.length; i++) {
            let data = usersWithWarn[i];
            text += `*${i + 1}.* @${data.jid.split('@')[0]}\n`;
            text += `   ◦  *Peringatan:* ${data.warn}/${maxWarn}\n\n`;
            mentions.push(data.jid);
        }

        text += `> _Gunakan perintah unwar/delwarn untuk mengurangi peringatan._`;

        await conn.sendMessage(m.chat, { text: text.trim(), mentions }, { quoted: m });

    } catch (e) {
        console.error('Error listwarn:', e);
        m.reply('Terjadi kesalahan saat memuat daftar warn.');
    }
}

handler.help = ['listwarn'];
handler.tags = ['group'];
handler.command = /^listwarn$/i;
handler.group = true;
handler.admin = true;

export default handler;