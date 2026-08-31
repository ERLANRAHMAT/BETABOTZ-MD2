const getClient = (conn) => conn._client || conn.client

async function sendGroupStatus(conn, jid, content) {
    const msg = { groupStatusMessageV2: { message: content } }
    return getClient(conn).message.send(jid, msg)
}

let handler = async (m, { conn, text, command, usedPrefix, isOwner, isBotAdmin }) => {
    if (!m.isGroup) return m.reply('❌ Perintah ini hanya bisa digunakan di dalam grup.')
    if (isBotAdmin === false) return m.reply('❌ Bot harus jadi admin grup untuk memposting status.')

    let q = m.quoted ? m.quoted : m
    let isMedia = /imageMessage|videoMessage|audioMessage/.test(q.mtype)
    let caption = text ? text.trim() : ''
    let targetGc = m.chat
    const prefix = usedPrefix || '.'

    if (isOwner && caption.includes('|')) {
        const parts = caption.split('|')
        targetGc = parts[0].trim()
        caption = parts.slice(1).join('|').trim()
    }
    if (!isOwner && targetGc !== m.chat) {
        return m.reply('🚫 Fitur menargetkan grup lain hanya untuk Owner.')
    }

    try {
        const client = getClient(conn)

        if (isMedia) {
            let media
            try { media = await q.download() } catch { return m.reply('❌ Gagal mengunduh media.') }

            let mimeType = q.mimetype || ''
            let content

            if (/image/.test(mimeType)) {
                const uploaded = await client.message.upload(media, { type: 'image', mimetype: mimeType })
                content = {
                    imageMessage: {
                        url: uploaded.url,
                        mimetype: mimeType,
                        caption: caption || '',
                        fileSha256: uploaded.fileSha256,
                        fileLength: uploaded.fileLength,
                        height: uploaded.height || 512,
                        width: uploaded.width || 512,
                        mediaKey: uploaded.mediaKey,
                        fileEncSha256: uploaded.fileEncSha256,
                        directPath: uploaded.directPath,
                        mediaKeyTimestamp: uploaded.mediaKeyTimestamp,
                        jpegThumbnail: uploaded.jpegThumbnail || undefined
                    }
                }
            } else if (/video/.test(mimeType)) {
                const uploaded = await client.message.upload(media, { type: 'video', mimetype: mimeType })
                content = {
                    videoMessage: {
                        url: uploaded.url,
                        mimetype: mimeType,
                        caption: caption || '',
                        fileSha256: uploaded.fileSha256,
                        fileLength: uploaded.fileLength,
                        height: uploaded.height || 512,
                        width: uploaded.width || 512,
                        mediaKey: uploaded.mediaKey,
                        fileEncSha256: uploaded.fileEncSha256,
                        directPath: uploaded.directPath,
                        mediaKeyTimestamp: uploaded.mediaKeyTimestamp,
                        jpegThumbnail: uploaded.jpegThumbnail || undefined,
                        seconds: uploaded.seconds || 1
                    }
                }
            } else if (/audio/.test(mimeType)) {
                const uploaded = await client.message.upload(media, { type: 'audio', mimetype: mimeType })
                content = {
                    audioMessage: {
                        url: uploaded.url,
                        mimetype: mimeType,
                        fileSha256: uploaded.fileSha256,
                        fileLength: uploaded.fileLength,
                        mediaKey: uploaded.mediaKey,
                        fileEncSha256: uploaded.fileEncSha256,
                        directPath: uploaded.directPath,
                        mediaKeyTimestamp: uploaded.mediaKeyTimestamp,
                        seconds: uploaded.seconds || 1,
                        ptt: false
                    }
                }
            } else {
                if (caption) {
                    content = { extendedTextMessage: { text: caption } }
                } else {
                    return m.reply(`❌ Tipe media tidak didukung untuk status grup!\nAtau reply media dengan ${usedPrefix + command}`)
                }
            }

            await sendGroupStatus(conn, targetGc, content)
        } else if (caption) {
            await sendGroupStatus(conn, targetGc, {
                extendedTextMessage: { text: caption }
            })
        } else {
            return m.reply(`Cara penggunaan:
*${prefix}${command || 'upswgc'}* Teks langsung
ATAU
Reply foto/video/audio dengan atau tanpa caption`)
        }

        try { await m.react('✅') } catch { }
    } catch (e) {
        console.error(e)
        throw e
    }
}

handler.help = ['upswgc']
handler.tags = ['grup']
handler.command = ['upswgc', 'swgc']
handler.admin = true
handler.group = true

export default handler