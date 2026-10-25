import fetch from 'node-fetch';

// Memori sesi aktif untuk menampung step pengguna
if (!global.tiktokCommentSession) global.tiktokCommentSession = {};

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let id = m.sender;

    // Jika pengguna ingin membatalkan sesi
    if (text && text.toLowerCase() === 'batalkan') {
        if (global.tiktokCommentSession[id]) {
            clearTimeout(global.tiktokCommentSession[id].timeout);
            delete global.tiktokCommentSession[id];
            return m.reply('❌ *Sesi pembuatan TikTok Comment berhasil dibatalkan.*');
        } else {
            return m.reply('Bukan dalam sesi pembuatan TikTok Comment.');
        }
    }

    // Jika pengguna baru memulai perintah
    if (!global.tiktokCommentSession[id]) {
        global.tiktokCommentSession[id] = {
            step: 1,
            data: {},
            timeout: setTimeout(() => {
                if (global.tiktokCommentSession[id]) {
                    delete global.tiktokCommentSession[id];
                    conn.sendMessage(m.chat, { text: '⏰ *Waktu habis (1 menit).* Sesi pembuatan TikTok Comment dibatalkan otomatis.' }, { quoted: m });
                }
            }, 60000) // Timeout 1 Menit
        };

        return m.reply(
            `🎬 *TIKTOK COMMENT MAKER*\n\n` +
            `Silakan ikuti petunjuk pengisian berutut-turut.\nKetik *batalkan* kapan saja untuk menghentikan sesi.\n\n` +
            `👉 *Langkah 1/5:* Kirimkan gambar untuk *Avatar User 1* (Komentar Utama).\n` +
            `_(Kirim gambar atau balaskan/reply ke gambar dengan mengetikkan perintah ini)_`
        );
    }
};

