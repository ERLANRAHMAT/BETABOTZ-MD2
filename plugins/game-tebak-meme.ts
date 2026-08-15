
import fetch from 'node-fetch';

let timeout = 100000;
let poin = 10000;

let handler: WaPlugin = async (m, { conn, usedPrefix }) => {
  try {
    conn.tebakmeme = conn.tebakmeme ? conn.tebakmeme : {};
    let id = m.chat;
    if (id in conn.tebakmeme) {
      await conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakmeme[id][0]);
      return;
    }

    let json;
    try {
      let src = await (await fetch(`https://api.betabotz.eu.org/api/game/tebakmeme?apikey=${lann}`)).json();
      json = src;
    } catch (e) {
      console.log(e);
      throw e;
    }

    if (!json || (!json.Jawaban && !json.jawaban)) throw new Error('Format data tebakmeme tidak valid dari API.');

    let jawaban = json.Jawaban || json.jawaban;
    let hint = json.Hint || json.hint || '-';
    let imgFilter = json.imgFilter || json.img || json.Img;
    let imgOriginal = json.Img || json.img || json.imgFilter;

    let caption = `
≡ _GAME TEBAK MEME_

┌─⊷ *SOAL*
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Bonus: ${poin} money
▢ Hint: ${hint}
▢ *REPLAY* pesan ini untuk\nmenjawab
└──────────────
`.trim();

    let caption2 = `Waktu habis!\nJawabannya adalah *${jawaban}*`;

    conn.tebakmeme[id] = [
      await conn.sendMessage(m.chat, { image: { url: imgFilter }, caption: caption }, { quoted: m }),
      json, 
      poin,
      setTimeout(() => {
        if (conn.tebakmeme[id]) {
          conn.sendMessage(m.chat, { image: { url: imgOriginal }, caption: caption2 }, { quoted: conn.tebakmeme[id][0] });
          delete conn.tebakmeme[id];
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

handler.help = ['tebakmeme'];
handler.tags = ['game'];
handler.command = /^tebakmeme/i;
handler.limit = false;
handler.group = true;

export default handler;
