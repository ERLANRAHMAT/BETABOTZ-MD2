// @ts-nocheck
// Converted from plugins-esm - automated
import fetch from 'node-fetch';
import uploader from '../lib/uploadImage.ts';
import uploadFile from '../lib/uploadFile.ts';

let handler: WaPlugin = async (m, { conn, text, command, usedPrefix }) => {
  try {
    if (!text) throw `Reply media with text\nExample: ${usedPrefix + command} what is this?`;
    
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || '';
    let media, urlAPI;
    
    await m.reply(wait);
    
    if (/image/g.test(mime) && !/webp/g.test(mime)) {
      let buffer = await q.download();
      media = await uploader(buffer);
      urlAPI = `https://api.betabotz.eu.org/api/search/bard-img?url=${media}&text=${text}&apikey=${lann}`;
    } 
    else if (/video/g.test(mime)) {
      if (q.seconds > 60) throw 'Maximum video duration is 60 seconds!';
      let buffer = await q.download();
      media = await uploadFile(buffer);
      urlAPI = `https://api.betabotz.eu.org/api/search/bard-video?url=${media}&text=${text}&apikey=${lann}`;
    }
    else if (/audio/g.test(mime)) {
      let buffer = await q.download();
      media = await uploadFile(buffer);
      urlAPI = `https://api.betabotz.eu.org/api/search/bard-audio?url=${media}&text=${text}&apikey=${lann}`;
    }
    else {
      throw `Reply image/video/audio with command ${usedPrefix + command} your_question`;
    }

    let json = await (await fetch(urlAPI)).json();
    if (json.status && json.result) {
      await conn.sendMessage(m.chat, { text: json.result }, { quoted: m });
    } else {
      throw 'Failed to get response from Bard';
    }
    
  } catch (e) {
    console.log(e);
    throw e;
  }
}

handler.help = ['bardimg', 'bardimage', 'bardvideo', 'bardaudio'];
handler.tags = ['tools'];
handler.command = /^(bardimg|bardimage|bardvideo|bardaudio)$/i;
handler.limit = true;

export default handler;
