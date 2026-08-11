import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        throw `*❌ Masukkan ID Program Studi!*\n\n_Catatan: Kamu harus mencari nama program studi menggunakan perintah *${usedPrefix}pddiktiprodi* terlebih dahulu untuk mendapatkan ID uniknya._\n\n*Contoh:*\n${usedPrefix + command} fIPgFfJW1U9HKnzDtWywj75aS8...`;
    }

    try {
        await m.reply('⏳ _Sedang mengambil data biaya kuliah program studi..._');

        let apiUrl = `https://api.betabotz.eu.org/api/tools/pddikti-prodi-cost-range?aksesKey=${aksesKey}&id=${encodeURIComponent(text.trim())}`;
        
        let res = await fetch(apiUrl);
        let json = await res.json();

        if (!json.status) throw '⚠️ Gagal mengambil data biaya kuliah dari server PDDIKTI.';

        let d = json.result;

        if (!d || !d.range_biaya_kuliah) {
            return m.reply(`❌ Data biaya kuliah untuk ID Prodi tersebut tidak ditemukan.`);
        }
        
        let txt = `🎓 *INFORMASI BIAYA KULIAH PRODI* 🎓\n\n`;
        txt += `  • *Nama Prodi:* ${d.nama_prodi || '-'}\n`;
        txt += `  • *Range Biaya:* Rp ${d.range_biaya_kuliah || '-'}\n`;
        
        txt += `\n_${global.wm}_`;

        await conn.sendMessage(m.chat, { text: txt.trim() }, { quoted: m });

    } catch (e) {
        console.error(e);
        throw e;
    }
};

handler.help = ['biayaprodi <id>'];
handler.tags = ['tools'];
handler.command = /^(biayaprodi|pddiktibiaya|biayakuliah)$/i;
handler.limit = true;

export default handler;