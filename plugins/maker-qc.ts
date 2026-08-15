// @ts-nocheck
// Converted from plugins-esm - automated
import { sticker5 } from '../lib/sticker.ts';
import axios from 'axios';
import FormData from 'form-data';
import { fileTypeFromBuffer as fromBuffer } from 'file-type';
import sharp from 'sharp';
import fetch from 'node-fetch';
let handler: WaPlugin = async (m, { conn, text, args }) => {
    try {
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || q.mediaType || ''
        
        let txt
        if (args.length >= 1) {
            txt = args.slice(0).join(" ")
        } else if (m.quoted && m.quoted.text) {
            txt = m.quoted.text
        }
        
        if (!txt && !/image\/(jpe?g|png|webp)/.test(mime)) {
            throw "Input teks atau reply teks/gambar yang ingin dijadikan quote!"
        }
        if (txt && txt.length > 100) return m.reply('Maksimal 100 Teks!')

        let name = await (typeof q.name === 'string' ? q.name : conn.getName(q.sender))
        let avatar
        try {
            avatar = await conn.profilePictureUrl(q.sender, 'image').catch(_ => 'https://telegra.ph/file/320b066dc81928b782c7b.png')
            if (!/tele/.test(avatar)) avatar = await uploadImage((await conn.getFile(avatar)).data)
        } catch {
            avatar = 'https://telegra.ph/file/320b066dc81928b782c7b.png'
        }
        if (!avatar) avatar = 'https://telegra.ph/file/320b066dc81928b782c7b.png'

        let randomColor = ['#ef1a11', '#89cff0', '#660000', '#87a96b', '#e9f6ff', '#ffe7f7', '#ca86b0', '#83a3ee', '#abcc88', '#80bd76', '#6a84bd', '#5d8d7f', '#530101', '#863434', '#013337', '#133700', '#2f3641', '#cc4291', '#7c4848', '#8a496b', '#722f37', '#0fc163', '#2f3641', '#e7a6cb', '#64c987', '#e6e6fa', '#ffa500']
        const apiColor = randomColor[Math.floor(Math.random() * randomColor.length)]

        let bufferqc
        if (!/image\/(jpe?g|png|webp)/.test(mime)) {
            bufferqc = await ___qctext(txt || '', name, avatar, apiColor)
        } else {
            let img = await q.download()
            let decodedBuffer = await sharp(img).toFormat('png').toBuffer()
            let mediaUrl = await uploadImage(decodedBuffer)
            bufferqc = await ___qcimg(mediaUrl, txt || '', name, avatar, apiColor)
        }

        let stiker = await sticker5(bufferqc, false, global.packname, global.author)
        if (stiker) return conn.sendFile(m.chat, stiker, 'Quotly.webp', '', m)

    }  catch (e) {
        console.log(e);
        throw e;
    }
}

handler.help = ['qc']
handler.tags = ['sticker']
handler.command = /^(qc|quotely)$/i

export default handler

async function ___qctext(text, name, url, color) {
    let body = {
        "type": "quote",
        "format": "png",
        "backgroundColor": color,
        "width": 512,
        "height": 512,
        "scale": 2,
        "messages": [{
            "avatar": true,
            "from": {
                "id": 1,
                "name": name,
                "photo": {
                    "url": url
                }
            },
            "text": text,
            "replyMessage": {}
        }]
    }
    let res = await axios.post('https://btzqc.betabotz.eu.org/generate', body, {
        headers: { 'Content-Type': 'application/json' }
    })
    return Buffer.from(res.data.result.image, "base64")
}

async function ___qcimg(url, text, name, avatar, color) {
    let body = {
        "type": "quote",
        "format": "png",
        "backgroundColor": color,
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
    }
    let res = await axios.post('https://btzqc.betabotz.eu.org/generate', body, {
        headers: { 'Content-Type': 'application/json' }
    })
    return Buffer.from(res.data.result.image, "base64")
}

async function uploadImage(buffer) { 
  let { ext } = await fromBuffer(buffer)
  let bodyForm = new FormData()
  bodyForm.append("file", buffer, "file." + ext)
  let res = await fetch("https://file.botcahx.eu.org/api/upload.php", {
    method: "post",
    body: bodyForm,
  })
  let data = await res.json()
  let resultUrl = data.result ? data.result.url : ''
  return resultUrl
}
