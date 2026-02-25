let handler = (m) => m;

handler.before = async function (m) {
  let user = global.db.data.users[m.sender];
  if (user?.afk > -1) {
    await m.reply(
      `
Kamu berhenti AFK${user.afkReason ? " setelah " + user.afkReason : ""}
Selama ${clockString(new Date() - user.afk)}
        `.trim(),
    );
    user.afk = -1;
    user.afkReason = "";
  }
  let jids = [
    ...(m.mentionedJid || []).map((jid) => this.getJid?.(jid) || jid),
    m.quoted ? this.getJid?.(m.quoted.sender) || m.quoted.sender : null,
  ].filter(Boolean);

  jids = [...new Set(jids)];

  for (let jid of jids) {
    let normalizedJid = this.getJid?.(jid) || jid;
    let targetUser = global.db.data.users[normalizedJid];

    if (!targetUser) continue;
    let afkTime = targetUser.afk;
    if (!afkTime || afkTime < 0) continue;

    let reason = targetUser.afkReason || "";
    await m.reply(
      `
Jangan tag dia!
Dia sedang AFK ${reason ? "dengan alasan " + reason : "tanpa alasan"}
Selama ${clockString(new Date() - afkTime)}
        `.trim(),
    );
  }

  return true;
};

module.exports = handler;

function clockString(ms) {
  let h = isNaN(ms) ? "--" : Math.floor(ms / 3600000);
  let m = isNaN(ms) ? "--" : Math.floor((ms % 3600000) / 60000);
  let s = isNaN(ms) ? "--" : Math.floor((ms % 60000) / 1000);
  return [h, m, s].map((v) => v.toString().padStart(2, "0")).join(":");
}
