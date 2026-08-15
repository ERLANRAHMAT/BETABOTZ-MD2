import fs from 'fs';
import fetch from 'node-fetch';

// Pastikan tipe WaPlugin dan lann sudah ter-declare/di-import di environment kamu
let handler: WaPlugin = async (m, { conn, text, usedPrefix, command }) => {
    const packname = global.packname;
    const author = global.author;
    
    text = text 
        ? text 
        : m.quoted && m.quoted.text 
        ? m.quoted.text 
        : m.quoted && m.quoted.caption 
        ? m.quoted.caption 
        : m.quoted && m.quoted.description 
        ? m.quoted.description 
        : '';
        
    if (!text) throw `Example : ${usedPrefix + command} Lagi Ruwet`;
    
    let res: string = '';
    const textEncoded = encodeURIComponent(text.substring(0, 151));

    if (command === 'attp') {
        res = `https://api.betabotz.eu.org/api/maker/attp?text=${textEncoded}&apikey=${lann}`;
    } else if (command === 'ttp') {
        res = `https://api.betabotz.eu.org/api/maker/ttp?text=${textEncoded}&apikey=${lann}`;
    } else if (command === 'brat') {
        res = `https://api.betabotz.eu.org/api/maker/brat?text=${textEncoded}&apikey=${lann}`;
    } else if (command === 'bratvideo') {
        res = `https://api.betabotz.eu.org/api/maker/brat-video?text=${textEncoded}&apikey=${lann}`;
    }
    
    try {
        const fetchResult = await fetch(res);
        const imageBuffer = await fetchResult.buffer();
                if (command === 'attp') {
            await conn.sendFile(m.chat, imageBuffer, 'sticker.webp', '', m);
        } else if (command === 'bratvideo') {
            await conn.sendVideoAsSticker(m.chat, imageBuffer, m, { packname, author });
        } else {
            await conn.sendImageAsSticker(m.chat, imageBuffer, m, { packname, author });
        }
        
    } catch (e) {
        console.error("Sticker Error:", e);
        const errorBuffer = fs.readFileSync(`./media/sticker/emror.webp`);
        await conn.sendFile(m.chat, errorBuffer, 'sticker.webp', '', m);
    }
}

handler.command = handler.help = ['attp', 'ttp', 'brat', 'bratvideo'];
handler.tags = ['sticker'];
handler.limit = true;
handler.group = false;

export default handler;