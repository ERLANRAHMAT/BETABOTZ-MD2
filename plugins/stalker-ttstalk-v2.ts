// @ts-nocheck
// Converted from plugins-esm - automated
import axios from 'axios';

let handler: WaPlugin = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        throw `Masukkan username TikTok yang ingin di-stalk.\n\n*Contoh:*\n${usedPrefix + command} betabotzz`;
    }

    try {
        await m.reply(`Sedang mengambil informasi profil TikTok *${text}*...`);

        const username = text.replace(/^@/, '').trim();
        const apiUrl = `https://api.betabotz.eu.org/api/stalk/tt-v2?apikey=${lann}&username=${encodeURIComponent(username)}`;
        
        const response = await axios.get(apiUrl);
        const resData = response.data;

        if (!resData || !resData.status || !resData.result || resData.result.status === false) {
            throw resData?.result?.message || 'Pengguna tidak ditemukan atau profil mungkin di-private.';
        }

        const data = resData.result;
        const profile = data.profile;
        const stats = data.stats;
        const regionInfo = data.region;

        let replyText = `🎵 *TIKTOK STALKER* 🎵\n\n`;
        replyText += `👤 *Nama:* ${profile.Nickname}\n`;
        replyText += `🔗 *Username:* ${profile.Username}\n`;
        
        if (regionInfo && regionInfo.region) {
            replyText += `🌍 *Negara:* ${regionInfo.region.name} ${regionInfo.region.flag}\n`;
        } else {
            replyText += `🌍 *Negara:* ${profile.Country || '-'}\n`;
        }
        
        replyText += `📝 *Bio:* ${profile.About || '_Tidak ada bio_'}\n`;
        replyText += `📅 *Dibuat Sejak:* ${profile['Account Created'] || '-'}\n`;
        
        if (profile['Bio Link']) {
            replyText += `🌐 *Link Bio:* ${profile['Bio Link']}\n`;
        }

        replyText += `\n📊 *STATISTIK*\n`;
        replyText += `◦ *Pengikut:* ${stats.Followers}\n`;
        replyText += `◦ *Mengikuti:* ${stats.Following}\n`;
        replyText += `◦ *Teman:* ${stats.Friends}\n`;
        replyText += `◦ *Suka (Hearts):* ${stats.Hearts}\n`;
        replyText += `◦ *Total Video:* ${stats.Videos}\n`;
        
        replyText += `\n🆔 *User ID:* ${profile['User ID']}`;

        const avatarUrl = profile['Avatar URL'];

        if (avatarUrl) {
            await conn.sendFile(m.chat, avatarUrl, 'tiktok_profile.jpg', replyText.trim(), m);
        } else {
            await m.reply(replyText.trim());
        }

    } catch (e) {
        if (e !== false) {
            console.log(e);
            throw e;
        }
    }
};

handler.help = ['stalktiktok <username>'];
handler.tags = ['stalk', 'tools'];
handler.command = /^(stalktiktok|stalktt|ttstalk2?|tiktokstalk)$/i; 
handler.limit = true;

export default handler;
