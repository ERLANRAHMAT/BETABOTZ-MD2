import moment from 'moment-timezone';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storeDatabaseFilePath = path.join(__dirname, 'store-database.json');

const loadStoreDatabase = () => {
    if (fs.existsSync(storeDatabaseFilePath)) {
        const data = fs.readFileSync(storeDatabaseFilePath);
        return JSON.parse(data);
    }
    return { store: {}, transactions: {}, setlist: {}, addlist: {} };
};

const saveStoreDatabase = (data) => {
    fs.writeFileSync(storeDatabaseFilePath, JSON.stringify(data, null, 2));
};

const handler = async (message, { isOwner }) => {
    const storeDatabase = loadStoreDatabase();
    storeDatabase.store = storeDatabase.store || {};
    storeDatabase.transactions = storeDatabase.transactions || {};

    const chatId = message.chat;
    storeDatabase.store[chatId] = storeDatabase.store[chatId] || [];
    storeDatabase.transactions[chatId] = storeDatabase.transactions[chatId] || [];

    const transactions = storeDatabase.transactions[chatId];

    if (!isOwner) throw `Hanya owner yang dapat menyelesaikan transaksi.`;
    if (!message.quoted) throw `Harap reply ke pesan yang berisi bukti gambar dengan caption ID transaksi.`;
    
    const quotedMessage = message.quoted;
    const transactionId = quotedMessage.text.trim().toUpperCase();
    const transaction = transactions.find(t => t.transactionId === transactionId);

    if (!transaction) throw `ID Transaksi tidak valid atau sudah kadaluarsa.`;

    const now = moment().tz('Asia/Jakarta');
    if (now.isAfter(moment(transaction.expiryTime))) {
        throw `ID Transaksi tidak valid atau sudah kadaluarsa.`;
    }

    const replyMessage = `「 BERHASIL DISELESAIKAN OLEH ADMIN AQUA 」\n\n📆 TANGGAL : ${now.format('YYYY-MM-DD')}\n⌚ JAM     : ${now.format('HH:mm')}\n✨ STATUS  : Berhasil\n\nTerimakasih @${quotedMessage.sender.split('@')[0]}\n\nKami ucapkan terima kasih sudah berbelanja di toko kami, Di tunggu ya pesanan berikut nya :D`;
    message.reply(replyMessage, null, { mentions: [quotedMessage.sender] });

    const transactionIndex = transactions.findIndex(t => t.transactionId === transactionId);
    if (transactionIndex !== -1) {
        transactions.splice(transactionIndex, 1);
        saveStoreDatabase(storeDatabase);
    }
};

handler.customPrefix = /^done$/i;
handler.command = new RegExp;
export default handler;


// no copas code dari luar, logic pakai kepala
// bebas ubah karena open source
// danaputra133
// tutorial pakai ada di: https://youtu.be/P7K5ycatYJA