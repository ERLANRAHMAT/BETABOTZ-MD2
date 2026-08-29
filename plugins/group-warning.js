let war = global.maxwarn 

let handler = async (m, { conn, text, args, groupMetadata, usedPrefix, command }) => {      
    let who;
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false;
    else who = m.chat;
    
    if (!who) throw `✳️ Berikan tag atau balas pesan seseorang\n\n📌 Contoh : ${usedPrefix + command} @user`;
    
    if (!global.db.data.users[who]) {
        global.db.data.users[who] = { warn: 0 };
    }
    if (typeof global.db.data.users[who].warn !== 'number') {
        global.db.data.users[who].warn = 0;
    }

    let warn = global.db.data.users[who].warn;
    
    if (warn < war) {
        global.db.data.users[who].warn += 1;
        m.reply(`
⚠️ *Pengguna yang Diperingatkan* ⚠️

▢ *Pengguna:* @${who.split('@')[0]}
▢ *Memperingatkan:* ${global.db.data.users[who].warn}/${war}
▢ *Alasan:* ${text || 'Tidak ada alasan'}`, null, { mentions: [who] }); 
    } else {
        global.db.data.users[who].warn = 0;
        m.reply(`⛔ Pengguna telah mencapai batas maksimal peringatan *${war}* dan akan dikeluarkan dari grup.`);
        await time(3000);
        await conn.groupParticipantsUpdate(m.chat, [who], 'remove').catch(() => {});
    }
}

handler.help = ['warn @user'];
handler.tags = ['group'];
handler.command = ['warn']; 
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;

const time = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};