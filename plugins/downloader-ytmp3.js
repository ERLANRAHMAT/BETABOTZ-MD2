const axios = require('axios');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Masukan URL!\n\ncontoh:\n${usedPrefix + command} https://youtu.be/4rDOsvzTicY?si=3Ps-SJyRGzMa83QT`;    
   
        if (!text) throw 'masukan link youtube';   
        m.reply(wait);      
        const response = await axios.get(`https://api.betabotz.eu.org/api/download/ytmp3?url=${text}&apikey=${lann}`);        
        const res = response.data.result;      
        var { mp3, id, title, source, duration } = res;
        let caption = `*Title:* ${title}\n*Duration:* ${duration}`
        // await conn.sendFile(m.chat, mp3, null, m);
        await conn.sendMessage(m.chat, { 
            document: { url: mp3 }, 
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`,
            caption: caption
        }, { quoted: m });
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

