const fetch = require('node-fetch');
const uploader = require('../lib/uploadFile');

let handler = async (m, { conn, usedPrefix, command }) => {
	let q = m.quoted ? m.quoted : m
	let mime = (q.msg || q).mimetype || q.mediaType || ''
	if (/video/.test(mime)) {
		let buffer = await q.download()
		await m.reply(wait)
		try {
		let media = await uploader(buffer)
		let json = await (await fetch(`https://api.betabotz.eu.org/api/tools/video2audio?url=${media}&apikey=${lann}`)).json()		
        await conn.sendFile(m.chat, json.result, "audio.mp3", "*DONE*", m)
        } catch (err) {
      throw eror
    }
 } else throw `Reply video with command ${usedPrefix + command}`
}
handler.help = handler.command = ['video2audio', 'tomp3', 'toaudio']
handler.tags = ['tools']
handler.limit = true;

module.exports = handler
