import yts from 'yt-search';
import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `[❗] *Penggunaan:* ${usedPrefix + command} <search>`;   
    try {
        conn.sendMessage(m.chat, { react: { text: '🎧', key: m.key }})
        let anu = (await yts(text)).all
        let video = anu.filter(v => v.type === 'video') 
        let channel = anu.filter(v => v.type === 'channel') 
        if (!anu) throw 'Video/Audio Tidak Ditemukan';
        let { title } = anu;
        let responseText = '[❗] Balas pesan ini dengan nomor untuk mendapatkan lagunya.\n\n';
        video.forEach(async(data, index) => {
            responseText += `*${index + 1}.* ${data.title} || ${data.timestamp}\n`;
        });
        const { key } = await conn.reply(m.chat, responseText, m);   
        conn.ytsvideo[m.sender] = { anu, key, title };
    } catch (e) {
        if (e !== false) {
            console.log(e);
            throw e;
        }
    }
}

handler.before = async (m, { conn }) => {
    try {
        conn.ytsvideo = conn.ytsvideo ? conn.ytsvideo : {};
        if (m.isBaileys || !(m.sender in conn.ytsvideo)) return;
        const { anu, key, title } = conn.ytsvideo[m.sender];
        if (!m.quoted || m.quoted.id !== key.id || !m.text) return;
        const choice = m.text.trim();
        const inputNumber = Number(choice);
        if (inputNumber >= 1 && inputNumber <= anu.length) {
            conn.sendMessage(m.chat, { delete: key });
            delete conn.ytsvideo[m.sender];
            const selectedTrack = anu[inputNumber - 1];
            try {
                if (selectedTrack.seconds >= 3600) {
                    return conn.reply(m.chat, 'Video is longer than 1 hour!', m);
                } else {
                    let videoUrl = await youtube(selectedTrack.url);
                    let videoLink = videoUrl.result.mp4
                    let captions = '';
                    captions += `∘ Title : ${selectedTrack.title}\n`;
                    captions += `∘ Duration : ${selectedTrack.timestamp}\n`;
                    captions += `∘ Viewers : ${selectedTrack.views}\n`;
                    captions += `∘ Upload At : ${selectedTrack.ago}\n`;
                    captions += `∘ Url : ${selectedTrack.url}\n`;
                    captions += `∘ Description : ${selectedTrack.description}\n`;

                    conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key }})
                    await conn.sendMessage(m.chat, { video: { url: videoLink }, caption: captions }, { quoted: m });
                }
            } catch (error) {
                console.error('Error downloading and sending audio:', error);
                await conn.reply(m.chat, 'error saat menngambil data, coba lagi dengan nomor yang lain tau hubungi owner!', m);
                conn.sendMessage(m.chat, { react: { text: '🚫', key: m.key }})
            }
        } else {
            await conn.reply(m.chat, "[❗] Nomor urut tidak valid. Silakan pilih nomor yang sesuai dengan daftar di atas.", m);
            conn.sendMessage(m.chat, { react: { text: '🚫', key: m.key }})
        }
    } catch (e) {
        if (e !== false) {
            console.log(e);
        }
    }
};

handler.help = ['yts4 <pencarian>'];
handler.tags = ['downloader'];
handler.command = /^(yts4)$/i;
handler.limit = true;

export default handler;

async function youtube(url) {
   try {
       const { data } = await axios.get("https://api.betabotz.eu.org/api/download/yt?url="+url+"&apikey="+lann)
       return data;
   } catch (e) {
       return e;
   }
}