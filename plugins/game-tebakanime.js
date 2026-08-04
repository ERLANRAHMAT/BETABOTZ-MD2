import fetch from 'node-fetch';

let timeout = 100000;
let poin = 10000;

let handler = async (m, { conn, usedPrefix }) => {
  try {
    conn.tebakanime = conn.tebakanime ? conn.tebakanime : {};
    let id = m.chat;
    if (id in conn.tebakanime) {
      await conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakanime[id][0]);
      return;
    }

    let json;
    try {
      let src = await (await fetch(`https://api.betabotz.eu.org/api/game/tebakanime?apikey=${lann}`)).json();
      json = src;
    } catch (e) {
      console.log(e);
      throw e;
    }

    if (!json || !json.img || !json.jawaban) throw new Error('Format data tebakanime tidak valid dari API.');

    let caption = `
≡ _GAME TEBAK ANIME_

┌─⊷ *SOAL*
▢ Deskripsi Anime: *${json.deskripsi || '-'}*
▢ Tahun rilis: *${json['tahun rilis'] || 'Tidak diketahui'}*
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Bonus: ${poin} money
▢ Ketik ${usedPrefix}tbam untuk clue jawaban
▢ *REPLAY* pesan ini untuk\nmenjawab
└──────────────
`.trim();

    conn.tebakanime[id] = [
      await conn.sendMessage(m.chat, { image: { url: json.img }, caption: caption }, { quoted: m }),
      json, 
      poin,
      setTimeout(() => {
        if (conn.tebakanime[id]) {
          conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakanime[id][0]);
          delete conn.tebakanime[id];
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

handler.help = ['tebakanime'];
handler.tags = ['game'];
handler.command = /^tebakanime/i;
handler.limit = false;
handler.group = true;

export default handler;