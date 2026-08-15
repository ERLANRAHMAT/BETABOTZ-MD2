// @ts-nocheck
// Converted from plugins-esm - automated
import fetch from 'node-fetch';

let handler: WaPlugin = async (m, { text, usedPrefix, command }) => {
  try {
    if (!text) throw `Masukkan pertanyaan!\n\n*Contoh:* Siapa presiden Indonesia? `;
    
    await m.reply(global.wait);
    
    let apii = await fetch(`https://api.betabotz.eu.org/api/search/bard-ai?apikey=${global.lann}&text=${text}`);
    let res = await apii.json();
    
    await m.reply(res.message);
  } catch (e) {
    console.log(e);
    throw e;
  }
};

handler.command = handler.help = ['bard', 'bardai'];
handler.tags = ['tools'];
handler.premium = false;

export default handler;
