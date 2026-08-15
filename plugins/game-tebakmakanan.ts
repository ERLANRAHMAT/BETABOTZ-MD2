
import fetch from 'node-fetch';

let timeout = 100000;
let poin = 10000;

let handler: WaPlugin = async (m, { conn, usedPrefix }) => {
  try {
    conn.tebakmakanan = conn.tebakmakanan ? conn.tebakmakanan : {};
    let id = m.chat;
    if (id in conn.tebakmakanan) {
      await conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakmakanan[id][0]);
      return;
    }

    let json;
    try {
      let src = await (await fetch(`https://api.betabotz.eu.org/api/game/tebakmakanan?apikey=${lann}`)).json();
      json = src;
    } catch (e) {
      console.log(e);
      throw e;
    }

    if (!json || !json.img || !json.jawaban) throw new Error('Format data tebakmakanan tidak valid dari API.');

    let caption = `
≡ _GAME TEBAK MAKANAN_

┌─⊷ *SOAL*
▢ Penjelasan: *${json.deskripsi || '-'}*
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Bonus: ${poin} money
▢ Ketik ${usedPrefix}tebma untuk clue jawaban
▢ *REPLAY* pesan ini untuk\nmenjawab
└──────────────
`.trim();

    conn.tebakmakanan[id] = [
      await conn.sendMessage(m.chat, { image: { url: json.img }, caption: caption }, { quoted: m }),
      json, 
      poin,
      setTimeout(() => {
        if (conn.tebakmakanan[id]) {
          conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakmakanan[id][0]);
          delete conn.tebakmakanan[id];
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

handler.help = ['tebakmakanan'];
handler.tags = ['game'];
handler.command = /^tebakmakanan/i;
handler.limit = false;
handler.group = true;

export default handler;
