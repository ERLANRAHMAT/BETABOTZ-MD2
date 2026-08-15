import fetch from 'node-fetch'
let handler: WaPlugin = async (m, { conn, text }) => {
try { 
let img = await fetch(`https://api.betabotz.eu.org/api/random/darkjokes?apikey=${lann}`).then(result => result.buffer())
await conn.sendFile(m.chat, img, 'file.jpg', wm, m)
} catch (e) {
throw `Error ${eror}`
 }
}
handler.command = /^(darkjokes)$/i
handler.tags = ['fun']
handler.help = ['darkjokes']
handler.limit = true
export default handler
