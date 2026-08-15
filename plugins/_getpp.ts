
import fetch from 'node-fetch';

let handler: WaPlugin = async (m, { conn, command }) => {
  try {
    try {
      let who;
      if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : m.sender);
      else who = m.quoted ? m.quoted.sender : m.sender;
      
      let pp = await conn.profilePictureUrl(who, 'image').catch((_) => "https://telegra.ph/file/24fa902ead26340f3df2c.png");
      await conn.sendFile(m.chat, pp, "nih bang.png", 'Selesai....', m, {jpegThumbnail: await(await fetch(pp)).buffer()});
    } catch {
      let sender = m.sender;
      let pp = await conn.profilePictureUrl(sender, 'image').catch((_) => "https://telegra.ph/file/24fa902ead26340f3df2c.png");
      await conn.sendFile(m.chat, pp, 'ppsad.png', "Selesai....", m, {jpegThumbnail: await(await fetch(pp)).buffer()});
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
}

handler.help = ['getpp <@tag/reply>']
handler.tags = ['group']
handler.command = /^(getpp|getpic?t?|pp)$/i

export default handler;
