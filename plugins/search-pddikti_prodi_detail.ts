// @ts-nocheck
// Converted from plugins-esm - automated
import fetch from 'node-fetch';

let handler: WaPlugin = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        throw `*❌ Masukkan ID Program Studi!*\n\n_Catatan: Kamu harus mencari program studi menggunakan perintah *${usedPrefix}pddiktiprodi* terlebih dahulu untuk mendapatkan ID uniknya._\n\n*Contoh:*\n${usedPrefix + command} pKofA455pjsU8xbN6fdZyH_Yjz...`;
    }

    try {
        await m.reply('⏳ _Sedang mengambil detail program studi..._');

        let apiUrl = `https://api.betabotz.eu.org/api/tools/pddikti-prodi-detail?aksesKey=${aksesKey}&id=${encodeURIComponent(text.trim())}`;
        
        let res = await fetch(apiUrl);
        let json = await res.json();

        if (!json.status) throw '⚠️ Gagal mengambil detail data program studi dari server PDDIKTI.';

        let d = json.result;
        
        if (!d) {
            return m.reply(`❌ Data detail untuk ID Prodi tersebut tidak ditemukan.`);
        }

        let txt = `🎓 *DETAIL PROGRAM STUDI* 🎓\n\n`;
        
        for (let key in d) {
            if (key === 'id_sp' || key === 'id_sms') continue;
            
            if (d[key] !== null && typeof d[key] !== 'object' && d[key] !== '') {
                let label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                let value = String(d[key]).replace('T00:00:00Z', '').trim();
                
                txt += `  • *${label}:* ${value}\n`;
            }
        }

        txt += `\n_${global.wm}_`;

        await conn.sendMessage(m.chat, { text: txt.trim() }, { quoted: m });

    } catch (e) {
        console.error(e);
        throw e;
    }
};

handler.help = ['detailprodi <id>'];
handler.tags = ['tools'];
handler.command = /^(detailprodi|pddiktiprodidetail)$/i;
handler.limit = true;

export default handler;