// Handler sebelum eksekusi utama (Menangkap input lanjutan/jawaban user)
handler.before = async function (m, { conn }) {
    let id = m.sender;
    let session = global.tiktokCommentSession[id];

    if (!session) return;

    // Abaikan jika mengetik perintah pembatalan (dikelola handler utama)
    if (m.text && m.text.toLowerCase() === 'batalkan') return;

    // Reset timer 1 menit setiap kali pengguna mengirimkan input baru
    clearTimeout(session.timeout);
    session.timeout = setTimeout(() => {
        if (global.tiktokCommentSession[id]) {
            delete global.tiktokCommentSession[id];
            conn.sendMessage(m.chat, { text: '⏰ *Waktu habis (1 menit).* Sesi pembuatan TikTok Comment dibatalkan otomatis.' }, { quoted: m });
        }
    }, 60000);

    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    try {
        // --- STEP 1: Upload Avatar 1 ---
        if (session.step === 1) {
            if (!/image\/(png|jpe?g)/.test(mime)) {
                return m.reply('⚠️ Harap kirimkan atau balaskan (*reply*) sebuah **gambar** untuk Avatar User 1!');
            }
            m.reply('⏳ _Mengunggah Avatar 1..._');
            let imgBuf = await q.download();
            let upUrl = await uploadImageToUploader(imgBuf);
            if (!upUrl) throw 'Gagal mengunggah gambar Avatar 1.';

            session.data.avatar1 = upUrl;
            session.step = 2;
            return m.reply(`✅ *Avatar 1 Berhasil!*\n\n👉 *Langkah 2/5:* Kirimkan gambar untuk *Avatar User 2* (Komentar Balasan).`);
        }

        // --- STEP 2: Upload Avatar 2 ---
        if (session.step === 2) {
            if (!/image\/(png|jpe?g)/.test(mime)) {
                return m.reply('⚠️ Harap kirimkan atau balaskan (*reply*) sebuah **gambar** untuk Avatar User 2!');
            }
            m.reply('⏳ _Mengunggah Avatar 2..._');
            let imgBuf = await q.download();
            let upUrl = await uploadImageToUploader(imgBuf);
            if (!upUrl) throw 'Gagal mengunggah gambar Avatar 2.';

            session.data.avatar2 = upUrl;
            session.step = 3;
            return m.reply(`✅ *Avatar 2 Berhasil!*\n\n👉 *Langkah 3/5:* Kirimkan gambar untuk *Avatar Saya (Avatar Me)* (Profil Anda di input bawah).`);
        }

        // --- STEP 3: Upload Avatar Me ---
        if (session.step === 3) {
            if (!/image\/(png|jpe?g)/.test(mime)) {
                return m.reply('⚠️ Harap kirimkan atau balaskan (*reply*) sebuah **gambar** untuk Avatar Saya!');
            }
            m.reply('⏳ _Mengunggah Avatar Saya..._');
            let imgBuf = await q.download();
            let upUrl = await uploadImageToUploader(imgBuf);
            if (!upUrl) throw 'Gagal mengunggah gambar Avatar Saya.';

            session.data.avatarMe = upUrl;
            session.step = 4;
            return m.reply(
                `✅ *Semua Avatar Berhasil Diunggah!*\n\n` +
                `👉 *Langkah 4/5:* Masukkan data teks Komentar Utama.\n` +
                `Gunakan tanda pemisah garis tegak (*|*) dengan format:\n` +
                `\`Username1 | Teks Komen 1 | Waktu | Jumlah Like\`\n\n` +
                `📌 *Contoh:* \`betabotz | Mantap kali bos | 2j | 12500\``
            );
        }

        // --- STEP 4: Input Teks Komentar 1 ---
        if (session.step === 4) {
            if (!m.text) return m.reply('⚠️ Harap masukkan teks sesuai format!');
            let splits = m.text.split('|').map(v => v.trim());
            if (splits.length < 4) {
                return m.reply('⚠️ Format salah! Pastikan menggunakan 3 tanda `|` (Username | Teks | Waktu | Like)');
            }

            session.data.user1 = splits[0];
            session.data.text1 = splits[1];
            session.data.time1 = splits[2];
            session.data.likes = splits[3];
            session.step = 5;

            return m.reply(
                `👉 *Langkah 5/5 (Terakhir):* Masukkan data teks Komentar Balasan.\n` +
                `Gunakan format:\n` +
                `\`Username2 | Teks Komen 2 | Waktu | Jumlah Like | Balasan Lainnya\`\n\n` +
                `📌 *Contoh:* \`BetaApi | Setuju banget | 1j | 15 | 4\``
            );
        }

        // --- STEP 5: Input Teks Komentar 2 & Generate Gambar ---
        if (session.step === 5) {
            if (!m.text) return m.reply('⚠️ Harap masukkan teks sesuai format!');
            let splits = m.text.split('|').map(v => v.trim());
            if (splits.length < 5) {
                return m.reply('⚠️ Format salah! Pastikan menggunakan 4 tanda `|` (Username | Teks | Waktu | Like | MoreReplies)');
            }

            session.data.user2 = splits[0];
            session.data.text2 = splits[1];
            session.data.time2 = splits[2];
            session.data.likes2 = splits[3];
            session.data.moreReplies = splits[4];

            await m.reply('⏳ _Sedang memproses gambar TikTok Comment..._');

            let apiKey = global.lann || '';
            let apiUrl = `https://api.betabotz.eu.org/api/maker/canvas-ttComment?` +
                `apikey=${apiKey}` +
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

            // Kirim Hasil Canvas
            await conn.sendMessage(m.chat, {
                image: { url: apiUrl },
                caption: '✨ *TikTok Comment Canvas Berhasil Dibuat!*'
            }, { quoted: m });

            // Bersihkan Sesi dari Memori
            clearTimeout(session.timeout);
            delete global.tiktokCommentSession[id];
        }

    } catch (e) {
        console.error(e);
        m.reply('❌ Terjadi kesalahan saat memproses gambar/data. Sesi dibatalkan.');
        clearTimeout(session.timeout);
        delete global.tiktokCommentSession[id];
    }
};

handler.help = ['ttcomment'];
handler.tags = ['maker'];
handler.command = /^(ttcomment|tiktokcomment)$/i;

export default handler;

// Helper Uploader Gambar (Mendukung upload temporary)
async function uploadImageToUploader(buffer) {
    try {
        let fetch = (await import('node-fetch')).default;
        let { FormData, Blob } = await import('node-fetch');
        let formData = new FormData();
        formData.append('file', new Blob([buffer]), 'image.jpg');

        let res = await fetch('https://uploader.danafxc.my.id/upload', {
            method: 'POST',
            body: formData
        });
        let json = await res.json();
        return json.fileUrl || json.url || json.result || null;
    } catch (e) {
        console.error('Uploader Error:', e);
        return null;
    }
}