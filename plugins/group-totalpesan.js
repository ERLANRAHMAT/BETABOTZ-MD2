let handler = async (m, { conn }) => {
    const user = global.db.data.chats[m.chat]?.memgc || {};

    let memgc = Object.keys(user)
        .filter(jid => {
            const isUser =
                jid.endsWith('@s.whatsapp.net') ||
                jid.endsWith('@lid');
            const isGroup = jid.endsWith('@g.us');

            return isUser && !isGroup;
        })
        .sort((a, b) => {
            const totalA = user[a]?.chat || 0;
            const totalB = user[b]?.chat || 0;
            return totalB - totalA;
        });

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

    const metadata = await conn.groupMetadata(m.chat);
    const participants = metadata.participants || [];
    const normalize = (id) => id?.split(":")[0];

    const getNameFromGroup = (jid) => {
        const base = jid?.split(":")[0];

        let p = participants.find((v) => (v.id || "").split(":")[0] === base);

        return (
            p?.notify ||
            p?.name ||
            conn.store?.contacts?.[base]?.name ||
            conn.contacts?.[base]?.name ||
            user[base]?.name ||
            base.replace("@s.whatsapp.net", "").replace("@lid", "")
        );
    };

    let caption = '';
    let nomor = 1;

    for (let i = 0; i < Math.min(memgc.length, 20); i++) {
        if (!user[jid]?.name && (p?.name || p?.notify)) {
            user[jid].name = p?.name || p?.notify;
        }
        const jid = memgc[i];
        const data = user[jid] || {};

        let name = getNameFromGroup(jid);

        caption += `*${nomor++}.* ${name}\n`;
        caption += `Chat Today : ${toRupiah(data.chat || 0)}\n`;
        caption += `Total Chat : ${toRupiah(data.chatTotal || 0)}\n`;
        caption += `Last Chat : ${getTime(data.lastseen)}\n\n`;
    }

    await m.reply(head + caption.trim());
};

handler.help = ['totalchatgc'];
handler.tags = ['group'];
handler.command = /^(totalchatgc)$/i;
handler.admin = true;
handler.group = true;

module.exports = handler;

function parseMs(ms) {
    return {
        days: Math.trunc(ms / 86400000),
        hours: Math.trunc(ms / 3600000) % 24,
        minutes: Math.trunc(ms / 60000) % 60,
        seconds: Math.trunc(ms / 1000) % 60
    };
}

function getTime(ms) {
    if (!ms || isNaN(ms)) return 'Belum pernah';

    const diff = Date.now() - Number(ms);

    if (diff < 0) return 'Baru saja';

    const now = parseMs(diff);

    if (now.days) return `${now.days} hari lalu`;
    if (now.hours) return `${now.hours} jam lalu`;
    if (now.minutes) return `${now.minutes} menit lalu`;

    return 'Baru saja';
}

function toRupiah(number) {
    return Number(number || 0).toLocaleString('id-ID');
}