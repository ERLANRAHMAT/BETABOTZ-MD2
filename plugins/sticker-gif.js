let { webp2mp4, webp2png } = require('../lib/webp2mp4');
let { getBuffer } = require('../lib/myfunc');

let handler = async (m, { conn, usedPrefix, command }) => {
  if (!m.quoted) throw `Balas stiker dengan caption *${usedPrefix + command}*`;
  let mime = m.quoted.mimetype || '';
  if (!/webp/.test(mime)) throw `Balas stiker dengan caption *${usedPrefix + command}*`;
  let media = await m.quoted.download();
  let out = Buffer.alloc(0);
  m.reply(wait)
  	
  if (command === 'tovideo' || command === 'tovid' || command === 'togif') {
    out = await webp2mp4(media);
    const vd = await getBuffer(out);
    await conn.sendFile(m.chat, vd, 'out.mp4', null, m);
  } else if (command === 'toimg') {
    out = await webp2png(media);
    await conn.sendFile(m.chat, out, 'out.png', '*DONE*', m, false, {
      thumbnail: Buffer.alloc(0)
    });
  }
}

handler.command = ['tovideo', 'togif', 'tovid', 'toimg'];
handler.help = ['tovideo', 'togif', 'tovid', 'toimg (reply)'];
handler.tags = ['sticker'];
handler.group = false;

module.exports = handler;

/*
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const converter = async bufferImage => {
  try {
    let pathFile = "./tmp/" + ~~(Math.random() * 1000000 + 1) + ".webp";
    fs.writeFileSync(pathFile, bufferImage);
    await exec(`convert ${pathFile} ${pathFile}.gif`);
    await exec(`ffmpeg -i ${pathFile}.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" ${pathFile}.mp4`);
    if (!fs.existsSync(pathFile + ".gif") || !fs.existsSync(pathFile + ".mp4")) {
      throw new Error("Failed convert file!");
    }
    let videoBuffer = fs.readFileSync(pathFile + ".mp4");
    fs.unlinkSync(pathFile);
    fs.unlinkSync(pathFile + ".gif");
    fs.unlinkSync(pathFile + ".mp4");
    return videoBuffer;
  } catch(error) {
    throw error;
  }
};

let handler = async (m, { conn, command, usedPrefix }) => {
	m.reply(wait)
	if (m.quoted && /sticker/.test(m.quoted.mtype) && !m.quoted.isAnimated) {
		let img = await m.quoted.download()
		await conn.sendMessage(m.chat, { image: img, jpegThumbnail: img }, { quoted: m })
	} else if (m.quoted && /sticker/.test(m.quoted.mtype) && m.quoted.isAnimated) {		
		let img = await m.quoted.download()
		let out = await converter(img)
		await conn.sendMessage(m.chat, { video: out, gifPlayback: /gif/i.test(m.text), gifAttribution: ~~(Math.random() * 2) }, { caption: '*DONE*', quoted: m });
	} else throw `Balas sticker dengan caption *${usedPrefix + command}*`
};

handler.command = handler.help = ['togif','tovideo','toimg'];
handler.tags = ['sticker'];
handler.limit = true;

module.exports = handler
*/
