// @ts-nocheck
// Converted from plugins-esm - automated
import axios from 'axios';

let handler: WaPlugin = async (m, { conn, text, usedPrefix, command }) => {
    let quoteText = text || (m.quoted ? m.quoted.text : '');
    if (!quoteText) {
        throw `Masukkan teks atau reply sebuah pesan.\n\n*Contoh:*\n${usedPrefix + command} Kata-kata mutiara`;
    }
    if (quoteText.length > 500) return m.reply('Teks terlalu panjang, maksimal 500 karakter!');
    try {
        const apiUrl = `https://api.betabotz.eu.org/api/maker/iqc?text=${encodeURIComponent(quoteText)}&apikey=${lann}`;

        const response = await axios.get(apiUrl, {
            responseType: 'arraybuffer'
        });
        conn.sendFile(m.chat, response.data,  m);
    } catch (e) {
      console.log(e);
      throw e;
    }
};

handler.help = ['iqc <teks>'];
handler.tags = ['maker', 'tools'];
handler.command = /^(iqc|imagequote)$/i;

export default handler;
