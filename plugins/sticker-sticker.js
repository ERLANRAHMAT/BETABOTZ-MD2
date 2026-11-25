import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import os from 'os';
import { randomBytes } from 'crypto';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { createRequire } from 'module';
import sharp from 'sharp';
import {
  prepareWAMessageMedia,
  proto,
  downloadMediaMessage
} from '@whiskeysockets/baileys';

const require = createRequire(import.meta.url);
const execFileAsync = promisify(execFile);

const MAX_DURATION = 25;
const MAX_STICKER_BYTES = 850 * 1024; // Batas aman WA (< 1 MB)

function patchProtoInstance(p) {
  const M = p?.Message;
  if (!M || M.__audioStickerPatchedV3) return;

  if (M.StickerMessage) {
    const prevStickerEncode = M.StickerMessage.encode;
    M.StickerMessage.encode = function (message, writer) {
      const audio = message?.audioMessage;
      if (audio && Object.prototype.hasOwnProperty.call(message, 'audioMessage')) {
        delete message.audioMessage;
      }
      const w = prevStickerEncode.call(this, message, writer);
      if (audio && M.AudioMessage) {
        message.audioMessage = audio;
        M.AudioMessage.encode(audio, w.uint32(210).fork()).ldelim();
      }
      return w;
    };

    if (typeof M.StickerMessage.fromObject === 'function') {
      const prevStickerFromObj = M.StickerMessage.fromObject;
      M.StickerMessage.fromObject = function (object) {
        const msg = prevStickerFromObj.call(this, object);
        if (object?.audioMessage) {
          msg.audioMessage = M.AudioMessage?.fromObject
            ? M.AudioMessage.fromObject(object.audioMessage)
            : object.audioMessage;
        }
        return msg;
      };
    }
  }

  const prevMsgEncode = M.encode;
  M.encode = function (message, writer) {
    const asm = message?.audioStickerMessage;
    if (asm) {
      if (Object.prototype.hasOwnProperty.call(message, 'stickerMessage')) {
        delete message.stickerMessage;
      }
      if (Object.prototype.hasOwnProperty.call(message, 'audioStickerMessage')) {
        delete message.audioStickerMessage;
      }
    }
    const w = prevMsgEncode.call(this, message, writer);
    if (asm && M.FutureProofMessage) {
      message.audioStickerMessage = asm;
      M.FutureProofMessage.encode(asm, w.uint32(1074).fork()).ldelim();
    }
    return w;
  };

  if (typeof M.fromObject === 'function') {
    const prevMsgFromObj = M.fromObject;
    M.fromObject = function (object) {
      const msg = prevMsgFromObj.call(this, object);
      if (object?.audioStickerMessage) {
        const inner = object.audioStickerMessage.message || object.audioStickerMessage;
        if (inner?.stickerMessage && object.audioStickerMessage.message?.stickerMessage?.audioMessage) {
          inner.stickerMessage.audioMessage = object.audioStickerMessage.message.stickerMessage.audioMessage;
        }
        msg.audioStickerMessage = { message: inner };
        delete msg.stickerMessage;
        if (inner) {
          Object.setPrototypeOf(msg, inner);
        }
      }
      return msg;
    };
  }

  M.__audioStickerPatchedV3 = true;
}

function ensurePatched() {
  patchProtoInstance(proto);
  for (const pkg of ['@whiskeysockets/baileys', 'baileys', '@rexxhayanasi/elaina-baileys']) {
    try {
      const mod = require(pkg);
      if (mod?.proto) patchProtoInstance(mod.proto);
      if (mod?.default?.proto) patchProtoInstance(mod.default.proto);
    } catch {}
  }
}

async function downloadMediaBuf(q, conn) {
  if (typeof q.download === 'function') {
    try {
      const buf = await q.download();
      if (buf?.length) return buf;
    } catch {}
  }
  if (q.fakeObj?.message || q.message) {
    try {
      const buf = await downloadMediaMessage(
        q.fakeObj || q,
        'buffer',
        {},
        {
          logger: { info: () => {}, error: () => {}, warn: () => {} },
          reuploadRequest: conn?.updateMediaMessage
        }
      );
      if (buf?.length) return buf;
    } catch {}
  }
  return null;
}

