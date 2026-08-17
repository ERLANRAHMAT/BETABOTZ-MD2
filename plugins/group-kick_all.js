let handler = async (m, { conn, participants, isOwner, isAdmin, command }) => {
  if (m.isZapo) return;

  if (!(isAdmin || isOwner)) {
    global.dfail("admin", m, conn);
    return; 
  }

  conn.kickall = conn.kickall ? conn.kickall : {};

  // ==========================================
  // FITUR BATAL
  // ==========================================
  if (/^(batal|batalkick)$/i.test(command)) {
    if (conn.kickall[m.chat]) {
      conn.kickall[m.chat] = false; // Ubah status menjadi false agar looping berhenti
      return m.reply("✅ Perintah diterima. Proses Kick All akan segera dihentikan...");
    } else {
      return m.reply("❌ Tidak ada proses Kick All yang sedang berjalan di grup ini.");
    }
  }

  // ==========================================
  // MENCEGAH DOUBLE SPAM
  // ==========================================
  if (conn.kickall[m.chat]) {
    return m.reply("⚠️ Proses Kick All masih berjalan di grup ini! Ketik *.batal* untuk menghentikan.");
  }

  // Jeda aman untuk Kick All
  const JEDA_KICK = 4; 

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
    `⏳ Menjalankan Kick All Aman.\n• Total target: ${targets.length} member\n• Jeda: ${JEDA_KICK} detik/member\n• Estimasi selesai: ± ${Math.ceil(totalWaktu / 60)} menit.\n\n_Mohon tunggu, proses sedang berjalan..._\n\n💡 *Ketik .batal jika ingin membatalkan proses.*`
  );

  conn.kickall[m.chat] = true;

  let suksesKick = [];
  for (let i = 0; i < targets.length; i++) {
    
    if (!conn.kickall[m.chat]) {
        await m.reply(`🛑 *Proses Dibatalkan!*\n\nBerhasil mengeluarkan ${suksesKick.length} member sebelum dihentikan.`);
        return; 
    }

    try {
      await conn.groupParticipantsUpdate(m.chat, [targets[i]], "remove");
      suksesKick.push(targets[i]);
    } catch (e) {
      if (e !== false) {
        console.error(`Gagal kick ${targets[i]}`, e);
      }
    }
    
    if (i < targets.length - 1) {
      await delay(JEDA_KICK * 1000); 
    }
  }

  if (conn.kickall[m.chat]) {
      delete conn.kickall[m.chat]; 
      return m.reply(
        `✅ Sukses Mengeluarkan ${suksesKick.length} Member secara berkala:\n${suksesKick.map((v) => "@" + v.split("@")[0]).join("\n")}`,
        null,
        { mentions: suksesKick }
      );
  }
};

handler.help = ['kickall', 'batal'];
handler.tags = ['group'];
handler.command = /^(kickall|removeall|batal|batalkick)$/i;
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));