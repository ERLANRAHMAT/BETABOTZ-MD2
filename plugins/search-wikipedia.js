import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        throw `Masukkan kata kunci yang ingin dicari di Wikipedia.\n\n*Contoh:*\n${usedPrefix + command} pohon`;
    }

    try {
        await m.reply(`Sedang mencari informasi tentang *${text}* di Wikipedia...`);

        const apiUrl = `https://api.betabotz.eu.org/api/search/wikipedia?apikey=${lann}&text=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl);
        const resData = response.data;

        if (!resData || !resData.status || !resData.result) {
            throw 'Artikel tidak ditemukan. Coba gunakan kata kunci pencarian yang lain.';
        }

        const data = resData.result;
        
        let replyText = `📚 *WIKIPEDIA SEARCH* 📚\n\n`;
        replyText += `*Judul:* ${data.title}\n`;
        replyText += `━─━─━─━─━─━─━─━─━─━─━\n\n`;
        replyText += `*Penjelasan:*\n${data.isi}`;

        if (data.thumb) {
            await conn.sendFile(m.chat, data.thumb, 'wikipedia.jpg', replyText.trim(), m);
        } else {
            await m.reply(replyText.trim());
        }

    } catch (e) {
        if (e !== false) {
            console.log(e);
            throw e;
        }
    }
};

handler.help = ['wikipedia <pencarian>'];
handler.tags = ['internet', 'search'];
handler.command = /^(wiki|wikipedia)$/i;
handler.limit = true;

export default handler;