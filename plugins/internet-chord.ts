// @ts-nocheck
// Converted from plugins-esm - automated
import fetch from 'node-fetch';

let handler: WaPlugin = async (m, { text, command, usedPrefix }) => {
	if (!text) throw `Example:\n${usedPrefix + command} Tiba Tiba Cinta Datang`;

	await m.reply(wait);

	try {
		const res = await fetch(
			`https://api.betabotz.eu.org/api/search/chord?song=${encodeURIComponent(text)}&apikey=${lann}`
		);

		if (!res.ok) throw new Error(`HTTP ${res.status}`);

		const json = await res.json();

		if (!json.result) {
			return m.reply('❌ Lagu tidak ditemukan.');
		}

		const {
			title = text,
			artist = '-',
			url = '-',
			chord = 'Chord tidak tersedia.'
		} = json.result;

		let caption = `🎵 *CHORD MUSIC*\n\n`;
		caption += `📌 *Judul:* ${title}\n`;
		caption += `👤 *Artist:* ${artist.replace(/^‣\s*/, '')}\n`;
		caption += `🔗 *Source:* ${url}\n\n`;
		caption += `🎼 *Chord:*\n`;
		caption += "```";
		caption += chord;
		caption += "```";

		if (caption.length > 3900) {
			caption = caption.slice(0, 3900) + "\n\n... (Chord dipotong)";
		}

		await m.reply(caption);

	} catch (e) {
    console.log(e);
    throw e;
  }
};

handler.help = ['chord <judul lagu>'];
handler.tags = ['internet'];
handler.command = /^chord$/i;
handler.limit = true;

export default handler;
