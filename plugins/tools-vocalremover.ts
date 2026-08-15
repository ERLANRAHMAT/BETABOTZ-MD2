import fetch from 'node-fetch';
import uploader from '../lib/uploadFile.ts';

let handler: WaPlugin = async (m, { conn, usedPrefix, command }) => {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || q.mediaType || '';
    if (/audio/.test(mime)) {
        const buffer = (await q.download()) as Buffer;
        await m.reply(wait);
        try {
            const fileSizeLimit = 5 * 1024 * 1024;
            if (buffer.length > fileSizeLimit) {
                throw 'Ukuran media tidak boleh melebihi 5MB';
            }
            const media = await uploader(buffer);
            const response = await fetch(`https://api.betabotz.eu.org/api/tools/voiceremover?url=${media}&apikey=${lann}`);
            const res = await response.json() as { status?: boolean; result?: { instrumental_path?: string; vocal_path?: string } };
            if (!res.status) {
                throw null;
            }
            if (command === 'vocalremover') {
                await conn.sendMessage(m.chat, { audio: { url: res.result?.instrumental_path }, mimetype: 'audio/mpeg' }, { quoted: m });
            } else if (command === 'instrumenremover') {
                await conn.sendMessage(m.chat, { audio: { url: res.result?.vocal_path }, mimetype: 'audio/mpeg' }, { quoted: m });
            }
        } catch (e) {
            throw '*[INTERNAL SERVER ERROR!]*';
        }
    } else {
        await m.reply(`Reply *audio* with command ${usedPrefix + command}`);
    }
};

handler.command = handler.help = ['vocalremover', 'instrumenremover'];
handler.tags = ['tools'];
handler.limit = true;

export default handler;
