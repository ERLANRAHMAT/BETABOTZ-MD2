// @ts-nocheck
// Converted from plugins-esm - automated
let handler: WaPlugin = async (m, {conn, text, usedPrefix}) => {
  if (!text) throw 'Berikan URL dari YouTube!'
  try {   
    var aud = `https://aemt.me/youtube?url=${text}&filter=audioonly&quality=highestaudio&contenttype=audio/mpeg` 
    await conn.sendMessage(m.chat, { audio: { url: aud }, mimetype: 'audio/mpeg' }, { quoted: m })    
  } catch (e) {
      console.log(e);
      throw e;
  }
}
handler.command = handler.help = ['ytaudio'];
handler.tags = ['downloader'];
handler.exp = 0;
handler.limit = true;
handler.premium = false;

export default handler;
