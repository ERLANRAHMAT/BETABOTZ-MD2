let handler = async (m, { conn, text, usedPrefix, command }) => {
  let who = '';
  let isGroupTarget = false;

  if (m.quoted) {
    who = m.quoted.sender;
  } else if (m.mentionedJid && m.mentionedJid[0]) {
    who = m.mentionedJid[0];
  } else if (text) {
    let cleanText = text.trim();
    if (cleanText.endsWith('g.us') || cleanText.includes('@g.us')) {
      who = cleanText;
      isGroupTarget = true;
    } else {
      who = cleanText.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    }
  }

  if (!who && !text) {
    throw `Format salah!\n\nContoh penggunaan:\n*${usedPrefix + command} @user* (tag/balas pesan)\n*${usedPrefix + command} 628123456789*\n*${usedPrefix + command} 1203633...g.us* (untuk unban grup)`;
  }

  if (!who && text) {
    who = text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
  }

  try {
    if (isGroupTarget || who.endsWith('g.us')) {
      if (!global.db.data.chats[who]) {
        global.db.data.chats[who] = { isBanned: false };
      } else {
        global.db.data.chats[who].isBanned = false;
      }
      return m.reply(`✅ Berhasil unban chat group: ${who}`);
    } else {
      if (!global.db.data.users[who]) {
        global.db.data.users[who] = { banned: false };
      } else {
        global.db.data.users[who].banned = false;
      }
      
      let name = 'User';
      try {
        name = await conn.getName(who) || 'User';
      } catch {}

      return m.reply(`✅ Berhasil unban user: ${name} (${who.split('@')[0]}) - Bot kembali aktif untuk user ini.`);
    }
  } catch (e) {
    console.error('Error unban command:', e);
    throw e;
  }
};

handler.help = ['unban @user'];
handler.tags = ['owner'];
handler.command = /^unban(chat)?$/i;
handler.owner = true;

export default handler;