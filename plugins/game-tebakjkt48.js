import fetch from 'node-fetch';

let timeout = 100000;
let poin = 10000;

let handler = async (m, { conn, usedPrefix }) => {
  try {
    conn.tebakjkt = conn.tebakjkt ? conn.tebakjkt : {};
    let id = m.chat;
    if (id in conn.tebakjkt) {
      await conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakjkt[id][0]);
      return;
    }

    let json;
    try {
      let src = await (await fetch(`https://api.betabotz.eu.org/api/game/tebakjkt48?apikey=${lann}`)).json();
      json = src;
    } catch (e) {
      console.log(e);
      throw e;
    }

    if (!json || !json.img || !json.jawaban) throw new Error('Format data tebakjkt48 tidak valid dari API.');

    let caption = `
≡ _GAME TEBAK JKT48_

┌─⊷ *SOAL*
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Bonus: ${poin} money
▢ Ketik ${usedPrefix}jkcu untuk clue jawaban
▢ *REPLAY* pesan ini untuk\nmenjawab
└──────────────
`.trim();

    conn.tebakjkt[id] = [
      await conn.sendMessage(m.chat, { image: { url: json.img }, caption: caption }, { quoted: m }),
      json, 
      poin,
      setTimeout(() => {
        if (conn.tebakjkt[id]) {
          conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakjkt[id][0]);
          delete conn.tebakjkt[id];
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

handler.help = ['tebakjkt'];
handler.tags = ['game'];
handler.command = /^tebakjkt/i;
handler.limit = false;
handler.group = true;

export default handler;