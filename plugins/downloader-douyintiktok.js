const axios = require('axios');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let message;
    let urlApi;
    let capt;
    if (command === 'tiktok' || command === 'tt' || command === 'tiktokdl' || command === 'tiktoknowm') {
        capt = `乂 *T I K T O K*`;
        message = `Masukan URL!\n\ncontoh:\n${usedPrefix + command} https://vt.tiktok.com/ZSY8XguF2/`;    
        urlApi = `https://api.betabotz.eu.org/api/download/tiktok?url=${text}&apikey=${lann}`;
    } else if (command === 'douyin') {
        capt = `乂 *D O U Y I N*`;
        message = `Masukkan URL!\n\ncontoh:\n${usedPrefix + command} https://v.douyin.com/ikq8axJ/`;
        urlApi = `https://api.betabotz.eu.org/api/download/douyin?url=${text}&apikey=${lann}`;
    }

    if (!text) {
        throw message;
    }

    try {
        m.reply(wait);      
        const response = await axios.get(urlApi);        
        const res = response.data.result;      
        var { video, title, title_audio, audio } = res;

        capt += `\n\n`;
        capt += `◦ *Title* : ${title}\n`;
        capt += `◦ *Audio Title* : ${title_audio}\n`;
        capt += `\n`;        

        await conn.sendFile(m.chat, video, null, capt, m);
        conn.sendMessage(m.chat, { audio: { url: audio[0] }, mimetype: 'audio/mpeg' }, { quoted: m });         
    } catch (e) {
        console.log(e);
        throw `🚩 ${eror}`;
    }
};

handler.command = handler.help = ['tiktok', 'tt','tiktokdl','tiktoknowm', 'douyin'];
handler.tags = ['downloader'];
handler.limit = true;
handler.group = false;
handler.premium = false;
handler.owner = false;
handler.admin = false;
handler.botAdmin = false;
handler.fail = null;
handler.private = false;

module.exports = handler;

