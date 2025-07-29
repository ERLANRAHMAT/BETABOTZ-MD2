let handler = async (m, { conn, text, usedPrefix, command }) => {
    let who;

    if (m.isGroup) {
        if (m.mentionedJid && m.mentionedJid[0]) {
            who = m.mentionedJid[0];
        } 
        else if (m.quoted) {
            who = m.quoted.sender;
        } 
        else {
            who = m.sender;
            m.reply(`Tidak ada reply pesan atau tag. Mengambil LID kamu sendiri:`);
        }
    } else { 
        who = m.sender;
    }

    if (!who) {
        return m.reply(`Penggunaan salah. Reply pesan, tag seseorang, atau gunakan di private chat.`);
    }

    if (typeof global.getLidFromJid !== 'function') {
        return m.reply('Fungsi `getLidFromJid` tidak ditemukan. Pastikan sudah didefinisikan dan di-export ke `global` di file handler utama Anda.');
    }

    try {
        let lid = await global.getLidFromJid(who, conn);
        m.reply(`*ID Target:* ${who}\n*LID Target:* ${lid}`);
    } catch (e) {
        console.error(e);
        m.reply('Terjadi kesalahan saat mencoba mendapatkan LID. Pastikan bot terhubung dan ID valid.');
    }
}

handler.help = ['getlid']
handler.tags = ['tools']
handler.command = /^(getlid)$/i

module.exports = handler