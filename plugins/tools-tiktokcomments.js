import fetch from 'node-fetch';
import uploadImage from '../lib/uploadImage.js';
import uploadFile from '../lib/uploadFile.js';

if (!global.tiktokCommentSession) global.tiktokCommentSession = {};

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let id = m.sender;

    if (text && text.toLowerCase() === 'batalkan') {
        if (global.tiktokCommentSession[id]) {
            clearTimeout(global.tiktokCommentSession[id].timeout);
            delete global.tiktokCommentSession[id];
            return m.reply('❌ *Sesi pembuatan TikTok Comment berhasil dibatalkan.*');
        } else {
            return m.reply('Anda tidak sedang dalam sesi pembuatan TikTok Comment.');
        }
    }

    if (!global.tiktokCommentSession[id]) {
        global.tiktokCommentSession[id] = {
            step: 1,
            data: {},
            timeout: setTimeout(() => {
                if (global.tiktokCommentSession[id]) {
                    delete global.tiktokCommentSession[id];
                    conn.sendMessage(m.chat, { text: '⏰ *Waktu habis (1 menit).* Sesi dibatalkan otomatis.' }, { quoted: m });
                }
            }, 60000)
        };

        return m.reply(
            `🎬 *TIKTOK COMMENT MAKER (WIZARD)*\n\n` +
            `Silakan ikuti instruksi tiap langkah di bawah ini.\n` +
            `💡 *Catatan:* Kirim kata *batalkan* kapan saja untuk menghentikan proses.\n\n` +
            `━━━━━━━━━━━━━━━━━━━━━\n` +
            `👉 *LANGKAH 1 dari 6: BACKGROUND VIDEO*\n` +
            `Kirimkan atau balaskan (*reply*) **gambar background** video TikTok yang akan dijadikan latar belakang.`
        );
    }
};

