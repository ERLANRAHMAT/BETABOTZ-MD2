
import axios from 'axios';

let handler: WaPlugin = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Masukkan URL!\n\nContoh:\n${usedPrefix + command} http://xhslink.com/a/1N9OyfeL9EFab`;
    if (!text.match(/xhslink|xiaohongshu/gi)) throw `URL Tidak Valid!`;
    try {
        m.reply(wait);
        const res = await axios.get(`https://api.betabotz.eu.org/api/download/rednote?url=${text}&apikey=${btc}`);
        const result = res.data?.result;
        if (!result || !result.media) throw `Gagal mengambil data!`;

        const media = result.media;
        const meta = result.metadata;
        const title = meta?.title || "No title";

        if (media.videoUrl) {
            await conn.sendMessage(
                m.chat,
                {
                    video: { url: media.videoUrl },
                    caption: `*Title:* ${title}`,
                },
                { quoted: m }
            );
        } else if (media.images && media.images.length > 0) {
            for (let img of media.images) {
                await sleep(2000);
                await conn.sendMessage(
                    m.chat,
                    {
                        image: { url: img },
                        caption: `*Title:* ${title}`,
                    },
                    { quoted: m }
                );
            }
        } else {
            throw `Konten tidak ditemukan!`;
        }

    } catch (e) {
       console.log(e);
      throw e;
    }
};

handler.help = ['xiaohongshu', 'rednote'];
handler.command = /^(xiaohongshu|xhs|xhsdl|rednote)$/i;
handler.tags = ['downloader'];
handler.limit = true;
handler.premium = false;



function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default handler;
