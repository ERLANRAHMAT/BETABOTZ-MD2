let handler = async (m, { conn, args }) => {
    let chats = global.db.data.chats;
    let mutedChats = Object.entries(chats).filter(([_, chat]) => chat.isBanned);
  
    if (mutedChats.length === 0) {
      return m.reply('✅ Tidak ada grup yang sedang di-mute.');
    }
    if (args[0]) {
      let index = parseInt(args[0]) - 1;
      if (isNaN(index) || index < 0 || index >= mutedChats.length) {
        return m.reply('❌ Nomor yang kamu masukkan tidak valid.');
      }
  
      let [chatId] = mutedChats[index];
      chats[chatId].isBanned = false;
      m.reply(`✅ Berhasil meng-unmute grup dengan ID: ${chatId}\n\nSilahkan Cek List Mute Terbaru Dengan Data Terbaru`);
    } else {
      let message = '*🔒 Daftar Grup yang Di-Mute:*\n\n';
  
      for (let i = 0; i < mutedChats.length; i++) {
        let [chatId] = mutedChats[i];
        try {
          let metadata = await conn.groupMetadata(chatId);
          let groupName = metadata.subject;
          message += `*${i + 1}. ${groupName}*\n`;
          message += `- *ID Grup:* ${chatId}\n\n`;
        } catch (e) {
          message += `*${i + 1}. [Nama grup tidak ditemukan]*\n`;
          message += `- *ID Grup:* ${chatId}\n\n`;
        }
      }
  
      message += `Ketik *listmute [nomor]* untuk meng-unmute grup tertentu.`;
      m.reply(message);
    }
  };
  
  handler.help = ['listmute'];
  handler.tags = ['owner'];
  handler.command = ['listmute'];
  handler.owner = true;
  
  export default handler;
  