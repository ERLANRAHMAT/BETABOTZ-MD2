const { deobfuscate } = require('obfuscator-io-deobfuscator')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const { downloadContentFromMessage } = require('@adiwajshing/baileys')

let handler = async (m, { conn, text, args }) => {
    let code
    const tempDir = path.join(__dirname, './temp')
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true })

    if (args.length >= 1) {
        code = args.join(' ')
    } else if (m.quoted?.text) {
        code = m.quoted.text
    } else if (m.quoted?.mtype === 'documentMessage') {
        if (!m.quoted.mimetype?.includes('javascript')) {
            return m.reply('Hanya file JavaScript (.js) yang didukung!')
        }

        const media = await downloadContentFromMessage(m.quoted, 'document')
        const filename = `input_${crypto.randomBytes(4).toString('hex')}.js`
        const tempFilePath = path.join(tempDir, filename)

        const writeStream = fs.createWriteStream(tempFilePath)
        for await (const chunk of media) {
            writeStream.write(chunk)
        }
        writeStream.end()
        await new Promise(resolve => writeStream.on('finish', resolve))

        code = fs.readFileSync(tempFilePath, 'utf8')
        fs.unlinkSync(tempFilePath)
    } else {
        return conn.reply(m.chat, `Cara penggunaan:\n• .dec <kode>\n• .dec (balas teks)\n• .dec (balas file .js)`, m)
    }

    try {
        await conn.reply(m.chat, 'Deobfuscating, please wait...', m)
        
        const result = await deobfuscate(code)

        const outputFilename = `dec_${Date.now()}.js`
        const outputFilePath = path.join(tempDir, outputFilename)
        fs.writeFileSync(outputFilePath, result)

        await conn.sendMessage(m.chat, {
            document: fs.readFileSync(outputFilePath),
            mimetype: 'application/javascript',
            fileName: outputFilename,
            caption: 'JavaScript berhasil dideobfuscate.'
        }, { quoted: m })

        fs.unlinkSync(outputFilePath)
    } catch (e) {
        console.error('DEC Error:', e)
        await conn.reply(m.chat, `Gagall:\n${e.message}`, m)
    }
}

handler.help = ['dec']
handler.tags = ['tools']
handler.command = /^dec$/i
handler.premium = true;

module.exports = handler