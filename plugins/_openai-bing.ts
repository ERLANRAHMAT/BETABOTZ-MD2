// @ts-nocheck
// Converted from plugins-esm - automated
import fetch from 'node-fetch';

let handler: WaPlugin = async (m, {
  conn,
  text,
  usedPrefix,
  command
}) => {
  try {
    if (command == 'bing') {
      if (!text) throw `Example : ${usedPrefix + command} siapa presiden Indonesia?`;
      m.reply(wait)
      let response = await fetch('https://api.betabotz.eu.org/api/search/bing-chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: text,
            apikey: lann
          })
        })
        .then(res => res.json());

      await conn.reply(m.chat, response.message, m);
    }
    if (command == 'bingimg') {
      if (!text) throw `Contoh: ${usedPrefix + command} anak berlari menggunakan pakaian merah 3d animation`;
      m.reply(wait)
      let response = await fetch('https://api.betabotz.eu.org/api/search/bing-img', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: text,
            apikey: lann
          })
        })
        .then(res => res.json());

      for (let i = 0; i < 4; i++) {
        let img = response.result[i]
        await sleep(3000)
        await conn.sendFile(m.chat, img, 'bing_img.png', `*PROMPT:* ${text}`, m)
      }
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
}

handler.command = handler.help = ['bing', 'bingimg']
handler.tags = ['tools']
handler.limit = true



function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default handler;
