let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text && !m.quoted) {
    throw `Format salah!\n\nContoh penggunaan:\n*${usedPrefix + command} @user* (tag/balas pesan)\n*${usedPrefix + command} 628123456789*\n*${usedPrefix + command} 1203633...g.us* (untuk ban grup)`;
  }

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

  if (!who) throw 'Target tidak valid atau tidak ditemukan!';

  try {
    if (isGroupTarget || who.endsWith('g.us')) {
      if (!global.db.data.chats[who]) {
        global.db.data.chats[who] = {};
      }
      global.db.data.chats[who].isBanned = true;

      let groupName = 'Grup';
      try {
        let metadata = await conn.groupMetadata(who).catch(() => null);
        if (metadata) groupName = metadata.subject;
      } catch {}

      return m.reply(`✅ Berhasil membanned chat group: ${groupName} (${who})`);
    } else {
      if (!global.db.data.users[who]) {
        global.db.data.users[who] = {};
      }
      global.db.data.users[who].banned = true;

      let name = 'User';
      try {
        name = await conn.getName(who) || 'User';
      } catch {}

      return m.reply(`✅ Berhasil membanned user: ${name} (${who.split('@')[0]})`);
    }
  } catch (e) {
    console.error('Error ban command:', e);
    throw `❌ Gagal memproses ban! Pastikan format nomor atau ID grup benar.`;
  }
};

handler.help = ['ban @user'];
handler.tags = ['owner'];
handler.command = /^ban(chat)?$/i;
handler.owner = true;

export default handler;