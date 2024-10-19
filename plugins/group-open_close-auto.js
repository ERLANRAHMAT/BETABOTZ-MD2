/*
*<>AUTOCLOSEGC<>*
SOURCE: https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
DON'T DELETE THIS WM!
HAPUS WM MANDUL 7 TURUNAN 
*BEBAS RECODE,ASAL INI WM JANGAN DIHAPUS ASU*
"aku janji tidak akan hapus wm ini"
RABU, 15 OKTOBER 2024 07:11
*/
let moment = require('moment-timezone')
let schedule = require ('node-schedule')

const timeZone = 'Asia/Jakarta';

// Konfigurasi waktu tutup dan buka grup
const closeTime = '23:00'; // tutup grub
const openTime = '04:00'; // buka grub

// Daftar ID grup yang ingin dikelola
const groupChats = [
    // Ganti dengan ID grup yang sesuai
    '120363297431278728@g.us'  //  ID grup di sini bisa di ambil dari exac => m di grub kamu
];

// Variabel status grup dan nama asli grup
let groupStatus = {};
let originalGroupNames = {};
let reminderSent = {};

// Fungsi untuk memeriksa waktu dan mengubah status serta nama grup
const checkGroupsStatus = async (conn) => {
    const currentTime = moment().tz(timeZone).format('HH:mm');

    for (const chatId of groupChats) {
        const groupMetadata = await conn.groupMetadata(chatId);
        const currentGroupName = groupMetadata.subject;

        // Simpan nama asli grup jika belum tersimpan
        if (!originalGroupNames[chatId]) {
            originalGroupNames[chatId] = currentGroupName;
        }

        // Hitung waktu 5 menit sebelum tutup dan buka
        const closeReminderTime = moment(closeTime, 'HH:mm').subtract(5, 'minutes').format('HH:mm');
        const openReminderTime = moment(openTime, 'HH:mm').subtract(5, 'minutes').format('HH:mm');

        // Pengingat 5 menit sebelum tutup
        if (currentTime === closeReminderTime && !reminderSent[`${chatId}-close`]) {
            await conn.sendMessage(chatId, { text: `𝗣𝗘𝗥𝗜𝗡𝗚𝗔𝗧𝗔𝗡!!
<-> ɢʀᴏᴜᴘ ᴀᴋᴀɴ ᴛᴇʀᴛᴜᴛᴜᴘ 5 ᴍᴇɴɪᴛ ʟᴀɢɪ <->` });
            reminderSent[`${chatId}-close`] = true; // Setel pengingat terkirim
        }

        // Pengingat 5 menit sebelum buka
        if (currentTime === openReminderTime && !reminderSent[`${chatId}-open`]) {
            await conn.sendMessage(chatId, { text: `𝗣𝗘𝗥𝗜𝗡𝗚𝗔𝗧𝗔𝗡!!
<-> ɢʀᴏᴜᴘ ᴀᴋᴀɴ ᴛᴇʀʙᴜᴋᴀ 5 ᴍᴇɴɪᴛ ʟᴀɢɪ <->` });
            reminderSent[`${chatId}-open`] = true; // Setel pengingat terkirim
        }

        // Tutup grup jika waktunya tepat dan grup belum ditutup
        if (currentTime === closeTime && groupStatus[chatId] !== 'closed') {
            await conn.groupSettingUpdate(chatId, 'announcement');
            await conn.groupUpdateSubject(chatId, `${originalGroupNames[chatId]} (𝗖𝗟𝗢𝗦𝗘)`);
            await conn.sendMessage(chatId, { text: `( OTOMATIS ) 𝖦𝖱𝖮𝖴𝖯 𝖢𝖫𝖮𝖲𝖤, 𝖣𝖠𝖭 𝖠𝖪𝖠𝖭 𝖣𝖨𝖡𝖴𝖪𝖠 𝖩𝖠𝖬 ${closeTime} 𝖶𝖨𝖡` });
            groupStatus[chatId] = 'closed';
            reminderSent[`${chatId}-close`] = false; // Reset pengingat
        }

        // Buka grup jika waktunya tepat dan grup belum dibuka
        if (currentTime === openTime && groupStatus[chatId] !== 'opened') {
            await conn.groupSettingUpdate(chatId, 'not_announcement');
            await conn.groupUpdateSubject(chatId, originalGroupNames[chatId]); // Kembalikan nama asli grup
            await conn.sendMessage(chatId, { text: `( OTOMATIS ) 𝖦𝖱𝖮𝖴𝖯 𝖮𝖯𝖤𝖭, 𝖣𝖠𝖭 𝖠𝖪𝖠𝖭 𝖣𝖨𝖳𝖴𝖳𝖴𝖯 𝖩𝖠𝖬 ${openTime} 𝖶𝖨𝖡` });
            groupStatus[chatId] = 'opened';
            reminderSent[`${chatId}-open`] = false; // Reset pengingat
        }
    }
};

// Jadwalkan pemeriksaan status grup setiap menit
schedule.scheduleJob('* * * * *', () => {
    checkGroupsStatus(conn);
});
/*
*<>AUTOCLOSEGC<>*
SOURCE: https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
DON'T DELETE THIS WM!
HAPUS WM MANDUL 7 TURUNAN 
*BEBAS RECODE,ASAL INI WM JANGAN DIHAPUS*
"aku janji tidak akan hapus wm ini"
RABU, 15 OKTOBER 2024 07:11
*/
/*
*SUMBER: https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
*GRUP DISKUSI: https://chat.whatsapp.com/ETZ8r7CLypfAPH93q0gC0y
ini tanda air kang, jangan dihapus
*/