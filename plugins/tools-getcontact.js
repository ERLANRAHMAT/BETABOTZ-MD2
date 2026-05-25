let fetch = require('node-fetch');

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) throw `*Example:* ${usedPrefix + command} 081324323543`;
  m.reply(wait);
    try {
        let res = await fetch(
            `https://api.betabotz.eu.org/api/tools/getcontact?nomer=${text}&aksesKey=${aksesKey}`,
        );
        let json = await res.json();
        if (json.status && json.profile) {
            let content = `  ◦ name:* ${json.profile.name || "-"}\n`;
            content += `  ◦ *Nama:* ${json.profile.surname || "-"}\n`;
            content += `  ◦ *phoneNumber:* ${json.profile.phoneNumber || "-"}\n`;
            content += `  ◦ *displayNumber:* ${json.profile.displayNumber || "-"}\n`;
            content += `  ◦ *country:* ${json.profile.country || "-"}\n`;
            content += `  ◦ *countryCode:* ${json.profile.countryCode || "-"}\n`;
            content += `  ◦ *displayName:* ${json.profile.displayName || "-"}\n`;
            content += `  ◦ *tagCount:* ${json.profile.tagCount || "-"}\n`;
            content += `  ◦ *Email:* ${json.profile.email || "-"}\n`;
            content += `  ◦ *Trust Score:* ${json.profile.trustScore || "-"}\n`;
            await conn.sendMessage(
                m.chat,
                { image: { url: json.profile.profileImage }, caption: content },
                { quoted: m },
            );
        } else {
            console.log(json);
            await m.reply("Nomor yang kamu input tidak ditemukan!");
        }
    } catch (error) {
        console.error(error);
    }
};

handler.command = handler.help = ["getcontact", "getco"];
handler.tags = ['tools'];
handler.limit = true;
module.exports = handler;