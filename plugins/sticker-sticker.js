import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { proto } from '../lib/simple.js'
import { addExif } from '../lib/sticker.js'

const FFMPEG = process.env.FFMPEG_PATH || 'ffmpeg'
const AUDIO_LIMIT = 10
const VIDEO_LIMIT = 10
const WEBP_LIMIT = 1024 * 1024
const SCRATCH_DIR = path.join(process.cwd(), 'tmp', 'stca')
const OPUS_MIME = 'audio/ogg; codecs=opus'
const WEBP_MIME = 'image/webp'
const PAD_FILTER = 'scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000'
const OPUS_ARGS = [
  '-vn',
  '-map_metadata', '-1',
  '-c:a', 'libopus',
  '-b:a', '64k',
  '-ar', '48000',
  '-ac', '1',
  '-f', 'ogg'
]

function varint(value) {
  const bytes = []
  let rest = value
  do {
    const chunk = rest & 0x7f
    rest = Math.floor(rest / 128)
    bytes.push(rest ? chunk | 0x80 : chunk)
  } while (rest)
  return bytes
}

function lengthDelimited(id, payload) {
  return Uint8Array.from([...varint((id << 3) | 2), ...varint(payload.length), ...payload])
}

function transcode(source, recipe, extension, timeout = 30000) {
  fs.mkdirSync(SCRATCH_DIR, { recursive: true })
  const tag = randomUUID()
  const inFile = path.join(SCRATCH_DIR, `${tag}.src`)
  const outFile = path.join(SCRATCH_DIR, `${tag}.${extension}`)
  fs.writeFileSync(inFile, source)

  return new Promise((resolve, reject) => {
    const worker = spawn(FFMPEG, [
      '-hide_banner', '-loglevel', 'error', '-nostdin', '-y',
      '-threads', '1',
      '-i', inFile,
      ...recipe,
      outFile
    ])

    let log = ''
    let settled = false
    let guard

    const settle = (error, output) => {
      if (settled) return
      settled = true
      clearTimeout(guard)
      for (const file of [inFile, outFile]) {
        try { fs.unlinkSync(file) } catch {}
      }
      if (error) reject(error)
      else resolve(output)
    }

    guard = setTimeout(() => {
      try { worker.kill('SIGKILL') } catch {}
    }, timeout)

    worker.stderr?.on('data', (chunk) => { log += chunk.toString() })
    worker.once('error', (error) => settle(error))
    worker.once('close', (code) => {
      if (code !== 0) {
        const tail = log.trim().slice(-180)
        return settle(new Error(`ffmpeg exit ${code}${tail ? ': ' + tail : ''}`))
      }
      try {
        if (!fs.existsSync(outFile)) return settle(new Error('ffmpeg tidak menghasilkan berkas'))
        settle(null, fs.readFileSync(outFile))
      } catch (error) {
        settle(error)
      }
    })
  })
}

function motionRecipe(quality, fps) {
  return [
    '-t', String(VIDEO_LIMIT),
    '-fs', '0.7M',
    '-an',
    '-vf', `fps=${fps},${PAD_FILTER},format=yuva420p`,
    '-c:v', 'libwebp',
    '-lossless', '0',
    '-q:v', String(quality),
    '-loop', '0',
    '-f', 'webp'
  ]
}

const toMotion = (source, quality, fps) => transcode(source, motionRecipe(quality, fps), 'webp', 45000)

async function siftAudio(source) {
  try {
    const output = await transcode(source, ['-t', String(AUDIO_LIMIT), ...OPUS_ARGS], 'ogg')
    return output?.length ? output : null
  } catch {
    return null
  }
}

function looksWebp(buffer) {
  return Buffer.isBuffer(buffer) &&
    buffer.length > 29 &&
    buffer.toString('latin1', 0, 4) === 'RIFF' &&
    buffer.toString('latin1', 8, 12) === 'WEBP'
}

function inspectWebp(buffer) {
  if (!looksWebp(buffer)) throw new Error('Hasil konversi bukan WebP yang sah')
  switch (buffer.toString('latin1', 12, 16)) {
    case 'VP8 ':
      return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff, animated: false }
    case 'VP8L':
      return {
        width: 1 + (buffer[21] | ((buffer[22] & 0x3f) << 8)),
        height: 1 + ((buffer[22] >> 6) | (buffer[23] << 2) | ((buffer[24] & 0x0f) << 10)),
        animated: false
      }
    case 'VP8X':
      return {
        width: 1 + buffer.readUIntLE(24, 3),
        height: 1 + buffer.readUIntLE(27, 3),
        animated: (buffer[20] & 2) !== 0
      }
    default:
      throw new Error('Chunk WebP tidak dikenali')
  }
}

