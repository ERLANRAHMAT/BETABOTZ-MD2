import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawn } from 'child_process';
import { randomUUID, createHash } from 'crypto';
import fetch from 'node-fetch';
import sharp from 'sharp';
import uploader from '../lib/uploadFile.js';
import { proto } from '../lib/simple.js';
import { stickerToImage, stickerToGif, stickerToMp4, detectStickerKind, STICKER_KIND } from '../lib/sticker-convert.js?v=6';

const FFMPEG = process.env.FFMPEG_PATH || 'ffmpeg';
const CACHE_TTL = 60 * 60 * 1000;
const soundStickerCache = global._zapoSoundStickerCache || (global._zapoSoundStickerCache = new Map());

function saveSoundCache(m, webpBytes, stickerObj, audioInfo) {
    const now = Date.now();
    for (const [k, v] of soundStickerCache) {
        if (now - v.ts > CACHE_TTL) soundStickerCache.delete(k);
    }
    const msgId = m?.id || m?.key?.id;
    if (msgId) soundStickerCache.set(`id:${msgId}`, { audioInfo, ts: now });

    if (webpBytes?.length) {
        const sha = createHash('sha256').update(webpBytes).digest('base64');
        soundStickerCache.set(`sha:${sha}`, { audioInfo, ts: now });
    }
    if (stickerObj?.fileSha256) {
        const sha = Buffer.from(stickerObj.fileSha256).toString('base64');
        soundStickerCache.set(`sha:${sha}`, { audioInfo, ts: now });
    }
}

function getSoundFromCache(q, m, webpBytes) {
    const ids = [
        q?.id,
        q?.key?.id,
        m?.quoted?.id,
        m?.quoted?.key?.id,
        m?.msg?.contextInfo?.stanzaId
    ].filter(Boolean);

    for (const id of ids) {
        const hit = soundStickerCache.get(`id:${id}`);
        if (hit?.audioInfo) return hit.audioInfo;
    }

    if (webpBytes?.length) {
        const sha = createHash('sha256').update(webpBytes).digest('base64');
        const hit = soundStickerCache.get(`sha:${sha}`);
        if (hit?.audioInfo) return hit.audioInfo;
    }

    return null;
}

function readVarint(buf, offset = 0) {
    let value = 0;
    let shift = 0;
    let pos = offset;
    while (pos < buf.length) {
        const byte = buf[pos++];
        value += (byte & 0x7f) * Math.pow(2, shift);
        if ((byte & 0x80) === 0) return { value, nextOffset: pos };
        shift += 7;
        if (shift > 49) break;
    }
    return null;
}

function extractFieldFromUnknowns(unknowns, targetFieldId) {
    if (!Array.isArray(unknowns)) return null;

    for (const entry of unknowns) {
        if (!entry) continue;

        if (typeof entry === 'object' && !ArrayBuffer.isView(entry) && !Array.isArray(entry)) {
            const fId = Number(entry.fieldNo ?? entry.fieldNumber ?? entry.field ?? entry.id ?? entry.number ?? 0);
            const rawData = entry.data ?? entry.value ?? entry.bytes;
            if (fId === targetFieldId && rawData) {
                return Uint8Array.from(rawData);
            }
        }

        if (ArrayBuffer.isView(entry) || Array.isArray(entry)) {
            const bytes = Uint8Array.from(entry);
            const tagInfo = readVarint(bytes, 0);
            if (!tagInfo) continue;

            const fieldId = Math.floor(tagInfo.value / 8);
            const wireType = tagInfo.value & 0x07;
            if (fieldId === targetFieldId && wireType === 2) {
                const lenInfo = readVarint(bytes, tagInfo.nextOffset);
                if (lenInfo && lenInfo.nextOffset + lenInfo.value <= bytes.length) {
                    return bytes.subarray(lenInfo.nextOffset, lenInfo.nextOffset + lenInfo.value);
                }
            }
        }
    }
    return null;
}

