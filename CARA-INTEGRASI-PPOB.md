# 💰 Panduan Integrasi API PPOB

Panduan lengkap untuk mengintegrasikan API PPOB ke dalam bot WhatsApp.

## 📋 Provider PPOB yang Didukung

Bot ini dapat diintegrasikan dengan berbagai provider PPOB:

1. **DigiFlazz** - https://digiflazz.com
2. **VIP Reseller** - https://vip-reseller.co.id
3. **Paydisini** - https://paydisini.co.id
4. **Apigames** - https://apigames.id
5. **Dan provider lainnya yang menggunakan REST API

## 🔧 Cara Integrasi

### 1. Daftar di Provider PPOB

Pilih salah satu provider dan daftar akun:

**Contoh: DigiFlazz**
1. Kunjungi https://digiflazz.com
2. Daftar akun baru
3. Verifikasi email
4. Login ke dashboard
5. Deposit saldo
6. Dapatkan API Key dan Username

### 2. Konfigurasi di Bot

Edit file `bot-config.js`:

```javascript
ppob: {
    enabled: true,
    apiKey: 'YOUR_API_KEY_HERE', // Ganti dengan API Key Anda
    apiUrl: 'https://api.digiflazz.com/v1', // URL API provider
    username: 'YOUR_USERNAME', // Username akun PPOB
    markup: {
        pulsa: 1000, // Markup harga pulsa (Rp)
        paketData: 1500,
        pln: 1000,
        emoney: 1000
    }
}
```

### 3. Implementasi API

Edit file `commands/ppob.js` sesuai dengan dokumentasi API provider Anda.

## 📚 Contoh Integrasi

### DigiFlazz API

```javascript
// commands/ppob.js

const axios = require('axios');
const crypto = require('crypto');
const config = require('../bot-config');

// Generate signature untuk DigiFlazz
function generateSignature(username, apiKey, refId) {
    const data = username + apiKey + refId;
    return crypto.createHash('md5').update(data).digest('hex');
}

// Fungsi untuk transaksi
async function buyPulsa(nomor, nominal) {
    const refId = 'TRX' + Date.now();
    const username = config.ppob.username;
    const apiKey = config.ppob.apiKey;
    const sign = generateSignature(username, apiKey, refId);
    
    const payload = {
        username: username,
        buyer_sku_code: `TSEL${nominal}`, // Kode produk
        customer_no: nomor,
        ref_id: refId,
        sign: sign
    };
    
    try {
        const response = await axios.post(
            `${config.ppob.apiUrl}/transaction`,
            payload,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        
        return {
            success: true,
            trxId: response.data.data.trx_id,
            status: response.data.data.status,
            sn: response.data.data.sn,
            message: response.data.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.data?.message || 'Transaksi gagal'
        };
    }
}

// Fungsi untuk cek harga
async function getPriceList() {
    const username = config.ppob.username;
    const apiKey = config.ppob.apiKey;
    const sign = generateSignature(username, apiKey, 'pricelist');
    
    const payload = {
        cmd: 'prepaid',
        username: username,
        sign: sign
    };
    
    try {
        const response = await axios.post(
            `${config.ppob.apiUrl}/price-list`,
            payload
        );
        
        return response.data.data;
    } catch (error) {
        console.error('Error getting price list:', error);
        return [];
    }
}

// Fungsi untuk cek saldo
async function checkBalance() {
    const username = config.ppob.username;
    const apiKey = config.ppob.apiKey;
    const sign = generateSignature(username, apiKey, 'depo');
    
    const payload = {
        cmd: 'deposit',
        username: username,
        sign: sign
    };
    
    try {
        const response = await axios.post(
            `${config.ppob.apiUrl}/cek-saldo`,
            payload
        );
        
        return {
            success: true,
            balance: response.data.data.deposit
        };
    } catch (error) {
        return {
            success: false,
            message: 'Gagal cek saldo'
        };
    }
}

module.exports = {
    buyPulsa,
    getPriceList,
    checkBalance
};
```