handler.before = async function (m, { conn }) {
    let id = m.sender;
    let session = global.tiktokCommentSession[id];

    if (!session) return;
    if (m.text && m.text.toLowerCase() === 'batalkan') return;

    clearTimeout(session.timeout);
    session.timeout = setTimeout(() => {
        if (global.tiktokCommentSession[id]) {
            delete global.tiktokCommentSession[id];
            conn.sendMessage(m.chat, { text: '⏰ *Waktu habis (1 menit).* Sesi dibatalkan otomatis.' }, { quoted: m });
        }
    }, 60000);

    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    try {
        // --- STEP 1: Background Image ---
        if (session.step === 1) {
            if (!/image\/(png|jpe?g)/.test(mime)) {
                return m.reply('⚠️ *Gambar tidak ditemukan!* Harap kirim atau reply sebuah gambar untuk dijadikan **Background Video**.');
            }
            m.reply('⏳ _Mengunggah gambar Background..._');
            let imgBuf = await q.download();
            if (imgBuf.length > 5 * 1024 * 1024) throw 'Ukuran gambar maksimal 5MB!';
            
            let isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime);
            let upUrl = await (isTele ? uploadImage : uploadFile)(imgBuf);
            if (!upUrl) throw 'Gagal mengunggah gambar Background.';

            session.data.bg = upUrl;
            session.step = 2;
            return m.reply(
                `✅ *Background Berhasil Upload!*\n\n` +
                `👉 *LANGKAH 2 dari 6: AVATAR USER 1 (Komentar Utama)*\n` +
                `Kirimkan atau reply gambar foto profil untuk *User 1* (orang yang berkomentar utama).`
            );
        }

        // --- STEP 2: Avatar 1 ---
        if (session.step === 2) {
            if (!/image\/(png|jpe?g)/.test(mime)) {
                return m.reply('⚠️ *Gambar tidak ditemukan!* Harap kirim atau reply sebuah gambar untuk **Avatar User 1**.');
            }
            m.reply('⏳ _Mengunggah Avatar User 1..._');
            let imgBuf = await q.download();
            if (imgBuf.length > 5 * 1024 * 1024) throw 'Ukuran gambar maksimal 5MB!';
            
            let isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime);
            let upUrl = await (isTele ? uploadImage : uploadFile)(imgBuf);
            if (!upUrl) throw 'Gagal mengunggah Avatar 1.';

            session.data.avatar1 = upUrl;
            session.step = 3;
            return m.reply(
                `✅ *Avatar User 1 Berhasil Upload!*\n\n` +
                `👉 *LANGKAH 3 dari 6: AVATAR USER 2 (Komentar Balasan)*\n` +
                `Kirimkan atau reply gambar foto profil untuk *User 2* (orang yang membalas komentar).`
            );
        }

        // --- STEP 3: Avatar 2 ---
        if (session.step === 3) {
            if (!/image\/(png|jpe?g)/.test(mime)) {
                return m.reply('⚠️ *Gambar tidak ditemukan!* Harap kirim atau reply sebuah gambar untuk **Avatar User 2**.');
            }
            m.reply('⏳ _Mengunggah Avatar User 2..._');
            let imgBuf = await q.download();
            if (imgBuf.length > 5 * 1024 * 1024) throw 'Ukuran gambar maksimal 5MB!';
            
            let isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime);
            let upUrl = await (isTele ? uploadImage : uploadFile)(imgBuf);
            if (!upUrl) throw 'Gagal mengunggah Avatar 2.';

            session.data.avatar2 = upUrl;
            session.step = 4;
            return m.reply(
                `✅ *Avatar User 2 Berhasil Upload!*\n\n` +
                `👉 *LANGKAH 4 dari 6: AVATAR SAYA (Avatar Me)*\n` +
                `Kirimkan atau reply gambar foto profil untuk *Profil Kamu* (terletak di kolom input komentar bagian bawah).`
            );
        }

        // --- STEP 4: Avatar Me ---
        if (session.step === 4) {
            if (!/image\/(png|jpe?g)/.test(mime)) {
                return m.reply('⚠️ *Gambar tidak ditemukan!* Harap kirim atau reply sebuah gambar untuk **Avatar Saya**.');
            }
            m.reply('⏳ _Mengunggah Avatar Saya..._');
            let imgBuf = await q.download();
            if (imgBuf.length > 5 * 1024 * 1024) throw 'Ukuran gambar maksimal 5MB!';
            
            let isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime);
            let upUrl = await (isTele ? uploadImage : uploadFile)(imgBuf);
            if (!upUrl) throw 'Gagal mengunggah Avatar Saya.';

            session.data.avatarMe = upUrl;
            session.step = 5;
            return m.reply(
                `✅ *Semua Gambar Berhasil Upload!*\n\n` +
                `👉 *LANGKAH 5 dari 6: TEKS KOMENTAR UTAMA*\n` +
                `Kirimkan rincian Komentar Utama menggunakan pemisah garis tegak (\`|\`).\n\n` +
                `📋 *Format Input:*\n` +
                `\`Username | Teks Komentar | Waktu | Jumlah Like\`\n\n` +
                `📌 *Contoh Pengiriman:*\n` +
                `\`betabotz | Mantap kali bos | 2j | 12500\``
            );
        }

        // --- STEP 5: Input Text Komentar 1 ---
        if (session.step === 5) {
            if (!m.text) return m.reply('⚠️ Harap masukkan teks rincian Komentar Utama!');
            let splits = m.text.split('|').map(v => v.trim());
            if (splits.length < 4) {
                return m.reply(
                    `⚠️ *Format Salah!* Pastikan menggunakan 3 garis tegak (\`|\`).\n\n` +
                    `📌 *Format:* \`Username | Teks Komentar | Waktu | Jumlah Like\`\n` +
                    `📌 *Contoh:* \`betabotz | Mantap kali bos | 2j | 12500\``
                );
            }

            session.data.user1 = splits[0];
            session.data.text1 = splits[1];
            session.data.time1 = splits[2];
            session.data.likes = splits[3];
            session.step = 6;

            return m.reply(
                `✅ *Komentar Utama Berhasil Disimpan!*\n\n` +
                `👉 *LANGKAH 6 dari 6 (Terakhir): TEKS BALASAN KOMENTAR*\n` +
                `Kirimkan rincian Balasan Komentar menggunakan pemisah garis tegak (\`|\`).\n\n` +
                `📋 *Format Input:*\n` +
                `\`Username | Teks Balasan | Waktu | Like Balasan | Balasan Lainnya\`\n\n` +
                `📌 *Contoh Pengiriman:*\n` +
                `\`BetaApi | Setuju banget | 1j | 15 | 4\``
            );
        }

        // --- STEP 6: Input Text Komentar 2 & Generate Canvas ---
        if (session.step === 6) {
            if (!m.text) return m.reply('⚠️ Harap masukkan teks rincian Balasan Komentar!');
            let splits = m.text.split('|').map(v => v.trim());
            if (splits.length < 5) {
                return m.reply(
                    `⚠️ *Format Salah!* Pastikan menggunakan 4 garis tegak (\`|\`).\n\n` +
                    `📌 *Format:* \`Username | Teks Balasan | Waktu | Like Balasan | Balasan Lainnya\`\n` +
                    `📌 *Contoh:* \`BetaApi | Setuju banget | 1j | 15 | 4\``
                );
            }

            session.data.user2 = splits[0];
            session.data.text2 = splits[1];
            session.data.time2 = splits[2];
            session.data.likes2 = splits[3];
            session.data.moreReplies = splits[4];

            await m.reply('⏳ _Sedang me-render gambar TikTok Comment... Mohon tunggu._');

            let apiKey = global.lann || '';
            let apiUrl = `https://api.betabotz.eu.org/api/maker/canvas-ttComment?` +
                `apikey=${apiKey}` +
                `&bg=${encodeURIComponent(session.data.bg)}` +
                `&avatar1=${encodeURIComponent(session.data.avatar1)}` +
                `&avatar2=${encodeURIComponent(session.data.avatar2)}` +
                `&avatarMe=${encodeURIComponent(session.data.avatarMe)}` +
                `&user1=${encodeURIComponent(session.data.user1)}` +
                `&text1=${encodeURIComponent(session.data.text1)}` +
                `&time1=${encodeURIComponent(session.data.time1)}` +
                `&likes=${encodeURIComponent(session.data.likes)}` +
                `&user2=${encodeURIComponent(session.data.user2)}` +
                `&text2=${encodeURIComponent(session.data.text2)}` +
                `&time2=${encodeURIComponent(session.data.time2)}` +
                `&likes2=${encodeURIComponent(session.data.likes2)}` +
                `&moreReplies=${encodeURIComponent(session.data.moreReplies)}` +
                `&placeholder=${encodeURIComponent('Tambahkan komentar...')}` +
                `&totalComments=604`;

            await conn.sendMessage(m.chat, {
                image: { url: apiUrl },
                caption: '✨ *TikTok Comment Canvas Berhasil Dibuat!*'
            }, { quoted: m });

            clearTimeout(session.timeout);
            delete global.tiktokCommentSession[id];
        }

    } catch (e) {
        console.error(e);
        m.reply(typeof e === 'string' ? e : '❌ Terjadi kesalahan saat memproses data. Sesi dibatalkan.');
        clearTimeout(session.timeout);
        delete global.tiktokCommentSession[id];
    }
};

handler.help = ['ttcomment'];
handler.tags = ['maker'];
handler.command = /^(ttcomment|tiktokcomment)$/i;

export default handler;