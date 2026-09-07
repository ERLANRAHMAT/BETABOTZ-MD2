let handler = async (m, { conn, text, usedPrefix, command }) => {
    let who;
    if (m.isGroup) {
        who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender;
    } else {
        who = m.sender;
    }

    if (!(who in global.db.data.users)) throw `Pengguna tidak ditemukan di dalam database.`;
    
    let user = global.db.data.users[who];
    let maxWarn = global.maxwarn || 3; 

    await m.reply(`*CEK WARNING PENGGUNA*\n\n▢ *Pengguna:* @${who.split`@`[0]}\n▢ *Jumlah Warn:* ${user.warn || 0} / ${maxWarn}`, null, { mentions: [who] });
}

handler.help = ['cekwarn [@user]'];
handler.tags = ['group'];
handler.command = /^(cekwarn|warncheck)$/i;
handler.group = true;

export default handler;