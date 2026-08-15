const __dirname = import.meta.dirname;
import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'
import { fileTypeFromBuffer as fromBuffer } from 'file-type';

async function validateMediaBuffer(buffer: Buffer, label = 'Buffer media') {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    throw new Error(`${label} kosong atau bukan Buffer`)
  }

  const info = await fromBuffer(buffer)
  if (!info) {
    throw new Error(`${label} tidak dikenali sebagai file media yang valid`)
  }

  if (!['image', 'video', 'audio'].some(type => info.mime.startsWith(type))) {
    throw new Error(`${label} memiliki MIME tidak valid: ${info.mime}`)
  }

  return info
}

function ffmpeg(buffer: Buffer, args: string[] = [], ext = '', ext2 = ''): Promise<{ data: Buffer; filename: string }> {
  return new Promise<{ data: Buffer; filename: string }>(async (resolve, reject) => {
    try {
      await validateMediaBuffer(buffer, 'Buffer input ffmpeg')

      let tmp = path.join(__dirname, '../tmp', + new Date + '.' + ext)
      let out = tmp + '.' + ext2
      await fs.promises.writeFile(tmp, buffer)
      spawn('ffmpeg', [
        '-y',
        '-i', tmp,
        ...args,
        out
      ])
        .on('error', reject)
        .on('close', async (code) => {
          try {
            await fs.promises.unlink(tmp)
            if (code !== 0) return reject(new Error(`ffmpeg exited with code ${code}`))
            resolve({ data: await fs.promises.readFile(out), filename: out })
          } catch (e) {
            reject(e)
          }
        })
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Convert Audio to Playable WhatsApp Audio
 * @param {Buffer} buffer Audio Buffer
 * @param {String} ext File Extension 
 */
function toPTT(buffer, ext) {
  return ffmpeg(buffer, [
    '-vn',
    '-c:a', 'libopus',
    '-ac', '1',
    '-avoid_negative_ts', 'make_zero'
  ], ext, 'ogg')
}

/**
 * Convert Audio to Playable WhatsApp PTT
 * @param {Buffer} buffer Audio Buffer
 * @param {String} ext File Extension 
 */
function toAudio(buffer, ext) {
  return ffmpeg(buffer, [
    '-vn',
    '-c:a', 'libmp3lame',
    '-b:a', '128k'
  ], ext, 'mp3')
}

/**
 * Convert Audio to Playable WhatsApp Video
 * @param {Buffer} buffer Video Buffer
 * @param {String} ext File Extension 
 */
function toVideo(buffer, ext) {
  return ffmpeg(buffer, [
    '-c:v', 'libx264',
    '-c:a', 'aac',
    '-ab', '128k',
    '-ar', '44100',
    '-crf', '32',
    '-preset', 'slow'
  ], ext, 'mp4')
}

export {
  toAudio,
  toPTT,
  toVideo,
  ffmpeg,
}