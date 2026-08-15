// @ts-nocheck
// Converted from plugins-esm - automated
import axios from 'axios';

let handler: WaPlugin = async (m, { conn, text, usedPrefix, command }) => {
    if (!text || !text.includes('|')) {
        throw `Masukkan dua tipe HP yang ingin dibandingkan dengan pemisah '|'.\n\n*Contoh:*\n${usedPrefix + command} Redmi Note 14 | Redmi Note 15`;
    }

    const [hp1, hp2] = text.split('|').map(v => v.trim());
    if (!hp1 || !hp2) {
        throw `Format salah! Pastikan ada dua nama HP yang dimasukkan.\n\n*Contoh:*\n${usedPrefix + command} iPhone 15 | Samsung S24`;
    }

    try {
        await m.reply(`⏳ Sedang membandingkan spesifikasi:\n1️⃣ *${hp1}*\n2️⃣ *${hp2}*...`);

        const apiUrl = `https://api.betabotz.eu.org/api/tools/compare-phone?apikey=${lann}&hp1=${encodeURIComponent(hp1)}&hp2=${encodeURIComponent(hp2)}`;
        const response = await axios.get(apiUrl);
        const resData = response.data;

        if (!resData || !resData.status || !resData.result || !resData.result.status) {
            throw 'Gagal mendapatkan data komparasi. Pastikan nama HP ditulis dengan benar.';
        }

        const data = resData.result;
        const p1Name = data.phone1.title;
        const p2Name = data.phone2.title;

        let replyText = `📱 *KOMPARASI SMARTPHONE* 📱\n\n`;
        replyText += `1️⃣ *${p1Name}*\n`;
        replyText += `      🆚\n`;
        replyText += `2️⃣ *${p2Name}*\n\n`;
        replyText += `━─━─━─━─━─━─━─━─━─━─━\n\n`;

        data.sections.forEach(sec => {
            if (sec.section.toUpperCase() === 'ARTIKEL TERKAIT') return;

            let sectionContent = `*┌ ⊜ [ ${sec.section} ]*\n`;
            let hasValidRows = false;

            sec.rows.forEach(row => {
                if (!row.label || row.label.includes('Cek Harga') || row.label.includes('Tentang Kami') || row.value1.includes('Halaman Spesifikasi')) {
                    return;
                }

                hasValidRows = true;
                sectionContent += `*├ 🏷️ ${row.label}*\n`;
                sectionContent += `*│ 1️⃣* ${row.value1 || '-'}\n`;
                sectionContent += `*│ 2️⃣* ${row.value2 || '-'}\n`;
            });

            if (hasValidRows) {
                sectionContent += `*└───────────────*\n\n`;
                replyText += sectionContent;
            }
        });

        await m.reply(replyText.trim());

    } catch (e) {
        if (e !== false) {
            console.log(e);
            throw e;
        }
    }
};

handler.help = ['comparehp <hp1> | <hp2>'];
handler.tags = ['tools'];
handler.command = /^(comparehp|bandingkanhp|vs)$/i;

export default handler;
