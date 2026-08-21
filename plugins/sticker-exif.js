import { format } from 'util';
import WebP from 'node-webpmux';
const { Image } = WebP;

let handler = async (m) => {
    if (!m.quoted) throw 'Tag stikernya!';
    
    if (/sticker/.test(m.quoted.mtype)) {
        try {
            let gambar = new Image();
            await gambar.load(await m.quoted.download());
            
            if (!gambar.exif) return m.reply('Stiker ini tidak memiliki data EXIF.');
            let exifString = gambar.exif.toString('utf-8');
            
            let start = exifString.indexOf('{');
            let end = exifString.lastIndexOf('}');
            
            if (start !== -1 && end !== -1) {
                let jsonString = exifString.substring(start, end + 1);
                let parsedData = JSON.parse(jsonString);
                
                m.reply(format(parsedData));
            } else {
                m.reply('Data EXIF pada stiker ini tidak memiliki format JSON yang valid.');
            }
        } catch (e) {
            console.error(e);
            throw e;
        }
    } else {
        throw 'Pesan yang kamu tag bukan stiker!';
    }
};

handler.command = handler.help = ['getexif'];
handler.tags = ['sticker'];

export default handler;