### VIP Reseller API

```javascript
// Contoh untuk VIP Reseller

async function buyPulsa(nomor, nominal) {
    const apiKey = config.ppob.apiKey;
    const apiUrl = 'https://vip-reseller.co.id/api/prepaid';
    
    const payload = {
        key: apiKey,
        sign: crypto.createHash('md5').update(apiKey + 'ORDER').digest('hex'),
        type: 'order',
        service: `pulsa-${nominal}`,
        data_no: nomor
    };
    
    try {
        const response = await axios.post(apiUrl, payload);
        
        return {
            success: response.data.result,
            trxId: response.data.data.trxid,
            sn: response.data.data.sn,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Transaksi gagal'
        };
    }
}
```

## 🛠️ Kode Produk

### Pulsa

```javascript
const pulsaCodes = {
    'TELKOMSEL': {
        5000: 'TSEL5',
        10000: 'TSEL10',
        20000: 'TSEL20',
        25000: 'TSEL25',
        50000: 'TSEL50',
        100000: 'TSEL100'
    },
    'INDOSAT': {
        5000: 'ISAT5',
        10000: 'ISAT10',
        25000: 'ISAT25',
        50000: 'ISAT50',
        100000: 'ISAT100'
    },
    'XL': {
        5000: 'XL5',
        10000: 'XL10',
        25000: 'XL25',
        50000: 'XL50',
        100000: 'XL100'
    }
};
```

### Paket Data

```javascript
const paketDataCodes = {
    'TELKOMSEL': {
        '1GB': 'TSEL1GB',
        '2GB': 'TSEL2GB',
        '5GB': 'TSEL5GB',
        '10GB': 'TSEL10GB'
    },
    'INDOSAT': {
        '1GB': 'ISAT1GB',
        '2GB': 'ISAT2GB',
        '5GB': 'ISAT5GB'
    }
};
```

### Token PLN

```javascript
const plnCodes = {
    20000: 'PLN20',
    50000: 'PLN50',
    100000: 'PLN100',
    200000: 'PLN200',
    500000: 'PLN500',
    1000000: 'PLN1000'
};
```

## 📊 Database Transaksi

Buat file `database/transactions.json` untuk menyimpan riwayat transaksi:

```javascript
// lib/transaction.js

const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database/transactions.json');

function saveTransaction(data) {
    let transactions = [];
    
    if (fs.existsSync(dbPath)) {
        transactions = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    }
    
    transactions.push({
        ...data,
        timestamp: new Date().toISOString()
    });
    
    fs.writeFileSync(dbPath, JSON.stringify(transactions, null, 2));
}

function getTransactions(userId) {
    if (!fs.existsSync(dbPath)) {
        return [];
    }
    
    const transactions = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    return transactions.filter(t => t.userId === userId);
}

module.exports = {
    saveTransaction,
    getTransactions
};
```

## 🔐 Keamanan

### 1. Enkripsi API Key

Jangan simpan API Key di plain text. Gunakan environment variables:

```javascript
// .env
PPOB_API_KEY=your_api_key_here
PPOB_USERNAME=your_username_here

// bot-config.js
require('dotenv').config();

ppob: {
    apiKey: process.env.PPOB_API_KEY,
    username: process.env.PPOB_USERNAME
}
```

### 2. Validasi Transaksi

```javascript
function validateTransaction(nomor, nominal) {
    // Validasi nomor HP
    if (!/^08[0-9]{8,11}$/.test(nomor)) {
        return { valid: false, message: 'Nomor HP tidak valid' };
    }
    
    // Validasi nominal
    const validNominals = [5000, 10000, 20000, 25000, 50000, 100000];
    if (!validNominals.includes(parseInt(nominal))) {
        return { valid: false, message: 'Nominal tidak valid' };
    }
    
    return { valid: true };
}
```

### 3. Rate Limiting

```javascript
const rateLimit = new Map();

function checkRateLimit(userId) {
    const now = Date.now();
    const userLimit = rateLimit.get(userId);
    
    if (userLimit && now - userLimit < 60000) { // 1 menit
        return false;
    }
    
    rateLimit.set(userId, now);
    return true;
}
```

