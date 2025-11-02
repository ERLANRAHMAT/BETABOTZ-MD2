const {
    default: makeWASocket,
    DisconnectReason,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    makeInMemoryStore,
    jidNormalizedUser,
    getContentType,
    downloadMediaMessage
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const config = require('./bot-config');
const { Boom } = require('@hapi/boom');

// Import handlers
const messageHandler = require('./handlers/message');
const commandHandler = require('./handlers/command');

// Store untuk menyimpan data sementara
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });

// Fungsi utama untuk menjalankan bot
async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
    const { version } = await fetchLatestBaileysVersion();

    console.log(chalk.green('╔════════════════════════════════════╗'));
    console.log(chalk.green('║   WhatsApp Bot PPOB & Downloader   ║'));
    console.log(chalk.green('╚════════════════════════════════════╝'));
    console.log(chalk.yellow(`Mode: ${config.bot.mode.toUpperCase()}`));
    console.log(chalk.yellow(`Prefix: ${config.bot.prefix}`));
    console.log('');

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true,
        auth: state,
        browser: ['WhatsApp Bot', 'Chrome', '3.0'],
        getMessage: async (key) => {
            if (store) {
                const msg = await store.loadMessage(key.remoteJid, key.id);
                return msg?.message || undefined;
            }
            return { conversation: 'Hello' };
        }
    });

    store?.bind(sock.ev);

    // Event: Connection Update
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error instanceof Boom)
                ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
                : true;
            
            console.log(chalk.red('Connection closed due to'), lastDisconnect?.error, chalk.yellow('reconnecting:'), shouldReconnect);
            
            if (shouldReconnect) {
                startBot();
            }
        } else if (connection === 'open') {
            console.log(chalk.green('✓ Bot berhasil terhubung!'));
            console.log(chalk.cyan('Bot siap digunakan!'));
        }
    });

    // Event: Credentials Update
    sock.ev.on('creds.update', saveCreds);

    // Event: Messages
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        try {
            if (type !== 'notify') return;
            
            const m = messages[0];
            if (!m.message) return;
            
            // Auto read messages
            if (config.bot.autoRead) {
                await sock.readMessages([m.key]);
            }

            // Handle message
            await messageHandler(sock, m, store);
            
            // Handle command
            await commandHandler(sock, m, store);
        } catch (error) {
            console.error(chalk.red('Error handling message:'), error);
        }
    });

    // Event: Group participants update
    sock.ev.on('group-participants.update', async (update) => {
        console.log('Group update:', update);
        // Handle welcome/goodbye messages here
    });

    return sock;
}

// Jalankan bot
startBot().catch(err => {
    console.error(chalk.red('Error starting bot:'), err);
    process.exit(1);
});

// Handle process termination
process.on('uncaughtException', (err) => {
    console.error(chalk.red('Uncaught Exception:'), err);
});

process.on('unhandledRejection', (err) => {
    console.error(chalk.red('Unhandled Rejection:'), err);
});
