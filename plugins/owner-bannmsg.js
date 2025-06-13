let handler = async (m, { conn, text, command }) => {
    let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false;

    let bl = db.data.chats[m.chat].blacklist || [];
    let peserta = await conn.groupMetadata(m.chat);
    switch (command) {
        case 'bannmsg':
            if (!who) return conn.reply(m.chat, 'Tag/reply orangnya untuk Blacklist', m);

            try {
                if (Object.values(bl).find(v => v.id == who)) throw `Nomor ${who.split(`@`)[0]} sudah ada di *BlackList*`;

                bl.unshift({ id: who });
                db.data.chats[m.chat].blacklist = bl;
                await conn.reply(m.chat, `Sukses menambahkan @${who.split(`@`)[0]} ke *BlackList*`, m, { contextInfo: { mentionedJid: [who] }});
            } catch (e) {
                throw e;
            }
            break;
        case 'unbannmsg':
            if (!who) throw 'Tag/reply orangnya untuk Unblacklist';

            try {
                if (!Object.values(bl).find(v => v.id == who)) throw `Nomor ${who.split(`@`)[0]} tidak ada di *BlackList*`;

                bl.splice(bl.findIndex(v => v.id == who), 1);
                db.data.chats[m.chat].blacklist = bl;
                await conn.reply(m.chat, `Sukses menghapus Nomor: @${who.split(`@`)[0]} dari *BlackList*`, m, { contextInfo: { mentionedJid: [who] }});
            } catch (e) {
                throw e;
            }
            break;
        case 'listbannmgs':
            let txt = `*「 Daftar Nomor Blacklist 」*\n\n*Total:* ${bl.length}\n\n┌─[ *BlackList* ]\n`;

            for (let i of bl) {
                txt += `├ @${i.id.split("@")[0]}\n`;
            }
            txt += "└─•";

            return conn.reply(m.chat, txt, m, { contextInfo: { mentionedJid: bl.map(v => v.id) } }, {mentions: bl.map(v => v.id)});
            break;
    }
};

handler.help = handler.command = ['unbannedmsg', 'bannmsg', 'listbannmsg'];
handler.tags = ['group'];
handler.group = true;
handler.owner = true

handler.before = function(m, { conn, isAdmin }) {
    if (!m.isGroup) return;
    if (m.fromMe) return;

    let bl = db.data.chats[m.chat].blacklist || [];

    if (Object.values(bl).find(users => users.id == m.sender) && !isAdmin) {
        // Menghapus pengguna dari grup jika ada di dalam daftar hitam
        conn.sendMessage(m.chat, { delete: { ...m.key }});
    }
}

module.exports = handler;
