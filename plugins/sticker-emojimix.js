import fetch from 'node-fetch';
import { sticker5 } from '../lib/sticker.js';

let handler = async (m, { conn, text, args }) => {
    if (!args[0] || !text.includes('+')) {
        throw 'Contoh penggunaan:\n\n*.emojimix 🤨+😣*';
    }

    try {
        let [emoji1, emoji2] = text.split('+');
         let apiUrl = `https://api.betabotz.eu.org/api/emoji/emojimix?emoji1=${encodeURIComponent(emoji1.trim())}&emoji2=${encodeURIComponent(emoji2.trim())}&apikey=${lann}`;
        let anu = await fetch(apiUrl);
        let res = await anu.json();

        if (!res.status || !res.result || !res.result.url) {
            throw 'Emoji tidak didukung atau gagal digabungkan!';
        }

        let stiker = await sticker5(res.result.url, false, packname, author);
        await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m);
        
    } catch (e) {
        console.log(e);
        throw e;
    }
}

handler.help = ['emojimix']
handler.tags = ['sticker']
handler.command = /^(emojimix)$/i
handler.limit = true

export default handler;