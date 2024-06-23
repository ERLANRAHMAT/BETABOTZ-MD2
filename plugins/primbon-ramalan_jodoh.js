const fetch = require('node-fetch');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Masukkan Nama dan Tanggal Lahir!\n\ncontoh: ${usedPrefix + command} dani,14,05,2006|dini,12,09,2008`;

    try {
        let [part1, part2] = text.split('|');
        let [nama1, tanggal1, bulan1, tahun1] = part1.split(',');
        let [nama2, tanggal2, bulan2, tahun2] = part2.split(',');
        
        await m.reply(wait);

        let res = await fetch(`https://api.betabotz.eu.org/api/primbon/ramalanjodoh?nama1=${nama1}&tanggal1=${tanggal1}&bulan1=${bulan1}&tahun1=${tahun1}&nama2=${nama2}&tanggal2=${tanggal2}&bulan2=${bulan2}&tahun2=${tahun2}&apikey=${lann}`);
        let json = await res.json();
        let anu = [
          `―-RAMALAN JODOH-―\n\nNama kamu: ${json.result.message.nama_anda.nama}\n\nTanggal lahir kamu:${json.result.message.nama_anda.tgl_lahir}\n\nPasangan kamu:${json.result.message.nama_pasangan.nama}Tanggal lahir pasangan kamu:\n\n${json.result.message.nama_pasangan.tgl_lahir}\n\nPenjelasan:${json.result.message.result}`, 
       ]
        if (json.status) {
      //  await m.reply(json.result.message.nama_anda.nama);
         conn.reply(m.chat,`${(anu)}`);;
            //conn.reply(m.chat, `―-HASIL RAMALAN JODOH-―\n\nNama 1: ${nama1}\nTanggal Lahir 1: ${tanggal1}-${bulan1}-${tahun1}\n\nNama 2: ${nama2}\nTanggal Lahir 2: ${tanggal2}-${bulan2}-${tahun2}\n\nHasil: ${json.result.kecocokan}`, m);
        } else {
            conn.reply(m.chat, `Maaf, terjadi kesalahan: ${json.message}`, m);
        }
    } catch (e) {
    throw e
        //throw `Internal server error!\n\nUlangi lagi perintah.`;
    }
}

handler.help = ['ramalanjodoh']
handler.tags = ['fun']
handler.command = /^(ramalanjodoh)$/i
handler.group = true

module.exports = handler;

//danaputra133
//di bantu erlan aka