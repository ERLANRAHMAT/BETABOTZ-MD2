import fetch from 'node-fetch';

let timeout = 100000;
let poin = 10000;

let handler = async (m, { conn, usedPrefix }) => {
  try {
    conn.tebakkpop = conn.tebakkpop ? conn.tebakkpop : {};
    let id = m.chat;
    if (id in conn.tebakkpop) {
      await conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakkpop[id][0]);
      return;
    }

    let json;
    try {
      let src = await (await fetch(`https://api.betabotz.eu.org/api/game/tebakpop?apikey=${lann}`)).json();
      json = src;
    } catch (e) {
      console.log(e);
      throw e;
    }

    if (!json || !json.jawaban) throw new Error('Format data tebakkpop tidak valid dari API.');

    let caption = `
≡ _GAME TEBAK KPOP_

┌─⊷ *SOAL*
▢ Penjelasan: *${json.deskripsi}*
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Bonus: ${poin} money
▢ Ketik ${usedPrefix}kpp untuk clue jawaban
▢ *REPLAY* pesan ini untuk\nmenjawab
└──────────────
`.trim();

    conn.tebakkpop[id] = [
      await conn.sendMessage(m.chat, { image: { url: json.img }, caption: caption }, { quoted: m }),
      json, 
      poin,
      setTimeout(() => {
        if (conn.tebakkpop[id]) {
          conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakkpop[id][0]);
          delete conn.tebakkpop[id];
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

handler.help = ['tebakkpop'];
handler.tags = ['game'];
handler.command = /^tebakkpop/i;
handler.limit = false;
handler.group = true;

export default handler;