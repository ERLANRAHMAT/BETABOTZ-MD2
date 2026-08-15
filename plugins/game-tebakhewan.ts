// @ts-nocheck
// Converted from plugins-esm - automated
import fetch from 'node-fetch';

let timeout = 100000;
let poin = 10000;

let handler: WaPlugin = async (m, { conn, usedPrefix }) => {
  try {
    conn.tebakhewan = conn.tebakhewan ? conn.tebakhewan : {};
    let id = m.chat;
    if (id in conn.tebakhewan) {
      await conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakhewan[id][0]);
      return;
    }

    let json;
    try {
      let src = await (await fetch(`https://api.betabotz.eu.org/api/game/tebakhewan?apikey=${lann}`)).json();
      json = src;
    } catch (e) {
      console.log(e);
      throw e;
    }

    if (!json || !json.img || !json.jawaban) throw new Error('Format data tebakhewan tidak valid dari API.');

    let caption = `
≡ _GAME TEBAK HEWAN_

┌─⊷ *SOAL*
▢ Deskripsi HEWAN: *${json.deskripsi || '-'}*
▢ Clue: *${json.clue || '-'}*
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Bonus: ${poin} money
▢ Ketik ${usedPrefix}hhew untuk clue jawaban
▢ *REPLAY* pesan ini untuk\nmenjawab
└──────────────
`.trim();

    conn.tebakhewan[id] = [
      await conn.sendMessage(m.chat, { image: { url: json.img }, caption: caption }, { quoted: m }),
      json, 
      poin,
      setTimeout(() => {
        if (conn.tebakhewan[id]) {
          conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakhewan[id][0]);
          delete conn.tebakhewan[id];
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

handler.help = ['tebakhewan'];
handler.tags = ['game'];
handler.command = /^tebakhewan/i;
handler.limit = false;
handler.group = true;

export default handler;
