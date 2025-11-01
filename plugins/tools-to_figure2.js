const uploadImage = require('../lib/uploadImage');
const fetch = require('node-fetch');

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!/image\/(jpe?g|png)/.test(mime)) {
        throw `Balas gambar atau kirim gambar dengan caption *${usedPrefix + command}*`;
    }

    await m.reply('Sedang memproses gambar Anda...');

    try {
        let img = await q.download();
        let mediaUrl = await uploadImage(img, "true");
        if (!mediaUrl) throw 'Gagal mengunggah gambar.';

        const apiUrl = `https://api.betabotz.eu.org/api/maker/tofigurev2?url=${encodeURIComponent(mediaUrl)}&apikey=${lann}`;
        
        let res = await fetch(apiUrl);

        // --- PERBAIKAN UTAMA DI SINI ---

        // 1. Cek apakah request ke API sukses
        if (!res.ok) {
            // Jika API mengembalikan error (misal: 404, 500), coba baca errornya sebagai teks
            let errorText = await res.text();
            throw `Gagal memproses gambar di API. Status: ${res.status}. Pesan: ${errorText}`;
        }

        // 2. Ambil respons sebagai buffer gambar, bukan JSON
        let imageBuffer = await res.buffer();

        // 3. Kirim buffer gambar tersebut
        await conn.sendFile(m.chat, imageBuffer, 'figure.jpg', 'Ini hasilnya!', m);

    } catch (e) {
        console.error(e);
        m.reply(`Terjadi kesalahan: ${e.message}`);
    }
};

handler.help = ['tofigure2'];
handler.tags = ['maker', 'tools'];
handler.command = /^(tofigure2)$/i;

module.exports = handler;