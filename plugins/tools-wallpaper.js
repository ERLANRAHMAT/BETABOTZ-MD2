const fetch = require('node-fetch');

let handler = async (m, { conn }) => {
    try {
        await m.reply(wait); 
        let apiUrl = `https://api.betabotz.eu.org/api/wallpaper/wallhp?apikey=${global.lann}`;
        await conn.sendMessage(m.chat, {
            image: { url: apiUrl }, 
            caption: `Berikut adalah wallpaper random untuk Anda!`,
        }, { quoted: m });
        
    } catch (error) {
        console.error(error);
        if (error !== false) {
             throw `Terjadi kesalahan: ${error.message || error}`;
        }
    }
};

handler.tags = ['image', 'internet'];
handler.help = ['wallpaper']; 
handler.command = /^(wallpaper)$/i; 
handler.limit = true;

module.exports = handler;