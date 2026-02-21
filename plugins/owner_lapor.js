let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`*CARA KIRIM BUKTI*\n\n- Screenshot error fitur nya, harus jelas!\n\n- Kirim/Reply gambar screenshotannya dengan caption *${usedPrefix}${command} error fitur nya minn*\n\n`)
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || '';
    if (/^image/.test(mime) && !/webp/.test(mime)) {
        if (text.length < 5) throw `teks terlalu pendek. kirim yang benar!`
        if (text.length > 100) throw `teks terlalu panjang, maksimal 100 karakter!`
        let img = await q.download();
        let teks = `*PESAN ERROR!*\n\nDari : *@${m.sender.split`@`[0]}*\n\nPESAN : ${text}\n`;
        conn.sendMessage(global.groupLapor,{
            image: img,
            caption: teks,
            contextInfo: {
                mentionedJid: [
                    m.sender,
                    ...global.owner.map(v => v + "@s.whatsapp.net")
                ]
            }
        });

        m.reply(`Pesan terkirim ke owner!\n\n mohon tunggu ya :D`);
    } else {
        m.reply(`*Reply atau Kirim gambar screenshot error nya dengan caption* \`${usedPrefix}fitur, error nya apa\``);
    }
}
handler.help = ['lapor', 'laporowner'].map(v => v + ' <teks>');
handler.tags = ['main'];
handler.command = /^(lapor|laporowner)$/i;
module.exports = handler;


// let handler = async (m, { conn, text, usedPrefix, command }) => {
//     if (!text) return m.reply(`*CARA KIRIM BUKTI*\n\n- Screenshot bukti pembayaran\n\n- Kirim/Reply gambar screenshotannya dengan caption *${usedPrefix}${command} paket pembelian, username*\n\n`)
//     let q = m.quoted ? m.quoted : m;
//     let mime = (q.msg || q).mimetype || q.mediaType || '';
//     if (/^image/.test(mime) && !/webp/.test(mime)) {
//         let img = await q.download();
//         let teks = `*PEMBELIAN API!*\n\nDari : *@${m.sender.split`@`[0]}*\n\nPAKET & USERNAME : ${text}\n`;
//
//         // Mendapatkan data grup
//         let groupId = '120363361439264023@g.us'; // ID grup
//         let groupMetadata = await conn.groupMetadata(groupId);
//         let participants = groupMetadata.participants.map(p => p.id); // Mendapatkan semua anggota grup
//
//         // Mengirim pesan dengan tag all
//         conn.sendMessage(groupId, {
//             image: img,
//             caption: teks,
//             contextInfo: {
//                 mentionedJid: participants // Menandai semua anggota grup
//             }
//         });
//
//         m.reply(`Pesan terkirim ke semua anggota grup!\n\n> jika tidak ada respon/ penambahan paket API selama 2 jam kirim kembali laporan nya :)`);
//     } else {
//         m.reply(`*Reply atau Kirim gambar screenshot bukti pembayaran caption* \`${usedPrefix}paket pembelian, username\``);
//     }
// }
// handler.help = ['payapi', 'pay'].map(v => v + ' <teks>');
// handler.tags = ['main'];
// handler.command = /^(pay|payapi)$/i;
// handler.private = true;
// module.exports = handler;

