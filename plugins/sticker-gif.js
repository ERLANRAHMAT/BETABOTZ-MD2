import fs from 'fs';
import fetch from 'node-fetch';
import uploader from '../lib/uploadFile.js';
import { stickerToImage, stickerToGif, stickerToMp4, detectStickerKind, STICKER_KIND } from '../lib/sticker-convert.js?v=6';

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || '';
    let isSticker = /sticker/i.test(q.mtype || '') || /webp|was/i.test(mime) || q.isLottie;
    
    if (!isSticker) {
        await m.reply(`Reply sticker with command ${usedPrefix + command}`);
        return;
    }
    
    await m.reply(wait);
    let buffer;
    
    try {
        buffer = await q.download();
        if (!buffer || !buffer.length) {
            await m.reply('Gagal mengunduh sticker.');
            return;
        }

        let success = false;
        let finalBuffer = null;
        let filename = command === 'toimg' ? 'image.png' : 'animation.gif';

        try {
            const mediaUrl = await uploader(buffer);
            if (mediaUrl) {
                let json;
                let apikey = global.lann || '';
                
                if (command === 'togif' || command === 'tomp4') {
                    let res = await fetch(`https://api.betabotz.eu.org/api/tools/webp2mp4?url=${mediaUrl}&apikey=${apikey}`);
                    json = await res.json();
                    filename = command === 'tomp4' ? 'video.mp4' : 'animation.gif';
                } else if (command === 'toimg') {
                    let res = await fetch(`https://api.betabotz.eu.org/api/tools/webp2png?url=${mediaUrl}&apikey=${apikey}`);
                    json = await res.json();
                    filename = 'image.png';
                }
                
                if (json && json.status && json.result) {
                    let downloadRes = await fetch(json.result);
                    if (downloadRes.ok) {
                        finalBuffer = await downloadRes.buffer();
                        success = true;
                    }
                }
            }
        } catch (e) {
            console.warn('sticker: API Betabotz gagal/timeout, beralih ke konversi lokal...', e?.message || e);
        }

        if (!success || !finalBuffer) {
            const isLottie = detectStickerKind(buffer) === STICKER_KIND.LOTTIE;
            
            if (isLottie) {
                finalBuffer = await stickerToGif(buffer);
                filename = 'animation.gif';
            } else if (command === 'toimg') {
                finalBuffer = await stickerToImage(buffer);
                filename = 'image.png';
            } else if (command === 'togif') {
                finalBuffer = await stickerToGif(buffer);
                filename = 'animation.gif';
            } else {
                finalBuffer = await stickerToMp4(buffer);
                filename = 'video.mp4';
            }
        }

        if (finalBuffer && finalBuffer.length) {
            await conn.sendFile(m.chat, finalBuffer, filename, '*DONE*', m);
        } else {
            await m.reply('❌ Error: Gagal mengonversi file, baik via server API maupun lokal.');
        }

    } catch (err) {
        console.error('sticker convert error:', err);
        let dbg = 'no-buffer';
        if (buffer && buffer.length) {
            try { fs.writeFileSync('/tmp/lottie-debug.bin', buffer); } catch {}
            dbg = 'kind=' + detectStickerKind(buffer) + ' len=' + buffer.length;
        }
        await m.reply('An error occurred while processing your request.\n⚠️ ' + String(err?.message || err).slice(0, 200) + '\n' + dbg);
    }
}

handler.help = ['toimg', 'togif', 'tomp4'];
handler.tags = ['tools'];
handler.command = /^(toimg|togif|tomp4)$/i;
handler.limit = true;

export default handler;