import gtts from 'node-gtts';
import fs from 'fs';
import path from 'path';

const __dirname = import.meta.dirname;
const defaultLang = 'id';

let handler = async (m, { conn, args }) => {
  try {
    let lang = args[0];
    let text = args.slice(1).join(' ');
    
    if ((args[0] || '').length !== 2) {
      lang = defaultLang;
      text = args.join(' ');
    }
    
    if (!text && m.quoted && m.quoted.text) text = m.quoted.text;
    if (!text) throw `Masukkan teks!\nContoh: .tts halo semuanya`;

    try {
      let res = await tts(text, lang);
      await conn.sendFile(m.chat, res, 'tts.opus', null, m, true);
    } catch (err) {
      if (String(err).includes('Bahasa tidak di suport!')) {
        text = args.join(' '); 
        if (!text && m.quoted && m.quoted.text) text = m.quoted.text;
        
        let res = await tts(text, defaultLang);
        await conn.sendFile(m.chat, res, 'tts.opus', null, m, true);
      } else {
        throw err;
      }
    }
  } catch (e) {
    console.error(e);
    m.reply(String(e));
  }
};

handler.help = ['tts <teks>'];
handler.tags = ['tools'];
handler.command = /^tts$/i;
export default handler;

function tts(text, lang = 'id') {
  return new Promise((resolve, reject) => {
    try {
      let tts = gtts(lang);
      let filePath = path.join(__dirname, '../tmp', (1 * new Date) + '.wav');
      tts.save(filePath, text, (err, result) => {
        if (err) return reject(err);
        fs.readFile(filePath, (err, data) => {
          if (err) return reject(err);
          fs.unlink(filePath, err => {
            if (err) console.error("Gagal menghapus file tmp tts:", err);
          });
          resolve(data);
        });
      });
    } catch (e) {
      console.logs(e);
      throw e;
    }
  });
}