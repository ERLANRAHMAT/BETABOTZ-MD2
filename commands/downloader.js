const config = require('../bot-config');
const axios = require('axios');
const ytdl = require('ytdl-core');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');

// Handler untuk downloader commands
async function handle(ctx) {
    const { command, args, reply } = ctx;
    
    if (!config.downloader.enabled) {
        await reply('❌ Fitur downloader sedang tidak aktif.');
        return;
    }
    
    if (args.length === 0) {
        await reply(`❌ Masukkan URL!\n\nContoh: ${config.bot.prefix}${command} https://...`);
        return;
    }
    
    const url = args[0];
    
    switch (command) {
        case 'tiktok':
        case 'tt':
            await downloadTikTok(ctx, url);
            break;
        case 'instagram':
        case 'ig':
            await downloadInstagram(ctx, url);
            break;
        case 'youtube':
        case 'yt':
            await downloadYouTube(ctx, url);
            break;
        case 'ytmp3':
            await downloadYouTubeAudio(ctx, url);
            break;
        case 'ytmp4':
            await downloadYouTubeVideo(ctx, url);
            break;
        case 'facebook':
        case 'fb':
            await downloadFacebook(ctx, url);
            break;
        case 'twitter':
        case 'x':
            await downloadTwitter(ctx, url);
            break;
    }
}

