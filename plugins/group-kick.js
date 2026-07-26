let handler = async (m, { conn, args, participants, isOwner, isAdmin }) => {
  if (m.isBaileys) return;

  if (!(isAdmin || isOwner)) {
    global.dfail("admin", m, conn);
    throw false;
  }

  // ini jeda setiap user yang akan di kick, jika kamu isi 60 detik maka 1 user akan di kick setiap 60 detik
  // jangan restart bot saat kick all sedang dijalankan
  const JEDA_KICK = 60; // <- dalam detik ini arti nya 60 second


  let ownerGroup = m.chat.split`-`[0] + "@s.whatsapp.net";
  let botJid = conn.user.id.split(":")[0] + "@s.whatsapp.net";

  let targets = [];

  // ==========================================
  // KICK ALL (Jika user mengetik `.kick all`)
  // ==========================================
  if (args[0] === "all") {
    let botNumber = botJid.split("@")[0];
    let ownerNumber = ownerGroup.split("@")[0];

    let users = participants.filter((u) => {
      let userNumber = u.id.split(":")[0].split("@")[0];
      return userNumber !== botNumber && userNumber !== ownerNumber && !u.admin;
    });

    for (let user of users) {
      if (user.id) targets.push(user.id);
    }

    if (targets.length === 0)
      return m.reply(
        "Di grup ini tidak ada member yang bisa dikick (semua admin/owner).",
      );

    let totalWaktu = targets.length * JEDA_KICK;
    await m.reply(
      `Menjalankan Kick All Aman.\n• Total target: ${targets.length} member\n• Jeda: ${JEDA_KICK} detik/member\n• Estimasi selesai: ± ${Math.ceil(totalWaktu / 60)} menit.\n\n_Mohon tunggu, proses sedang berjalan..._`,
    );

    let suksesKick = [];
    for (let i = 0; i < targets.length; i++) {
      try {
        await conn.groupParticipantsUpdate(m.chat, [targets[i]], "remove");
        suksesKick.push(targets[i]);
      } catch (e) {
        console.error(`Gagal kick ${targets[i]}:`, e);
      }
      // ada delay kick agar bot tidak di curigai mark dan gak kena overlimit
      if (i < targets.length - 1) {
        await delay(JEDA_KICK * 1000); 
      }
    }

    return m.reply(
      ` Sukses Mengeluarkan ${suksesKick.length} Member secara berkala:\n${suksesKick.map((v) => "@" + v.split("@")[0]).join("\n")}`,
      null,
      { mentions: suksesKick },
    );
  }

  // ==========================================
  // KICK VIA REPLY CHAT
  // ==========================================
  if (m.quoted) {
    let quotedSender = m.quoted.sender.split(":")[0] + "@s.whatsapp.net";
    if (quotedSender === ownerGroup || quotedSender === botJid) {
      return m.reply(
        "Gagal! Tidak bisa mengeluarkan Owner Grup atau Bot sendiri.",
      );
    }
    targets.push(m.quoted.sender);
  }

  // ==========================================
  // KICK VIA TAG / MENTION
  // ==========================================
  if (m.mentionedJid && m.mentionedJid.length > 0) {
    let mentionedTargets = m.mentionedJid.filter((u) => {
      let jid = u.split(":")[0] + "@s.whatsapp.net";
      return jid !== ownerGroup && jid !== botJid;
    });
    targets = [...targets, ...mentionedTargets];
  }

  targets = [...new Set(targets)];

  if (targets.length === 0) {
    throw `Format salah!\n\n• Tag user: *.kick @user*\n• Reply chat target\n• Kick semua member: *.kick all*`;
  }

  for (let user of targets) {
    if (user.endsWith("@s.whatsapp.net")) {
      await conn.groupParticipantsUpdate(m.chat, [user], "remove");
      await delay(500); 
    }
  }
};

handler.help = ['kick @user', 'kick all'];
handler.tags = ['group'];
handler.command = /^(kic?k|remove|tendang|\-)$/i;

handler.group = true;
handler.botAdmin = true;

export default handler;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));