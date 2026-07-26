let handler = async (m, { conn }) => {
    try {
        
        let apiUrl = `https://api.betabotz.eu.org/api/wallpaper/wallhp2?apikey=${lann}`;

      

        await conn.sendMessage(m.chat, {
            image: { url: apiUrl }, 
            caption: `Berikut adalah wallpaper random (versi 2) untuk Anda!`,
        }, { quoted: m });
    } catch (error) {
        console.error(error);
        throw `Terjadi kesalahan: ${error.message || error}`;
    }
};

handler.tags = ['image', 'internet'];
handler.help = ['wallpaper2']; 
handler.command = /^(wallpaper2)$/i; 
handler.limit = true;

export default handler;