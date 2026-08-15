// @ts-nocheck
// Converted from plugins-esm - automated
import { 
sticker5 
} from '../lib/sticker.ts';
let handler: WaPlugin = async (m, {conn, command, text, userPrefix}) => {
    try {
            const res = `https://api.betabotz.eu.org/api/sticker/meme-kucing?apikey=${global.lann}`;
            var stiker = await sticker5(null, res, global.packname, global.author);
            await conn.sendFile(m.chat, stiker, "emror.webp", "", m as any);
    } catch (e) {
      console.log(e);
      throw e;
    }
}

handler.command = handler.info = ['stickerkucing', 'stikercat'];
handler.help = ['sticker']
handler.limit = true

export default handler;
