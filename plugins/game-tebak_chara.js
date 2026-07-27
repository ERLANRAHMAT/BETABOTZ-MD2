import fetch from 'node-fetch';

let timeout = 100000;
let poin = 10000;

let handler = async (m, { conn, usedPrefix }) => {
  try {
    conn.tebakchara = conn.tebakchara ? conn.tebakchara : {};
    let id = m.chat;
    if (id in conn.tebakchara) {
      await conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakchara[id][0]);
      return;
    }

    let json;
    try {
      let src = await (await fetch(`https://api.betabotz.eu.org/api/game/tebakchara?apikey=${lann}`)).json();
      json = src;
    } catch (e) {
      console.log(e);
      throw e;
    }

    if (!json || !json.result || !json.result.name) throw new Error('Format data tebakchara tidak valid dari API.');

    let caption = `
≡ _GAME TEBAK KARAKTER_

┌─⊷ *SOAL*
▢ Penjelasan: *${json.result.desc}*
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Bonus: ${poin} money
▢ Ketik ${usedPrefix}chrd untuk clue jawaban
▢ *REPLAY* pesan ini untuk\nmenjawab
└──────────────
`.trim();

    conn.tebakchara[id] = [
      await conn.sendMessage(m.chat, { image: { url: json.result.image }, caption: caption }, { quoted: m }),
      json, 
      poin,
      setTimeout(() => {
        if (conn.tebakchara[id]) {
          conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.result.name}*`, conn.tebakchara[id][0]);
          delete conn.tebakchara[id];
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

handler.help = ['tebakchara'];
handler.tags = ['game'];
handler.command = /^tebakchara/i;
handler.limit = false;
handler.group = true;

export default handler;