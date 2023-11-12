const fetch = require('node-fetch');

let handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) throw 'Berikan URL dari YouTube!';
  await m.reply(wait)
  try {
    if (command == 'ytmp3' || command == 'yta' || command == 'ytaudio') {
      var aud = await (await fetch(API('lann', '/api/download/ytmp3', { url: text, apikey: lann }))).json();
      await conn.sendMessage(m.chat, { audio: { url: aud.result.mp3 }, mimetype: 'audio/mpeg' }, { quoted: m });
    } else if (command == 'ytv' || command == 'ytvideo' || command == 'ytmp4') {
      var vid = await (await fetch(API('lann', '/api/download/ytmp4', { url: text, apikey: lann }))).json();
      await conn.sendFile(m.chat, vid.result.mp4, null, `*Youtube Mp4 Downloader*`, m)
    } else if (command == 'ytshorts' || command == 'shortsyt' || command == 'shorts') {
      var aud = await (await fetch(API('lann', '/api/download/ytmp3', { url: text, apikey: lann }))).json();
      await conn.sendMessage(m.chat, { audio: { url: aud.result.mp3 }, mimetype: 'audio/mpeg' }, { quoted: m });
      var vid = await (await fetch(API('lann', '/api/download/ytmp4', { url: text, apikey: lann }))).json();
      await conn.sendMessage(m.chat, { video: { url: vid.result.mp4 }}, { quoted: m });
    }
  } catch (e) {
    throw 'Video/Audio Tidak Ditemukan';
  }
};

handler.command = handler.help = ['ytaudio', 'yta', 'ytmp3', 'ytvideo', 'ytmp4', 'ytv', 'ytshorts', 'shortsyt', 'shorts'];
handler.tags = ['downloader'];
handler.exp = 0;
handler.limit = true;
handler.premium = false;
module.exports = handler;
      
