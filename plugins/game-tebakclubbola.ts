
import fetch from 'node-fetch';

let timeout = 100000;
let poin = 10000;

let handler: WaPlugin = async (m, { conn, usedPrefix }) => {
  try {
    conn.tebakclub = conn.tebakclub ? conn.tebakclub : {};
    let id = m.chat;
    if (id in conn.tebakclub) {
      await conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakclub[id][0]);
      return;
    }

    let json;
    try {
      let src = await (await fetch(`https://api.betabotz.eu.org/api/game/tebakclubbola?apikey=${lann}`)).json();
      json = src;
    } catch (e) {
      console.log(e);
      throw e;
    }

    if (!json || !json.logo || !json.jawaban) throw new Error('Format data tebakclub tidak valid dari API.');

    let caption = `
≡ _GAME TEBAK CLUB BOLA_

┌─⊷ *SOAL*
▢ Deskripsi Club: *${json.deskripsi || '-'}*
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Bonus: ${poin} money
▢ Ketik ${usedPrefix}tbcl untuk clue jawaban
▢ *REPLAY* pesan ini untuk\nmenjawab
└──────────────
`.trim();

    conn.tebakclub[id] = [
      await conn.sendMessage(m.chat, { image: { url: json.logo }, caption: caption }, { quoted: m }),
      json, 
      poin,
      setTimeout(() => {
        if (conn.tebakclub[id]) {
          conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakclub[id][0]);
          delete conn.tebakclub[id];
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

handler.help = ['tebakclub'];
handler.tags = ['game'];
handler.command = /^tebakclub/i;
handler.limit = false;
handler.group = true;

export default handler;
