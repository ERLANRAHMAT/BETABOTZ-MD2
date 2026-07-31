import fetch from 'node-fetch';

let timeout = 100000;
let poin = 1000;

let handler = async (m, { conn, usedPrefix }) => {
  try {
    conn.tebakml = conn.tebakml ? conn.tebakml : {};
    let id = m.chat;
    if (id in conn.tebakml) {
      await conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakml[id][0]);
      return;
    }

    let json;
    try {
      let src = await (await fetch(`https://api.betabotz.eu.org/api/game/tebakheroml?apikey=${lann}`)).json();
      json = src;
    } catch (e) {
      console.log(e);
      throw e;
    }

    if (!json || !json.fullimg || !json.jawaban) throw new Error('Format data tebakml tidak valid dari API.');

    let caption = `
≡ _TEBAK HERO ML_

┌─⊷ *SOAL*
▢ Deskripsi: *${json.deskripsi || '-'}*
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Bonus: ${poin} money
▢ Ketik ${usedPrefix}tml untuk clue jawaban
▢ *REPLAY* pesan ini untuk\nmenjawab
└──────────────
`.trim();

    conn.tebakml[id] = [
      await conn.sendMessage(m.chat, { image: { url: json.fullimg }, caption: caption }, { quoted: m }),
      json, 
      poin,
      setTimeout(() => {
        if (conn.tebakml[id]) {
          conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakml[id][0]);
          delete conn.tebakml[id];
        }
      }, timeout)
    ];
  } catch (e) {
    if (e !== false) {
      console.log(e);
      throw e;
    }
  }
};

handler.help = ['tebakml'];
handler.tags = ['game'];
handler.command = /^tebakml/i;
handler.limit = false;
handler.group = true;

export default handler;