let handler = async (m, { teks, conn, isOwner, isAdmin, args, command }) => {
    try {
        if (m.isBaileys) return;
        if (!(isAdmin || isOwner)) {
            global.dfail('admin', m, conn);
            throw false;
        }

        let ownerGroup = m.chat.split`-`[0] + "@s.whatsapp.net";

        if (m.quoted) {
            if (m.quoted.sender === ownerGroup || m.quoted.sender === conn.user.jid) return;
            let usr = m.quoted.sender;
            await conn.groupParticipantsUpdate(m.chat, [usr], "demote");
            await m.reply(`Sukses demote @${usr.split('@')[0]}!`, null, { mentions: [usr] });
            return;
        }

        if (!m.mentionedJid[0]) throw `Tag siapa yang ingin diturunkan jabatannya?`;

        let users = m.mentionedJid.filter(
            (u) => !(u == ownerGroup || u.includes(conn.user.jid))
        );

        for (let user of users) {
            if (user.endsWith("@s.whatsapp.net")) {
                await conn.groupParticipantsUpdate(m.chat, [user], "demote");
                await m.reply(`Sukses ${command} @${user.split('@')[0]}!`, null, { mentions: [user] });
            }
        }
    } catch (e) {
        if (e !== false) {
            console.log(e);
            throw e;
        }
    }
};

handler.help = ['demote @user'];
handler.tags = ['group', 'owner'];
handler.command = /^(demo?te|\↓)$/i;

handler.group = true;
handler.botAdmin = true;
handler.admin = true;
handler.fail = null;

export default handler;