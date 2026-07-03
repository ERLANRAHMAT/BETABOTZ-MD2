var { 
sticker5 
} = require('../lib/sticker')
let handler = async (m, {conn, command, text, userPrefix}) => {
    try {
            const res = `https://api.betabotz.eu.org/api/sticker/meme-kucing?apikey=${global.lann}`;
            var stiker = await sticker5(null, res, global.packname, global.author);
            await conn.sendFile(m.chat, stiker, "emror.webp", "", m);
    } catch  (e) {
        console.log (e)
        return e
    }
}

handler.command = handler.info = ['sticker-kucing', 'stikercat'];
handler.help = ['sticker']
handler.limit = true
module.exports = handler;
