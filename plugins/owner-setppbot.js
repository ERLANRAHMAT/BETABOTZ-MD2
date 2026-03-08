/*di bawah ini buat pp biasa non panjang pilih salah satu*/
// const jimp = require('jimp');

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (/image/.test(mime)) {
        try {
            let img = await q.download()
            let noBot = conn.user.jid
            if (!img) throw 'Gambar tidak ditemukan'
            await conn.updateProfilePicture(noBot, img)
            m.reply('ppbot berhasil di ganti')
        } catch (e) {
            console.log(e)
            m.reply(`Terjadi kesalahan, coba lagi nanti.`)
        }
    } else throw `kirim/balas gambar dengan caption *${usedPrefix + command}*`
}

handler.help = ['setppbot'].map(v => v + ' <caption / reply image>')
handler.tags = ['adminry']
handler.command = /^(setppbot)$/i
handler.rowner = true

module.exports = handler

/*di bawah ini buat pp panjang aktifin aja pilih salah satu*/
// const { S_WHATSAPP_NET } = require('@adiwajshing/baileys');
//     let q = m.quoted ? m.quoted : m;
//     let mime = (q.msg || q).mimetype || q.mediaType || '';
//     if (/image/g.test(mime) && !/webp/g.test(mime)) {
//         try {
//             let media = await q.download();
//             let botNumber = await conn.user.jid;
//             let { img } = await pepe(media);
//             await conn.query({
//                 tag: 'iq',
//                 attrs: {
//                     target: undefined,
//                     to: S_WHATSAPP_NET,
//                     type: 'set',
//                     xmlns: 'w:profile:picture'
//                 },
//                 content: [
//                     {
//                         tag: 'picture',
//                         attrs: { type: 'image' },
//                         content: img
//                     }
//                 ]
//             });
//             m.reply(`Sukses mengganti PP Bot`);
//         } catch (e) {
//             console.log(e);
//             m.reply(`Terjadi kesalahan, coba lagi nanti.`);
//         }
//     } else {
//         m.reply(`Kirim gambar dengan caption *${usedPrefix + command}* atau tag gambar yang sudah dikirim`);
//     }
// };

// handler.help = ['setbotpp'];
// handler.tags = ['owner'];
// handler.command = /^(set(botpp|ppbot))$/i;

// handler.owner = true;

// module.exports = handler;

// async function pepe(media) {
//     const image = await jimp.read(media);
//     const min = image.getWidth();
//     const max = image.getHeight();
//     const cropped = image.crop(0, 0, min, max);
//     return {
//         img: await cropped.scaleToFit(720, 720).getBufferAsync(jimp.MIME_JPEG),
//         preview: await cropped.normalize().getBufferAsync(jimp.MIME_JPEG)
//     };
// }
