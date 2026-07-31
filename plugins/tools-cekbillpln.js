let fetch = require('node-fetch');

let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) throw `*Contoh Penggunaan:*\n${usedPrefix + command} 172720204487`;
    
    await m.reply(wait);
    
    try {
        let res = await fetch(`https://api.betabotz.eu.org/api/tools/cekbillpln?id=${text}&apikey=${global.lann}`);
        let json = await res.json();
        
        if (json.status && json.result) {
            let r = json.result;
            
            let content = `
┌─⊷ *TAGIHAN PLN*
▢ *Nama:* ${r['Nama Pelanggan'] || '-'}
▢ *ID Pelanggan:* ${r['Nomor ID Pelanggan'] || '-'}
▢ *Tarif / Daya:* ${r['Tarif / Daya'] || '-'}
▢ *Periode:* ${r['Periode'] || '-'}
▢ *Stand Meter:* ${r['Stand Meter'] || '-'}
▢ *Denda:* ${r['Denda'] || '-'}
▢ *Biaya Admin:* ${r['Biaya Admin'] || '-'}
▢ *Jumlah Tagihan:* ${r['Jumlah Tagihan'] || '-'}
└──────────────
`.trim();

            await m.reply(content);
        } else {
            throw '❌ Data tagihan tidak ditemukan atau ID pelanggan salah.';
        }
    } catch (error) {
        if (error !== false) {
            console.log(error);
            throw error;
        }
    }
};

handler.command = handler.help = ['cekbillpln','tagihanpln','pln'];
handler.tags = ['tools'];
handler.limit = true;
module.exports = handler;