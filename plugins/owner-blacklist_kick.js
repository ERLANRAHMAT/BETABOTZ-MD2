const handler = async (m, { conn, text, command }) => {
  let who;

  if (m.quoted && m.quoted.sender) {
    who = m.quoted.sender;
  } else if (m.mentionedJid && m.mentionedJid[0]) {
    who = m.mentionedJid[0];
  } else if (text) {
    let cleanNumber = text.replace(/[^0-9]/g, "");
    if (cleanNumber.startsWith("0")) {
      cleanNumber = "62" + cleanNumber.slice(1);
    }

    if (cleanNumber.startsWith("76") || cleanNumber.length >= 14) {
      who = cleanNumber + "@lid";
    } else {
      who = cleanNumber + "@s.whatsapp.net";
    }
  }

  if (!who)
    return conn.reply(
      m.chat,
      "Format salah! Gunakan:\n• *.blacklist [nomor/LID]*\n• *.blacklist [reply chat target]*\n• *.blacklist @taguser*",
      m,
    );

  let domain = who.includes("@lid") ? "lid" : "s.whatsapp.net";
  let targetJid = who.split(":")[0].split("@")[0] + "@" + domain;
  let targetNumber = targetJid.split("@")[0];

  let backupNumber = text ? text.replace(/[^0-9]/g, "") : "";
  if (backupNumber.startsWith("0")) backupNumber = "62" + backupNumber.slice(1);

  if (!global.db.data.globalBlacklist) global.db.data.globalBlacklist = [];
  let globalBlacklist = global.db.data.globalBlacklist;

  switch (command) {
    case "blacklist":
      let botJid = conn.user.jid || conn.user.id;
      let botNumber = botJid.split(":")[0].split("@")[0];

      if (targetNumber === botNumber || backupNumber === botNumber) {
        return m.reply("Gagal! Tidak bisa mem-blacklist Bot sendiri.");
      }

      if (global.owner) {
        let isOwnerTarget = global.owner.some((owner) => {
          let ownerNumber = String(owner[0] || owner).replace(/[^0-9]/g, "");
          return targetNumber === ownerNumber || backupNumber === ownerNumber;
        });
        if (isOwnerTarget)
          return m.reply("Gagal! Tidak bisa mem-blacklist Owner.");
      }

      try {
        let isAlreadyBlacklisted = globalBlacklist.some(
          (id) =>
            id.split("@")[0] === targetNumber ||
            (backupNumber && id.split("@")[0] === backupNumber),
        );
        if (isAlreadyBlacklisted)
          throw `Nomor / ID ini sudah ada di daftar *Blacklist Global*.`;

        globalBlacklist.push(targetJid);
        if (backupNumber && backupNumber !== targetNumber) {
          let backupJid =
            backupNumber +
            (backupNumber.startsWith("76") ? "@lid" : "@s.whatsapp.net");
          if (!globalBlacklist.includes(backupJid))
            globalBlacklist.push(backupJid);
        }
        global.db.data.globalBlacklist = globalBlacklist;

        await conn.reply(
          m.chat,
          `Sukses menambahkan *${targetNumber}* ke *Blacklist Global*.\n\nMemulai pemindaian grup untuk mengeluarkan ${targetNumber}...`,
          m,
        );

        const allGroupsData = await conn.groupFetchAllParticipating();
        const groupIds = Object.keys(allGroupsData);
        let totalKicked = 0;

        for (let groupId of groupIds) {
          await delay(3000); // jeda 3 detik

          try {
            const groupMetadata = await conn
              .groupMetadata(groupId)
              .catch((_) => null);
            if (!groupMetadata || !groupMetadata.participants) {
              console.log(
                `[Blacklist Scan] Melewati grup ${groupId} karena gagal memuat metadata.`,
              );
              continue;
            }

            let botMember = groupMetadata.participants.find((u) =>
              (u.jid || u.phoneNumber || u.id || "").includes(botNumber),
            );
            let botIsAdmin = botMember
              ? botMember.admin === "admin" || botMember.admin === "superadmin"
              : false;

            if (!botIsAdmin) continue;

            let targetMember = groupMetadata.participants.find((member) => {
              let memberId =
                member.jid || member.phoneNumber || member.id || "";
              let memberNumber = memberId.split("@")[0].split(":")[0];
              return (
                memberNumber === targetNumber ||
                (backupNumber && memberNumber === backupNumber)
              );
            });

            if (targetMember) {
              let actualJid = targetMember.jid || targetMember.id;

              // Eksekusi kick menggunakan JID asli yang ditemukan di grup tersebut
              await conn.groupParticipantsUpdate(
                groupId,
                [actualJid],
                "remove",
              );
              totalKicked++;

              await conn.sendMessage(groupId, {
                text: `🚨 *Blacklist Bot*\nPengguna dengan ID @${actualJid.split("@")[0]} telah masuk ke dalam daftar Blacklist Global dan otomatis dikeluarkan dari grup ini.`,
                mentions: [actualJid],
              });
              await delay(1500);
            }
          } catch (err) {
            console.error(
              `[Blacklist Error] Gagal scan di grup ${groupId}:`,
              err.message,
            );
          }
        }

        await conn.reply(
          m.chat,
          `🧹 *Pembersihan Selesai*\nTarget berhasil mengeluarkan user dari *${totalKicked}* grup tempat bot menjadi admin.`,
          m,
        );

        await conn.reply(
          m.chat,
          `🧹 *Pembersihan Selesai*\nTarget berhasil mengeluarkan user dari *${totalKicked}* grup tempat bot menjadi admin.`,
          m,
        );
      } catch (e) {
        throw e;
      }
      break;

    case "unblacklist":
      try {
        global.db.data.globalBlacklist = globalBlacklist.filter(
          (id) =>
            id.split("@")[0] !== targetNumber &&
            (!backupNumber || id.split("@")[0] !== backupNumber),
        );
        await conn.reply(
          m.chat,
          `Sukses menghapus *${targetNumber}* dari *Blacklist Global*.`,
          m,
        );
      } catch (e) {
        throw e;
      }
      break;

    // case "listblacklist":
    // case "listbl":
    //   if (globalBlacklist.length === 0)
    //     return m.reply("Daftar *Blacklist Global* saat ini masih kosong.");

    //   let txt = `*「 Daftar Nomor Blacklist Global 」*\n\n*Total:* ${globalBlacklist.length}\n\n┌─[ *Blacklist* ]\n`;
    //   for (let id of globalBlacklist) {
    //     txt += `├ @${id.split("@")[0]}\n`;
    //   }
    //   txt += "└─•";

    //   return conn.reply(m.chat, txt, m, {
    //     contextInfo: { mentionedJid: globalBlacklist },
    //   });
    //   break;
  }
};

handler.before = async function (m, { conn, isBotAdmin }) {
  if (!m.isGroup || m.fromMe || m.isZapo ) return;

  let globalBlacklist = global.db.data.globalBlacklist || [];
  if (globalBlacklist.length === 0) return;

  let senderNumber = m.sender.split(":")[0].split("@")[0];
  let isBlacklisted = globalBlacklist.some(
    (id) => id.split("@")[0] === senderNumber,
  );

  if (isBlacklisted) {
    if (!isBotAdmin) return;
    try {
      await conn.sendMessage(m.chat, {
        text: `🚨 *Akses Ditolak*\nPengguna @${senderNumber} berada dalam daftar blacklist global dan otomatis dikeluarkan.`,
        mentions: [m.sender],
      });
      await conn.groupParticipantsUpdate(m.chat, [m.sender], "remove");
    } catch (e) {
      console.error(
        "[Before-Blacklist] Gagal mengeluarkan user blacklist:",
        e.message,
      );
    }
  }
  return;
};

handler.help = ["blacklist", "unblacklist"];
handler.tags = ["group"];
handler.command = ["blacklist", "unblacklist"];

handler.owner = true;
handler.group = true;

export default handler;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
