import axios from 'axios';
import uploadFile from '../lib/uploadFile.js';
import sharp from 'sharp'; 

let handler = async (m, { conn, text, usedPrefix, command }) => {
  text = text
    ? text
    : m.quoted && m.quoted.text
    ? m.quoted.text
    : m.quoted && m.quoted.caption
    ? m.quoted.caption
    : "";

  if (!text) throw `Contoh: ${usedPrefix + command} lagi mumet!`;

  let who = m.quoted ? m.quoted.sender : m.sender;
  let username = 'User';
  try {
    username = await conn.getName(who) || 'User';
  } catch {}

  let avatarUrl = 'https://telegra.ph/file/28608d59edb4488b7da81.jpg';
  try {
    avatarUrl = await conn.profilePictureUrl(who, 'image');
  } catch {}

  let uploadedAvatar = avatarUrl;
  try {
    let avatarBuffer = await conn.getFile(avatarUrl).catch(() => null);
    if (avatarBuffer && avatarBuffer.data) {
      uploadedAvatar = await uploadFile(avatarBuffer.data);
    }
  } catch (e) {
    console.error('Gagal upload avatar:', e);
  }

  m.reply('_Sedang membuat Quote Card & mengonversi stiker..._');
  try {
    
    let apiUrl = `https://api.danafxc.my.id/api/proxy/maker/qc?apikey=${dana}&text=${encodeURIComponent(text)}&username=${encodeURIComponent(username)}&avatar=${encodeURIComponent(uploadedAvatar)}`;

    let response = await axios.post(apiUrl, null, {
      responseType: "arraybuffer",
    });

    let imageBuffer = response.data;

    let webpBuffer = await sharp(imageBuffer)
      .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp({ quality: 80 })
      .toBuffer();

    await conn.sendMessage(m.chat, { 
      sticker: webpBuffer 
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    throw e;
  }
};

handler.help = ['qc2'];
handler.tags = ['sticker', 'maker'];
handler.command = /^qc2$/i;
handler.limit = true;

export default handler;