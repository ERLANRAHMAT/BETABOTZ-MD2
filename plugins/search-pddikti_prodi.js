import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        throw `*❌ Masukkan Nama Program Studi!*\n\n*Contoh Penggunaan:*\n${usedPrefix + command} Agribisnis`;
    }

    try {
        await m.reply('⏳ _Sedang mencari data program studi di database PDDIKTI, tunggu sebentar..._');

        let apiUrl = `https://api.betabotz.eu.org/api/tools/pddikti-prodi?aksesKey=${lann}&query=${encodeURIComponent(text.trim())}`;
        
        let res = await fetch(apiUrl);
        let json = await res.json();

        if (!json.status) throw '⚠️ Gagal mengambil data dari server PDDIKTI.';

        let details = json.result.details;

        if (!details || details.length === 0) {
            return m.reply(`❌ Data Program Studi dengan kata kunci *"${text}"* tidak ditemukan.\n\n_Pastikan ejaan diketik dengan benar._`);
        }

        let txt = `🎓 *DATA PROGRAM STUDI PDDIKTI* 🎓\n\n`;
        txt += `🔍 Pencarian: *${text}*\n`;
        txt += `📊 Total Ditemukan: *${details.length}* Data\n\n`;
        txt += `───────────────────\n\n`;

        let limit = 5;
        for (let i = 0; i < details.length && i < limit; i++) {
            let d = details[i];

            txt += `*${i + 1}. ${d.nama_prodi} (${d.jenj_didik})*\n`;
            txt += `  • *ID:* ${d.id_sms}\n`;
            txt += `  • *Kampus:* ${d.nama_pt || '-'}\n`;
            txt += `  • *Akreditasi:* ${d.akreditasi || '-'}\n`;
            txt += `  • *Status:* ${d.status || '-'}\n`;
            txt += `  • *Lokasi:* ${d.kab_kota || '-'}, ${d.provinsi || '-'}\n\n`;
        }

        if (details.length > limit) {
            txt += `_...dan *${details.length - limit}* hasil lainnya disembunyikan._\n`;
            txt += `💡 _Ketik Nama Prodi yang lebih spesifik untuk hasil yang lebih akurat._\n\n`;
        }

        txt += `_${global.wm}_`;

        await conn.sendMessage(m.chat, { text: txt.trim() }, { quoted: m });

    } catch (e) {
        console.error(e);
        throw e;
    }
};

handler.help = ['pddiktiprodi <nama>'];
handler.tags = ['tools'];
handler.command = /^(pddiktiprodi|cekprodi)$/i;
handler.limit = true;

export default handler;