const fetch = require('node-fetch');

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        throw `Masukan URL!\n\ncontoh:\n${usedPrefix + command} https://www.capcut.com/template-detail/7299286607478181121?template_id=7299286607478181121&share_token=80302b19-8026-4101-81df-2fd9a9cecb9c&enter_from=template_detail&region=ID&language=in&platform=copy_link&is_copy_link=1`;
    }

    try {
        if (!args[0].match(/capcut/gi)) {
            throw `URL Tidak Ditemukan!`;
        }
        m.reply('*Mohon tunggu..*');

        const response = await fetch(`https://api.betabotz.eu.org/api/download/capcut?url=${args[0]}&apikey=${lann}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const res = await response.json();
        const { 
            video,
            title,
            owner
        } = res.result;

        await conn.sendFile(m.chat, video, 'capcut.mp4', `Title: ${title}\n\nProfile: ${owner}`, m);

    } catch (e) {
        console.log(e);
        throw `Terjadi Kesalahan!`;
    }
};

handler.help = handler.command = ['capcut','cc','capcutdl','ccdl'];
handler.tags = ['downloader'];
handler.limit = true;
handler.group = true;
module.exports = handler;