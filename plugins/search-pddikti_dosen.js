import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        throw `*❌ Masukkan Nama Dosen!*\n\n*Contoh Penggunaan:*\n${usedPrefix + command} jokowi`;
    }

    try {
        await m.reply('⏳ _Sedang mencari data dosen di database PDDIKTI, tunggu sebentar..._');

        let apiUrl = `https://api.betabotz.eu.org/api/tools/pddikti-dosen?aksesKey=${aksesKey}&query=${encodeURIComponent(text.trim())}`;
        
        let res = await fetch(apiUrl);
        let json = await res.json();

        if (!json.status) throw '⚠️ Gagal mengambil data dari server PDDIKTI.';

        let details = json.result.details;

        if (!details || details.length === 0) {
            return m.reply(`❌ Data dosen dengan kata kunci *"${text}"* tidak ditemukan.\n\n_Pastikan Nama diketik dengan benar._`);
        }

        let txt = `🎓 *DATA DOSEN PDDIKTI* 🎓\n\n`;
        txt += `🔍 Pencarian: *${text}*\n`;
        txt += `📊 Total Ditemukan: *${details.length}* Data\n\n`;
        txt += `───────────────────\n\n`;

        let limit = 5;
        for (let i = 0; i < details.length && i < limit; i++) {
            let d = details[i];
            
            let gender = d.jenis_kelamin === 'Laki-laki' ? 'Laki-laki ♂️' : d.jenis_kelamin === 'Perempuan' ? 'Perempuan ♀️' : d.jenis_kelamin;

            txt += `*${i + 1}. ${d.nama_dosen}*\n`;
            txt += `  • *ID:* ${d.id_sdm}\n`;
            txt += `  • *Kampus:* ${d.nama_pt || '-'}\n`;
            txt += `  • *Prodi:* ${d.nama_prodi || '-'}\n`;
            txt += `  • *Gender:* ${gender}\n`;
            txt += `  • *Jabatan:* ${d.jabatan_akademik || '-'}\n`;
            txt += `  • *Pendidikan:* ${d.pendidikan_tertinggi || '-'}\n`;
            txt += `  • *Status:* ${d.status_aktivitas || '-'}\n\n`;
        }

        if (details.length > limit) {
            txt += `_...dan *${details.length - limit}* hasil lainnya disembunyikan._\n`;
            txt += `💡 _Ketik Nama yang lebih spesifik untuk hasil yang lebih akurat._\n\n`;
        }

        txt += `_${global.wm}_`;

        await conn.sendMessage(m.chat, { text: txt.trim() }, { quoted: m });

    } catch (e) {
        console.error(e);
        throw e;
    }
};

handler.help = ['pddiktidosen <nama>'];
handler.tags = ['tools'];
handler.command = /^(pddiktidosen|cekdosen)$/i;
handler.limit = true;

export default handler;