async function addStickerExif(webpBuffer, packname, author) {
  const json = {
    'sticker-pack-id': 'com.bot.audiosticker',
    'sticker-pack-name': String(packname ?? ''),
    'sticker-pack-publisher': String(author ?? ''),
    emojis: ['🔊']
  };
  const exifAttr = Buffer.from([
    0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57,
    0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00
  ]);
  const jsonBuff = Buffer.from(JSON.stringify(json), 'utf-8');
  const exif = Buffer.concat([exifAttr, jsonBuff]);
  exif.writeUIntLE(jsonBuff.length, 14, 4);

  try {
    const { Image } = require('node-webpmux');
    const img = new Image();
    await img.load(webpBuffer);
    img.exif = exif;
    return await img.save(null);
  } catch {
    return webpBuffer;
  }
}

async function videoBufferToAnimatedWebp(buffer, packname, author) {
  const tmpId = randomBytes(6).toString('hex');
  const inPath = path.join(os.tmpdir(), `as_vid_${tmpId}.mp4`);
  const outPath = path.join(os.tmpdir(), `as_out_${tmpId}.webp`);

  const profiles = [
    { fps: 10, size: 360, q: 42 },
    { fps: 8, size: 300, q: 32 },
    { fps: 7, size: 256, q: 25 }
  ];

  try {
    await fsp.writeFile(inPath, buffer);
    let bestBuf = null;

    for (const p of profiles) {
      const vf = `fps=${p.fps},scale=${p.size}:${p.size}:force_original_aspect_ratio=decrease,format=rgba,pad=${p.size}:${p.size}:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1`;
      await execFileAsync('ffmpeg', [
        '-y',
        '-i', inPath,
        '-t', String(MAX_DURATION),
        '-vf', vf,
        '-c:v', 'libwebp',
        '-lossless', '0',
        '-compression_level', '6',
        '-q:v', String(p.q),
        '-loop', '0',
        '-preset', 'picture',
        '-an',
        '-vsync', '0',
        outPath
      ]);

      bestBuf = await fsp.readFile(outPath);
      if (bestBuf.length <= MAX_STICKER_BYTES) break;
    }

    return await addStickerExif(bestBuf, packname, author);
  } finally {
    await fsp.unlink(inPath).catch(() => {});
    await fsp.unlink(outPath).catch(() => {});
  }
}

async function extractOggOpusFromVideo(buffer) {
  const tmpId = randomBytes(6).toString('hex');
  const inPath = path.join(os.tmpdir(), `ptt_in_${tmpId}.mp4`);
  const outPath = path.join(os.tmpdir(), `ptt_out_${tmpId}.ogg`);

  try {
    await fsp.writeFile(inPath, buffer);
    await execFileAsync('ffmpeg', [
      '-y',
      '-i', inPath,
      '-vn',
      '-map', '0:a:0',
      '-t', String(MAX_DURATION),
      '-af', 'aresample=48000:async=1:first_pts=0',
      '-c:a', 'libopus',
      '-b:a', '48k',
      '-vbr', 'on',
      '-compression_level', '10',
      '-ac', '1',
      '-ar', '48000',
      '-application', 'audio',
      '-avoid_negative_ts', 'make_zero',
      '-f', 'ogg',
      outPath
    ]);
    const oggBuffer = await fsp.readFile(outPath);
    if (!oggBuffer || oggBuffer.length < 200) return null;
    return oggBuffer;
  } catch {
    return null;
  } finally {
    await fsp.unlink(inPath).catch(() => {});
    await fsp.unlink(outPath).catch(() => {});
  }
}

async function sendCombinedAudioSticker(conn, chat, stickerBuffer, oggBuffer, durationHint = 0) {
  ensurePatched();

  const [{ audioMessage }, prepared] = await Promise.all([
    prepareWAMessageMedia(
      { audio: oggBuffer, mimetype: 'audio/ogg; codecs=opus', ptt: true },
      { upload: conn.waUploadToServer }
    ),
    prepareWAMessageMedia(
      { sticker: stickerBuffer, isAnimated: true },
      { upload: conn.waUploadToServer }
    )
  ]);

  const validSeconds = durationHint > 0 ? Math.min(MAX_DURATION, Math.ceil(durationHint)) : MAX_DURATION;
  audioMessage.seconds = audioMessage.seconds || validSeconds;
  audioMessage.ptt = true;

  prepared.stickerMessage.isAnimated = true;
  prepared.stickerMessage.audioMessage = audioMessage;

  await conn.relayMessage(
    chat,
    {
      __proto__: prepared,
      audioStickerMessage: { message: prepared },
      messageContextInfo: { messageSecret: randomBytes(32) }
    },
    {}
  );
}

