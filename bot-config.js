// Konfigurasi Bot WhatsApp
module.exports = {
    // Informasi Owner
    owner: {
        name: 'Owner Bot',
        number: '6281234567890', // Ganti dengan nomor owner
        numbers: ['6281234567890'] // Bisa lebih dari 1 owner
    },

    // Bot Settings
    bot: {
        name: 'WhatsApp Bot',
        prefix: '.',
        mode: 'public', // 'public' atau 'self'
        autoRead: true,
        autoTyping: false,
        autoRecord: false,
        maxDownloadSize: 100 // MB
    },

    // PPOB Settings (Integrasi dengan API PPOB)
    ppob: {
        enabled: true,
        apiKey: 'YOUR_PPOB_API_KEY', // Ganti dengan API Key dari provider PPOB
        apiUrl: 'https://api.digiflazz.com/v1', // Contoh: DigiFlazz, VIP Reseller, dll
        username: 'YOUR_USERNAME',
        markup: {
            pulsa: 1000, // Markup harga pulsa
            paketData: 1500,
            pln: 1000,
            emoney: 1000
        }
    },

    // Store Settings
    store: {
        enabled: true,
        currency: 'IDR',
        paymentMethods: ['BCA', 'Mandiri', 'OVO', 'DANA', 'GoPay'],
        adminFee: 0
    },

    // Downloader Settings
    downloader: {
        enabled: true,
        maxSize: 100, // MB
        quality: 'medium', // low, medium, high
        watermark: false
    },

    // Messages
    messages: {
        wait: '⏳ Tunggu sebentar...',
        success: '✅ Berhasil!',
        error: '❌ Terjadi kesalahan!',
        ownerOnly: '⚠️ Perintah ini hanya untuk owner!',
        groupOnly: '⚠️ Perintah ini hanya bisa digunakan di grup!',
        privateOnly: '⚠️ Perintah ini hanya bisa digunakan di private chat!',
        notFound: '❌ Tidak ditemukan!',
        invalidFormat: '❌ Format salah!'
    },

    // Timezone
    timezone: 'Asia/Jakarta'
};
