// @ts-nocheck
// Converted from plugins-esm - automated
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

var handler = async (m, { conn, command, args }) => {
  if (!args[0]) return conn.reply(m.chat, 'Input URL!', m as any);
  if (args[0].match(/xnxx\.com|hamster\.com|nekopoi\.care/i)) {
    return conn.reply(m.chat, 'Link tersebut dilarang!', m as any);
  }

  await m.reply('_Ｌｏａｄｉｎｇ．．._');

  // Check if the URL starts with 'http' or 'https'
  var url = args[0].startsWith('http') ? args[0] : 'https://' + args[0]

  try {
    var img = await fetch(`https://api.betabotz.eu.org/api/tools/ssweb?url=${url}&device=phone&apikey=${lann}`);
    if (!img) {
      await m.reply('Gagal saat percobaan pertama. Memulai percobaan kedua...');
      img = await fetch(`https://api.betabotz.eu.org/api/tools/ssweb?url=${url}&device=phone&apikey=${lann}`);
      if (!img) return conn.reply(m.chat, 'Gambar tidak tersedia', m as any);
    }
    var filepath = path.join(__dirname, '../tmp/') + (+new Date) + '.jpeg';
    if (!fs.existsSync(path.join(__dirname, '../tmp/'))) fs.mkdirSync(path.join(__dirname, '../tmp/'));
    const dest = fs.createWriteStream(filepath);
    dest.on('finish', () => {
      conn.sendFile(m.chat, filepath, 'screenshot.jpeg', 'Nih gambarnya.', m as any)
        .then(() => {
          // Do nothing on success
        })
        .catch(() => { });
    });
    img.body.pipe(dest);

    // save file
    img.body.pipe(fs.createWriteStream(filepath));
  } catch (e) {
      console.log(e);
      throw e;
    }
}
handler.help = ['sshp', 'sshandphone', 'sstablet'];
handler.tags = ['tools'];
handler.command = ['sshp', 'sshandphone', 'sstablet',]

handler.limit = true;
handler.fail = null;

export default handler;
