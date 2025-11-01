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

        const apiUrl = `https://api.betabotz.eu.org/api/maker/tofigurev3?url=${encodeURIComponent(mediaUrl)}&apikey=${lann}`;
        
        let res = await fetch(apiUrl);


        if (!res.ok) {
            let errorText = await res.text();
            throw `Gagal memproses gambar di API. Status: ${res.status}. Pesan: ${errorText}`;
        }

        let imageBuffer = await res.buffer();
        await conn.sendFile(m.chat, imageBuffer, 'figure.jpg', 'Ini hasilnya!', m);

    } catch (e) {
        console.error(e);
        m.reply(`Terjadi kesalahan: ${e.message}`);
    }
};

handler.help = ['tofigure3'];
handler.tags = ['maker', 'tools'];
handler.command = /^(tofigure3)$/i;

module.exports = handler;