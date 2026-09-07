let handler = async (m, { conn, text, usedPrefix, command }) => {
    let who;
    if (m.isGroup) {
        who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender;
    } else {
        who = m.sender;
    }

    if (!(who in global.db.data.users)) throw `✳️ Pengguna tidak ditemukan di dalam database.`;

    let user = global.db.data.users[who];
    let maxWarn = global.maxwarn || 3;
    let username = await conn.getName(who);

    await conn.reply(m.chat, `*CEK WARNING PENGGUNA*\n\n▢ *Target:* @${who.split`@`[0]}\n▢ *Nama:* ${username}\n▢ *Jumlah Warn:* ${user.warn || 0} / ${maxWarn}`, m, { mentions: [who] });
}

handler.help = ['cekwarn [@user]'];
handler.tags = ['group'];
handler.command = /^(cekwarn|warncheck)$/i;
handler.group = true;

export default handler;