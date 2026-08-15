
import { 
    sticker5 
} from '../lib/sticker.ts';
import fs from 'fs';
import fetch from 'node-fetch';
let handler: WaPlugin = async (m, {
    conn, 
    args, 
    text, 
    usedPrefix, 
    command
}) => {
    const packname = global.packname
    const author = global.author
    
    text = text ? text : m.quoted && m.quoted.text ? m.quoted.text : m.quoted && m.quoted.caption ? m.quoted.caption : m.quoted && m.quoted.description ? m.quoted.description : ''
    if (!text) throw `Example : ${usedPrefix + command} Lagi Ruwet`
    
    let res;
    var error = fs.readFileSync(`./media/sticker/emror.webp`)
    
    try {
        if (command === 'attp') {
            res = `https://api.betabotz.eu.org/api/maker/attp?text=${encodeURIComponent(text.substring(0, 151))}&apikey=${lann}`;
            let fetchResult = await fetch(res)
            let imageBuffer = await fetchResult.buffer()
            
            let stiker = await sticker5(
                imageBuffer,
                null,
                packname,
                author,
                ['🎨']
            )
            
            if (stiker) {
                await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
            } else {
                throw new Error('Pembuatan stiker gagal')
            }
        } else if (command === 'ttp') {
            res = `https://api.betabotz.eu.org/api/maker/ttp?text=${encodeURIComponent(text.substring(0, 151))}&apikey=${lann}`;
            let fetchResult = await fetch(res)
            let imageBuffer = await fetchResult.buffer()
            
            let stiker = await sticker5(
                imageBuffer,
                null,
                packname,
                author,
                ['🎨']
            )
            
            if (stiker) {
                await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
            } else {
                throw new Error('Pembuatan stiker gagal')
            }
        } else if (command === 'brat') {
            res = `https://api.betabotz.eu.org/api/maker/brat?text=${encodeURIComponent(text.substring(0, 151))}&apikey=${lann}`;
            let fetchResult = await fetch(res)
            let imageBuffer = await fetchResult.buffer()
            
            let stiker = await sticker5(
                imageBuffer,
                null,
                packname,
                author,
                ['🎨']
            )
            
            if (stiker) {
                await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
            } else {
                throw new Error('Pembuatan stiker gagal')
            }
        } else if (command === 'bratvideo') {
            res = `https://api.betabotz.eu.org/api/maker/brat-video?text=${encodeURIComponent(text.substring(0, 151))}&apikey=${lann}`;
            await conn.sendVideoAsSticker(m.chat, res, m, { packname: packname, author: author })
        }
        
    }  catch (e) {
        console.log(e);
        throw e;
    }
}

handler.command = handler.help = ['attp', 'ttp', 'brat', 'bratvideo']
handler.tags = ['sticker']
handler.limit = true
handler.group = false

export default handler;
