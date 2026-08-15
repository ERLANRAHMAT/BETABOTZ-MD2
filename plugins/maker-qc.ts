import axios from 'axios';
import { Sticker } from 'wa-sticker-formatter';
import FormData from 'form-data';
import { fileTypeFromBuffer as fromBuffer } from 'file-type';
import sharp from 'sharp';
import fetch from 'node-fetch';

let handler: WaPlugin = async (m, { conn, text, usedPrefix, command, isOwner }) => {
    try {
        let q: any = m.quoted ? m.quoted : m;
        let mime: string = (q.msg || q).mimetype || q.mediaType || '';
        let txt: string = text ? text : typeof q.text == 'string' ? q.text : '';
        let name: string = await (typeof q.name === 'string' ? q.name : conn.getName(q.sender));
        let avatar: string;
        
        try {
            avatar = await conn.profilePictureUrl(q.sender, 'image').catch((_: any) => 'https://telegra.ph/file/320b066dc81928b782c7b.png');
            if (!/tele/.test(avatar)) {
                let fileData = await conn.getFile(avatar);
                avatar = await uploadImage(fileData.data);
            }
        } catch {
            avatar = 'https://telegra.ph/file/320b066dc81928b782c7b.png';
        }
        
        if (!avatar) avatar = 'https://telegra.ph/file/320b066dc81928b782c7b.png';

        if (!/image\/(jpe?g|png|webp)/.test(mime)) {
            let req = await ___qctext(txt, name, avatar);
            let stiker = await createWebp(req, false, global.packname, global.author);
            await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m);
        } else {
            let img: Buffer = await q.download();
            // Sharp di sini aman karena membaca gambar dari WA, lalu diubah ke PNG
            let decodedBuffer: Buffer = await sharp(img).toFormat('png').toBuffer();
            let url: string = await uploadImage(decodedBuffer);
            let req = await ___qcimg(url, txt, name, avatar);
            let stiker = await createWebp(req, false, global.packname, global.author);
            await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m);
        }
    } catch (e) {
        console.error("Quotely Error:", e);
        throw e;
    }
};

handler.help = ['qc'].map(v => v + ' <text & reply>');
handler.tags = ['sticker'];
handler.command = /^(qc|quotely)$/i;
handler.premium = false;
handler.limit = true;

export default handler;

// Definisi fungsi helpers
async function ___qctext(text: string, name: string, url: string): Promise<Buffer> {
    let body = {
        "type": "quote",
        "format": "png", // <-- SUDAH DIUBAH KE PNG AGAR SHARP TIDAK CRASH
        "backgroundColor": "#FFFFFF",
        "width": 512,
        "height": 512,
        "scale": 2,
        "messages": [{
            "avatar": true,
            "from": {
                "first_name": name,
                "language_code": "en",
                "name": name,
                "photo": {
                    "url": url
                }
            },
            "text": text,
            "replyMessage": {}
        }]
    };
    let res = await axios.post('https://qc.botcahx.eu.org/generate', body);
    return Buffer.from(res.data.result.image, "base64");
}

async function ___qcimg(url: string, text: string, name: string, avatar: string): Promise<Buffer> {
    let body = {
        "type": "quote",
        "format": "png",
        "backgroundColor": "#FFFFFF",
        "width": 512,
        "height": 768,
        "scale": 2,
        "messages": [{
            "entities": [],
            "media": {
                "url": url
            },
            "avatar": true,
            "from": {
                "id": 1,
                "name": name,
                "photo": {
                    "url": avatar
                }
            },
            "text": text,
            "replyMessage": {}
        }]
    };
    let res = await axios.post('https://qc.botcahx.eu.org/generate', body);
    return Buffer.from(res.data.result.image, "base64");
}

async function createWebp(req: Buffer | string, url: boolean | string, packName: string, authorName: string, quality = 80): Promise<Buffer> {
    let metadata_sticker = {
        type: 'full',
        pack: packName,
        author: authorName,
        quality
    };
    const media = req ? req : (url as unknown as string);
    
    return (new Sticker(media, metadata_sticker)).toBuffer();
}

async function uploadImage(buffer: Buffer): Promise<string> { 
    let fileTypeRes = await fromBuffer(buffer);
    // Safety check: jika fileType gagal membaca buffer, default ke png
    let ext = fileTypeRes ? fileTypeRes.ext : 'png'; 
    
    let bodyForm = new FormData();
    bodyForm.append("file", buffer, "file." + ext);
    
    let res = await fetch("https://file.botcahx.eu.org/api/upload.php", {
        method: "post",
        body: bodyForm,
    });
    
    let data: any = await res.json();
    let resultUrl: string = data.result ? data.result.url : '';
    return resultUrl;
}