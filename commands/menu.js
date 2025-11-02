const config = require('../bot-config');
const moment = require('moment-timezone');

async function main(ctx) {
    const { reply } = ctx;
    
    const time = moment.tz(config.timezone).format('HH:mm:ss');
    const date = moment.tz(config.timezone).format('DD/MM/YYYY');
    
    const menuText = `
╔════════════════════════════╗
║   🤖 *WHATSAPP BOT MENU*   ║
╚════════════════════════════╝

📅 *Tanggal:* ${date}
⏰ *Waktu:* ${time}
👤 *User:* @${ctx.senderNumber}
🤖 *Mode:* ${config.bot.mode.toUpperCase()}
📝 *Prefix:* ${config.bot.prefix}

┏━━━『 💰 *PPOB MENU* 』━━━┓
┃ ${config.bot.prefix}pulsa <nomor> <nominal>
┃ ${config.bot.prefix}paketdata <nomor> <kode>
┃ ${config.bot.prefix}pln <nomor> <nominal>
┃ ${config.bot.prefix}emoney <jenis> <nomor> <nominal>
┃ ${config.bot.prefix}cekppob
┗━━━━━━━━━━━━━━━━━━━━━┛

┏━━━『 📥 *DOWNLOADER* 』━━━┓
┃ ${config.bot.prefix}tiktok <url>
┃ ${config.bot.prefix}instagram <url>
┃ ${config.bot.prefix}youtube <url>
┃ ${config.bot.prefix}ytmp3 <url>
┃ ${config.bot.prefix}ytmp4 <url>
┃ ${config.bot.prefix}facebook <url>
┃ ${config.bot.prefix}twitter <url>
┗━━━━━━━━━━━━━━━━━━━━━┛

┏━━━『 🏪 *STORE MENU* 』━━━┓
┃ ${config.bot.prefix}store
┃ ${config.bot.prefix}listproduk
┃ ${config.bot.prefix}order <id>
┃ ${config.bot.prefix}addproduk (owner)
┃ ${config.bot.prefix}delproduk (owner)
┗━━━━━━━━━━━━━━━━━━━━━┛

┏━━━『 🎨 *STICKER* 』━━━┓
┃ ${config.bot.prefix}sticker (reply image/video)
┃ ${config.bot.prefix}s (reply image/video)
┗━━━━━━━━━━━━━━━━━━━━━┛

┏━━━『 👑 *OWNER MENU* 』━━━┓
┃ ${config.bot.prefix}setmode <public/self>
┃ ${config.bot.prefix}broadcast <text>
┃ ${config.bot.prefix}addowner <nomor>
┃ ${config.bot.prefix}delowner <nomor>
┃ ${config.bot.prefix}block <nomor>
┃ ${config.bot.prefix}unblock <nomor>
┗━━━━━━━━━━━━━━━━━━━━━┛

┏━━━『 ℹ️ *INFO* 』━━━┓
┃ 📸 *Auto RVO:* Aktif
┃ Bot akan otomatis screenshot
┃ foto/video yang dikirim 1x lihat
┗━━━━━━━━━━━━━━━━━━━━━┛

💡 *Tips:* Kirim foto/video dengan caption
untuk membuat sticker!

© ${config.bot.name} - ${new Date().getFullYear()}
`;
    
    await reply(menuText);
}

module.exports = { main };
