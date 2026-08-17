let handler = async (m, { conn, participants, isOwner, isAdmin }) => {
  if (m.isZapo) return;

  if (!(isAdmin || isOwner)) {
    global.dfail("admin", m, conn);
    return; 
  }

  let ownerGroup = m.chat.split`-`[0] + "@s.whatsapp.net";
  let botJid = conn.user.id.split(":")[0] + "@s.whatsapp.net";

  let targets = [];

  // ==========================================
  // KICK VIA REPLY CHAT
  // ==========================================
  if (m.quoted) {
    let quotedSender = m.quoted.sender.split(":")[0] + "@s.whatsapp.net";
    if (quotedSender === ownerGroup || quotedSender === botJid) {
      throw "Gagal! Tidak bisa mengeluarkan Owner Grup atau Bot sendiri.";
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
    throw `Format salah!\n\n• Tag user: *.kick @user*\n• Reply chat target`;
  }

  try {
    for (let user of targets) {
      if (user.endsWith("@s.whatsapp.net")) {
        await conn.groupParticipantsUpdate(m.chat, [user], "remove");
        await delay(500);
      }
    }
  } catch (e) {
    if (e !== false) {
      console.log(e);
      throw e;
    }
  }
};

handler.help = ['kick @user'];
handler.tags = ['group'];
handler.command = /^(kic?k|remove|tendang|\-)$/i;
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));