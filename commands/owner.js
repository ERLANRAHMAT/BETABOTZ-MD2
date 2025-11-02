const config = require('../bot-config');
const fs = require('fs');

// Handler untuk owner commands
async function handle(ctx) {
    const { command, args, reply, sock } = ctx;
    
    switch (command) {
        case 'setmode':
            await setMode(ctx);
            break;
        case 'broadcast':
        case 'bc':
            await broadcast(ctx);
            break;
        case 'addowner':
            await addOwner(ctx);
            break;
        case 'delowner':
            await delOwner(ctx);
            break;
        case 'block':
            await blockUser(ctx);
            break;
        case 'unblock':
            await unblockUser(ctx);
            break;
    }
}

// Set mode bot (public/self)
async function setMode(ctx) {
    const { args, reply } = ctx;
    
    if (args.length === 0) {
        await reply(`❌ Mode tidak valid!\n\nGunakan: ${config.bot.prefix}setmode public/self\n\nMode saat ini: *${config.bot.mode}*`);
        return;
    }
    
    const mode = args[0].toLowerCase();
    
    if (mode !== 'public' && mode !== 'self') {
        await reply('❌ Mode hanya bisa "public" atau "self"!');
        return;
    }
    
    config.bot.mode = mode;
    
    // Update config file
    const configPath = './bot-config.js';
    let configContent = fs.readFileSync(configPath, 'utf8');
    configContent = configContent.replace(/mode: '(public|self)'/, `mode: '${mode}'`);
    fs.writeFileSync(configPath, configContent);
    
    await reply(`✅ Mode bot berhasil diubah ke *${mode.toUpperCase()}*`);
}

// Broadcast message ke semua chat
async function broadcast(ctx) {
    const { args, reply, sock } = ctx;
    
    if (args.length === 0) {
        await reply(`❌ Masukkan pesan broadcast!\n\nContoh: ${config.bot.prefix}broadcast Halo semua!`);
        return;
    }
    
    const message = args.join(' ');
    
    await reply('📢 Memulai broadcast...');
    
    try {
        const chats = await sock.groupFetchAllParticipating();
        const groups = Object.values(chats);
        
        let success = 0;
        let failed = 0;
        
        for (const group of groups) {
            try {
                await sock.sendMessage(group.id, { text: message });
                success++;
                await new Promise(resolve => setTimeout(resolve, 1000)); // Delay 1 detik
            } catch (error) {
                failed++;
            }
        }
        
        await reply(`✅ Broadcast selesai!\n\n✓ Berhasil: ${success}\n✗ Gagal: ${failed}`);
    } catch (error) {
        await reply('❌ Terjadi kesalahan saat broadcast!');
    }
}

// Tambah owner
async function addOwner(ctx) {
    const { args, reply } = ctx;
    
    if (args.length === 0) {
        await reply(`❌ Masukkan nomor!\n\nContoh: ${config.bot.prefix}addowner 6281234567890`);
        return;
    }
    
    const number = args[0].replace(/[^0-9]/g, '');
    
    if (config.owner.numbers.includes(number)) {
        await reply('❌ Nomor sudah terdaftar sebagai owner!');
        return;
    }
    
    config.owner.numbers.push(number);
    
    // Update config file
    const configPath = './bot-config.js';
    let configContent = fs.readFileSync(configPath, 'utf8');
    const numbersStr = config.owner.numbers.map(n => `'${n}'`).join(', ');
    configContent = configContent.replace(/numbers: \[.*?\]/, `numbers: [${numbersStr}]`);
    fs.writeFileSync(configPath, configContent);
    
    await reply(`✅ Nomor *${number}* berhasil ditambahkan sebagai owner!`);
}

// Hapus owner
async function delOwner(ctx) {
    const { args, reply } = ctx;
    
    if (args.length === 0) {
        await reply(`❌ Masukkan nomor!\n\nContoh: ${config.bot.prefix}delowner 6281234567890`);
        return;
    }
    
    const number = args[0].replace(/[^0-9]/g, '');
    
    if (!config.owner.numbers.includes(number)) {
        await reply('❌ Nomor tidak terdaftar sebagai owner!');
        return;
    }
    
    if (config.owner.numbers.length === 1) {
        await reply('❌ Tidak bisa menghapus owner terakhir!');
        return;
    }
    
    config.owner.numbers = config.owner.numbers.filter(n => n !== number);
    
    // Update config file
    const configPath = './bot-config.js';
    let configContent = fs.readFileSync(configPath, 'utf8');
    const numbersStr = config.owner.numbers.map(n => `'${n}'`).join(', ');
    configContent = configContent.replace(/numbers: \[.*?\]/, `numbers: [${numbersStr}]`);
    fs.writeFileSync(configPath, configContent);
    
    await reply(`✅ Nomor *${number}* berhasil dihapus dari owner!`);
}

// Block user
async function blockUser(ctx) {
    const { args, reply, sock } = ctx;
    
    if (args.length === 0) {
        await reply(`❌ Masukkan nomor!\n\nContoh: ${config.bot.prefix}block 6281234567890`);
        return;
    }
    
    const number = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    
    try {
        await sock.updateBlockStatus(number, 'block');
        await reply(`✅ Nomor berhasil diblokir!`);
    } catch (error) {
        await reply('❌ Gagal memblokir nomor!');
    }
}

// Unblock user
async function unblockUser(ctx) {
    const { args, reply, sock } = ctx;
    
    if (args.length === 0) {
        await reply(`❌ Masukkan nomor!\n\nContoh: ${config.bot.prefix}unblock 6281234567890`);
        return;
    }
    
    const number = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    
    try {
        await sock.updateBlockStatus(number, 'unblock');
        await reply(`✅ Nomor berhasil di-unblock!`);
    } catch (error) {
        await reply('❌ Gagal meng-unblock nomor!');
    }
}

module.exports = { handle };