function unwrapContainer(raw) {
    let cur = raw;
    for (let i = 0; i < 6 && cur && typeof cur === 'object'; i++) {
        const fpBytes = extractFieldFromUnknowns(cur.$unknowns || cur.unknownFields, 134);
        if (fpBytes && proto?.Message?.FutureProofMessage) {
            try {
                const fp = proto.Message.FutureProofMessage.decode(fpBytes);
                if (fp?.message) {
                    cur = fp.message;
                    continue;
                }
            } catch {}
        }

        const next =
            cur.audioStickerMessage?.message ||
            cur.futureProofMessage?.message ||
            cur.ephemeralMessage?.message ||
            cur.viewOnceMessageV2?.message ||
            cur.viewOnceMessage?.message ||
            cur.documentWithCaptionMessage?.message ||
            cur.editedMessage?.message;
        if (!next) break;
        cur = next;
    }
    return cur || {};
}

function getStickerObj(q) {
    const candidates = [
        q?.message,
        q?.fakeObj?.message,
        q?.msg && typeof q.msg === 'object' ? { stickerMessage: q.msg } : null
    ].filter(Boolean);

    for (const cand of candidates) {
        const raw = unwrapContainer(cand);
        if (raw.stickerMessage) return raw.stickerMessage;
    }
    return null;
}

function extractEmbeddedAudio(node) {
    const stickerObj = getStickerObj(node);
    if (!stickerObj || typeof stickerObj !== 'object') return null;

    if (stickerObj.audioMessage && typeof stickerObj.audioMessage === 'object') {
        return { decoded: stickerObj.audioMessage, rawBytes: null };
    }

    const audioBytes = extractFieldFromUnknowns(stickerObj.$unknowns || stickerObj.unknownFields, 26);
    if (audioBytes?.length) {
        try {
            const decoded = proto.Message.AudioMessage.decode(audioBytes);
            return { decoded, rawBytes: audioBytes };
        } catch {
            return { decoded: null, rawBytes: audioBytes };
        }
    }

    return null;
}

async function resolveAudioBuffer(conn, audioInfo) {
    if (!audioInfo) return null;
    if (audioInfo.opusBytes?.length) return Buffer.from(audioInfo.opusBytes);

    const bridge = conn?._client;
    if (audioInfo.decoded && typeof bridge?.message?.downloadBytes === 'function') {
        try {
            const d = audioInfo.decoded;
            const bytes = await bridge.message.downloadBytes({
                audioMessage: {
                    url: d.url,
                    directPath: d.directPath,
                    mediaKey: d.mediaKey,
                    fileSha256: d.fileSha256,
                    fileEncSha256: d.fileEncSha256,
                    fileLength: d.fileLength,
                    mediaKeyTimestamp: d.mediaKeyTimestamp,
                    mimetype: d.mimetype || 'audio/ogg; codecs=opus',
                    ptt: true
                }
            });
            if (bytes?.length) return Buffer.from(bytes);
        } catch (err) {
            console.warn('tomp4: gagal mengunduh audio stiker:', err?.message || err);
        }
    }

    return null;
}

function runFfmpeg(args, tempFiles = [], timeout = 45000) {
    return new Promise((resolve, reject) => {
        const worker = spawn(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-nostdin', '-y', ...args]);
        let log = '';
        let settled = false;

        const finish = (err, out) => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            for (const f of tempFiles) {
                try { fs.unlinkSync(f); } catch {}
            }
            if (err) reject(err);
            else resolve(out);
        };

        const timer = setTimeout(() => {
            try { worker.kill('SIGKILL'); } catch {}
        }, timeout);

        worker.stderr?.on('data', (chunk) => { log += chunk.toString(); });
        worker.once('error', (err) => finish(err));
        worker.once('close', (code) => {
            if (code !== 0) {
                return finish(new Error(`ffmpeg exit ${code}: ${log.trim().slice(-180)}`));
            }
            const outPath = tempFiles[tempFiles.length - 1];
            try {
                if (!fs.existsSync(outPath)) return finish(new Error('ffmpeg tidak menghasilkan output'));
                finish(null, fs.readFileSync(outPath));
            } catch (err) {
                finish(err);
            }
        });
    });
}

