import { createHash } from 'node:crypto';
import uploadFile from '../lib/uploadFile.js';
import fetch from 'node-fetch';
import { stickerToMp4 } from '../lib/sticker-convert.js?v=6';
import { proto } from '../lib/simple.js';
import { addExif } from '../lib/sticker.js';

const WEBP_MIME = 'image/webp';
const OPUS_MIME = 'audio/ogg; codecs=opus';
const CACHE_TTL = 60 * 60 * 1000;
const soundStickerCache = global._zapoSoundStickerCache || (global._zapoSoundStickerCache = new Map());

function saveSoundCache(sent, webpBytes, stickerObj, audioInfo) {
  const now = Date.now();
  for (const [k, v] of soundStickerCache) {
    if (now - v.ts > CACHE_TTL) soundStickerCache.delete(k);
  }
  const msgId = sent?.id || sent?.key?.id || sent?.messageId;
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

function varint(value) {
  const bytes = [];
  let rest = value;
  do {
    const chunk = rest & 0x7f;
    rest = Math.floor(rest / 128);
    bytes.push(rest ? chunk | 0x80 : chunk);
  } while (rest);
  return bytes;
}

function lengthDelimited(id, payload) {
  return Uint8Array.from([...varint((id << 3) | 2), ...varint(payload.length), ...payload]);
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

function looksWebp(buffer) {
  return Buffer.isBuffer(buffer) &&
    buffer.length > 29 &&
    buffer.toString('latin1', 0, 4) === 'RIFF' &&
    buffer.toString('latin1', 8, 12) === 'WEBP';
}

function inspectWebp(buffer) {
  if (!looksWebp(buffer)) throw new Error('File bukan WebP yang valid.');
  switch (buffer.toString('latin1', 12, 16)) {
    case 'VP8 ':
      return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff, animated: false };
    case 'VP8L':
      return {
        width: 1 + (buffer[21] | ((buffer[22] & 0x3f) << 8)),
        height: 1 + ((buffer[22] >> 6) | (buffer[23] << 2) | ((buffer[24] & 0x0f) << 10)),
        animated: false
      };
    case 'VP8X':
      return {
        width: 1 + buffer.readUIntLE(24, 3),
        height: 1 + buffer.readUIntLE(27, 3),
        animated: (buffer[20] & 2) !== 0
      };
    default:
      return { width: 512, height: 512, animated: buffer.includes(Buffer.from('ANIM')) };
  }
}

async function deliverAudioStickerWithWm(conn, chat, origin, webpBuffer, packname, author, audioInfo) {
  const stamped = await addExif(webpBuffer, packname, author).catch(() => webpBuffer);
  const finalWebp = looksWebp(stamped) ? stamped : webpBuffer;
  const meta = inspectWebp(finalWebp);

  const bridge = conn._client;
  const visual = await bridge.message.upload(finalWebp, { type: 'image' });

  let soundMessageBytes = null;
  let updatedAudioInfo = audioInfo;

  // 1. Jika punya raw Opus buffer di cache -> upload langsung paling stabil
  if (audioInfo?.opusBytes?.length) {
    const uploadedSound = await bridge.message.upload(audioInfo.opusBytes, { type: 'audio' });
    const soundObj = {
      ...uploadedSound,
      mimetype: OPUS_MIME,
      ptt: true
    };
    soundMessageBytes = proto.Message.AudioMessage.encode(soundObj).finish();
    updatedAudioInfo = { decoded: soundObj, rawBytes: soundMessageBytes, opusBytes: audioInfo.opusBytes };
  }
  // 2. Jika berasal dari pesan masuk -> download ulang audionya lalu re-upload
  else if (audioInfo?.decoded) {
    const d = audioInfo.decoded;
    const cleanAudioProto = {
      url: d.url,
      directPath: d.directPath,
      mediaKey: d.mediaKey,
      fileSha256: d.fileSha256,
      fileEncSha256: d.fileEncSha256,
      fileLength: d.fileLength,
      mediaKeyTimestamp: d.mediaKeyTimestamp,
      mimetype: d.mimetype || OPUS_MIME,
      seconds: d.seconds,
      ptt: true,
      waveform: d.waveform
    };

    try {
      const audioBytes = await bridge.message.downloadBytes({ audioMessage: cleanAudioProto });
      if (audioBytes?.length) {
        const opusBuf = Buffer.from(audioBytes);
        const uploadedSound = await bridge.message.upload(opusBuf, { type: 'audio' });
        const soundObj = {
          ...uploadedSound,
          mimetype: d.mimetype || OPUS_MIME,
          seconds: d.seconds || undefined,
          ptt: true
        };
        soundMessageBytes = proto.Message.AudioMessage.encode(soundObj).finish();
        updatedAudioInfo = { decoded: soundObj, rawBytes: soundMessageBytes, opusBytes: opusBuf };
      }
    } catch {
      soundMessageBytes = proto.Message.AudioMessage.encode(cleanAudioProto).finish();
    }
  } else if (audioInfo?.rawBytes?.length) {
    soundMessageBytes = audioInfo.rawBytes;
  }

  const sent = await conn.sendMessage(chat, {
    stickerMessage: {
      ...visual,
      mimetype: WEBP_MIME,
      width: meta.width,
      height: meta.height,
      isAnimated: meta.animated,
      $unknowns: [lengthDelimited(26, soundMessageBytes)]
    }
  }, { quoted: origin });

  saveSoundCache(sent, finalWebp, visual, updatedAudioInfo);
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m;
  let mtype = q.mtype || '';
  let stickerObj = getStickerObj(q);
  let mime = (q.msg || q).mimetype || (stickerObj || /sticker/i.test(mtype) ? WEBP_MIME : '');

  if (!text) throw `Format salah!\n\nContoh penggunaan:\n*${usedPrefix + command} Packname | Author*\n(Atau balas gambar/video/stiker)`;
  if (!mime) throw `Balas gambar/video/stiker dengan perintah ${usedPrefix + command}`;
  if (/video/g.test(mime) && (q.msg || q).seconds > 11) return m.reply('Maksimal 10 detik!');

  let parts = text.split(/[|•]/).map(v => v.trim());
  let packname = parts[0] || text;
  let author = parts[1] || '';
  const waitMsg = typeof wait !== 'undefined' ? wait : global.wait;
  if (waitMsg) await m.reply(waitMsg);

  try {
    let img = await q.download?.().catch(() => null);
    if ((!img || !img.length) && stickerObj && conn._client?.message?.downloadBytes) {
      const bytes = await conn._client.message.downloadBytes({ stickerMessage: stickerObj }).catch(() => null);
      if (bytes?.length) img = Buffer.from(bytes);
    }
    if (!img || !img.length) throw `Gagal mengunduh media, pastikan kamu membalas gambar/video/stiker.`;

    const embeddedAudio = extractEmbeddedAudio(q) || getSoundFromCache(q, m, img);

    if (embeddedAudio && looksWebp(img)) {
      await deliverAudioStickerWithWm(conn, m.chat, m, img, packname, author, embeddedAudio);
      return;
    }

    let media = await uploadFile(img);
    let isAnimated = (q.msg || q).isAnimated === true;

    if (isAnimated || /video/g.test(mime)) {
      let videoResult = null;
      const apiKey = typeof lann !== 'undefined' ? lann : (global.lann || '');

      try {
        let res = await fetch(`https://api.betabotz.eu.org/api/tools/webp2mp4?url=${media}&apikey=${apiKey}`);
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

// Simpan metadata audio dari Sound Sticker kiriman user lain ke cache
handler.before = async function (m) {
  if (!m) return;
  const audioInfo = extractEmbeddedAudio(m);
  if (audioInfo) {
    const stickerObj = getStickerObj(m);
    saveSoundCache(m, null, stickerObj, audioInfo);
  }
};

handler.help = ['wm', 'watermark'];
handler.tags = ['sticker'];
handler.command = /^wm|watermark?$/i;

export default handler;