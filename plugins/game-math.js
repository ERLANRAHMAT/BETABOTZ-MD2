const fetch = require('node-fetch');

const modes = {
  noob: { bonus: 10, time: 20000, money: 500 },
  easy: { bonus: 20, time: 30000, money: 1000 },
  medium: { bonus: 40, time: 40000, money: 2500 },
  hard: { bonus: 100, time: 60000, money: 5000 },
  master: { bonus: 250, time: 70000, money: 10000 },
  grandmaster: { bonus: 500, time: 90000, money: 25000 },
  legendary: { bonus: 1000, time: 120000, money: 50000 },
  mythic: { bonus: 3000, time: 150000, money: 75000 },
  god: { bonus: 5000, time: 200000, money: 100000 },
};

let handler = async (m, { conn, args, usedPrefix }) => {

  conn.math = conn.math ? conn.math : {};
  
  const modeList = Object.keys(modes);
  if (args.length < 1) {
    throw `
Silakan pilih tingkat kesulitan.
Mode yang tersedia: ${modeList.join(' | ')}

Contoh penggunaan: ${usedPrefix}math medium
    `.trim();
  }

  let mode = args[0].toLowerCase();
  if (!(mode in modes)) {
    throw `
Mode "${mode}" tidak ditemukan.
Mode yang tersedia: ${modeList.join(' | ')}

Contoh penggunaan: ${usedPrefix}math medium
    `.trim();
  }

  let id = m.chat;
  if (id in conn.math) {
    return conn.reply(m.chat, 'Masih ada soal yang belum terjawab di chat ini.', conn.math[id][0]);
  }

  try {
    const url = `https://api.betabotz.eu.org/api/game/math?apikey=${lann}`;
    const res = await fetch(url);
    const json = await res.json();
    const soalDitemukan = json.filter(q => q.level && q.level.toLowerCase() === mode);

    if (soalDitemukan.length < 1) {
        throw new Error(`Maaf, soal untuk level "${mode}" tidak tersedia di API.`);
    }
    const data = soalDitemukan[Math.floor(Math.random() * soalDitemukan.length)];



    if (!data || !data.soal || !data.jawaban) {
        throw new Error('Format API tidak sesuai atau soal tidak ditemukan.');
    }
    
    const { bonus, time, money } = modes[mode];

    let math = {
      soal: data.soal,
      jawaban: data.jawaban,
      mode: mode,
      bonus: bonus,
      money: money,
      time: time,
    };
    
    conn.math[id] = [
      await conn.reply(m.chat, `Berapa jawaban dari *${math.soal}*?\n\nTimeout: ${(math.time / 1000).toFixed(2)} detik\nBonus: +${math.bonus} XP & +${math.money} Money`, m),
      math, 
      4, 
      setTimeout(() => {
        if (conn.math[id]) {
          conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${math.jawaban}*`, conn.math[id][0]);
          delete conn.math[id];
        }
      }, math.time)
    ];
  } catch (e) {
    console.error(e);
    m.reply(e.message || 'Maaf, terjadi kesalahan saat mengambil soal dari API. Coba lagi nanti.');
  }
};

handler.help = ['math <mode>'];
handler.tags = ['game'];
handler.command = /^math/i;

module.exports = handler;