import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `*❌ Masukkan Nomor!*\n\n*Contoh:* ${usedPrefix + command} 081324323543`;
  
  try {
    await m.reply('⏳ _Sedang mencari informasi kontak, tunggu sebentar..._');
    
    let res = await fetch(`https://api.betabotz.eu.org/api/tools/getcontact?nomer=${text}&apikey=${lann}`);
    let json = await res.json();
    
    if (json.status && json.profile) {
        let content = `👤 *GETCONTACT INFO*\n\n`;
        content += `  ◦ *Name:* ${json.profile.name || "-"}\n`;
        content += `  ◦ *Surname:* ${json.profile.surname || "-"}\n`;
        content += `  ◦ *Phone Number:* ${json.profile.phoneNumber || "-"}\n`;
        content += `  ◦ *Display Number:* ${json.profile.displayNumber || "-"}\n`;
        content += `  ◦ *Country:* ${json.profile.country || "-"}\n`;
        content += `  ◦ *Country Code:* ${json.profile.countryCode || "-"}\n`;
        content += `  ◦ *Display Name:* ${json.profile.displayName || "-"}\n`;
        content += `  ◦ *Tag Count:* ${json.profile.tagCount || "0"}\n`;
        content += `  ◦ *Email:* ${json.profile.email || "-"}\n`;
        content += `  ◦ *Trust Score:* ${json.profile.trustScore || "-"}\n\n`;
        content += `_${global.wm}_`;

        if (json.profile.profileImage) {
            await conn.sendMessage(
                m.chat,
                { image: { url: json.profile.profileImage }, caption: content.trim() },
                { quoted: m }
            );
        } else {
            await m.reply(content.trim());
        }
    } else {
        await m.reply("❌ Nomor yang kamu input tidak ditemukan atau data kosong!");
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
};

handler.command = handler.help = ["getcontact", "getco"];
handler.tags = ['tools'];
handler.limit = true;
export default handler;