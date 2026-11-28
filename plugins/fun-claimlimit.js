// Pengaturan awal:
// mode 'acak'    -> limit didapat acak antara min–max
// mode 'default' -> limit didapat tetap sebesar amount
// cooldown       -> jeda antar claim (jam)
const DEFAULT_CLAIM = { mode: 'acak', min: 5, max: 20, amount: 10, cooldown: 24 };

const msToTime = (ms) => {
  const h = Math.floor(ms / 3600000);
  const mnt = Math.floor(ms / 60000) % 60;
  const s = Math.floor(ms / 1000) % 60;
  return `${h} jam ${mnt} menit ${s} detik`;
};

// Ambil pengaturan claim dari database, isi bagian yang belum ada dengan default
const getConfig = () => {
  const db = global.db.data;
  const c = (db.claimLimit = db.claimLimit || {});
  if (c.mode !== 'acak' && c.mode !== 'default') {
    // data format lama: min == max berarti jumlah tetap
    c.mode = typeof c.min === 'number' && c.min === c.max ? 'default' : DEFAULT_CLAIM.mode;
  }
  if (typeof c.min !== 'number') c.min = DEFAULT_CLAIM.min;
  if (typeof c.max !== 'number') c.max = DEFAULT_CLAIM.max;
  if (typeof c.amount !== 'number') c.amount = c.min === c.max ? c.min : DEFAULT_CLAIM.amount;
  if (typeof c.cooldown !== 'number') c.cooldown = DEFAULT_CLAIM.cooldown;
  return c;
};

const describe = (c) =>
  c.mode === 'acak' ? `acak ${c.min}–${c.max} limit` : `tetap ${c.amount} limit`;

const toInt = (v) => {
  const n = parseInt(v);
  return isNaN(n) || n < 1 ? null : n;
};

let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
  const cfg = getConfig();

  // ===== SETCLAIM (khusus owner) =====
  if (/^setclaim$/i.test(command)) {
    if (!isOwner) {
      global.dfail('owner', m, conn);
      throw false;
    }

    const mode = (args[0] || '').toLowerCase();

    // .setclaim -> lihat pengaturan + cara pakai
    if (!mode) {
      return m.reply(
`Claim saat ini: *${describe(cfg)}* tiap *${cfg.cooldown} jam*

*Format:* ${usedPrefix}setclaim <opsi> [nilai]

*Opsi:*
• acak [min] [max] → limit didapat acak
• default [jumlah] → limit didapat tetap
• jam <jam> → jeda antar claim

*Contoh:*
${usedPrefix}setclaim acak 5 20 → acak 5 sampai 20 limit
${usedPrefix}setclaim acak → pakai mode acak (range sekarang ${cfg.min}–${cfg.max})
${usedPrefix}setclaim default 10 → tetap 10 limit
${usedPrefix}setclaim default → pakai jumlah tetap (sekarang ${cfg.amount})
${usedPrefix}setclaim jam 12 → jeda claim 12 jam`
      );
    }

    // .setclaim acak [min] [max]
    if (mode === 'acak') {
      if (args[1] !== undefined) {
        let min = toInt(args[1]);
        let max = args[2] !== undefined ? toInt(args[2]) : null;
        if (min === null || max === null) {
          return m.reply(`Isi dua angka lebih dari 0.\nContoh: ${usedPrefix}setclaim acak 5 20`);
        }
        if (min > max) [min, max] = [max, min];
        cfg.min = min;
        cfg.max = max;
      }
      cfg.mode = 'acak';
      return m.reply(`✅ Claim diatur: *${describe(cfg)}* tiap *${cfg.cooldown} jam*`);
    }

    // .setclaim default [jumlah]
    if (mode === 'default') {
      if (args[1] !== undefined) {
        const jumlah = toInt(args[1]);
        if (jumlah === null) {
          return m.reply(`Jumlah harus angka lebih dari 0.\nContoh: ${usedPrefix}setclaim default 10`);
        }
        cfg.amount = jumlah;
      }
      cfg.mode = 'default';
      return m.reply(`✅ Claim diatur: *${describe(cfg)}* tiap *${cfg.cooldown} jam*`);
    }

    // .setclaim jam <jam>
    if (mode === 'jam') {
      const jam = parseFloat(args[1]);
      if (isNaN(jam) || jam <= 0) {
        return m.reply(`Jeda harus angka lebih dari 0.\nContoh: ${usedPrefix}setclaim jam 12`);
      }
      cfg.cooldown = jam;
      return m.reply(`✅ Jeda claim diatur: *${cfg.cooldown} jam*\nClaim saat ini: *${describe(cfg)}*`);
    }

    return m.reply(`Opsi tidak dikenal. Pilih: *acak*, *default*, atau *jam*.\nContoh: ${usedPrefix}setclaim acak 5 20\nKetik ${usedPrefix}setclaim untuk lihat semua cara pakai.`);
  }

  // ===== RESETCLAIM @tag (khusus owner) =====
  if (/^resetclaim$/i.test(command)) {
    if (!isOwner) {
      global.dfail('owner', m, conn);
      throw false;
    }

    // Target: user yang di-tag, atau pengirim pesan yang di-reply
    const who = (m.mentionedJid && m.mentionedJid[0]) || (m.quoted && m.quoted.sender);
    if (!who) return m.reply(`Tag atau reply user yang mau di-reset.\nContoh: ${usedPrefix}resetclaim @user`);

    const target = global.db.data.users[who];
    if (!target) return m.reply('User itu belum terdaftar di database.');

    const tag = `@${who.split('@')[0]}`;
    if (!target.lastClaimLimit) {
      return conn.sendMessage(m.chat, {
        text: `${tag} belum pernah claim, jadi sudah bisa claim kapan saja.`,
        mentions: [who]
      }, { quoted: m });
    }

    target.lastClaimLimit = 0;
    return conn.sendMessage(m.chat, {
      text: `✅ Claim ${tag} sudah di-reset. Dia bisa claim lagi sekarang.\n_(Limit yang sudah didapat tidak berubah)_`,
      mentions: [who]
    }, { quoted: m });
  }

  // ===== CLAIMLIMIT =====
  const user = global.db.data.users[m.sender];
  if (!user) return m.reply('Data kamu belum terdaftar.');

  const now = Date.now();
  const cooldownMs = cfg.cooldown * 3600000;
  const last = user.lastClaimLimit || 0;

  if (now - last < cooldownMs) {
    return m.reply(`⏳ Kamu sudah claim. Claim lagi dalam *${msToTime(last + cooldownMs - now)}*`);
  }

  const dapat = cfg.mode === 'acak'
    ? Math.floor(Math.random() * (cfg.max - cfg.min + 1)) + cfg.min
    : cfg.amount;

  user.limit = (user.limit || 0) + dapat;
  user.lastClaimLimit = now;

  return m.reply(`🎁 Kamu dapat *${dapat} limit*!\nTotal limit kamu: *${user.limit}*`);
};

handler.help = ['claimlimit', 'setclaim <acak|default|jam>', 'resetclaim @tag'];
handler.tags = ['xp'];
handler.command = /^(claimlimit|claim|setclaim|resetclaim)$/i;

export default handler;