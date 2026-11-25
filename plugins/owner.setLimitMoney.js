let handler = async (m, { conn, text, usedPrefix, command }) => {
  const isMoney = /^setmoney$/i.test(command);
  const field = isMoney ? 'money' : 'limit';
  const label = isMoney ? 'Money' : 'Limit';

  const cleanText = (text || '').replace(/@\d+/g, '').trim();
  const numMatch = cleanText.match(/-?\d+/);
  const amount = numMatch ? parseInt(numMatch[0], 10) : NaN;

  let who =
    m.mentionedJid?.[0] ||
    m.quoted?.sender ||
    (() => {
      const phoneMatch = (text || '').match(/(?:62|0)8\d{7,12}/);
      if (!phoneMatch) return null;
      let num = phoneMatch[0];
      if (num.startsWith('0')) num = '62' + num.slice(1);
      return num + '@s.whatsapp.net';
    })();

  if (!who || isNaN(amount) || amount < 0) {
    return m.reply(
      `⚠️ *Format salah!*\n\n` +
      `📌 *Cara Pakai:*\n` +
      `• \`${usedPrefix + command} @user <jumlah>\`\n` +
      `• Reply pesan user dengan \`${usedPrefix + command} <jumlah>\`\n\n` +
      `📌 *Contoh:*\n` +
      `\`${usedPrefix + command} @628123456789 5000\``
    );
  }

  if (who.endsWith('@lid') && typeof conn.getJid === 'function') {
    who = await conn.getJid(who, m.chat).catch(() => who);
  } else if (typeof conn.decodeJid === 'function') {
    who = conn.decodeJid(who);
  }

  if (!global.db.data.users) global.db.data.users = {};
  if (!global.db.data.users[who]) global.db.data.users[who] = {};

  global.db.data.users[who][field] = amount;

  const caption =
    `✅ *${label} Berhasil Diatur!*\n\n` +
    `• *User:* @${who.split('@')[0]}\n` +
    `• *${label} Baru:* ${amount.toLocaleString('id-ID')}`;

  await conn.sendMessage(
    m.chat,
    { text: caption, mentions: [who] },
    { quoted: m }
  );
};

handler.help = ['setmoney @user <jumlah>', 'setlimit @user <jumlah>'];
handler.tags = ['owner'];
handler.command = /^(setmoney|setlimit)$/i;
handler.owner = true;

export default handler;