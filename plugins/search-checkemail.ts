
import axios from 'axios';

let handler: WaPlugin = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        throw `Masukkan email yang ingin dicek.\n\n*Contoh:*\n${usedPrefix + command} email1@gmail.com, email2@gmail.com`;
    }

    try {
        await m.reply('Sedang memeriksa status email...');

        const emails = text.split(/,|\s+/).map(e => e.trim()).filter(e => e);
        
        const apiUrl = 'https://api.betabotz.eu.org/api/tools/email-check';
        const payload = {
            email: emails,
            apikey: lann
        };

        const response = await axios.post(apiUrl, payload);
        const resData = response.data;

        if (!resData || !resData.result) {
            throw 'Gagal mendapatkan data yang valid dari API.';
        }

        const data = resData.result;
        let replyText = `*📧 Hasil Pengecekan Email*\n\n`;
        
        replyText += `📊 *Statistik:*\n`;
        replyText += `◦ Total: ${data.statistics.total}\n`;
        replyText += `◦ Aktif: ${data.statistics.active} (${data.statistics.active_percentage})\n`;
        replyText += `◦ Tidak Aktif: ${data.statistics.inactive} (${data.statistics.inactive_percentage})\n\n`;

        if (data.active_emails && data.active_emails.length > 0) {
            replyText += `✅ *Email Aktif:*\n◦ ${data.active_emails.join('\n◦ ')}\n\n`;
        }
        
        if (data.inactive_emails && data.inactive_emails.length > 0) {
            replyText += `❌ *Email Tidak Aktif:*\n◦ ${data.inactive_emails.join('\n◦ ')}`;
        }

        await m.reply(replyText.trim());

    } catch (e) {
        if (e !== false) {
            console.log(e);
            throw e;
        }
    }
};

handler.help = ['checkemail <email1, email2>'];
handler.tags = ['tools'];
handler.command = /^(checkemail|cekemail|emailcheck)$/i;

export default handler;
