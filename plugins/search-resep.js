let fetch = require('node-fetch');

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) throw `*Example:* ${usedPrefix + command} nasi goreng`;
  m.reply('Tunggu sebentar, mencari resep...');
  try {
    let res = await fetch(`https://api.betabotz.eu.org/api/search/resep?query=${encodeURIComponent(text)}&apikey=${lann}`);
    let json = await res.json();
    if (json.status && json.detail) {
      let detail = json.detail;
      let content = `*${detail.title || '-'}*\n`;
      content += `${detail.description ? detail.description + '\n' : ''}`;
      content += `*Rating:* ${detail.rating || '-'}\n`;
      content += `*Porsi:* ${detail.serving_min || '-'} - ${detail.serving_max || '-'}\n`;
      content += `*Waktu Masak:* ${detail.cooking_time || '-'} menit\n`;
      if (detail.ingredient_type && detail.ingredient_type.length) {
        content += '\n*Bahan-bahan:*\n';
        detail.ingredient_type.forEach(type => {
          content += `- ${type.name}:\n`;
          type.ingredients.forEach(ing => {
            content += `  • ${ing.description}\n`;
          });
        });
      }
      if (detail.cooking_step && detail.cooking_step.length) {
        content += '\n*Langkah-langkah:*\n';
        detail.cooking_step.forEach(step => {
          content += `*${step.title}:* ${step.text}\n`;
        });
      }
      content += `\n*Link Resep:* ${detail.share_link || '-'}\n`;
      await conn.sendMessage(
        m.chat,
        { image: { url: detail.cover_url }, caption: content },
        { quoted: m },
      );
    } else {
      await m.reply('Resep tidak ditemukan!');
    }
  } catch (error) {
    console.error(error);
    await m.reply('Terjadi error, cek console untuk detail.');
  }
};

handler.command = handler.help = ['searchresep', 'resep', 'cariresep'];
handler.tags = ['tools'];
handler.limit = true;
module.exports = handler;
