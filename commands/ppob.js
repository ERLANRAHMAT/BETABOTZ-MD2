const config = require('../bot-config');
const axios = require('axios');

// Handler untuk PPOB commands
async function handle(ctx) {
    const { command, args, reply } = ctx;
    
    if (!config.ppob.enabled) {
        await reply('❌ Fitur PPOB sedang tidak aktif.');
        return;
    }
    
    switch (command) {
        case 'pulsa':
            await handlePulsa(ctx);
            break;
        case 'paketdata':
            await handlePaketData(ctx);
            break;
        case 'pln':
            await handlePLN(ctx);
            break;
        case 'emoney':
            await handleEmoney(ctx);
            break;
        case 'cekppob':
            await handleCekPPOB(ctx);
            break;
    }
}

// Handle pembelian pulsa
async function handlePulsa(ctx) {
    const { args, reply } = ctx;
    
    if (args.length < 2) {
        await reply(`❌ Format salah!\n\nContoh: ${config.bot.prefix}pulsa 081234567890 10000`);
        return;
    }
    
    const nomor = args[0];
    const nominal = args[1];
    
    await reply(config.messages.wait);
    
    try {
        // Simulasi pembelian pulsa (ganti dengan API PPOB sebenarnya)
        const result = await buyPulsa(nomor, nominal);
        
        const message = `
✅ *PEMBELIAN PULSA BERHASIL*

📱 *Nomor:* ${nomor}
💰 *Nominal:* Rp ${parseInt(nominal).toLocaleString('id-ID')}
🆔 *Trx ID:* ${result.trxId}
⏰ *Waktu:* ${new Date().toLocaleString('id-ID')}

Terima kasih telah menggunakan layanan kami! 🙏
`;
        
        await reply(message);
    } catch (error) {
        await reply(`❌ Pembelian gagal: ${error.message}`);
    }
}

// Handle pembelian paket data
async function handlePaketData(ctx) {
    const { args, reply } = ctx;
    
    if (args.length < 2) {
        await reply(`❌ Format salah!\n\nContoh: ${config.bot.prefix}paketdata 081234567890 TSEL5GB`);
        return;
    }
    
    const nomor = args[0];
    const kode = args[1];
    
    await reply(config.messages.wait);
    
    try {
        const result = await buyPaketData(nomor, kode);
        
        const message = `
✅ *PEMBELIAN PAKET DATA BERHASIL*

📱 *Nomor:* ${nomor}
📦 *Paket:* ${kode}
🆔 *Trx ID:* ${result.trxId}
⏰ *Waktu:* ${new Date().toLocaleString('id-ID')}

Terima kasih telah menggunakan layanan kami! 🙏
`;
        
        await reply(message);
    } catch (error) {
        await reply(`❌ Pembelian gagal: ${error.message}`);
    }
}

// Handle pembelian token PLN
async function handlePLN(ctx) {
    const { args, reply } = ctx;
    
    if (args.length < 2) {
        await reply(`❌ Format salah!\n\nContoh: ${config.bot.prefix}pln 12345678901 50000`);
        return;
    }
    
    const nomor = args[0];
    const nominal = args[1];
    
    await reply(config.messages.wait);
    
    try {
        const result = await buyPLN(nomor, nominal);
        
        const message = `
✅ *PEMBELIAN TOKEN PLN BERHASIL*

🔢 *ID Pelanggan:* ${nomor}
💰 *Nominal:* Rp ${parseInt(nominal).toLocaleString('id-ID')}
🔑 *Token:* ${result.token}
🆔 *Trx ID:* ${result.trxId}
⏰ *Waktu:* ${new Date().toLocaleString('id-ID')}

Terima kasih telah menggunakan layanan kami! 🙏
`;
        
        await reply(message);
    } catch (error) {
        await reply(`❌ Pembelian gagal: ${error.message}`);
    }
}

// Handle top up e-money
async function handleEmoney(ctx) {
    const { args, reply } = ctx;
    
    if (args.length < 3) {
        await reply(`❌ Format salah!\n\nContoh: ${config.bot.prefix}emoney gopay 081234567890 50000\n\nJenis: gopay, ovo, dana, shopeepay`);
        return;
    }
    
    const jenis = args[0].toLowerCase();
    const nomor = args[1];
    const nominal = args[2];
    
    await reply(config.messages.wait);
    
    try {
        const result = await buyEmoney(jenis, nomor, nominal);
        
        const message = `
✅ *TOP UP E-MONEY BERHASIL*

💳 *Jenis:* ${jenis.toUpperCase()}
📱 *Nomor:* ${nomor}
💰 *Nominal:* Rp ${parseInt(nominal).toLocaleString('id-ID')}
🆔 *Trx ID:* ${result.trxId}
⏰ *Waktu:* ${new Date().toLocaleString('id-ID')}

Terima kasih telah menggunakan layanan kami! 🙏
`;
        
        await reply(message);
    } catch (error) {
        await reply(`❌ Top up gagal: ${error.message}`);
    }
}

// Handle cek produk PPOB
async function handleCekPPOB(ctx) {
    const { reply } = ctx;
    
    const message = `
📋 *DAFTAR PRODUK PPOB*

💰 *PULSA*
• 5.000 - Rp 6.000
• 10.000 - Rp 11.000
• 20.000 - Rp 21.000
• 25.000 - Rp 26.000
• 50.000 - Rp 51.000
• 100.000 - Rp 101.000

📦 *PAKET DATA*
• TSEL5GB - Rp 45.000
• TSEL10GB - Rp 75.000
• ISAT5GB - Rp 40.000
• XL5GB - Rp 42.000

⚡ *TOKEN PLN*
• 20.000 - Rp 21.000
• 50.000 - Rp 51.000
• 100.000 - Rp 101.000
• 200.000 - Rp 201.000

💳 *E-MONEY*
• GoPay, OVO, DANA, ShopeePay
• Min: 10.000 | Max: 1.000.000

Harga sudah termasuk markup.
Untuk pembelian, gunakan command sesuai kategori.
`;
    
    await reply(message);
}

// Fungsi API untuk pembelian (simulasi - ganti dengan API sebenarnya)
async function buyPulsa(nomor, nominal) {
    // Simulasi - Ganti dengan integrasi API PPOB sebenarnya
    // Contoh: DigiFlazz, VIP Reseller, dll
    
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                trxId: 'TRX' + Date.now(),
                status: 'success'
            });
        }, 2000);
    });
}

async function buyPaketData(nomor, kode) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                trxId: 'TRX' + Date.now(),
                status: 'success'
            });
        }, 2000);
    });
}

async function buyPLN(nomor, nominal) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                trxId: 'TRX' + Date.now(),
                token: '1234-5678-9012-3456-7890',
                status: 'success'
            });
        }, 2000);
    });
}

async function buyEmoney(jenis, nomor, nominal) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                trxId: 'TRX' + Date.now(),
                status: 'success'
            });
        }, 2000);
    });
}

module.exports = { handle };