## 📱 Command Handler Update

Update `commands/ppob.js` dengan implementasi lengkap:

```javascript
async function handlePulsa(ctx) {
    const { args, reply, senderNumber } = ctx;
    
    // Validasi
    if (args.length < 2) {
        await reply(`❌ Format salah!\n\nContoh: ${config.bot.prefix}pulsa 081234567890 10000`);
        return;
    }
    
    const nomor = args[0];
    const nominal = args[1];
    
    // Validasi input
    const validation = validateTransaction(nomor, nominal);
    if (!validation.valid) {
        await reply(`❌ ${validation.message}`);
        return;
    }
    
    // Rate limiting
    if (!checkRateLimit(senderNumber)) {
        await reply('❌ Tunggu 1 menit sebelum transaksi berikutnya!');
        return;
    }
    
    await reply(config.messages.wait);
    
    try {
        // Proses transaksi
        const result = await buyPulsa(nomor, nominal);
        
        if (result.success) {
            // Hitung harga dengan markup
            const price = parseInt(nominal) + config.ppob.markup.pulsa;
            
            // Simpan transaksi
            saveTransaction({
                userId: senderNumber,
                type: 'pulsa',
                nomor: nomor,
                nominal: nominal,
                price: price,
                trxId: result.trxId,
                status: 'success'
            });
            
            const message = `
✅ *PEMBELIAN PULSA BERHASIL*

📱 *Nomor:* ${nomor}
💰 *Nominal:* Rp ${parseInt(nominal).toLocaleString('id-ID')}
💳 *Harga:* Rp ${price.toLocaleString('id-ID')}
🆔 *Trx ID:* ${result.trxId}
📝 *SN:* ${result.sn || '-'}
⏰ *Waktu:* ${new Date().toLocaleString('id-ID')}

Terima kasih telah menggunakan layanan kami! 🙏
`;
            
            await reply(message);
        } else {
            await reply(`❌ Transaksi gagal: ${result.message}`);
        }
    } catch (error) {
        console.error('PPOB Error:', error);
        await reply('❌ Terjadi kesalahan sistem. Silakan coba lagi nanti.');
    }
}
```

## 🧪 Testing

Buat file `test-ppob.js` untuk testing:

```javascript
const { buyPulsa, checkBalance, getPriceList } = require('./commands/ppob');

async function test() {
    console.log('Testing PPOB API...\n');
    
    // Test cek saldo
    console.log('1. Cek Saldo:');
    const balance = await checkBalance();
    console.log(balance);
    
    // Test price list
    console.log('\n2. Price List:');
    const prices = await getPriceList();
    console.log(prices.slice(0, 5)); // Tampilkan 5 produk pertama
    
    // Test transaksi (gunakan nomor test dari provider)
    console.log('\n3. Test Transaksi:');
    const result = await buyPulsa('081234567890', '5000');
    console.log(result);
}

test();
```

Jalankan:
```bash
node test-ppob.js
```

## 📝 Catatan Penting

1. **Baca dokumentasi API provider** - Setiap provider punya format berbeda
2. **Gunakan nomor test** - Jangan langsung test dengan nomor asli
3. **Cek saldo** - Pastikan saldo API mencukupi
4. **Handle error** - Implementasi error handling yang baik
5. **Log transaksi** - Simpan semua transaksi untuk tracking
6. **Backup database** - Backup database transaksi secara berkala

## 🆘 Troubleshooting

### Error: Invalid Signature

Cek kembali cara generate signature sesuai dokumentasi provider.

### Error: Insufficient Balance

Deposit saldo ke akun PPOB Anda.

### Error: Product Not Found

Cek kode produk di price list provider.

### Transaksi Pending

Tunggu beberapa menit, lalu cek status transaksi.

---

Untuk pertanyaan lebih lanjut, baca dokumentasi API provider atau hubungi support mereka.