async function stampExif(buffer) {
  try {
    if (!looksWebp(buffer)) return buffer
    const stamped = await addExif(buffer, global.packname, global.author)
    return looksWebp(stamped) ? stamped : buffer
  } catch {
    return buffer
  }
}

async function buildMotionSticker(source) {
  const raw = Buffer.from(source)
  let bytes = await stampExif(await toMotion(raw, 50, 10))
  if (bytes.length > WEBP_LIMIT) {
    const lean = await toMotion(raw, 35, 8)
    const stamped = await stampExif(lean)
    bytes = stamped.length <= WEBP_LIMIT ? stamped : lean
  }
  return { bytes, meta: inspectWebp(bytes) }
}

async function deliverStickerAudio(conn, chat, origin, sticker) {
  if (!sticker.track?.length) {
    await conn.sendMessage(chat, { sticker: sticker.bytes, mimetype: WEBP_MIME }, { quoted: origin })
    return
  }

  const bridge = conn._client
  const [sound, visual] = await Promise.all([
    bridge.message.upload(sticker.track, { type: 'audio' }),
    bridge.message.upload(sticker.bytes, { type: 'image' })
  ])

  const soundMessage = proto.Message.AudioMessage.encode({
    ...sound,
    mimetype: OPUS_MIME,
    ptt: true
  }).finish()

  await conn.sendMessage(chat, {
    stickerMessage: {
      ...visual,
      mimetype: WEBP_MIME,
      width: sticker.meta.width,
      height: sticker.meta.height,
      isAnimated: sticker.meta.animated,
      $unknowns: [lengthDelimited(26, soundMessage)]
    }
  }, { quoted: origin })
}

let handler = async (m, { conn, command, usedPrefix }) => {
  const q = m.quoted ? m.quoted : m
  const payload = q.msg || q
  const mime = payload.mimetype || ''
  const mtype = q.mtype || ''
  const isSoundCmd = /^(sa|saudio|stcaudio|stikeraudio)$/i.test(command)

  const isVideo = mime.startsWith('video/') || mtype === 'videoMessage'
  const isImage = (mime.startsWith('image/') && !mime.includes('webp')) || mtype === 'imageMessage'

  // Mode Sound Sticker (.sa) khusus video bersuara
  if (isSoundCmd && isVideo) {
    if (Number(payload.seconds || 0) > VIDEO_LIMIT) {
      return m.reply(`Maksimal durasi video untuk stiker audio adalah ${VIDEO_LIMIT} detik!`)
    }

    const raw = await q.download()
    if (!raw?.length) throw new Error('Video gagal diunduh.')

    if (global.stiker_wait) m.reply(global.stiker_wait)

    const sticker = await buildMotionSticker(raw)
    const track = await siftAudio(raw)

    await deliverStickerAudio(conn, m.chat, m, {
      bytes: sticker.bytes,
      meta: sticker.meta,
      track
    })

    if (!track) {
      await m.reply('Video ini tanpa suara, jadi dikirim sebagai stiker biasa.')
    }
    return
  }

  //  Mode Stiker Biasa (.s / .sticker) + Fallback otomatis jika .sa dipakai pada gambar
  if (isImage) {
    const media = await q.download()
    if (global.stiker_wait) m.reply(global.stiker_wait)
    const encmedia = await conn.sendImageAsSticker(m.chat, media, m, {
      packname: global.packname,
      author: global.author
    })
    if (typeof encmedia === 'string' && fs.existsSync(encmedia)) fs.unlinkSync(encmedia)
    return
  }

  if (isVideo) {
    if (Number(payload.seconds || 0) > 7) return m.reply('maksimal 6 detik!')
    const media = await q.download()
    if (global.stiker_wait) m.reply(global.stiker_wait)
    const encmedia = await conn.sendVideoAsSticker(m.chat, media, m, {
      packname: global.packname,
      author: global.author
    })
    if (typeof encmedia === 'string' && fs.existsSync(encmedia)) fs.unlinkSync(encmedia)
    return
  }

  if (isSoundCmd) {
    throw `Kirim/Balas Video Bersuara Dengan Caption ${usedPrefix + command}\nDurasi Video Maksimal ${VIDEO_LIMIT} Detik`
  }

  throw `Kirim Gambar/Video Dengan Caption ${usedPrefix + command}\nDurasi Video 1-6 Detik`
}

handler.help = ['sticker', 'sa']
handler.tags = ['sticker']
handler.command = /^(stiker|s|sticker|sa|saudio|stcaudio|stikeraudio)$/i
handler.limit = true

export default handler