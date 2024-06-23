const fetch = require('node-fetch');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Masukkan Nama dan Tanggal Lahir!\n\ncontoh: ${usedPrefix + command} cowo|cewe`;

    try {
        let [part1, part2] = text.split('|');
        let [nama1] = part1.split(',');
        let [nama2] = part2.split(',');
        
        await m.reply(wait);

        let res = await fetch(`https://api.betabotz.eu.org/api/primbon/kecocokanpasangan?cowo=${nama1}&cewe=${nama2}&apikey=${lann}`);
        let json = await res.json();
        let anu = [
          `―-KECOCOKAN PASANGAN-―\n\nNama kamu: ${json.result.message.nama_anda}\n\nNama pasangan kamu: ${json.result.message.nama_pasangan}\n\nSisi positif:${json.result.message.sisi_positif}\n\nSisi negatif:${json.result.message.sisi_negatif}\n\nCatatan:${json.result.message.catatan}`, 
       ]
       
    //    var logos= [ `${json.result.message.gambar}`

    //    ]
       
        if (json.status) {
            conn.reply(m.chat,`${(anu)}`);;

        //  conn.reply(m.chat,`${(anu)}`);;
        // conn.relayMessage(m.chat, {
        //     extendedTextMessage:{
        //                     text: `${(anu)}`, 
        //                     contextInfo: {
        //                          externalAdReply: {
        //                             mediaType: 1,
        //                             previewType: 1,
        //                             renderLargerThumbnail: true,
        //                             thumbnailUrl: `${(anu1)}`,
        //                             sourceUrl: ''
        //                         }
        //                     }, mentions: [m.sender]
        //     }}, {})
         
            //conn.reply(m.chat, `―-HASIL RAMALAN JODOH-―\n\nNama 1: ${nama1}\nTanggal Lahir 1: ${tanggal1}-${bulan1}-${tahun1}\n\nNama 2: ${nama2}\nTanggal Lahir 2: ${tanggal2}-${bulan2}-${tahun2}\n\nHasil: ${json.result.kecocokan}`, m);
        } else {
            conn.reply(m.chat, `Maaf, terjadi kesalahan: ${json.message}`, m);
        }
    } catch (e) {
    throw e
        //throw `Internal server error!\n\nUlangi lagi perintah.`;
    }
}

handler.help = ['kecocokanpasangan']
handler.tags = ['fun']
handler.command = /^(kecocokanpasangan)$/i
handler.group = true

module.exports = handler;

//danaputra133
//di bantu erlan aka