let handler = async (m, { conn, command, usedPrefix }) => {
  let q = m.quoted ? m.quoted : m;
  let msgObj = q.msg || q;
  let mime = msgObj.mimetype || '';
  let mtype = q.mtype || '';
  let isSoundCmd = /^(sa|saudio|stikeraudio|audiosticker)$/i.test(command);

  let isVideo = /video/.test(mime) || mtype === 'videoMessage';
  let isImage = (/image/.test(mime) && !/webp/.test(mime)) || mtype === 'imageMessage';

  // Mode Sound Sticker (.sa) khusus video bersuara
  if (isSoundCmd && isVideo) {
    let seconds = Number(msgObj.seconds || 0);
    if (seconds > MAX_DURATION) {
      return m.reply(`Maksimal durasi video untuk stiker audio adalah ${MAX_DURATION} detik!`);
    }

    let media = await downloadMediaBuf(q, conn);
    if (!media) throw 'Video gagal diunduh.';

    let oggBuffer = await extractOggOpusFromVideo(media);

    // Jika video memiliki trek audio, buat Audio Sticker
    if (oggBuffer) {
      let stickerBuffer = await videoBufferToAnimatedWebp(
        media,
        global.packname || 'Bot Sticker',
        global.author || 'Sticker'
      );
      await sendCombinedAudioSticker(conn, m.chat, stickerBuffer, oggBuffer, seconds);
      return;
    }

    // Jika video tanpa suara, otomatis fallback ke stiker video biasa
    if (seconds > 7) return m.reply('Video ini tanpa suara dan durasinya lebih dari 6 detik!');
    let encmedia = await conn.sendVideoAsSticker(m.chat, media, m, {
      packname: global.packname,
      author: global.author
    });
    if (typeof encmedia === 'string' && fs.existsSync(encmedia)) fs.unlinkSync(encmedia);
    return m.reply('Video ini tanpa suara, jadi dikirim sebagai stiker biasa.');
  }

  // Mode Stiker Gambar Biasa (.s / .sticker) + otomatis jika .sa dipakai di gambar
  if (isImage) {
    let media = await downloadMediaBuf(q, conn);
    if (!media) throw 'Gambar gagal diunduh.';

    let processedMedia = await sharp(media)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toBuffer();

    let encmedia = await conn.sendImageAsSticker(m.chat, processedMedia, m, {
      packname: global.packname,
      author: global.author
    });
    if (typeof encmedia === 'string' && fs.existsSync(encmedia)) fs.unlinkSync(encmedia);
    return;
  }

  // Mode Stiker Video Biasa (.s / .sticker)
  if (isVideo) {
    if (Number(msgObj.seconds || 0) > 7) return m.reply('Maksimal 6 detik!');
    let media = await downloadMediaBuf(q, conn);
    if (!media) throw 'Video gagal diunduh.';

    let encmedia = await conn.sendVideoAsSticker(m.chat, media, m, {
      packname: global.packname,
      author: global.author
    });
    if (typeof encmedia === 'string' && fs.existsSync(encmedia)) fs.unlinkSync(encmedia);
    return;
  }

  if (isSoundCmd) {
    throw `Kirim/balas video bersuara dengan caption ${usedPrefix + command}\nDurasi video maksimal ${MAX_DURATION} detik.`;
  }

  throw `Kirim gambar/video dengan caption ${usedPrefix + command}\nDurasi video 1-6 detik.`;
};

handler.help = ['sticker', 'sa'];
handler.tags = ['sticker'];
handler.command = /^(stiker|s|sticker|sa|saudio|stikeraudio|audiosticker)$/i;
handler.limit = true;

export default handler;