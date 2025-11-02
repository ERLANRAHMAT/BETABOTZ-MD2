const config = require('../bot-config');
const fs = require('fs');
const path = require('path');

// Database produk (gunakan JSON file)
const dbPath = path.join(__dirname, '../database/products.json');

// Inisialisasi database jika belum ada
function initDB() {
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify([], null, 2));
    }
}

// Baca database
function readDB() {
    initDB();
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

// Tulis database
function writeDB(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// Handler untuk store commands
async function handle(ctx) {
    const { command, args, reply, isOwner } = ctx;
    
    if (!config.store.enabled) {
        await reply('❌ Fitur store sedang tidak aktif.');
        return;
    }
    
    switch (command) {
        case 'store':
            await showStore(ctx);
            break;
        case 'listproduk':
            await listProducts(ctx);
            break;
        case 'order':
            await orderProduct(ctx);
            break;
        case 'addproduk':
            if (!isOwner) {
                await reply(config.messages.ownerOnly);
                return;
            }
            await addProduct(ctx);
            break;
        case 'delproduk':
            if (!isOwner) {
                await reply(config.messages.ownerOnly);
                return;
            }
            await deleteProduct(ctx);
            break;
    }
}

// Tampilkan store
async function showStore(ctx) {
    const { reply } = ctx;
    
    const message = `
╔════════════════════════════╗
║      🏪 *WELCOME TO STORE*      ║
╚════════════════════════════╝

Selamat datang di toko kami!
Kami menyediakan berbagai produk digital dan fisik.

📋 *Menu Store:*
• ${config.bot.prefix}listproduk - Lihat daftar produk
• ${config.bot.prefix}order <id> - Pesan produk

💳 *Metode Pembayaran:*
${config.store.paymentMethods.map(m => `• ${m}`).join('\n')}

📞 *Kontak:*
Hubungi owner untuk informasi lebih lanjut

© ${config.bot.name}
`;
    
    await reply(message);
}

// List semua produk
async function listProducts(ctx) {
    const { reply } = ctx;
    
    const products = readDB();
    
    if (products.length === 0) {
        await reply('❌ Belum ada produk di store.');
        return;
    }
    
    let message = `
╔════════════════════════════╗
║     📋 *DAFTAR PRODUK*     ║
╚════════════════════════════╝

`;
    
    products.forEach((product, index) => {
        message += `
*${index + 1}. ${product.name}*
💰 Harga: Rp ${parseInt(product.price).toLocaleString('id-ID')}
📦 Stok: ${product.stock}
📝 Deskripsi: ${product.description}
🆔 ID: ${product.id}
━━━━━━━━━━━━━━━━━━━━━
`;
    });
    
    message += `
\n💡 Untuk order: ${config.bot.prefix}order <id>
Contoh: ${config.bot.prefix}order ${products[0]?.id || 'PROD001'}
`;
    
    await reply(message);
}

// Order produk
async function orderProduct(ctx) {
    const { args, reply, senderNumber } = ctx;
    
    if (args.length === 0) {
        await reply(`❌ Masukkan ID produk!\n\nContoh: ${config.bot.prefix}order PROD001`);
        return;
    }
    
    const productId = args[0].toUpperCase();
    const products = readDB();
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        await reply('❌ Produk tidak ditemukan!');
        return;
    }
    
    if (product.stock <= 0) {
        await reply('❌ Produk sedang habis!');
        return;
    }
    
    const orderId = 'ORD' + Date.now();
    
    const message = `
✅ *PESANAN BERHASIL DIBUAT*

🆔 *Order ID:* ${orderId}
📦 *Produk:* ${product.name}
💰 *Harga:* Rp ${parseInt(product.price).toLocaleString('id-ID')}
👤 *Pembeli:* ${senderNumber}
⏰ *Waktu:* ${new Date().toLocaleString('id-ID')}

━━━━━━━━━━━━━━━━━━━━━

💳 *Metode Pembayaran:*
${config.store.paymentMethods.map(m => `• ${m}`).join('\n')}

📝 *Instruksi:*
1. Lakukan pembayaran sesuai nominal
2. Kirim bukti transfer ke owner
3. Tunggu konfirmasi dari owner
4. Produk akan dikirim setelah pembayaran dikonfirmasi

⚠️ *Penting:*
Simpan Order ID untuk tracking pesanan

Terima kasih telah berbelanja! 🙏
`;
    
    await reply(message);
    
    // Kurangi stok (opsional, bisa dikembalikan jika tidak jadi bayar)
    // product.stock -= 1;
    // writeDB(products);
}

// Tambah produk (owner only)
async function addProduct(ctx) {
    const { args, reply } = ctx;
    
    if (args.length < 4) {
        await reply(`❌ Format salah!\n\nContoh: ${config.bot.prefix}addproduk PROD001 NamaProduk 50000 10 Deskripsi produk`);
        return;
    }
    
    const id = args[0].toUpperCase();
    const name = args[1];
    const price = parseInt(args[2]);
    const stock = parseInt(args[3]);
    const description = args.slice(4).join(' ') || '-';
    
    const products = readDB();
    
    if (products.find(p => p.id === id)) {
        await reply('❌ ID produk sudah ada!');
        return;
    }
    
    const newProduct = {
        id,
        name,
        price,
        stock,
        description,
        createdAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    writeDB(products);
    
    await reply(`✅ Produk berhasil ditambahkan!\n\n*${name}*\nID: ${id}\nHarga: Rp ${price.toLocaleString('id-ID')}\nStok: ${stock}`);
}

// Hapus produk (owner only)
async function deleteProduct(ctx) {
    const { args, reply } = ctx;
    
    if (args.length === 0) {
        await reply(`❌ Masukkan ID produk!\n\nContoh: ${config.bot.prefix}delproduk PROD001`);
        return;
    }
    
    const id = args[0].toUpperCase();
    const products = readDB();
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) {
        await reply('❌ Produk tidak ditemukan!');
        return;
    }
    
    const deletedProduct = products[index];
    products.splice(index, 1);
    writeDB(products);
    
    await reply(`✅ Produk berhasil dihapus!\n\n*${deletedProduct.name}* (${id})`);
}

module.exports = { handle };
