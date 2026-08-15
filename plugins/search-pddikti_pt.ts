
import fetch from 'node-fetch';

let handler: WaPlugin = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        throw `*❌ Masukkan Nama Perguruan Tinggi!*\n\n*Contoh Penggunaan:*\n${usedPrefix + command} Gunadarma`;
    }

    try {
        await m.reply('⏳ _Sedang mencari data perguruan tinggi di database PDDIKTI, tunggu sebentar..._');

        let apiUrl = `https://api.betabotz.eu.org/api/tools/pddikti-pt?aksesKey=${aksesKey}&query=${encodeURIComponent(text.trim())}`;
        
        let res = await fetch(apiUrl);
        let json = await res.json();

        if (!json.status) throw '⚠️ Gagal mengambil data dari server PDDIKTI.';

        let details = json.result.details;

        if (!details || details.length === 0) {
            return m.reply(`❌ Data perguruan tinggi dengan kata kunci *"${text}"* tidak ditemukan.\n\n_Pastikan ejaan diketik dengan benar._`);
        }

        let txt = `🎓 *DATA PERGURUAN TINGGI PDDIKTI* 🎓\n\n`;
        txt += `🔍 Pencarian: *${text}*\n`;
        txt += `📊 Total Ditemukan: *${details.length}* Data\n\n`;
        txt += `───────────────────\n\n`;

        let limit = 5;
        for (let i = 0; i < details.length && i < limit; i++) {
            let d = details[i];
            let namaSingkat = d.nm_singkat ? ` (${d.nm_singkat})` : '';

            txt += `*${i + 1}. ${d.nama_pt}${namaSingkat}*\n`;
            txt += `  • *ID:* ${d.id_sp}\n`;
            txt += `  • *Kode PT:* ${d.kode_pt ? d.kode_pt.trim() : '-'}\n`;
            txt += `  • *Kelompok:* ${d.kelompok || '-'}\n`;
            txt += `  • *Pembina:* ${d.pembina || '-'}\n`;
            txt += `  • *Lokasi:* ${d.kab_kota_pt || '-'}, ${d.provinsi_pt || '-'}\n`;
            txt += `  • *Status:* ${d.status_pt || '-'}\n`;
            txt += `  • *Akreditasi:* ${d.akreditasi_pt || '-'}\n\n`;
        }

        if (details.length > limit) {
            txt += `_...dan *${details.length - limit}* hasil lainnya disembunyikan._\n`;
            txt += `💡 _Ketik Nama Perguruan Tinggi yang lebih spesifik untuk hasil yang lebih akurat._\n\n`;
        }

        txt += `_${global.wm}_`;

        await conn.sendMessage(m.chat, { text: txt.trim() }, { quoted: m });

    } catch (e) {
        console.error(e);
        throw e;
    }
};

handler.help = ['pddiktipt <nama>'];
handler.tags = ['tools'];
handler.command = /^(pddiktipt|cekpt|kampus|cekkampus)$/i;
handler.limit = true;

export default handler;
