let handler = async (m, { conn, participants, command }) => {
    if (!m.isGroup) {
        return m.reply('Perintah ini cuma bisa dipakai di dalam grup ya!');
    }

    let sender = m.sender;
    let memberJids = participants.map(p => p.id);

    let botJid = conn.user.jid || conn.user.id.split(':')[0] + '@s.whatsapp.net';
    let filteredMembers = memberJids.filter(jid => jid !== sender && jid !== botJid);
    if (filteredMembers.length === 0) {
        return m.reply('Gak ada orang lain di grup ini buat dijodohin 🥲');
    }
    let randomMember = filteredMembers[Math.floor(Math.random() * filteredMembers.length)];
    let text = `@${sender.split('@')[0]} ❤️ @${randomMember.split('@')[0]}`;
    await conn.sendMessage(m.chat, {
        text: text,
        mentions: [sender, randomMember]
    }, { quoted: m });
}

handler.help = ['jodohku'];
handler.tags = ['fun'];
handler.command = /^(jodohku)$/i;
handler.group = true; 

module.exports = handler;