async function muxAudioToMp4(videoOrPngBuffer, audioBuffer, isStaticImage = false) {
    const tag = randomUUID();
    const dir = os.tmpdir();
    const vidPath = path.join(dir, `tomp4_v_${tag}.${isStaticImage ? 'png' : 'mp4'}`);
    const audPath = path.join(dir, `tomp4_a_${tag}.ogg`);
    const outPath = path.join(dir, `tomp4_o_${tag}.mp4`);

    fs.writeFileSync(vidPath, videoOrPngBuffer);
    fs.writeFileSync(audPath, audioBuffer);

    const inputArgs = isStaticImage
        ? ['-loop', '1', '-framerate', '15', '-i', vidPath, '-i', audPath]
        : ['-stream_loop', '-1', '-i', vidPath, '-i', audPath];

    const args = [
        ...inputArgs,
        '-map', '0:v:0',
        '-map', '1:a:0',
        '-c:v', 'libx264',
        '-preset', 'veryfast',
        '-crf', '23',
        '-pix_fmt', 'yuv420p',
        '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-ar', '44100',
        '-shortest',
        '-movflags', '+faststart',
        outPath
    ];

    return await runFfmpeg(args, [vidPath, audPath, outPath]);
}

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let stickerObj = getStickerObj(q);
    let mime = (q.msg || q).mimetype || q.mediaType || (stickerObj ? 'image/webp' : '');
    let isSticker = Boolean(stickerObj) || /sticker/i.test(q.mtype || '') || /webp|was/i.test(mime) || q.isLottie;
    const cmd = command.toLowerCase();

    if (!isSticker) {
        await m.reply(`Reply sticker with command ${usedPrefix + command}`);
        return;
    }

    await m.reply(wait);
    let buffer;

    try {
        buffer = await q.download?.().catch(() => null);
        if ((!buffer || !buffer.length) && stickerObj && conn._client?.message?.downloadBytes) {
            const bytes = await conn._client.message.downloadBytes({ stickerMessage: stickerObj }).catch(() => null);
            if (bytes?.length) buffer = Buffer.from(bytes);
        }
        if (!buffer || !buffer.length) {
            await m.reply('Gagal mengunduh sticker.');
            return;
        }

        let audioBuffer = null;
        if (cmd === 'tomp4') {
            const embeddedAudio = extractEmbeddedAudio(q) || getSoundFromCache(q, m, buffer);
            if (embeddedAudio) {
                audioBuffer = await resolveAudioBuffer(conn, embeddedAudio);
            }
        }

        let success = false;
        let finalBuffer = null;
        let filename = cmd === 'toimg' ? 'image.png' : cmd === 'tomp4' ? 'video.mp4' : 'animation.gif';

        try {
            const mediaUrl = await uploader(buffer);
            if (mediaUrl) {
                let json;
                let apikey = global.lann || '';

                if (cmd === 'togif' || cmd === 'tomp4') {
                    let res = await fetch(`https://api.betabotz.eu.org/api/tools/webp2mp4?url=${mediaUrl}&apikey=${apikey}`);
                    json = await res.json();
                    filename = cmd === 'tomp4' ? 'video.mp4' : 'animation.gif';
                } else if (cmd === 'toimg') {
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
            } else if (cmd === 'toimg') {
                finalBuffer = await stickerToImage(buffer);
                filename = 'image.png';
            } else if (cmd === 'togif') {
                finalBuffer = await stickerToGif(buffer);
                filename = 'animation.gif';
            } else {
                try {
                    finalBuffer = await stickerToMp4(buffer);
                    filename = 'video.mp4';
                } catch (mp4Err) {
                    if (audioBuffer) {
                        const pngBuf = await stickerToImage(buffer).catch(() => sharp(buffer).png().toBuffer());
                        finalBuffer = await muxAudioToMp4(pngBuf, audioBuffer, true);
                        audioBuffer = null; // Sudah ter-mux
                        filename = 'video.mp4';
                    } else {
                        throw mp4Err;
                    }
                }
            }
        }

        if (cmd === 'tomp4' && audioBuffer && finalBuffer?.length) {
            finalBuffer = await muxAudioToMp4(finalBuffer, audioBuffer, false);
            filename = 'video.mp4';
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
};

handler.before = async function (m) {
    if (!m) return;
    const audioInfo = extractEmbeddedAudio(m);
    if (audioInfo) {
        const stickerObj = getStickerObj(m);
        saveSoundCache(m, null, stickerObj, audioInfo);
    }
};

handler.help = ['toimg', 'togif', 'tomp4'];
handler.tags = ['tools'];
handler.command = /^(toimg|togif|tomp4)$/i;
handler.limit = true;

export default handler;