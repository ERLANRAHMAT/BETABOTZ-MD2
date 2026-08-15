// @ts-nocheck
// Converted from plugins-esm - automated
import fetch from 'node-fetch';
let handler: WaPlugin = async (m, { conn }) => {
  try {
    conn.reply(m.chat, wait, m)
    let res = await fetch(`https://api.betabotz.eu.org/api/download/storyanime?apikey=${lann}`);
    let json = await res.json();
      conn.sendFile(m.chat, json.result.url, 'anime_story.mp4', "*STORY ANIME*", m);
  } catch (e) {
    console.log(e);
    throw e;
  }
};

handler.help = ['storyanime'];
handler.tags = ['downloader'];
handler.command = /^(storyanime)$/i;
handler.limir = true

export default handler;
