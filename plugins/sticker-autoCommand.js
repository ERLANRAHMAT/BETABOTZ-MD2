const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!global.db.data.autoSticker) global.db.data.autoSticker = {};
    let dbSticker = global.db.data.autoSticker;

    if (command === 'addcmdsticker') {
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || q.mediaType || '';

        if (!text) {
            return m.reply(
                `⚠️ *Masukkan kata kunci trigger!*\n\n` +
                `📌 *Cara Pakai:*\n` +
                `Reply **stiker diam (bukan stiker bergerak/GIF)** dengan caption:\n` +
                `\`${usedPrefix + command} ketawa\``
            );
        }

        if (!/webp|sticker/i.test(mime)) {
            return m.reply(
                `⚠️ *Media tidak valid!*\n` +
                `Harap reply sebuah **stiker diam (bukan GIF / gambar biasa / video)** dengan perintah \`${usedPrefix + command} ${text.trim()}\`.`
            );
        }

        let keyword = text.trim().toLowerCase();
        if (keyword.length < 2) {
            return m.reply('⚠️ Kata kunci minimal terdiri dari 2 karakter.');
        }

        try {
            let stickerBuf = await q.download();
            if (!stickerBuf) throw 'Gagal mengunduh buffer stiker.';

            let isAnimated = Boolean((q.msg || q).isAnimated) || stickerBuf.includes(Buffer.from('ANIM'));
            if (isAnimated) {
                return m.reply(
                    `❌ *Stiker bergerak (GIF) tidak didukung!*\n` +
                    `Harap gunakan **stiker diam (statis)**, bukan stiker animasi/GIF.`
                );
            }

            dbSticker[keyword] = {
                data: stickerBuf.toString('base64'),
                creator: m.sender,
                createdAt: Date.now()
            };

            return m.reply(
                `✅ *Auto-Sticker Berhasil Disimpan!*\n\n` +
                `• *Kata Kunci:* \`${keyword}\`\n` +
                `• *Tipe:* Stiker Diam (Statis)\n\n` +
                `> Setiap ada yang mengirim kata *${keyword}* (baik berdiri sendiri maupun di dalam kalimat), bot akan otomatis membalas dengan stiker tersebut.`
            );
        } catch (e) {
            console.error('[addcmdsticker Sticker Error]:', e);
            return m.reply('❌ Terjadi kesalahan saat menyimpan stiker.');
        }
    }

    if (command === 'delcmdsticker') {
        if (!text) return m.reply(`⚠️ Masukkan kata kunci yang ingin dihapus.\nContoh: \`${usedPrefix + command} ketawa\``);
        let keyword = text.trim().toLowerCase();

        if (!dbSticker[keyword]) {
            return m.reply(`❌ Kata kunci \`${keyword}\` tidak ditemukan di daftar.`);
        }

        delete dbSticker[keyword];
        return m.reply(`🗑️ Auto-sticker untuk kata kunci \`${keyword}\` berhasil dihapus.`);
    }

    if (command === 'listcmdsticker') {
        let keys = Object.keys(dbSticker);
        if (keys.length === 0) {
            return m.reply('📭 Belum ada daftar auto-sticker yang tersimpan.');
        }

        let listText = `📋 *DAFTAR AUTO-STICKER COMMAND*\n\n`;
        keys.forEach((key, idx) => {
            listText += `${idx + 1}. \`${key}\`\n`;
        });
        listText += `\n_Gunakan ${usedPrefix}delcmdsticker <kata> untuk menghapus._`;
        return m.reply(listText);
    }
};

handler.before = async function (m, { conn }) {
    if (!m.text || m.fromMe || m.isBaileys) return;

    if (/^[.!#/]?(addcmdsticker|delcmdsticker|listcmdsticker)\b/i.test(m.text.trim())) return;

    let dbSticker = global.db.data?.autoSticker;
    if (!dbSticker) return;

    let keywords = Object.keys(dbSticker);
    if (keywords.length === 0) return;

    for (let key of keywords) {
        let regex = new RegExp(`\\b${escapeRegex(key)}\\b`, 'i');
        if (regex.test(m.text)) {
            let stickerBuffer = Buffer.from(dbSticker[key].data, 'base64');
            try {
                await conn.sendMessage(m.chat, {
                    sticker: stickerBuffer
                }, { quoted: m });
            } catch (e) {
                try {
                    await conn.sendFile(m.chat, stickerBuffer, 'sticker.webp', '', m, false, { asSticker: true });
                } catch (err) {
                    console.error('[AutoSticker Send Error]:', err);
                }
            }
            break;
        }
    }
};

handler.help = ['addcmdsticker', 'delcmdsticker', 'listcmdsticker'];
handler.tags = ['sticker'];
handler.command = /^(addcmdsticker|delcmdsticker|listcmdsticker)$/i;

export default handler;