exports.before = async function(m, { isAdmin, isBotAdmin }) {
    if (m.isBaileys && m.fromMe) return true;
    
    let chat = global.db.data.chats[m.chat];
    let sender = global.db.data.chats[m.sender];
    let isVideo = m.mtype;
    let hapus = m.key.participant;
    let bang = m.key.id;
    
    if (chat.antivideo && isVideo) {
      if (isVideo === "videoMessage") {
        if (isAdmin || !isBotAdmin) {
          // Jika pengirim adalah admin atau bot bukan admin, tidak melakukan apa-apa
        } else {
          m.reply(`*Video Terdeteksi*\n\nMaaf Tapi Harus Saya Hapus, Karna Admin/Owner Mengaktifkan Anti Video Untuk Chat Ini`);
          return this.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: hapus } });
        }
        return true;
      }
    }
    return true;
  };
  