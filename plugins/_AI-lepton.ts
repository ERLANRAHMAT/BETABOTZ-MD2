// @ts-nocheck
// Converted from plugins-esm - automated
import fetch from 'node-fetch';
let handler: WaPlugin = async (m, {
 text, 
 usedPrefix, 
 command
 }) => {
if (!text) throw `Masukkan pertanyaan!\n\n*Contoh:* Siapa presiden Indonesia? `
try {
  await m.reply(wait)
  let res = await (await fetch(`https://api.betabotz.eu.org/api/search/lepton-ai?apikey=${lann}&text=${text}`)).json()
  await m.reply(res.result.result)
} catch (e) {
    console.log(e);
    throw e;
  }
}
handler.command = handler.help = ['lepton'];
handler.tags = ['ai'];
handler.premium = false
handler.limit = true;

export default handler;
