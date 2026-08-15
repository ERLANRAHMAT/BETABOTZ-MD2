
import fetch from 'node-fetch';

let timeout = 100000;
let poin = 10000;

let handler: WaPlugin = async (m, { conn, usedPrefix }) => {
  try {
    conn.tebakbuah = conn.tebakbuah ? conn.tebakbuah : {};
    let id = m.chat;
    if (id in conn.tebakbuah) {
      await conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakbuah[id][0]);
      return;
    }

    let json;
    try {
      let src = await (await fetch(`https://api.betabotz.eu.org/api/game/tebakbuah?apikey=${lann}`)).json();
      json = src;
    } catch (e) {
      console.log(e);
      throw e;
    }

    if (!json || !json.img || !json.jawaban) throw new Error('Format data tebakbuah tidak valid dari API.');

    let caption = `
≡ _GAME TEBAK BUAH_

┌─⊷ *SOAL*
▢ Deskripsi Buah: *${json.deskripsi || '-'}*
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Bonus: ${poin} money
▢ Ketik ${usedPrefix}tbau untuk clue jawaban
▢ *REPLAY* pesan ini untuk\nmenjawab
└──────────────
`.trim();

    conn.tebakbuah[id] = [
      await conn.sendMessage(m.chat, { image: { url: json.img }, caption: caption }, { quoted: m }),
      json, 
      poin,
      setTimeout(() => {
        if (conn.tebakbuah[id]) {
          conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakbuah[id][0]);
          delete conn.tebakbuah[id];
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

handler.help = ['tebakbuah'];
handler.tags = ['game'];
handler.command = /^tebakbuah/i;
handler.limit = false;
handler.group = true;

export default handler;
