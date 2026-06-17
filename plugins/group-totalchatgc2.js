let handler = async (m, { conn }) => {
    const user = global.db.data.chats[m.chat]?.memgc || {};

    let memgc = Object.keys(user)
        .filter(jid => jid.endsWith('@s.whatsapp.net') || jid.endsWith('@lid'))
        .sort((a, b) => (user[b]?.chat || 0) - (user[a]?.chat || 0));

    if (!memgc.length) {
        return m.reply('Belum ada data statistik chat di grup ini.');
    }

    let chatToday = 0;
    let chatTotal = 0;

    for (const jid of memgc) {
        chatToday += Number(user[jid]?.chat || 0);
        chatTotal += Number(user[jid]?.chatTotal || 0);
    }

    let head =
        `Total chat group hari ini: ${toRupiah(chatToday)}\n` +
        `Total semua chat: ${toRupiah(chatTotal)}\n\n`;

    // ✅ INI KUNCI UTAMA (REFERENSI KAMU)
    const participants = (await conn.groupMetadata(m.chat)).participants;

    const getName = (jid) => {
        const p = participants.find(v => v.id === jid);
        return (
            p?.notify ||
            p?.name ||
            jid.split('@')[0]
        );
    };

    let caption = '';
    let nomor = 1;

    for (let i = 0; i < Math.min(memgc.length, 20); i++) {
        const jid = memgc[i];
        const data = user[jid] || {};

        let name = getName(jid);

        caption += `*${nomor++}.* ${name}\n`;
        caption += `Chat Today : ${toRupiah(data.chat || 0)}\n`;
        caption += `Total Chat : ${toRupiah(data.chatTotal || 0)}\n`;
        caption += `Last Chat : ${getTime(data.lastseen)}\n\n`;
    }

    await m.reply(head + caption.trim());
};

handler.help = ['totalchatgc2'];
handler.tags = ['group'];
handler.command = /^(totalchatgc2)$/i;
handler.admin = true;
handler.group = true;

module.exports = handler;