import uploadImage from '../lib/uploadImage.js';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || "";
    let guide = `Kirim gambar (atau balas gambar) dengan caption seperti berikut:\n\n*${usedPrefix + command}*\nbio: [isi bio kamu]\nnama: [isi nama kamu]\nponsel: [isi nomor ponsel]\nusername: [isi username]\n\n*Contoh:*\n${usedPrefix + command}\nbio: Just a dev\nnama: Budi Santoso\nponsel: +6281234567890\nusername: budisantoso`;

    if (!mime || !/image\/(png|jpe?g)/.test(mime)) {
        return m.reply(`*❌ Media tidak ditemukan!*\n\n${guide}`);
    }

    let input = text || m.text || q.caption || q.text || '';
    let bioMatch = input.match(/bio\s*:\s*([^\n]+)/i);
    let namaMatch = input.match(/nama\s*:\s*([^\n]+)/i);
    let ponselMatch = input.match(/ponsel\s*:\s*([^\n]+)/i);
    let usernameMatch = input.match(/username\s*:\s*([^\n]+)/i);

    if (!bioMatch || !namaMatch || !ponselMatch || !usernameMatch) {
        return m.reply(`*❌ Terdapat kesalahan atau data yang kurang pada isian!*\n\nPastikan format kamu sama persis dengan panduan di bawah ini dan tidak menghapus tanda \`:\`\n\n${guide}`);
    }

    let bio = bioMatch[1].trim();
    let nama = namaMatch[1].trim();
    let ponsel = ponselMatch[1].trim();
    let username = usernameMatch[1].trim();

    try {
        await m.reply('⏳ _Sedang mengunggah gambar dan membuat Fake Telegram..._');
        let media = await q.download();
        let link = await uploadImage(media);

        if (!link) throw 'Gagal mengunggah gambar ke server.';
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

export default handler;