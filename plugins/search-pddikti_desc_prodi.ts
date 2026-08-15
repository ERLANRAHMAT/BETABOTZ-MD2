
import fetch from 'node-fetch';

let handler: WaPlugin = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        throw `*❌ Masukkan ID Program Studi!*\n\n_Catatan: Kamu harus mencari nama program studi menggunakan perintah *${usedPrefix}pddiktiprodi* terlebih dahulu untuk mendapatkan ID uniknya._\n\n*Contoh:*\n${usedPrefix + command} fIPgFfJW1U9HKnzDtWywj75aS8...`;
    }

    try {
        await m.reply('⏳ _Sedang mengambil deskripsi dan informasi lengkap program studi..._');

        let apiUrl = `https://api.betabotz.eu.org/api/tools/pddikti-prodi-desc?aksesKey=${aksesKey}&id=${encodeURIComponent(text.trim())}`;
        
        let res = await fetch(apiUrl);
        let json = await res.json();

        if (!json.status) throw '⚠️ Gagal mengambil deskripsi program studi dari server PDDIKTI.';

        let d = json.result;

        if (!d) {
            return m.reply(`❌ Data deskripsi untuk ID Prodi tersebut tidak ditemukan.`);
        }

        const cleanHTML = (str) => {
            if (!str) return '-';
            return str.replace(/<br\s*[\/]?>/gi, '\n')
                      .replace(/<[^>]+>/g, '')
                      .replace(/&nbsp;/g, ' ')
                      .trim();
        };
        
        let txt = `🎓 *INFORMASI & DESKRIPSI PRODI* 🎓\n\n`;
        txt += `  • *Kode Prodi:* ${d.kode_prodi || '-'}\n`;
        txt += `  • *Akreditasi:* ${d.akreditasi || '-'}\n`;
        txt += `  • *Rasio Pendaftar:* ${d.rasio_terima_daftar || '-'}\n`;
        txt += `  • *Jumlah Dosen:* ${d.jumlah_dosen || 0}\n`;
        txt += `  • *Jumlah Mahasiswa:* ${d.jumlah_mahasiswa || 0}\n`;
        txt += `  • *Rata-rata Masa Studi:* ${d.rata_masa_studi ? parseFloat(d.rata_masa_studi).toFixed(2) : '-'} Tahun\n\n`;
        txt += `───────────────────\n\n`;

        if (d.deskripsi_singkat) {
            txt += `*📖 Deskripsi Singkat*\n${cleanHTML(d.deskripsi_singkat)}\n\n`;
        }
        if (d.visi) {
            txt += `*👁️ Visi*\n${cleanHTML(d.visi)}\n\n`;
        }
        if (d.misi) {
            txt += `*🎯 Misi*\n${cleanHTML(d.misi)}\n\n`;
        }
        if (d.kompetensi) {
            txt += `*💡 Profil & Kompetensi*\n${cleanHTML(d.kompetensi)}\n\n`;
        }
        if (d.capaian_belajar) {
            txt += `*🏆 Capaian Belajar*\n${cleanHTML(d.capaian_belajar)}\n\n`;
        }
        
        txt += `_${global.wm}_`;

        await conn.sendMessage(m.chat, { text: txt.trim() }, { quoted: m });

    } catch (e) {
        console.error(e);
        throw e;
    }
};

handler.help = ['descprodi <id>'];
handler.tags = ['tools'];
handler.command = /^(descprodi|pddiktiprodidesc|deskripsiprodi|profilprodi)$/i;
handler.limit = true;

export default handler;
