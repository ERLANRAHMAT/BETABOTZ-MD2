let handler = async (m, { conn, args, groupMetadata }) => {
    try {
        let who;
        if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false;
        else who = m.chat;
        
        if (!who) throw `Tag sesesorang untuk mengurangi peringatan nya`;
        if (!(who in global.db.data.users)) throw `✳️ Pengguna hilang dari database saya`;
        
        let warn = global.db.data.users[who].warn;
        if (warn > 0) {
            global.db.data.users[who].warn -= 1;
            await m.reply(`⚠️ *PERINGATAN*
         
▢ Memperingatkan: *-1*
▢ Total Memperingatkan: *${warn - 1}*`);
        } else if (warn == 0) {
            await m.reply('✳️ Pengguna tidak memiliki peringatan');
        }
    } catch (e) {
            console.log(e);
            throw e;
    }
};

handler.help = ['delwarn @user'];
handler.tags = ['group'];
handler.command = ['delwarn', 'unwarn']; 
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;