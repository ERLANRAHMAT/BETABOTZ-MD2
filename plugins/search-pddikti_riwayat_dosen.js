import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        throw `*❌ Masukkan ID Dosen!*\n\n_Catatan: Kamu harus mencari nama dosen menggunakan perintah *${usedPrefix}pddiktidosen* terlebih dahulu untuk mendapatkan ID uniknya._\n\n*Contoh:*\n${usedPrefix + command} ioXUz97TDRf6H8uxF69TURm...`;
    }

    try {
        await m.reply('⏳ _Sedang mengambil data riwayat mengajar dosen..._');

        let apiUrl = `https://api.betabotz.eu.org/api/tools/pddikti-dosen-riwayat-mengajar?aksesKey=${aksesKey}&id=${encodeURIComponent(text.trim())}`;
        
        let res = await fetch(apiUrl);
        let json = await res.json();

        if (!json.status) throw '⚠️ Gagal mengambil riwayat mengajar dari server PDDIKTI.';

        let data = json.result;

        if (!data || data.length === 0) {
            return m.reply(`❌ Riwayat mengajar tidak ditemukan untuk dosen dengan ID tersebut.`);
        }

        let txt = `🎓 *RIWAYAT MENGAJAR DOSEN* 🎓\n\n`;
        txt += `📊 Total Riwayat Kelas: *${data.length}* Data\n\n`;
        txt += `───────────────────\n\n`;

        let limit = 10; 
        for (let i = 0; i < data.length && i < limit; i++) {
            let d = data[i];

            txt += `*${i + 1}. ${d.nama_matkul.trim()}*\n`;
            txt += `  • *Semester:* ${d.nama_semester || '-'}\n`;
            txt += `  • *Kode MK:* ${d.kode_matkul || '-'}\n`;
            txt += `  • *Kelas:* ${d.nama_kelas || '-'}\n`;
            txt += `  • *Kampus:* ${d.nama_pt || '-'}\n\n`;
        }

        if (data.length > limit) {
            txt += `_...dan *${data.length - limit}* riwayat mengajar lainnya disembunyikan._\n\n`;
        }

        txt += `_${global.wm}_`;

        await conn.sendMessage(m.chat, { text: txt.trim() }, { quoted: m });

    } catch (e) {
        console.error(e);
        throw e;
    }
};

handler.help = ['riwayatdosen <id>'];
handler.tags = ['tools'];
handler.command = /^(riwayatdosen|pddiktiriwayat|mengajardosen)$/i;
handler.limit = true;

export default handler;