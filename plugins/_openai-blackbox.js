import fetch from 'node-fetch';
var handler = async (m, {
 text, 
 usedPrefix, 
 command
 }) => {
  try {
    if (!text) throw `Masukkan pertanyaan!\n\n*Contoh:* buatkan saya code express.js`
    await m.reply(wait)
    var apii = await fetch(`https://api.betabotz.eu.org/api/search/blackbox-chat?text=${text}&apikey=${lann}`)
    var res = await apii.json()
    await m.reply(res.message)
  } catch (e) {
    console.log(e);
    throw e;
  }
}
handler.command = handler.help = ['blackbox','blackboxai','aicoding'];
handler.tags = ['tools'];
handler.premium = false
export default handler;