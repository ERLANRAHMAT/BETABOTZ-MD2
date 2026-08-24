let handler = async (m, { conn, isOwner }) => {
    let chats = Object.entries(global.db.data.chats).filter(chat => chat[1].isBanned)
    let users = Object.entries(global.db.data.users).filter(user => user[1].banned)

    let chatList = await Promise.all(chats.map(async ([jid], i) => {
        let name = 'Unknown';
        try {
            name = await conn.getName(jid) || 'Unknown';
        } catch {}
        let target = isOwner ? '@' + jid.split('@')[0] : jid;
        return `├ ${i + 1}. ${name}\n├ ${target}`;
    }));

    let userList = await Promise.all(users.map(async ([jid], i) => {
        let name = 'Unknown';
        try {
            name = await conn.getName(jid) || 'Unknown';
        } catch {}
        let target = isOwner ? '@' + jid.split('@')[0] : jid;
        return `├ ${i + 1}. ${name}\n├ ${target}`;
    }));

    let caption = `
┌〔 Daftar Chat Terbanned 〕
├ Total : ${chats.length} Chat
${chatList.length > 0 ? chatList.join('\n') : ''}
└────

┌〔 Daftar Pengguna Terbanned 〕
├ Total : ${users.length} Pengguna
${userList.length > 0 ? userList.join('\n') : ''}
└────
`.trim()

    let mentionedJid = [...chats.map(([jid]) => jid), ...users.map(([jid]) => jid)];

    conn.reply(m.chat, caption, m, { contextInfo: { mentionedJid } })
}

handler.help = ['bannedlist']
handler.tags = ['info']
handler.command = /^listban(ned)?|ban(ned)?list|daftarban(ned)?$/i
handler.owner = false

export default handler