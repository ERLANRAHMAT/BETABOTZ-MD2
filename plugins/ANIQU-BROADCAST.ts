
// ANIQU BROADCAST WORKER, Aktifkan ini jika kammu ingin fitur broadcast terintegrasi dengan bot whatsapp
// jangan lupa token kelas kamu di .env atau config.js

// Tutorial https://www.youtube.com/playlist?list=PLGv_-znSuMIwhZPH2y06HWisHZbn7dXL3

/*
import axios from 'axios';
const BROADCAST_URL = `https://task.aniqu.biz.id/api/bot/broadcast/whatsapp-pull?token=${taskToken}`;

// Atur interval pengecekan di sini (dalam hitungan MENIT)
const BROADCAST_INTERVAL_MINUTES = 3;

let sentBroadcasts = new Map();
// ==========================================

// Fungsi pengiriman khusus Broadcast (dengan Hidetag penuh)
async function sendBroadcastHidetag(jid, text) {
    try {
        const botConn = global.conn || (typeof conn !== 'undefined' ? conn : null);
        
        if (!botConn) {
            console.error('[ANIQU BROADCAST] Tidak ada koneksi WhatsApp aktif!');
            return;
        }

        const groupMetadata = await botConn.groupMetadata(jid);
        const participants = groupMetadata.participants.map(p => p.id);

        await botConn.sendMessage(jid, { 
            text: text,
            mentions: participants 
        });
        console.log(`[ANIQU BROADCAST] Berhasil mengirim pesan massal ke grup: ${jid}`);
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function checkAndSendBroadcast() {
    try {
        const response = await axios.get(BROADCAST_URL);
        const resData = response.data;

        if (!resData || !resData.status || !Array.isArray(resData.data) || resData.data.length === 0) {
            return; 
        }

        const targetGroups = resData.targetGroups || [];
        const messages = resData.data;
        for (const msgText of messages) {
            
            const now = Date.now();
            if (sentBroadcasts.has(msgText)) {
                const lastSentTime = sentBroadcasts.get(msgText);
                const diffMinutes = (now - lastSentTime) / (1000 * 60);
                
                if (diffMinutes < 10) {
                    continue; 
                }
            }

            console.log(`[ANIQU BROADCAST] Menemukan pesan baru! Proses pengiriman ke ${targetGroups.length} grup...`);
            
            const finalMsg = `*=== INFORMASI KELAS ===*\n\n${msgText}`; // Tambahan header biar rapi
            
            for (const jid of targetGroups) {
                await sendBroadcastHidetag(jid, finalMsg);
            }

            sentBroadcasts.set(msgText, now);
        }

        // ==========================================
        // Memory Cleanup (Pembersihan Histori)
        // Agar RAM server tidak penuh, histori yang 
        // lebih dari 30 menit akan dihapus otomatis.
        // ==========================================
        for (const [key, timestamp] of sentBroadcasts.entries()) {
            if ((Date.now() - timestamp) / (1000 * 60) > 30) {
                sentBroadcasts.delete(key);
            }
        }

    } catch (e) {
        console.log(e);
        throw e;
    }
}

try {
    setInterval(() => {
        try {
            checkAndSendBroadcast();
        } catch (e) {
            console.log(e);
            throw e;
        }
    }, BROADCAST_INTERVAL_MINUTES * 60 * 1000);

    // Opsional: Jalankan satu kali di awal saat bot baru menyala
    setTimeout(() => {
        try {
            checkAndSendBroadcast();
        } catch (e) {
            console.log(e);
            throw e;
        }
    }, 5000);

    console.log(`[ANIQU BROADCAST] Sistem pull broadcast aktif (Cek per ${BROADCAST_INTERVAL_MINUTES} menit)!`);
} catch (e) {
    console.log(e);
    throw e;
}

*/

export default {};
