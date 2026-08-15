
import fetch from 'node-fetch';

let timeout = 100000;
let poin = 10000;

let handler: WaPlugin = async (m, { conn, usedPrefix }) => {
  try {
    conn.tebakgenshin = conn.tebakgenshin ? conn.tebakgenshin : {};
    let id = m.chat;
    if (id in conn.tebakgenshin) {
      await conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakgenshin[id][0]);
      return;
    }

    let json;
    try {
      let src = await (await fetch(`https://api.betabotz.eu.org/api/game/tebak-genshin?apikey=${lann}`)).json();
      json = src;
    } catch (e) {
      console.log(e);
      throw e;
    }

    if (!json || !json.jawaban) throw new Error('Format data tebakgenshin tidak valid dari API.');

    let caption = `
≡ _GAME TEBAK GENSHIN_

┌─⊷ *SOAL*
▢ Penjelasan: *${json.deskripsi}*
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Bonus: ${poin} money
▢ Ketik ${usedPrefix}gca untuk clue jawaban
▢ *REPLAY* pesan ini untuk\nmenjawab
└──────────────
`.trim();

    conn.tebakgenshin[id] = [
      await conn.sendMessage(m.chat, { image: { url: json.img }, caption: caption }, { quoted: m }),
      json, 
      poin,
      setTimeout(() => {
        if (conn.tebakgenshin[id]) {
          conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakgenshin[id][0]);
          delete conn.tebakgenshin[id];
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

handler.help = ['tebakgenshin'];
handler.tags = ['game'];
handler.command = /^tebakgenshin/i;
handler.limit = false;
handler.group = true;

export default handler;
