const axios = require('axios');
const moment = require('moment-timezone'); 

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Masukkan username Roblox yang ingin dicari.\n\n*Contoh:*\n${usedPrefix + command} betabotzz`;

    try {
        m.reply(`- 🕵️‍♂️ Sedang mencari profil Roblox *${text}*...`);
        const apiUrl = `https://api.betabotz.eu.org/api/stalk/roblox?username=${encodeURIComponent(text)}&apikey=${lann}`;
        
        const response = await axios.get(apiUrl);
        const res = response.data;
        if (!res || res.code !== 200 || !res.result) {
            throw new Error(res.message || 'Gagal mengambil data. Pastikan username benar.');
        }

        const data = res.result;
        const account = data.account;
        const presence = data.presence;
        const stats = data.stats;
        const createdDate = moment(account.created).tz('Asia/Jakarta').format('DD MMMM YYYY, HH:mm:ss');
        let replyText = `
👤 *Informasi Akun Roblox*

- *Username:* ${account.username}
- *Display Name:* ${account.displayName}
- *Deskripsi:* ${account.description || '_Tidak ada deskripsi_'}
- *Bergabung:* ${createdDate}
- *Status Akun:* ${account.isBanned ? 'Diblokir' : 'Aktif'}
- *Verified:* ${account.hasVerifiedBadge ? 'Ya' : 'Tidak'}

---
📊 *Statistik*

- *Teman:* ${stats.friendCount}
- *Pengikut:* ${stats.followers}
- *Mengikuti:* ${stats.following}

---
🎮 *Status Kehadiran*

- *Online:* ${presence.isOnline ? 'Ya' : 'Tidak'}
- *Terakhir Online:* ${presence.isOnline ? 'Sekarang' : (presence.lastOnline || 'Tidak tersedia')}
- *Game Terakhir:* ${presence.recentGame || 'Tidak ada'}
`;
        if (data.badges && data.badges.length > 0) {
            replyText += `\n---
🏆 *Badges Terakhir:* (5 dari ${data.badges.length})\n`;
            data.badges.slice(0, 5).forEach(badge => {
                replyText += `\n- *${badge.name}*\n  _${badge.description}_\n`;
            });
        }
        await conn.sendFile(m.chat, account.profilePicture, 'profile.png', replyText.trim(), m);

    } catch (error) {
        console.error('Error pada fitur stalkroblox:', error);
        m.reply(error.message || 'Terjadi kesalahan saat mengambil data.');
    }
};

handler.help = ['stalkroblox <username>'];
handler.tags = ['tools', 'stalk'];
handler.command = /^(roblox|stalkroblox|rbx)$/i;
handler.limit = true;

module.exports = handler;