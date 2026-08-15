// @ts-nocheck
// Converted from plugins-esm - automated
import fetch from 'node-fetch';

let timeout = 100000;
let poin = 10000;

let handler: WaPlugin = async (m, { conn, usedPrefix }) => {
  try {
    conn.tebaktokoh = conn.tebaktokoh ? conn.tebaktokoh : {};
    let id = m.chat;
    if (id in conn.tebaktokoh) {
      await conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebaktokoh[id][0]);
      return;
    }

    let json;
    try {
      let src = await (await fetch(`https://api.betabotz.eu.org/api/game/tebaknamatokoh?apikey=${lann}`)).json();
      json = src;
    } catch (e) {
      console.log(e);
      throw e;
    }

    if (!json || !json.jawaban) throw new Error('Format data tebaktokoh tidak valid dari API.');

    let caption = `
≡ _GAME TEBAK TOKOH_ ≡ 
${json.soal}

┌─⊷ *SOAL*
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Bonus: ${poin} money
▢ Ketik ${usedPrefix}tbok untuk clue jawaban
▢ *REPLAY* pesan ini untuk\nmenjawab
└──────────────
`.trim();

    conn.tebaktokoh[id] = [
      await conn.sendMessage(m.chat, { image: { url: json.img }, caption: caption }, { quoted: m }),
      json, 
      poin,
      setTimeout(() => {
        if (conn.tebaktokoh[id]) {
          conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebaktokoh[id][0]);
          delete conn.tebaktokoh[id];
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

handler.help = ['tebaktokoh'];
handler.tags = ['game'];
handler.command = /^tebaktokoh/i;
handler.limit = false;
handler.group = true;

export default handler;
