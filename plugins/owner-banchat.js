let handler = async (m, { conn, command, isAdmin, isOwner }) => {
  let chat = global.db.data.chats[m.chat] || (global.db.data.chats[m.chat] = { isBanned: false });
  if (!(isAdmin || isOwner)) {
      global.dfail('admin', m, conn)
      throw false
    }
  // Jika grup sedang di-mute, bot tidak merespon
  if (chat.isBanned && command !== 'unmute') return;

  if (command === 'mute') {
    chat.isBanned = true;
    m.reply('Berhasil membanned chat. Bot tidak akan merespon di chat ini.');
  } else if (command === 'unmute') {
    if (chat.isBanned) {
      chat.isBanned = false;
      m.reply('Berhasil meng-unmute chat. Bot akan kembali merespon di chat ini.');
    } else {
      m.reply('Chat ini tidak dalam keadaan mute.');
    }
  }
};

handler.help = ['mute', 'unmute'];
handler.tags = ['owner'];
handler.command = ['mute', 'unmute'];
handler.owner = true;

module.exports = handler;

// let handler = async (m, { conn, participants }) => {
  // // if (participants.map(v=>v.jid).includes(global.conn.user.jid)) {
    // global.db.data.chats[m.chat].isBanned = true
    // m.reply('Berhasil membanned chat, Bot tidak akan respon di chat ini.')
  // // } else m.reply('Ada nomor host disini...')
// }
// handler.help = ['mute']
// handler.tags = ['owner']
// handler.command = ['mute']
// handler.owner = true

// module.exports = handler
