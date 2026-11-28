import uploadFile from '../lib/uploadFile.js';
import fetch from 'node-fetch';
import { stickerToMp4 } from '../lib/sticker-convert.js?v=6';
import { createRequire } from 'node:module';
import { randomBytes } from 'node:crypto';
import {
  prepareWAMessageMedia,
  proto,
  downloadMediaMessage,
  downloadContentFromMessage
} from '@whiskeysockets/baileys';

const require = createRequire(import.meta.url);

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

function unwrapContainer(raw) {
  let cur = raw;
  for (let i = 0; i < 6 && cur && typeof cur === 'object'; i++) {
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
  const raw = unwrapContainer(q?.message || q?.fakeObj?.message || {});
  if (raw.stickerMessage) return raw.stickerMessage;
  if (q?.msg && typeof q.msg === 'object' && (q.msg.mediaKey || q.msg.directPath || q.msg.audioMessage)) {
    return q.msg;
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

function extractEmbeddedAudio(stickerObj) {
  if (!stickerObj || typeof stickerObj !== 'object') return null;

  if (stickerObj.audioMessage && typeof stickerObj.audioMessage === 'object') {
    return stickerObj.audioMessage;
  }

  const unknowns = stickerObj.$unknowns || stickerObj.unknownFields;
  if (Array.isArray(unknowns)) {
    for (const chunk of unknowns) {
      const raw = chunk?.data || chunk;
      if (!raw || raw.length < 3) continue;
      const bytes = Uint8Array.from(raw);
      const tagInfo = readVarint(bytes, 0);
      if (!tagInfo) continue;

      const fieldId = Math.floor(tagInfo.value / 8);
      const wireType = tagInfo.value & 0x07;
      if (fieldId === 26 && wireType === 2) {
        const lenInfo = readVarint(bytes, tagInfo.nextOffset);
        if (lenInfo && lenInfo.nextOffset + lenInfo.value <= bytes.length) {
          const audioBytes = bytes.subarray(lenInfo.nextOffset, lenInfo.nextOffset + lenInfo.value);
          try {
            return proto.Message.AudioMessage.decode(audioBytes);
          } catch {}
        }
      }
    }
  }

  return null;
}

async function downloadStickerBuffer(q, stickerObj, conn) {
  if (typeof q?.download === 'function') {
    try {
      const buf = await q.download();
      if (buf?.length) return buf;
    } catch {}
  }

  if (stickerObj && (stickerObj.mediaKey || stickerObj.directPath || stickerObj.url)) {
    try {
      const stream = await downloadContentFromMessage(stickerObj, 'sticker');
      const chunks = [];
      for await (const chunk of stream) chunks.push(chunk);
      const buf = Buffer.concat(chunks);
      if (buf.length) return buf;
    } catch {}
  }

  if (q?.fakeObj?.message || q?.message) {
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

function isWebpAnimated(buf) {
  if (!Buffer.isBuffer(buf) || buf.length < 22) return false;
  if (buf.toString('ascii', 12, 16) === 'VP8X' && (buf[20] & 0x02) !== 0) return true;
  return buf.includes(Buffer.from('ANIM'));
}

function buildExifPayload(packname, author) {
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
  return exif;
}

async function addStickerExif(webpBuffer, packname, author) {
  const exifData = buildExifPayload(packname, author);
  try {
    const { Image } = require('node-webpmux');
    const img = new Image();
    await img.load(webpBuffer);
    img.exif = exifData;
    return await img.save(null);
  } catch {
    return webpBuffer;
  }
}

async function deliverAudioStickerWithWm(conn, chat, webpBuffer, packname, author, audioObj, isAnimatedHint) {
  ensurePatched();

  const finalWebp = await addStickerExif(webpBuffer, packname, author);
  const animatedFlag = Boolean(isAnimatedHint || isWebpAnimated(finalWebp));

  let finalAudioMsg = audioObj;
  if (audioObj && (audioObj.mediaKey || audioObj.directPath || audioObj.url)) {
    try {
      const stream = await downloadContentFromMessage(audioObj, 'audio');
      const chunks = [];
      for await (const chunk of stream) chunks.push(chunk);
      const audioBuf = Buffer.concat(chunks);

      if (audioBuf.length) {
        const { audioMessage } = await prepareWAMessageMedia(
          {
            audio: audioBuf,
            mimetype: audioObj.mimetype || 'audio/ogg; codecs=opus',
            ptt: true
          },
          { upload: conn.waUploadToServer }
        );
        audioMessage.seconds = audioObj.seconds || audioMessage.seconds;
        audioMessage.ptt = true;
        finalAudioMsg = audioMessage;
      }
    } catch (err) {
      console.warn('⚠️ Re-upload audio WM gagal, memakai audioMessage bawaan:', err?.message || err);
    }
  }

  const prepared = await prepareWAMessageMedia(
    { sticker: finalWebp, isAnimated: animatedFlag },
    { upload: conn.waUploadToServer }
  );

  prepared.stickerMessage.isAnimated = animatedFlag;
  prepared.stickerMessage.audioMessage = finalAudioMsg;

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

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m;
  let mtype = q.mtype || '';
  let stickerObj = getStickerObj(q);
  let mime = (q.msg || q).mimetype || (stickerObj || /sticker/i.test(mtype) ? 'image/webp' : '');

  if (!text) throw `Format salah!\n\nContoh penggunaan:\n*${usedPrefix + command} Packname | Author*\n(Atau balas gambar/video/stiker)`;
  if (!mime) throw `Balas gambar/video/stiker dengan perintah ${usedPrefix + command}`;
  if (/video/g.test(mime) && (q.msg || q).seconds > 11) return m.reply('Maksimal 10 detik!');

  let parts = text.split(/[|•]/).map(v => v.trim());
  let packname = parts[0] || text;
  let author = parts[1] || '';
  await m.reply(wait);

  try {
    let img = await downloadStickerBuffer(q, stickerObj, conn);
    if (!img) throw `Gagal mengunduh media, pastikan kamu membalas gambar/video/stiker.`;

    let embeddedAudio = extractEmbeddedAudio(stickerObj);
    if (embeddedAudio) {
      let isAnimatedHint = Boolean((q.msg || q).isAnimated || stickerObj?.isAnimated);
      await deliverAudioStickerWithWm(conn, m.chat, img, packname, author, embeddedAudio, isAnimatedHint);
      return;
    }

    let media = await uploadFile(img);
    let isAnimated = (q.msg || q).isAnimated === true;

    if (isAnimated || /video/g.test(mime)) {
      let videoResult = null;

      try {
        let res = await fetch(`https://api.betabotz.eu.org/api/tools/webp2mp4?url=${media}&apikey=${lann}`);
        let json = await res.json();
        if (json && json.result) {
          videoResult = json.result;
        }
      } catch (apiErr) {
        console.warn('API Betabotz gagal, beralih ke konversi lokal...', apiErr);
      }

      if (!videoResult) {
        try {
          videoResult = await stickerToMp4(img);
        } catch (localErr) {
          console.error('Konversi lokal gagal:', localErr);
        }
      }

      if (!videoResult) throw "Gagal mengubah stiker animasi ke video.";

      await conn.sendVideoAsSticker(m.chat, videoResult, m, {
        packname: packname,
        author: author,
      });
    } else {
      await conn.sendImageAsSticker(m.chat, img, m, {
        packname: packname,
        author: author,
      });
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
};

handler.help = ['wm', 'watermark'];
handler.tags = ['sticker'];
handler.command = /^wm|watermark?$/i;

export default handler;