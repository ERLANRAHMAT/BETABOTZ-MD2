// @ts-nocheck
// Converted from plugins-esm - automated
import fetch from 'node-fetch';
import uploader from '../lib/uploadFile.js';

let handler: WaPlugin = async (m, { conn, usedPrefix, command }) => {
	try {
		let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || "";
    if (/video|audio/.test(mime)) {
      let buffer = await q.download();
      await m.reply(wait);
      try {
        let media = await uploader(buffer);
        let json = await (
          await fetch(
            `https://api.betabotz.eu.org/api/tools/whatmusic?url=${media}&apikey=${lann}`,
          )
        ).json();
        conn.sendMessage(m.chat, { text: json.result }, { quoted: m });
      } catch (err) {
        throw `${eror}`;
      }
    } else throw `Reply audio/video with command ${usedPrefix + command}`;
  } catch (e) {
    console.log(e);
    throw e;
  }
	
}
handler.help = ['whatmusic']
handler.tags = ['tools']
handler.command = /^(whatmusic)$/i
handler.limit = true;

export default handler;
