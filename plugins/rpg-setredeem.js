let handler = async (m, { conn, participants, text, usedPrefix, command }) => {

  db.data.redeem = db.data.redeem || { 
    code: '', 
    expires: 0,
    reward: {
      limit: 30,
      exp: 2500,
      money: 3500000
    }
  };

  if (!text) {
    const usage = `Contoh penggunaan:\n${usedPrefix + command} <kode>|<waktu_expired>|<hadiah>\n\nFormat hadiah: limit|exp|money\n\nContoh:\n${usedPrefix + command} FreeCode|24h|30|2500|3500000\n${usedPrefix + command} Premium|7d|50|5000|5000000`;
    return m.reply(usage);
  }

  // Nilai Results Sementara 
  const args = text.split('|').map(arg => arg.trim());
  const redeemCode = args[0];
  const expireTime = args[1];
  const rewardLimit = parseInt(args[2]) || 30;
  const rewardExp = parseInt(args[3]) || 2500;
  const rewardMoney = parseInt(args[4]) || 3500000;

  if (!redeemCode) {
    return m.reply('Harap masukkan kode redeem!');
  }

  let expirationHours = 24; // Default 24 hours if no time provided
  let expirationText = '24 jam';

  if (expireTime) {
    const timeMatch = expireTime.match(/^(\d+)([hdm])$/i);
    if (timeMatch) {
      const amount = parseInt(timeMatch[1]);
      const unit = timeMatch[2].toLowerCase();
      
      if (unit === 'h') {
        expirationHours = amount;
        expirationText = `${amount} jam`;
      } else if (unit === 'd') {
        expirationHours = amount * 24;
        expirationText = `${amount} hari`;
      } else if (unit === 'm') {
        expirationHours = amount * 24 * 30;
        expirationText = `${amount} bulan`;
      }
    } else {
      return m.reply('Format waktu salah! Gunakan format seperti 24h, 7d, atau 1m');
    }
  }

  const currentDate = new Date();
  const expirationDate = new Date(currentDate.getTime() + expirationHours * 60 * 60 * 1000);
  const formattedExpirationDate = expirationDate.toLocaleString('id-ID', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric', 
    hour: 'numeric', 
    minute: 'numeric' 
  });

  db.data.redeem = {
    code: redeemCode,
    expires: expirationDate.getTime(),
    reward: {
      limit: rewardLimit,
      exp: rewardExp,
      money: rewardMoney
    }
  };

  const replyMessage = `============================
*REDEEM CODE TELAH DIBUAT*
  
🎟️ KODE: ${redeemCode}
⏳ EXPIRED: ${formattedExpirationDate} (${expirationText})
  
🎁 HADIAH:
- Limit: ${rewardLimit}
- Exp: ${rewardExp}
- Money: ${rewardMoney}

CLAIM DENGAN CARA:
> .claimredeem ${redeemCode}
============================`;

  m.reply(replyMessage);

  const q = {
    "key": {
      "remoteJid": "status@broadcast",
      "participant": "0@s.whatsapp.net",
      "fromMe": false,
      "id": ""
    },
    "message": {
      "conversation": "Redeem code baru telah dibuat! 👑"
    }
  };

  let groups = Object.entries(conn.chats).filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isGroup && !chat.read_only && !chat.announce).map(v => v[0]);

  for (let id of groups) {
    let participantIds = participants.map(a => a.id);
    await conn.reply(id, replyMessage, q, { contextInfo: { mentionedJid: participantIds } });
  }
};

handler.help = ["sredeem <kode>|<waktu>|<limit>|<exp>|<money>"];
handler.tags = ["owner"];
handler.command = ["sredeem"];
handler.owner = true;

module.exports = handler;
