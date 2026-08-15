
import fetch from 'node-fetch';

let handler: WaPlugin = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        throw `*❌ Masukkan NIM atau Nama Mahasiswa!*\n\n*Contoh Penggunaan:*\n${usedPrefix + command} 11123232\n${usedPrefix + command} Satria Nugraha`;
    }

    try {
        await m.reply('⏳ _Sedang mencari data di database PDDIKTI, tunggu sebentar..._');
        let apiUrl = `https://api.betabotz.eu.org/api/tools/pddikti-mahasiswa?aksesKey=${aksesKey}&query=${encodeURIComponent(text.trim())}`;
        let res = await fetch(apiUrl);
        let json = await res.json();

        if (!json.status) throw '⚠️ Gagal mengambil data dari server PDDIKTI.';

        let details = json.result.details;
        if (!details || details.length === 0) {
            return m.reply(`❌ Data mahasiswa dengan kata kunci *"${text}"* tidak ditemukan.\n\n_Pastikan NIM atau Nama diketik dengan benar._`);
        }
        let txt = `🎓 *DATA MAHASISWA PDDIKTI* 🎓\n\n`;
        txt += `🔍 Pencarian: *${text}*\n`;
        txt += `📊 Total Ditemukan: *${details.length}* Data\n\n`;
        txt += `───────────────────\n\n`;

        let limit = 5;
        for (let i = 0; i < details.length && i < limit; i++) {
            let d = details[i];
            
            let nimBersih = d.nim ? d.nim.trim() : '-';
            let gender = d.jenis_kelamin === 'L' ? 'Laki-laki ♂️' : d.jenis_kelamin === 'P' ? 'Perempuan ♀️' : d.jenis_kelamin;

            txt += `*${i + 1}. ${d.nama}*\n`;
            txt += `  • *ID:* ${d.id}\n`;
            txt += `  • *NIM:* ${nimBersih}\n`;
            txt += `  • *Kampus:* ${d.nama_pt}\n`;
            txt += `  • *Prodi:* ${d.prodi} (${d.jenjang})\n`;
            txt += `  • *Gender:* ${gender}\n`;
            txt += `  • *Status:* ${d.status_saat_ini}\n`;
            txt += `  • *Tgl Masuk:* ${d.tanggal_masuk}\n\n`;
        }

        if (details.length > limit) {
            txt += `_...dan *${details.length - limit}* hasil lainnya disembunyikan._\n`;
            txt += `💡 _Ketik NIM atau Nama yang lebih spesifik untuk hasil yang lebih akurat._\n\n`;
        }

        txt += `_${global.wm}_`;

        await conn.sendMessage(m.chat, { text: txt.trim() }, { quoted: m });

    } catch (e) {
        console.error(e);
        throw e;
    }
};

handler.help = ['pddikti <nim/nama>'];
handler.tags = ['tools'];
handler.command = /^(pddikti|pddiktimahasiswa|cekmhs)$/i;
handler.limit = true;

export default handler;
