
import fetch from 'node-fetch';

let handler: WaPlugin = async (m, { conn, args, usedPrefix, command }) => {
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
      artist,
      duration,
      url
    } = jsons.result.data;
    const {
      id,
      type
    } = jsons.result.data.artist;
    let captionvid = ` ∘ Title: ${title}\n∘ Artits: ${artist}\n\n∘ Duration: ${duration}\n`;
    let pesan = await conn.sendFile(m.chat, thumbnail, "thumb.png", captionvid, m)
    // await m.reply(captionvid);
    await conn.sendMessage(m.chat, {
      audio: { url: url },
      mimetype: 'audio/mpeg',
    }, { quoted: m });
  } catch (e) {
      console.log(e);
      throw e;
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

export default handler;
