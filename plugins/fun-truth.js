const fetch = require('node-fetch');

let handler = async (m, { conn }) => {
	let img = 'https://i.ibb.co/305yt26/bf84f20635dedd5dde31e7e5b6983ae9.jpg';
	const tr = await fetch(API('lann', '/api/random/truth', { apikey: lann }));
	const trs = await tr.json();
	const tru = trs.result;
	conn.sendFile(m.chat, img, 'truth.png', `*TRUTH*\n\n“${tru}”`, m)
}
handler.help = ['truth']
handler.tags = ['fun']
handler.command = /^(truth|kebenaran|kejujuran)$/i
handler.limit = true

module.exports = handler
