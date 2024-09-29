const fetch = require('node-fetch');
const uploader = require('../lib/uploadFile');

let handler = async (m, { conn, usedPrefix, command }) => {
	let q = m.quoted ? m.quoted : m
	let mime = (q.msg || q).mimetype || q.mediaType || ''
	if (/webp/.test(mime)) {
		let buffer = await q.download()
		await m.reply('Please wait...')
		try {
			let media = await uploader(buffer)
			let json;
			if (['togif', 'tovid', 'tovideo'].includes(command)) {		
				json = await (await fetch(`https://api.betabotz.eu.org/api/tools/webp2mp4?url=${media}&apikey=${lann}`)).json();
			} else if (command === 'toimg') {
				json = await (await fetch(`https://api.betabotz.eu.org/api/tools/webp2png?url=${media}&apikey=${lann}`)).json();
			}
			await conn.sendFile(m.chat, json.result, null, "*DONE*", m)
		} catch (err) {
			console.error(err);
			throw 'Error occurred while processing your request.';
		}
	} else {
		throw `Reply to a sticker with the command ${usedPrefix + command}`;
	}
}

handler.command = ['tovideo', 'togif', 'tovid', 'toimg'];
handler.help = ['tovideo', 'togif', 'tovid', 'toimg (reply)'];
handler.tags = ['sticker'];
handler.group = false;

module.exports = handler;
