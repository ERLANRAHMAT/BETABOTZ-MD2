import { format } from 'util';
import WebP from 'node-webpmux';
const { Image } = WebP;

var handler = async (m) => {
	if (!m.quoted) return m.reply('Tag stiker nya!')
	if (/sticker/.test(m.quoted.mtype)) {
		var gambar = new Image()
		await gambar.load(await m.quoted.download())
		m.reply(format(JSON.parse(gambar.exif.slice(22).toString())))
	}
};
handler.command = handler.help = ['getexif'];
handler.tags = ['sticker'];
export default handler;
