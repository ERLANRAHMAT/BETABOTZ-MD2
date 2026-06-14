// ANIQU REMINDER WORKER, Aktifkan ini jika kammu ingin fitur reminder terintegrasi dengan bot whatsapp
// jangan lupa token kelas kamu di .env atau config.js

// Tutorial https://www.youtube.com/playlist?list=PLGv_-znSuMIwhZPH2y06HWisHZbn7dXL3

/*
const axios = require('axios');
const { setInterval } = require('timers');

// Pengaturan Jam Pengingat (Gunakan format 24 jam)
const TIME_H_MINUS = { hour: 19, minute: 0 };  // Waktu untuk reminder H-3 & H-1
const TIME_H_DAY   = { hour: 6, minute: 30 };  // Waktu untuk reminder Hari H (H-0)
// ==========================================

let lastReminded = {};
let cachedTugasList = [];
let cachedTargetGroups = []; 

function formatDate(dateStr) {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes} WIB`;
}

function getHMinus(deadline) {
    const today = new Date();
    const dline = new Date(deadline);
    today.setHours(0,0,0,0);
    dline.setHours(0,0,0,0);
    const diff = Math.floor((dline - today) / (1000 * 60 * 60 * 24));
    return diff;
}

function getUniqueJenis(tugasList) {
    const jenisSet = new Set();
    tugasList.forEach(t => {
        if (t.jenis && Array.isArray(t.jenis)) {
            t.jenis.forEach(j => jenisSet.add(j.toUpperCase()));
        }
    });
    return Array.from(jenisSet);
}

function groupByType(tugasList, type) {
    return tugasList.filter(t => t.jenis && t.jenis.some(j => j.toLowerCase() === type.toLowerCase()));
}

function buildMsg(list, typeLabel) {
    if (!list.length) return '';
    const grouped = list.reduce((acc, t) => {
        const mk = (t.subject || 'Tanpa Nama').trim();
        if (!acc[mk]) acc[mk] = [];
        acc[mk].push(t);
        return acc;
    }, {});

    let result = `${typeLabel}\n\n`;
    for (const [mk, tugasMk] of Object.entries(grouped)) {
        result += `*${mk}*\n`;
        tugasMk.forEach(t => {
            const namaTugas = t.taskName ? `${t.taskName} - ${t.title}` : 'gak ada tugas nya woy';
            const deadline = formatDate(t.deadline);
            result += `• ${namaTugas}\n  Deadline: ${deadline}\n`;
        });
        result += '\n';
    }
    return result + '\n';
}

function buildDynamicReminderMsg(tugasList, titleHeader) {
    if (!tugasList.length) return '';
    
    let msg = `${titleHeader}\n\n`;
    const uniqueTypes = getUniqueJenis(tugasList);
    
    uniqueTypes.forEach(type => {
        const filteredTugas = groupByType(tugasList, type);
        if (filteredTugas.length) {
            const typeLabel = `=== INFO ${type} ===`; 
            msg += buildMsg(filteredTugas, typeLabel);
        }
    });
    
    return msg;
}

async function getTugasMahasiswa() {
    try {
        const url = `https://task.aniqu.biz.id/api/bot/tasks?token=${taskToken}`;
        console.log('[ANIQU] Mengambil data tugas dari API...');
        const response = await axios.get(url);
        return response.data;
    } catch (e) {
        console.error('[ANIQU] Gagal mengambil data tugas:', e.message || e);
        return null;
    }
}

async function sendReminderToGroup(jid, text, useHidetag = false) {
    const botConn = global.conn || (typeof conn !== 'undefined' ? conn : null);
    
    if (!botConn) {
        console.error('[ANIQU] No WhatsApp connection object found!');
        return;
    }

    try {
        let options = { text: text };
        
        if (useHidetag) {
            const groupMetadata = await botConn.groupMetadata(jid);
            options.mentions = groupMetadata.participants.map(p => p.id);
        }

        await botConn.sendMessage(jid, options);
        console.log(`[ANIQU] Berhasil mengirim pesan ke ${jid} (Hidetag: ${useHidetag})`);
    } catch (error) {
        console.error(`[ANIQU] Gagal mengirim pesan ke ${jid}:`, error);
    }
}

async function updateTugasCache() {
    const res = await getTugasMahasiswa();
    
    if (!res || !Array.isArray(res.data) || !res.data.length) {
        console.log('[ANIQU] Gagal memperbarui cache: Data kosong atau format salah.');
        return;
    }
    
    cachedTugasList = res.data;
    cachedTargetGroups = res.classInfo?.targetGroups || [];
    
    console.log(`[ANIQU] Cache diperbarui. Jumlah tugas: ${cachedTugasList.length}, Jumlah target grup: ${cachedTargetGroups.length}`);
}

async function checkCustomSchedule() {
    if (!cachedTugasList.length) return;
    
    const now = new Date();
    
    const customTasks = cachedTugasList.filter(t => {
        if (!t.isCustomSchedule || !t.customScheduleDate) return false;
        
        const customDate = new Date(t.customScheduleDate);
        return now.getFullYear() === customDate.getFullYear() &&
               now.getMonth() === customDate.getMonth() &&
               now.getDate() === customDate.getDate() &&
               now.getHours() === customDate.getHours() &&
               now.getMinutes() === customDate.getMinutes();
    });

    if (customTasks.length === 0) return;
    let tasksToSend = [];
    customTasks.forEach(t => {
        const uniqueKey = `CUSTOM-${t.id || t.taskName}-${t.customScheduleDate}`;
        if (!lastReminded[uniqueKey]) {
            tasksToSend.push(t);
            lastReminded[uniqueKey] = true;
        }
    });

    if (tasksToSend.length > 0) {
        let msgToSent = buildDynamicReminderMsg(tasksToSend, '=== ⏰ CUSTOM REMINDER TUGAS ⏰ ===');
        if (msgToSent.trim() && cachedTargetGroups.length > 0) {
            for (const jid of cachedTargetGroups) {
                await sendReminderToGroup(jid, msgToSent.trim(), true); 
            }
            console.log(`[ANIQU] Custom reminder selesai dikirim.`);
        }
    }
}

async function processReminder(type) {
    if (!cachedTugasList.length) return;

    const todayStr = new Date().toISOString().slice(0,10);
    const reminderKey = `${todayStr}-${type}`; 
    
    if (lastReminded[reminderKey]) {
        return; 
    }

    let msgToSent = '';
    let isHidetag = false;

    if (type === 'H_MINUS') {
        const h3Tugas = cachedTugasList.filter(t => getHMinus(t.deadline) === 3 && t.reminderH3 === true);
        const h1Tugas = cachedTugasList.filter(t => getHMinus(t.deadline) === 1 && t.reminderH1 === true);

        if (h3Tugas.length) msgToSent += buildDynamicReminderMsg(h3Tugas, '=== TUGAS DEADLINE H-3 ===');
        if (h1Tugas.length) msgToSent += buildDynamicReminderMsg(h1Tugas, '=== TUGAS DEADLINE H-1 ===');
        
    } else if (type === 'H_DAY') {
        const hTugas = cachedTugasList.filter(t => getHMinus(t.deadline) === 0 && t.reminderH === true);
        
        if (hTugas.length) {
            msgToSent += buildDynamicReminderMsg(hTugas, '=== ⚠️ TUGAS DEADLINE HARI INI ⚠️ ===');
            isHidetag = true; 
        }
    }

    if (msgToSent.trim() && cachedTargetGroups.length > 0) {
        for (const jid of cachedTargetGroups) {
            await sendReminderToGroup(jid, msgToSent.trim(), isHidetag);
        }
        lastReminded[reminderKey] = true;
        console.log(`[ANIQU] Semua tugas tipe ${type} selesai dikirim untuk tanggal: ${todayStr}`);
    }
}

setInterval(async () => {
    const now = new Date();
    await updateTugasCache(); 
    await checkCustomSchedule();
    
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    if (currentHour === TIME_H_MINUS.hour && currentMinute === TIME_H_MINUS.minute) {
        console.log(`[ANIQU] Waktunya mengecek tugas H-3 & H-1...`);
        await processReminder('H_MINUS');
    }
    else if (currentHour === TIME_H_DAY.hour && currentMinute === TIME_H_DAY.minute) {
        console.log(`[ANIQU] Waktunya mengecek tugas Hari H...`);
        await processReminder('H_DAY');
    } else {
        console.log(`[ANIQU] Interval aktif, sekarang jam ${currentHour}:${currentMinute.toString().padStart(2, '0')}`);
    }
}, 60 * 1000); // Cek setiap 1 menit

*/