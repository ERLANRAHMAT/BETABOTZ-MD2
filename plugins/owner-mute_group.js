let handler = async (m, { conn, command, isAdmin, isOwner }) => {
  let chat = global.db.data.chats[m.chat] || (global.db.data.chats[m.chat] = { isBanned: false });

  if (!(isAdmin || isOwner)) {
      global.dfail('admin', m, conn);
      return;
  }

  if (command === 'unmute') {
    if (chat.isBanned) {
      chat.isBanned = false;
      return m.reply('✅ Berhasil meng-unmute chat. Bot akan kembali merespon di chat ini.');
    } else {
      return m.reply('ℹ️ Chat ini tidak dalam keadaan mute.');
    }
  }

  if (chat.isBanned) return;

  if (command === 'mute') {
    chat.isBanned = true;
    return m.reply('🔕 Berhasil membanned chat. Bot tidak akan merespon di chat ini.');
  }
};

handler.help = ['mute', 'unmute'];
handler.tags = ['owner', 'group'];
handler.command = /^(mute|unmute)$/i;
handler.admin = true; 
handler.owner = false; 

export default handler;