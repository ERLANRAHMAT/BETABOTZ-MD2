import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let handler = async (m, { conn, command, args }) => {
  if (!args[0]) return conn.reply(m.chat, 'Input URL!', m);
  if (args[0].match(/xnxx\.com|hamster\.com|nekopoi\.care/i)) {
    return conn.reply(m.chat, 'Link tersebut dilarang!', m);
  }
  
  await m.reply('_Ｌｏａｄｉｎｇ．．._');
  let url = args[0].startsWith('http') ? args[0] : 'https://' + args[0]
  
  try {
    let img = await fetch(`https://api.betabotz.eu.org/api/tools/ssweb?url=${url}&device=desktop&apikey=${lann}`);
    
    if (!img.ok) {
      await m.reply('Gagal saat percobaan pertama. Memulai percobaan kedua...');
      img = await fetch(`https://api.betabotz.eu.org/api/tools/ssweb?url=${url}&device=desktop&apikey=${lann}`);
      if (!img.ok) return conn.reply(m.chat, 'Gambar tidak tersedia', m);
    }
    
    let tmpDir = path.join(__dirname, '../tmp/');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true }); 
    
    let filepath = path.join(tmpDir, (+new Date) + '.jpeg'); 
    
    const dest = fs.createWriteStream(filepath);
    dest.on('finish', () => {
        conn.sendFile(m.chat, filepath, 'screenshot.jpeg', 'Nih gambarnya.', m)
            .catch((err) => {
                console.log('Gagal mengirim gambar:', err);
            });
    });
    
    img.body.pipe(dest);    
    
  } catch (e) {
      console.log(e);
      throw e;
  }
}

handler.help = ['ssweb','sspc'];
handler.tags = ['tools'];
handler.command = ['ssweb', 'sspc', 'ss'];
handler.limit = true;
handler.fail = null;

export default handler;