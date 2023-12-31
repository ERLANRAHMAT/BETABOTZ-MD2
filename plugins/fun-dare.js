const fetch = require('node-fetch');

let handler = async (m, { conn }) => {
	let img = 'https://i.ibb.co/305yt26/bf84f20635dedd5dde31e7e5b6983ae9.jpg'
	const tr = await fetch(API('lann', '/api/random/dare', { apikey: lann }));
	const trs = await tr.json();
	const der = trs.result;
	conn.sendFile(m.chat, img, 'dare.png', `*DARE*\n\n“${der}”`, m)
}
handler.help = ['dare']
handler.tags = ['fun']
handler.command = /^(dare|berani|tantangan)$/i
handler.limit = true

module.exports = handler
