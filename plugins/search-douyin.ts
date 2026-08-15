
import axios from 'axios';

let handler: WaPlugin = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        throw `Masukkan kata kunci pencarian untuk Douyin.\n\n*Contoh:*\n${usedPrefix + command} perfect world`;
    }

    try {
        await m.reply(`⏳ Sedang mencari video Douyin untuk pencarian *${text}*...`);

        const apiUrl = `https://api.betabotz.eu.org/api/search/douyin?apikey=${lann}&query=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl);
        const resData = response.data;

        if (!resData || !resData.status || !resData.result || !resData.result.success) {
            throw 'Gagal mendapatkan hasil pencarian. Coba lagi nanti.';
        }

        const videos = resData.result.videos;
        
        if (!videos || videos.length === 0) {
            throw `Tidak ada video ditemukan untuk pencarian "${text}".`;
        }

        let replyText = `🎥 *DOUYIN SEARCH RESULT* 🎥\n\n`;
        replyText += `🔎 *Pencarian:* ${resData.result.query}\n`;
        replyText += `📈 *Total Ditemukan:* ${resData.result.total} video\n`;
        replyText += `━─━─━─━─━─━─━─━─━─━─━\n\n`;

        videos.forEach(v => {
            replyText += `*${v.rank}. ${v.author}*\n`;
            replyText += `📝 *Deskripsi:* ${v.desc || 'Tidak ada deskripsi'}\n`;
            replyText += `👍 *Suka:* ${v.stats.likes} | 💬 *Komen:* ${v.stats.comments} | 🔗 *Share:* ${v.stats.shares}\n`;
            replyText += `🌐 *Link:* ${v.url}\n\n`;
        });

        await m.reply(replyText.trim());

    } catch (e) {
        if (e !== false) {
            console.log(e);
            throw e;
        }
    }
};

handler.help = ['douyinsearch <query>'];
handler.tags = ['search', 'internet'];
handler.command = /^(douyinsearch|caridouyin|searchdouyin|douyins)$/i;
handler.limit = true;

export default handler;
