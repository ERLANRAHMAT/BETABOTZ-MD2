// @ts-nocheck
// Converted from plugins-esm - automated
import axios from 'axios';

let handler: WaPlugin = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        throw `Masukkan URL Kuaishou yang ingin diunduh.\n\n*Contoh:*\n${usedPrefix + command} https://v.kuaishou.com/KT2lZm23`;
    }
    const urlMatch = text.match(/https?:\/\/[^\s]+/);
    const url = urlMatch ? urlMatch[0] : text.trim();

    try {
        await m.reply(`⏳ Sedang memproses unduhan Kuaishou...`);

        const apiUrl = `https://api.betabotz.eu.org/api/download/kuaishou?apikey=${lann}&url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl);
        const resData = response.data;

        if (!resData || !resData.status || !resData.result || !resData.result.success) {
            throw 'Gagal mengambil video. Pastikan URL valid atau coba lagi nanti.';
        }

        const data = resData.result;
        
        if (!data.videoUrl) {
            throw 'Video URL tidak ditemukan dalam respon API.';
        }

        let caption = `🎥 *KUAISHOU DOWNLOADER* 🎥\n\n`;
        caption += `👤 *Author:* ${data.author} (@${data.username})\n`;
        caption += `📝 *Deskripsi:* ${data.title || '-'}\n`;
        caption += `👍 *Suka:* ${data.likeCount}\n`;
        caption += `💬 *Komentar:* ${data.commentCount}\n`;
        caption += `👁️ *Ditonton:* ${data.viewCount}\n`;
        caption += `🔗 *Sumber:* ${data.rawUrl}\n`;

        await conn.sendFile(m.chat, data.videoUrl, 'kuaishou.mp4', caption.trim(), m);

    } catch (e) {
        if (e !== false) {
            console.log(e);
            throw e;
        }
    }
};

handler.help = ['kuaishou <url>'];
handler.tags = ['downloader'];
handler.command = /^(kuaishou|kuaishoudl|ksdl)$/i;
handler.limit = true;

export default handler;
