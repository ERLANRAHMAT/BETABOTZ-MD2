import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        throw `*❌ Masukkan URL!*\n\n*Contoh:*\n${usedPrefix + command} https://vt.tiktok.com/ZSVh18yL4/`;
    }

    try {
        let capt, urlApi;
        if (/^(tiktok|tt|ttdl|ttnowm|tiktokdl|tiktoknowm)$/i.test(command)) {
            if (!text.match(/https?:\/\/(www\.|vt\.|vm\.|m\.)?tiktok\.com/gi)) throw "❌ URL TikTok Tidak Ditemukan!";
            capt = `乂 *T I K T O K*`;
            urlApi = `https://api.betabotz.eu.org/api/download/tiktok?url=${encodeURIComponent(text.trim())}&apikey=${lann}`;
        } else if (/^(douyin|douyindl)$/i.test(command)) {
            if (!text.match(/https?:\/\/(www\.|v\.)?douyin\.com/gi)) throw "❌ URL Douyin Tidak Ditemukan!";
            capt = `乂 *D O U Y I N*`;
            urlApi = `https://api.betabotz.eu.org/api/download/douyin?url=${encodeURIComponent(text.trim())}&apikey=${lann}`;
        }

        await m.reply('⏳ _Sedang memproses video, tunggu sebentar..._');  
        
        const response = await axios.get(urlApi);
        const res = response.data.result;
        var { video, title, title_audio, audio } = res;

        capt += `\n\n◦ *Title* : ${title}\n◦ *Audio Title* : ${title_audio}\n`;
        capt += `\n_${global.wm}_`;
        if (Array.isArray(video)) {
            for (let v of video) {
                await conn.sendFile(m.chat, v, null, capt, m);
            }
        } else {
            await conn.sendFile(m.chat, video, null, capt, m);
        }
        if (audio && audio.length > 0) {
            await conn.sendMessage(m.chat, { audio: { url: audio[0] }, mimetype: 'audio/mpeg' }, { quoted: m });
        }
        
    } catch (e) {
        console.error(e);
        throw e;
    }
};

handler.help = ['tiktok', 'douyin'].map(v => v + ' <url>');
handler.command = /^(tiktok|tt|ttdl|ttnowm|tiktokdl|tiktoknowm|douyin|douyindl)$/i;
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