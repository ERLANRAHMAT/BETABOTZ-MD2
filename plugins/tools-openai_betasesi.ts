// @ts-nocheck
// Converted from plugins-esm - automated
/* Auto-AI Sesi X Pinterest (Foto) X YouTube Mp3/Mp4 (Lagu/Video) 
Creator: Shina Arthenon (ALC) 
MY Ch  : https://whatsapp.com/channel/0029VaNImZtKbYMRX8M08D08
Thanks To Betabotz Api
donate nya Om: https://saweria.co/ShinaStumugi
Please Don't Delete Wm*/
//Hapus Teros Wm Ny 🤮🤮🤮🤮🤮
 
import fetch from 'node-fetch';
import search from 'yt-search';
import axios from 'axios';
 
let handler: WaPlugin = async (m, { conn, text, usedPrefix, command }) => {
    conn.betaai = conn.betaai || {};
 
    if (!text) throw `*• Example:* ${usedPrefix}${command} *[on/off]*`;
 
    if (text.toLowerCase() === "on") {
        conn.betaai[m.sender] = { pesan: [] };
        m.reply("[ ✓ ] Berhasil Membuat Sesi Chat Beta-AI");
    } else if (text.toLowerCase() === "off") {
        delete conn.betaai[m.sender];
        m.reply("[ ✓ ] Berhasil Menghapus Sesi Chat Beta-AI");
    } else {
        throw `*• Example:* ${usedPrefix}${command} *[on/off]*`;
    }
};
 
/* Auto-AI Sesi X Pinterest (Foto) X YouTube Mp3/Mp4 (Lagu/Video) 
Creator: Shina Arthenon (ALC) 
MY Ch  : https://whatsapp.com/channel/0029VaNImZtKbYMRX8M08D08
Thanks To Betabotz Api
donate nya Om: https://saweria.co/ShinaStumugi
Please Don't Delete Wm*/
//Cil" Udh dibikinin, malah ngedl wm ny 🤮🤮🤮
handler.before = async (m, { conn, text }) => {
    conn.betaai = conn.betaai || {};
    if (!m.text || !conn.betaai[m.sender]) return;
 
    const skipPrefixes = [".", "#", "!", "/", "\\"];
    if (skipPrefixes.some(prefix => m.text.startsWith(prefix))) return;
 
    try {
        // Custom logic for Betabotz AI
        const logic = `Mulai dari sekarang nama anda adalah Beta-Ai, anda adalah seorang kecerdasan buatan yang di buat oleh Shina Arthenon. \nSifat anda adalah baik, ramah, lucu. Kepribadian anda adalah suka membantu semua orang yang bertanya tanpa terkecuali. \nBahasa anda adalah bahasa Indonesia. Ubahlah gaya bahasa kamu menjadi sangat tidak formal seperti gaya bahasa sehari-hari \nyang dipakai oleh manusia. Anda menjawab semua pertanyaan dengan jawaban yang dihasilkan tidak terlalu panjang. \nTambahkan sedikit emoticon lucu pada jawaban kamu. Buatlah obrolan yang menyenangkan dan tidak membosankan.`;
 
   
        const response = await fetch(`https://api.betabotz.eu.org/api/search/openai-logic?text=${encodeURIComponent(m.text)}&logic=${encodeURIComponent(logic)}&apikey=${lann}`);
        const json = await response.json();
        
        if (json.message) {
            await conn.sendMessage(m.chat, {
                text: json.message
            });
        }
 
        if (m.text.toLowerCase().includes("video")) {
            const look = await search(m.text);
            const convert = look.videos[0];
            if (!convert) throw 'Video/Audio Tidak Ditemukan';
            
            const ress = await fetch(`https://api.betabotz.eu.org/api/download/ytmp4?url=${convert.url}&apikey=${lann}`);
            const res = await ress.json();      
            var { mp4, id, title, source, duration } = res.result;
        let capt = `*YT MP4*\n\n`;
        capt += `◦ *id* : ${id}\n`;
        capt += `◦ *tittle* : ${title}\n`;
        capt += `◦ *source* : ${source}\n`;
        capt += `◦ *duration* : ${duration}\n`;
        capt += `\n`;        
        // await conn.sendFile(m.chat, mp4, null, capt, m as any);
        await conn.sendMessage(m.chat, { 
            document: { url: mp4 }, 
            mimetype: 'video/mp4',
            fileName: `${title}##.mp4`,
            caption: capt
        }, { quoted: m });
// Ganti logic, Apus wm, naruh wm sendri🤮🤮🤮🤮
}
       //YouTube Mp3 Search songs
       if (m.text.toLowerCase().includes("lagu")) {
            const look = await search(m.text);
            const convert = look.videos[0];
            if (!convert) throw 'Video/Audio Tidak Ditemukan';
            
            const response = await axios.get(`https://api.betabotz.eu.org/api/download/ytmp3?url=${convert.url}&apikey=${lann}`);        
            const res = response.data.result;      
            const { mp3, title, duration } = res;
 
            let caption = `*Title:* ${title}\n*Duration:* ${duration}`;
            await conn.sendMessage(m.chat, { 
                document: { url: mp3 }, 
                mimetype: 'audio/mpeg',
                fileName: `${title}.mp3`,
                caption: caption
            }, { quoted: m });
        }
 
/* Auto-AI Sesi X Pinterest (Foto) X YouTube Mp3/Mp4 (Lagu/Video) 
Creator: Shina Arthenon (ALC) 
MY Ch  : https://whatsapp.com/channel/0029VaNImZtKbYMRX8M08D08
Thanks To Betabotz Api
donate nya Om: https://saweria.co/ShinaStumugi
Please Don't Delete Wm*/
       // Pinterest image search
        if (m.text.toLowerCase().includes("foto")) {
            const query = m.text.split("foto")[1]?.trim();
            if (!query) throw "Harap tulis kata kunci setelah 'foto'. Contoh: foto kucing lucu";
 
            const pinterestRes = await fetch(`https://api.betabotz.eu.org/api/search/pinterest?text1=${encodeURIComponent(query)}&apikey=${lann}`);
            const pinData = await pinterestRes.json();
            const pinImage = pinData.result[0];
 
            await conn.sendMessage(m.chat, { image: { url: pinImage }, caption: `Berikut hasil pencarian untuk: "${query}"` }, { quoted: m });
        }
 
    } catch (error) {
        m.reply(`Terjadi kesalahan: ${error.message}`);
    }
};
 
handler.command = ['betaai'];
handler.tags = ['ai'];
handler.help = ['betaai [on/off]'];
 

//Hapus Teros Wm ny, Kek Bocah Aja🤮🤮🤮

export default handler;
