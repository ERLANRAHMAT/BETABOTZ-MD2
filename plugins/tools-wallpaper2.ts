// @ts-nocheck
// Converted from plugins-esm - automated
let handler: WaPlugin = async (m, { conn }) => {
    try {
        
        let apiUrl = `https://api.betabotz.eu.org/api/wallpaper/wallhp2?apikey=${lann}`;

      

        await conn.sendMessage(m.chat, {
            image: { url: apiUrl }, 
            caption: `Berikut adalah wallpaper random (versi 2) untuk Anda!`,
        }, { quoted: m });
    }  catch (e) {
    console.log(e);
    throw e;
  }
};

handler.tags = ['image', 'internet'];
handler.help = ['wallpaper2']; 
handler.command = /^(wallpaper2)$/i; 
handler.limit = true;

export default handler;
