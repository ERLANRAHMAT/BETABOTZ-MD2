
import fetch from 'node-fetch';

let timeout = 100000;
let poin = 10000;

let handler: WaPlugin = async (m, { conn, usedPrefix }) => {
  try {
    conn.tebakff = conn.tebakff ? conn.tebakff : {};
    let id = m.chat;
    if (id in conn.tebakff) {
      await conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakff[id][0]);
      return;
    }

    let json;
    try {
      let src = await (await fetch(`https://api.betabotz.eu.org/api/game/tebakepep?apikey=${lann}`)).json();
      json = src;
    } catch (e) {
      console.log(e);
      throw e;
    }

    if (!json || !json.jawaban) throw new Error('Format data tebakff tidak valid dari API.');

    let caption = `
≡ _GAME TEBAK FF_

┌─⊷ *SOAL*
▢ Penjelasan: *${json.deskripsi}*
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Bonus: ${poin} money
▢ Ketik ${usedPrefix}tbff untuk clue jawaban
▢ *REPLAY* pesan ini untuk\nmenjawab
└──────────────
`.trim();

    conn.tebakff[id] = [
      await conn.sendMessage(m.chat, { image: { url: json.img }, caption: caption }, { quoted: m }),
      json, 
      poin,
      setTimeout(() => {
        if (conn.tebakff[id]) {
          conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakff[id][0]);
          delete conn.tebakff[id];
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

handler.help = ['tebakff'];
handler.tags = ['game'];
handler.command = /^tebakff/i;
handler.limit = false;
handler.group = true;

export default handler;
