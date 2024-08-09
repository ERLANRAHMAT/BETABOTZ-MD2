const axios = require('axios');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Masukan URL!\n\ncontoh:\n${usedPrefix + command} https://youtu.be/4rDOsvzTicY?si=3Ps-SJyRGzMa83QT`;    
   
        if (!text) throw 'masukan link youtube';   
        m.reply(wait);      
        const response = await axios.get(`https://api.betabotz.eu.org/api/download/ytmp3?url=${text}&apikey=${lann}`);        
        const res = response.data.result;      
        var { mp3, id, title, source, duration } = res;
        // let capt = `YT M P 3*\n\n`;
        // capt += `◦ *id* : ${id}\n`;
        // capt += `◦ *tittle* : ${title}\n`;
        // capt += `◦ *source* : ${source}\n`;
        // capt += `◦ *duration* : ${duration}\n`;
        // capt += `\n`;        
        await conn.sendFile(m.chat, mp3, null, m);
        // conn.sendMessage(m.chat, { audio: { url: mp3[0] }, mimetype: 'audio/mpeg' }, { quoted: m });    
};
handler.help = ['ytmp3'];
handler.command = /^(ytmp3)$/i
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