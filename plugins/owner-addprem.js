const { loadBaileys } = require('../baileys-loader.mjs')
let baileys

let handler = async (m, { conn, text, usedPrefix }) => {
  if (!baileys) baileys = await loadBaileys();
  const { MessageType } = baileys;
  function no(number){
    return number.replace(/\s/g, '').replace(/([@+-])/g, '');
  }

  var hl = [];
  hl[0] = text.split('|')[0];
  hl[0] = no(hl[0]) + "@s.whatsapp.net";
  hl[1] = text.split('|')[1];
  
  if (!text) {
    return conn.reply(m.chat, `*『 G A G A L 』*\n\n• ${usedPrefix}prem @tag/nomor|days\n*Example:* ${usedPrefix}prem 6285764068784|60`, m);
  }
  
  if (typeof db.data.users[hl[0]] === 'undefined') throw 'Pengguna Belum Masuk DataBase';
  
  var jumlahHari = 86400000 * hl[1];
  var now = new Date() * 1;
  
  db.data.users[hl[0]].premium = true;
  
  if (now < db.data.users[hl[0]].premiumTime) {
    db.data.users[hl[0]].premiumTime += jumlahHari;
  } else {
    db.data.users[hl[0]].premiumTime = now + jumlahHari;
  }
  
  conn.reply(m.chat, `*『 S U K S E S 』*\n\nBerhasil menambahkan akses premium kepada *@${hl[0].split('@')[0]}* selama *${hl[1]} hari*.`, m, { contextInfo: { mentionedJid: [hl[0]] } });
  conn.reply(hl[0], `*『 I N F O  P R E M I U M 』*\n\nKamu telah ditambah ke akses premium selama *${hl[1]} hari*.`, m, { contextInfo: { mentionedJid: [hl[0]] } });
};

handler.help = ['addprem *@tag|days*'];
handler.tags = ['owner'];
handler.command = /^(addprem|prem)$/i;
handler.owner = true;
handler.fail = null;

module.exports = handler;


// hapis skibidiiii