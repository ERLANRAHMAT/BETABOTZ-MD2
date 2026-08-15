import fetch from 'node-fetch';

let handler: WaPlugin = async (m, { conn }) => {    
    try {
        const response = await fetch(`https://api.betabotz.eu.org/api/wallpaper/cosplay?apikey=${btc}`);
        const buffer = Buffer.from(await response.buffer());
        conn.sendFile(m.chat, buffer, 'hasil.jpg', 'Random Cosplay', m);
    } catch (err) {
        throw eror
    }
}

handler.help = handler.command = ['cosplay'];
handler.tags = ['internet'];
handler.limit = true;

export default handler;
