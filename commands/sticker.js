const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const config = require('../bot-config');

// Handler untuk sticker commands
async function handle(ctx) {
    const { m, reply, replyWithSticker } = ctx;
    
    try {
        // Cek apakah ada media yang di-reply
        const quotedMessage = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quotedMessage) {
            await reply('❌ Reply gambar/video dengan caption .sticker atau .s');
            return;
        }
        
        await reply(config.messages.wait);
        
        // Cek tipe media
        const messageType = Object.keys(quotedMessage)[0];
        
        if (messageType === 'imageMessage') {
            await createImageSticker(ctx, quotedMessage);
        } else if (messageType === 'videoMessage') {
            await createVideoSticker(ctx, quotedMessage);
        } else {
            await reply('❌ Hanya support gambar dan video!');
        }
        
    } catch (error) {
        console.error('Sticker error:', error);
        await reply('❌ Terjadi kesalahan saat membuat sticker!');
    }
}

// Buat sticker dari gambar
async function createImageSticker(ctx, quotedMessage) {
    const { m, sock, from, replyWithSticker, reply } = ctx;
    
    try {
        // Download media
        const buffer = await downloadMediaMessage(
            { message: quotedMessage },
            'buffer',
            {},
            {
                logger: console,
                reuploadRequest: sock.updateMediaMessage
            }
        );
        
        // Simpan sementara
        const tempPath = path.join(__dirname, '../temp', `sticker_${Date.now()}.png`);
        const outputPath = path.join(__dirname, '../temp', `sticker_${Date.now()}.webp`);
        
        // Buat folder temp jika belum ada
        if (!fs.existsSync(path.join(__dirname, '../temp'))) {
            fs.mkdirSync(path.join(__dirname, '../temp'));
        }
        
        fs.writeFileSync(tempPath, buffer);
        
        // Convert ke webp menggunakan ffmpeg
        await new Promise((resolve, reject) => {
            exec(
                `ffmpeg -i ${tempPath} -vf "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=white@0.0,setsar=1" ${outputPath}`,
                (error) => {
                    if (error) reject(error);
                    else resolve();
                }
            );
        });
        
        // Baca hasil convert
        const stickerBuffer = fs.readFileSync(outputPath);
        
        // Kirim sticker
        await sock.sendMessage(from, {
            sticker: stickerBuffer
        }, { quoted: m });
        
        // Hapus file temporary
        fs.unlinkSync(tempPath);
        fs.unlinkSync(outputPath);
        
    } catch (error) {
        console.error('Image sticker error:', error);
        
        // Jika ffmpeg tidak tersedia, kirim tanpa convert
        try {
            const buffer = await downloadMediaMessage(
                { message: quotedMessage },
                'buffer',
                {},
                {
                    logger: console,
                    reuploadRequest: sock.updateMediaMessage
                }
            );
            
            await sock.sendMessage(from, {
                sticker: buffer
            }, { quoted: m });
        } catch (fallbackError) {
            await reply('❌ Gagal membuat sticker. Pastikan ffmpeg terinstall!');
        }
    }
}

// Buat sticker dari video
async function createVideoSticker(ctx, quotedMessage) {
    const { m, sock, from, reply } = ctx;
    
    try {
        // Download media
        const buffer = await downloadMediaMessage(
            { message: quotedMessage },
            'buffer',
            {},
            {
                logger: console,
                reuploadRequest: sock.updateMediaMessage
            }
        );
        
        // Cek ukuran video
        if (buffer.length > 1024 * 1024) { // Max 1MB
            await reply('❌ Video terlalu besar! Maksimal 1MB atau 6 detik.');
            return;
        }
        
        // Simpan sementara
        const tempPath = path.join(__dirname, '../temp', `sticker_${Date.now()}.mp4`);
        const outputPath = path.join(__dirname, '../temp', `sticker_${Date.now()}.webp`);
        
        // Buat folder temp jika belum ada
        if (!fs.existsSync(path.join(__dirname, '../temp'))) {
            fs.mkdirSync(path.join(__dirname, '../temp'));
        }
        
        fs.writeFileSync(tempPath, buffer);
        
        // Convert ke webp animated menggunakan ffmpeg
        await new Promise((resolve, reject) => {
            exec(
                `ffmpeg -i ${tempPath} -vf "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=white@0.0,setsar=1,fps=15" -t 6 -loop 0 ${outputPath}`,
                (error) => {
                    if (error) reject(error);
                    else resolve();
                }
            );
        });
        
        // Baca hasil convert
        const stickerBuffer = fs.readFileSync(outputPath);
        
        // Kirim sticker
        await sock.sendMessage(from, {
            sticker: stickerBuffer
        }, { quoted: m });
        
        // Hapus file temporary
        fs.unlinkSync(tempPath);
        fs.unlinkSync(outputPath);
        
    } catch (error) {
        console.error('Video sticker error:', error);
        await reply('❌ Gagal membuat sticker video. Pastikan ffmpeg terinstall dan video tidak lebih dari 6 detik!');
    }
}

module.exports = { handle };
