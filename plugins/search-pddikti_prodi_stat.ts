// @ts-nocheck
// Converted from plugins-esm - automated
import fetch from 'node-fetch';

let handler: WaPlugin = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        throw `*❌ Masukkan ID Program Studi!*\n\n_Catatan: Kamu harus mencari program studi menggunakan perintah *${usedPrefix}pddiktiprodi* terlebih dahulu untuk mendapatkan ID uniknya._\n\n*Contoh:*\n${usedPrefix + command} fIPgFfJW1U9HKnzDtWywj75aS8...`;
    }

    try {
        await m.reply('⏳ _Sedang mengambil data statistik program studi..._');

        let apiUrl = `https://api.betabotz.eu.org/api/tools/pddikti-prodi-stat?aksesKey=${aksesKey}&id=${encodeURIComponent(text.trim())}`;
        
        let res = await fetch(apiUrl);
        let json = await res.json();

        if (!json.status) throw '⚠️ Gagal mengambil data statistik program studi dari server PDDIKTI.';

        let data = json.result;

        if (!data || data.length === 0) {
            return m.reply(`❌ Data statistik untuk ID Prodi tersebut tidak ditemukan.`);
        }

        let txt = `🎓 *STATISTIK PROGRAM STUDI* 🎓\n\n`;
        txt += `📊 Menampilkan data jumlah mahasiswa & dosen per semester:\n\n`;
        txt += `───────────────────\n\n`;

        let limit = 10;
        for (let i = 0; i < data.length && i < limit; i++) {
            let d = data[i];

            txt += `*Semester: ${d.semester}*\n`;
            txt += `  • Mahasiswa: ${d.jumlah_mahasiswa}\n`;
            txt += `  • Dosen Homebase: ${d.jumlah_dosen}\n`;
            txt += `  • Dosen Mengajar: ${d.jumlah_dosen_ajar}\n\n`;
        }

        if (data.length > limit) {
            txt += `_...dan *${data.length - limit}* semester lainnya disembunyikan._\n\n`;
        }

        txt += `_${global.wm}_`;

        await conn.sendMessage(m.chat, { text: txt.trim() }, { quoted: m });

    } catch (e) {
        console.error(e);
        throw e;
    }
};

handler.help = ['statprodi <id>'];
handler.tags = ['tools'];
handler.command = /^(statprodi|pddiktiprodistat|statistikprodi)$/i;
handler.limit = true;

export default handler;