// Download TikTok
async function downloadTikTok(ctx, url) {
    const { reply, replyWithVideo } = ctx;
    
    await reply(config.messages.wait);
    
    try {
        // Menggunakan API TikTok downloader
        const response = await axios.get(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`);
        
        if (response.data && response.data.video) {
            const videoUrl = response.data.video.noWatermark || response.data.video.watermark;
            const caption = `
✅ *TIKTOK DOWNLOADER*

👤 *Author:* ${response.data.author?.name || 'Unknown'}
📝 *Caption:* ${response.data.title || '-'}
❤️ *Likes:* ${response.data.stats?.likeCount || 0}
💬 *Comments:* ${response.data.stats?.commentCount || 0}
🔄 *Shares:* ${response.data.stats?.shareCount || 0}

© ${config.bot.name}
`;
            
            // Download video
            const videoBuffer = await axios.get(videoUrl, { responseType: 'arraybuffer' });
            await replyWithVideo(Buffer.from(videoBuffer.data), caption);
        } else {
            await reply('❌ Gagal mendownload video TikTok. Coba lagi nanti.');
        }
    } catch (error) {
        console.error('TikTok download error:', error);
        await reply('❌ Terjadi kesalahan saat mendownload video TikTok.');
    }
}

// Download Instagram
async function downloadInstagram(ctx, url) {
    const { reply, replyWithVideo, replyWithImage } = ctx;
    
    await reply(config.messages.wait);
    
    try {
        // Menggunakan API Instagram downloader
        const response = await axios.get(`https://api.instagramsave.com/download?url=${encodeURIComponent(url)}`);
        
        if (response.data && response.data.url) {
            const mediaUrl = response.data.url[0];
            const caption = `
✅ *INSTAGRAM DOWNLOADER*

👤 *Username:* ${response.data.username || 'Unknown'}
📝 *Caption:* ${response.data.caption || '-'}

© ${config.bot.name}
`;
            
            // Download media
            const mediaBuffer = await axios.get(mediaUrl, { responseType: 'arraybuffer' });
            
            if (response.data.type === 'video') {
                await replyWithVideo(Buffer.from(mediaBuffer.data), caption);
            } else {
                await replyWithImage(Buffer.from(mediaBuffer.data), caption);
            }
        } else {
            await reply('❌ Gagal mendownload media Instagram. Coba lagi nanti.');
        }
    } catch (error) {
        console.error('Instagram download error:', error);
        await reply('❌ Terjadi kesalahan saat mendownload media Instagram.');
    }
}

// Download YouTube (info)
async function downloadYouTube(ctx, url) {
    const { reply } = ctx;
    
    await reply(config.messages.wait);
    
    try {
        if (!ytdl.validateURL(url)) {
            await reply('❌ URL YouTube tidak valid!');
            return;
        }
        
        const info = await ytdl.getInfo(url);
        const message = `
✅ *YOUTUBE INFO*

📺 *Judul:* ${info.videoDetails.title}
👤 *Channel:* ${info.videoDetails.author.name}
⏱️ *Durasi:* ${formatDuration(info.videoDetails.lengthSeconds)}
👁️ *Views:* ${parseInt(info.videoDetails.viewCount).toLocaleString('id-ID')}
📅 *Upload:* ${info.videoDetails.uploadDate}

📥 *Download:*
• ${config.bot.prefix}ytmp3 ${url}
• ${config.bot.prefix}ytmp4 ${url}

© ${config.bot.name}
`;
        
        await reply(message);
    } catch (error) {
        console.error('YouTube info error:', error);
        await reply('❌ Terjadi kesalahan saat mengambil info YouTube.');
    }
}

// Download YouTube Audio (MP3)
async function downloadYouTubeAudio(ctx, url) {
    const { reply, sock, from, m } = ctx;
    
    await reply(config.messages.wait);
    
    try {
        if (!ytdl.validateURL(url)) {
            await reply('❌ URL YouTube tidak valid!');
            return;
        }
        
        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title;
        
        // Download audio
        const stream = ytdl(url, {
            quality: 'highestaudio',
            filter: 'audioonly'
        });
        
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        
        await new Promise((resolve, reject) => {
            stream.on('end', resolve);
            stream.on('error', reject);
        });
        
        const buffer = Buffer.concat(chunks);
        
        // Send audio
        await sock.sendMessage(from, {
            audio: buffer,
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`
        }, { quoted: m });
        
    } catch (error) {
        console.error('YouTube audio download error:', error);
        await reply('❌ Terjadi kesalahan saat mendownload audio YouTube.');
    }
}

// Download YouTube Video (MP4)
async function downloadYouTubeVideo(ctx, url) {
    const { reply, replyWithVideo } = ctx;
    
    await reply(config.messages.wait);
    
    try {
        if (!ytdl.validateURL(url)) {
            await reply('❌ URL YouTube tidak valid!');
            return;
        }
        
        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title;
        
        // Download video (quality rendah untuk menghemat bandwidth)
        const stream = ytdl(url, {
            quality: 'lowest',
            filter: 'videoandaudio'
        });
        
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        
        await new Promise((resolve, reject) => {
            stream.on('end', resolve);
            stream.on('error', reject);
        });
        
        const buffer = Buffer.concat(chunks);
        
        await replyWithVideo(buffer, `✅ *${title}*\n\n© ${config.bot.name}`);
        
    } catch (error) {
        console.error('YouTube video download error:', error);
        await reply('❌ Terjadi kesalahan saat mendownload video YouTube. Video mungkin terlalu besar.');
    }
}

// Download Facebook
async function downloadFacebook(ctx, url) {
    const { reply, replyWithVideo } = ctx;
    
    await reply(config.messages.wait);
    
    try {
        // Menggunakan API Facebook downloader
        const response = await axios.get(`https://api.facebookdownloader.com/download?url=${encodeURIComponent(url)}`);
        
        if (response.data && response.data.hd) {
            const videoUrl = response.data.hd || response.data.sd;
            const caption = `
✅ *FACEBOOK DOWNLOADER*

📝 *Title:* ${response.data.title || '-'}

© ${config.bot.name}
`;
            
            // Download video
            const videoBuffer = await axios.get(videoUrl, { responseType: 'arraybuffer' });
            await replyWithVideo(Buffer.from(videoBuffer.data), caption);
        } else {
            await reply('❌ Gagal mendownload video Facebook. Coba lagi nanti.');
        }
    } catch (error) {
        console.error('Facebook download error:', error);
        await reply('❌ Terjadi kesalahan saat mendownload video Facebook.');
    }
}

// Download Twitter/X
async function downloadTwitter(ctx, url) {
    const { reply, replyWithVideo, replyWithImage } = ctx;
    
    await reply(config.messages.wait);
    
    try {
        // Menggunakan API Twitter downloader
        const response = await axios.get(`https://api.twittervideodownloader.com/download?url=${encodeURIComponent(url)}`);
        
        if (response.data && response.data.media) {
            const mediaUrl = response.data.media[0].url;
            const caption = `
✅ *TWITTER/X DOWNLOADER*

👤 *User:* ${response.data.user || 'Unknown'}
📝 *Tweet:* ${response.data.text || '-'}

© ${config.bot.name}
`;
            
            // Download media
            const mediaBuffer = await axios.get(mediaUrl, { responseType: 'arraybuffer' });
            
            if (response.data.media[0].type === 'video') {
                await replyWithVideo(Buffer.from(mediaBuffer.data), caption);
            } else {
                await replyWithImage(Buffer.from(mediaBuffer.data), caption);
            }
        } else {
            await reply('❌ Gagal mendownload media Twitter/X. Coba lagi nanti.');
        }
    } catch (error) {
        console.error('Twitter download error:', error);
        await reply('❌ Terjadi kesalahan saat mendownload media Twitter/X.');
    }
}

// Helper function untuk format durasi
function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

module.exports = { handle };
