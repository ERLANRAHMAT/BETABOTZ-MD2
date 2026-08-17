let handler = async (m, { conn, participants, isOwner, isAdmin }) => {
  if (m.isBaileys) return;

  if (!(isAdmin || isOwner)) {
    global.dfail("admin", m, conn);
    return; 
  }

  // Jeda aman untuk Kick All
  const JEDA_KICK = 3; 

  let ownerGroup = m.chat.split`-`[0] + "@s.whatsapp.net";
  let botJid = conn.user.id.split(":")[0] + "@s.whatsapp.net";

  let targets = [];

  let botNumber = botJid.split("@")[0];
  let ownerNumber = ownerGroup.split("@")[0];

  let users = participants.filter((u) => {
    let userNumber = u.id.split(":")[0].split("@")[0];
    return userNumber !== botNumber && userNumber !== ownerNumber && !u.admin;
  });

  for (let user of users) {
    if (user.id) targets.push(user.id);
  }

  if (targets.length === 0) {
      throw "Di grup ini tidak ada member yang bisa dikick (semua admin/owner).";
  }

  let totalWaktu = targets.length * JEDA_KICK;
  await m.reply(
    `⏳ Menjalankan Kick All Aman.\n• Total target: ${targets.length} member\n• Jeda: ${JEDA_KICK} detik/member\n• Estimasi selesai: ± ${Math.ceil(totalWaktu / 60)} menit.\n\n_Mohon tunggu, proses sedang berjalan..._`,
  );

  let suksesKick = [];
  for (let i = 0; i < targets.length; i++) {
    try {
      await conn.groupParticipantsUpdate(m.chat, [targets[i]], "remove");
      suksesKick.push(targets[i]);
    } catch (e) {
      console.error(`Gagal kick ${targets[i]}:`, e);
    }
    
    // Delay agar tidak terkena limit / ban dari WhatsApp
    if (i < targets.length - 1) {
      await delay(JEDA_KICK * 1000); 
    }
  }

  return m.reply(
    `✅ Sukses Mengeluarkan ${suksesKick.length} Member secara berkala:\n${suksesKick.map((v) => "@" + v.split("@")[0]).join("\n")}`,
    null,
    { mentions: suksesKick },
  );
};

handler.help = ['kickall'];
handler.tags = ['group'];
handler.command = /^(kickall|removeall)$/i;
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));