import fetch from 'node-fetch';
let handler = async (m, { conn, text }) => {
try { 
let img = await fetch(`https://api.betabotz.eu.org/api/wallpaper/meme?apikey=${lann}`).then(result => result.buffer())
await conn.sendFile(m.chat, img, 'file.jpg', wm, m)
} catch (e) {
      console.log(e);
      throw e;
    }
}
handler.command = /^(meme)$/i
handler.tags = ['fun']
handler.help = ['meme']
handler.limit = true
export default handler
