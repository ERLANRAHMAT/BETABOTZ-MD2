import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        throw `*❌ Masukkan ID Mahasiswa!*\n\n_Catatan: Kamu harus mencari nama/nim mahasiswa menggunakan perintah *${usedPrefix}pddikti* terlebih dahulu untuk mendapatkan ID uniknya._\n\n*Contoh:*\n${usedPrefix + command} F3Gmku5nnASY6UE_ETjgHSTd_...`;
    }

    try {
        await m.reply('⏳ _Sedang mengambil detail mahasiswa..._');

        let apiUrl = `https://api.betabotz.eu.org/api/tools/pddikti-mahasiswa-detail?aksesKey=${lann}&id=${encodeURIComponent(text.trim())}`;
        
        let res = await fetch(apiUrl);
        let json = await res.json();

        if (!json.status) throw '⚠️ Gagal mengambil detail data dari server PDDIKTI.';

        let d = json.result;
        
        let txt = `🎓 *DETAIL MAHASISWA* 🎓\n\n`;
        
        for (let key in d) {
            if (d[key] !== null && typeof d[key] !== 'object') {
                let label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                txt += `  • *${label}:* ${String(d[key]).trim()}\n`;
            }
        }

        txt += `\n_${global.wm}_`;

        await conn.sendMessage(m.chat, { text: txt.trim() }, { quoted: m });

    } catch (e) {
        console.error(e);
        throw e;
    }
};

handler.help = ['detailmhs <id>'];
handler.tags = ['tools'];
handler.command = /^(detailmhs|pddiktidetail)$/i;
handler.limit = true;

export default handler;