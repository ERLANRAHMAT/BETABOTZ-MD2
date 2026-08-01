import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        throw `Masukan URL!\n\ncontoh:\n${usedPrefix + command} https://vt.tiktok.com/ZSY8XguF2/`;
    }
     

    if (!text.match(/tiktok|douyin/gi)) {
        throw `URL Tidak Ditemukan!`;
    }

    try {
        let capt, urlApi;
        
        if (command === 'tiktok' || command === 'tt' || command === 'ttdl' || command === 'ttnowm' || command === 'tiktokdl' || command === 'tiktoknowm') {
            capt = `乂 *T I K T O K*`;
            urlApi = `https://api.betabotz.eu.org/api/download/tiktok?url=${text}&apikey=${lann}`;
        } else if (command === 'douyin' || command === 'douyindl') {
            capt = `乂 *D O U Y I N*`;
            urlApi = `https://api.betabotz.eu.org/api/download/douyin?url=${text}&apikey=${lann}`;
        }

        m.reply(wait);  
        const response = await axios.get(urlApi);
        const res = response.data.result;
        var { video, title, title_audio, audio } = res;

        capt += `\n\n◦ *Title* : ${title}\n◦ *Audio Title* : ${title_audio}\n`;

        if (Array.isArray(video)) {
            for (let v of video) {
                await conn.sendFile(m.chat, v, null, capt, m);
            }
        } else {
            await conn.sendFile(m.chat, video, null, capt, m);
        }

        await conn.sendMessage(m.chat, { audio: { url: audio[0] }, mimetype: 'audio/mpeg' }, { quoted: m });
        
    } catch (e) {
        if (e !== false) {
            console.error(e);
            throw e;
        }
    }
};
handler.help = handler.command = ['tiktok', 'tt', 'ttdl', 'ttnowm', 'tiktokdl', 'tiktoknowm', 'douyin', 'douyindl'];
handler.tags = ['downloader'];
handler.limit = true;
handler.group = false;
handler.premium = false;
handler.owner = false;
handler.admin = false;
handler.botAdmin = false;
handler.fail = null;
handler.private = false;

export default handler;