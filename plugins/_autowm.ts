
import WebP from 'node-webpmux';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import uploadImage from '../lib/uploadImage.ts'; 

const { Image } = WebP;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let handler = m => m;

handler.all = async function(m) {
    let chat = global.db.data.chats[m.chat];
    let user = global.db.data.users[m.sender];
    
    if (!chat || !chat.autowm) return; 
    if (chat.isBanned || user.banned || m.fromMe) return;

    let q = m;
    let mime = (q.msg || q).mimetype || '';
    let mtype = m.mtype || '';

    if (/webp|sticker/.test(mime) || mtype === 'stickerMessage') {
        try {
            let stickerBuffer = (await q.download()) as Buffer;
            if (!stickerBuffer) return;
            let img = new Image();
            await img.load(stickerBuffer);

            let packnameExif = '';
            let authorExif = '';

            if (img.exif) {
                try {
                    let exifData = JSON.parse(img.exif.slice(22).toString());
                    packnameExif = exifData['sticker-pack-name'] || '';
                    authorExif = exifData['sticker-pack-publisher'] || '';
                } catch (jsonErr) {
                    packnameExif = '';
                    authorExif = '';
                }
            }
            if (packnameExif === global.packname && authorExif === global.author) {
                return;
            }
            let isAnimated = q.isAnimated || (q.msg && q.msg.isAnimated) || false;

            if (isAnimated) {
                let mediaUrl = await uploadImage(stickerBuffer, "true");
                if (!mediaUrl) return;
                let res = await fetch(`https://api.betabotz.eu.org/api/tools/webp2mp4?url=${mediaUrl}&apikey=${global.lann}`);
                let json = await res.json();
                
                if (json.result) {
                    await this.sendVideoAsSticker(m.chat, json.result, m, {
                        packname: global.packname,
                        author: global.author
                    });
                }
            } else {
                let tmpPath = path.join(__dirname, `../tmp/autowm_${Date.now()}.webp`);
                
                if (!fs.existsSync(path.dirname(tmpPath))) {
                    fs.mkdirSync(path.dirname(tmpPath), { recursive: true });
                }

                fs.writeFileSync(tmpPath, stickerBuffer);
                await this.sendImageAsSticker(m.chat, tmpPath, m, { 
                    packname: global.packname, 
                    author: global.author 
                });

                if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
            }

        } catch (e) {
            console.error('Error pada Auto-WM:', e);
        }
    }
    return !0;
};

export default handler;
