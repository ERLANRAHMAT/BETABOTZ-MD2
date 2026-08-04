import uploadImage from '../lib/uploadImage.js';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || "";
        
        if (!mime) throw `Balas gambar dengan perintah\n\n${usedPrefix + command} <teks atas>|<teks bawah>`;
        if (!/image\/(jpe?g|png)/.test(mime)) throw `_*Mime ${mime} tidak didukung!*_`;

        let [atas, bawah] = text.split('|');
        atas = (atas || '').trim() || '_';
        bawah = (bawah || '').trim() || '_';

        let img = await q.download?.();
        if (!img) throw 'Gagal mengunduh gambar. Pastikan kamu membalas gambar.';
        let url = await uploadImage(img, "true");
                let meme = `https://api.memegen.link/images/custom/${encodeURIComponent(atas)}/${encodeURIComponent(bawah)}.png?background=${url}`;
        
        await conn.sendImageAsSticker(m.chat, meme, m, {
            packname: global.packname || "",
            author: global.author || "",
        });

    } catch (e) {
            console.log(e);
            throw e;
    }
}

handler.help = ['stickermeme <teks>|<teks>'];
handler.tags = ['sticker'];
handler.command = /^(s(tic?ker)?me(me)?)$/i;
handler.limit = false;

export default handler;