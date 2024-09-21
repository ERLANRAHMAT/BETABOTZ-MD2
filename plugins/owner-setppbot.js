// const jimp_1 = require('jimp')

// let handler = async (m, { conn, command, usedPrefix }) => {
// 	let q = m.quoted ? m.quoted : m
// 	let mime = (q.msg || q).mimetype || q.mediaType || ''
// 	if ((/image/g.test(mime) && !/webp/g.test(mime)) || q.message?.imageMessage) {
// 		try {
// 			let media = await q.download()
// 			let { img } = await pepe(media)
// 			await conn.query({
// 				tag: 'iq',
// 				attrs: {
// 					to: conn.user.jid,
// 					type:'set',
// 					xmlns: 'w:profile:picture'
// 				},
// 				content: [
// 					{
// 						tag: 'picture',
// 						attrs: { type: 'image' },
// 						content: img
// 					}
// 				]
// 			})
// 			m.reply(`Sukses mengganti PP Bot`)
// 		} catch (e) {
// 			console.log(e)
// 			m.reply(`Terjadi kesalahan, coba lagi nanti.`)
// 		}
// 	} else {
// 		m.reply(`Kirim gambar dengan caption *${usedPrefix + command}* atau tag gambar yang sudah dikirim`)
// 	}
// }

// handler.menuowner = ['setppbot']
// handler.tagsowner = ['owner']
// handler.command = /^(set(botpp|ppbot)(2|panjang|full?)?)$/i

// handler.owner = true

// module.exports = handler

// async function pepe(media) {
// 	const jimp = await jimp_1.read(media)
// 	const min = jimp.getWidth()
// 	const max = jimp.getHeight()
// 	const cropped = jimp.crop(0, 0, min, max)
// 	return {
// 		img: await cropped.scaleToFit(720, 720).getBufferAsync(jimp_1.MIME_JPEG),
// 		preview: await cropped.normalize().getBufferAsync(jimp_1.MIME_JPEG)
// 	}
// }

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (/image/.test(mime)) {
        let img = await q.download()
        if (!img) throw 'Gambar tidak ditemukan'
        await conn.updateProfilePicture(undefined, img)
		m.reply('ppbot berhasil di ganti')
    } else throw `kirim/balas gambar dengan caption *${usedPrefix + command}*`
}
handler.help = ['setppbot'].map(v => v + ' <caption / reply image>')
handler.tags = ['adminry']
handler.command = /^(setppbot)$/i

handler.group = true
handler.admin = true
handler.botAdmin = true
module.exports = handler

//jangan lupa install $ npm install @adiwajshing/baileys@Akkun3704/Baileys#profile-picture