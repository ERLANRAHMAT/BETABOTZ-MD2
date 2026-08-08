import uploadImage from '../lib/uploadImage.js';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || "";

    let guide = `Kirim gambar (atau balas gambar) dengan caption seperti berikut:\n\n*${usedPrefix + command}*\nbio: [isi bio kamu]\nnama: isi nama kamu\nponsel: isi nomor ponsel\nusername: isi username\n\n*Contoh:*\n${usedPrefix + command}\nbio: Just a dev\nnama: Budi Santoso\nponsel: +6281234567890\nusername: budisantoso\n\n*⚠️ Peringatan:* Jangan hapus tanda titik dua (\`:\`) karena berfungsi sebagai pemisah data!`;

    if (!mime || !/image\/(png|jpe?g)/.test(mime)) {
        throw guide;
    }

    let bioMatch = text.match(/bio\s*:\s*(.+)/i);
    let namaMatch = text.match(/nama\s*:\s*(.+)/i);
    let ponselMatch = text.match(/ponsel\s*:\s*(.+)/i);
    let usernameMatch = text.match(/username\s*:\s*(.+)/i);
    if (!bioMatch || !namaMatch || !ponselMatch || !usernameMatch) {
        throw `*❌ Terdapat kesalahan atau data yang kurang pada isian!*\n\nPastikan format kamu sama persis dengan panduan di bawah ini dan tidak menghapus tanda \`:\`\n\n${guide}`;
    }
    let bio = bioMatch[1].trim();
    let nama = namaMatch[1].trim();
    let ponsel = ponselMatch[1].trim();
    let username = usernameMatch[1].trim();

    try {
        await m.reply('⏳ _Sedang mengunggah gambar dan membuat Fake Telegram..._');

        let media = await q.download();
        let link = await uploadImage(media);

        let apiUrl = `https://api.betabotz.eu.org/api/maker/canvas-fakeTele?apikey=${lann}&bio=${encodeURIComponent(bio)}&nama=${encodeURIComponent(nama)}&ponsel=${encodeURIComponent(ponsel)}&url=${encodeURIComponent(link)}&username=${encodeURIComponent(username)}`;

        await conn.sendFile(m.chat, apiUrl, 'faketele.jpg', 'Done!', m);
        
    } catch (e) {
        console.log(e);
        throw e;
    }
};

handler.help = ['faketele'];
handler.tags = ['maker'];
handler.command = /^(faketele)$/i;
handler.limit = true;
handler.group = true;

export default handler;