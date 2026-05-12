let fetch = require('node-fetch');

let handler = async (m, { conn, command, args }) => {
  let text = args[0];
  if (!text) return conn.reply(m.chat, 'Tidak ada teks untuk dicari', m);

  try {
    let response = await fetch(`https://api.betabotz.eu.org/api/search/google?text1=${encodeURIComponent(text)}&apikey=${lann}`);
    let data = await response.json();

    if (!data.status) throw eror

    let msg = data.result.map(({ title, url, description }) => {
      return `*${title}*\n_${url}_\n_${description}_`;
    }).join('\n\n');
    conn.sendMessage(
      m.chat,
      {
        image: { url: "https://telegra.ph/file/d7b761ea856b5ba7b0713.jpg" },
        caption: `🔍 *Hasil Pencarian: ${text}*\n\n${msg}`,
        mentions: [m.sender],
      },
      { quoted: m },
    );
  } catch (e) {
    throw eror
  }
};

handler.help = ['google'].map(v => v + ' <pencarian>');
handler.tags = ['internet'];
handler.command = /^google$/i;
handler.limit = true;

module.exports = handler;
