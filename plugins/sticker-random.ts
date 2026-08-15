// @ts-nocheck
// Converted from plugins-esm - automated
import { 
sticker5 
} from '../lib/sticker.js';
var handler = async (m, {
 conn, 
 command
 }) => {
    var error = (`https://telegra.ph/file/12141dd462ecabeed1347.png`)
    try {
        if (command == 'dinokuning' || command == 'sdino') {
        const res = `https://api.betabotz.eu.org/api/sticker/dinokuning?apikey=${lann}`
            var stiker = await sticker5(null, res, global.packname, global.author)
            await conn.sendFile(m.chat, stiker, 'emror.webp', '', m as any)
        }
        else if (command == 'patrick' || command == 'spatrick') {
        const res = `https://api.betabotz.eu.org/api/sticker/patrick?apikey=${lann}`
            var stiker = await sticker5(null, res, global.packname, global.author)
            await conn.sendFile(m.chat, stiker, 'emror.webp', '', m as any)
        }
        else if (command == 'spongebob' || command == 'sspongebob') {
        const res = `https://api.betabotz.eu.org/api/sticker/spongebob?apikey=${lann}`
            var stiker = await sticker5(null, res, global.packname, global.author)
            await conn.sendFile(m.chat, stiker, 'emror.webp', '', m as any)
        }
        else if (command == 'doge' || command == 'sdoge') {
        const res = `https://api.betabotz.eu.org/api/sticker/doge?apikey=${lann}`
            var stiker = await sticker5(null, res, global.packname, global.author)
            await conn.sendFile(m.chat, stiker, 'emror.webp', '', m as any)
        }
        else if (command == 'manusialidi' || command == 'smanusialidi') {
        const res = `https://api.betabotz.eu.org/api/sticker/manusialidi?apikey=${lann}`
            var stiker = await sticker5(null, res, global.packname, global.author)
            await conn.sendFile(m.chat, stiker, 'emror.webp', '', m as any)
        }
    } catch (e) {
      console.log(e);
      throw e;
    }
}

handler.command = handler.help = ['dinokuning', 'patrick', 'spongebob', 'doge', 'manusialidi', 'sdino', 'spatrick', 'sspongebob', 'sdoge', 'smanusialidi']
handler.tags = ['sticker']
handler.limit = true

export default handler;
