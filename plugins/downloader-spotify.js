const fetch = require("node-fetch");

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) throw `Masukkan URL!\n\nContoh:\n${usedPrefix + command} https://open.spotify.com/track/3zakx7RAwdkUQlOoQ7SJRt`;
  if (!args[0].match(/spotify/gi)) throw `URL Tidak Ditemukan!`;
  m.reply("Tunggu sebentar...");
  const urll = args[0];
  try {
    const res = await fetch(`https://api.betabotz.eu.org/api/download/spotify?url=${args[0]}&apikey=${lann}`)
    let jsons = await res.json();
    const {
      thumbnail,
      title,
      name,
      duration,
      url
    } = jsons.result.data;
    const {
      id,
      type
    } = jsons.result.data.artist;
    let captionvid = `∘ Title: ${title}\n∘ Id: ${id}\n∘ Duration: ${duration}\n∘ Type: ${type}`;
    await m.reply(captionvid);
    await conn.sendMessage(m.chat, {
      audio: { url: url },
      mimetype: 'audio/mpeg',
    }, { quoted: m });
  } catch (e) {
    throw `*Server down!*`;
  }
};
handler.help = ['spotify']
handler.command = /^(spotify)$/i
handler.tags = ['downloader'];
handler.limit = true;
handler.group = false;
handler.premium = false;
handler.owner = false;
handler.admin = false;
handler.botAdmin = false;
handler.fail = null;
handler.private = false;
module.exports = handler;