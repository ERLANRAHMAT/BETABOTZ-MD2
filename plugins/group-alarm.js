/*
*ALARM GROUP*
di buat oleh dana putra | Betabotz | aqua bot
wm ini boleh di hapus bebas kalian juga boleh belajar cara kerja code ny. Happy code!:)
jangan lupa follow github admin = danaputra133
*/

// let moment = import 'moment-timezone';
// let schedule = import 'node-schedule';

// const timeZone = 'Asia/Jakarta';


// const groupChats = [
//     'ID GC 1 @g.us',
//     'ID GC 2 @g.us',  //dapat id dari "=> m" di gc nya
// ];

// // Waktu alarm untuk setiap grup
// const alarmTimes = {
//     'ID GC 1 @g.us': ['22:10', '00:23', '00:40', '06:00'],
//     'ID GC 2 @g.us': ['22:11', '06:01', '00:40'],
// };


// const sendAlarmHidetag = async (conn, chatId, text) => {
//     const groupMetadata = await conn.groupMetadata(chatId);
//     const participants = groupMetadata.participants.map((p) => p.id);

// //ini buat hidetag
//     const fkontak = {
//         "key": {
//             "participants": "0@s.whatsapp.net",
//             "remoteJid": "status@broadcast",
//             "fromMe": false,
//             "id": "Halo"
//         },
//         "message": {
//             "contactMessage": {
//                 "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:Bot\nitem1.TEL;waid=0:0\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
//             }
//         },
//         "participant": "0@s.whatsapp.net"
//     };

//     await conn.sendMessage(
//         chatId,
//         { text, mentions: participants },
//         { quoted: fkontak } 
//     );
// };

// const checkAlarmStatus = async (conn) => {
//     const currentTime = moment().tz(timeZone).format('HH:mm');

//     for (const chatId of groupChats) {
//         if (alarmTimes[chatId]) {
//             for (const time of alarmTimes[chatId]) {
//                 if (currentTime === time) {
//                     const alarmMessage = `⏰ *ALARM GRUP!*\n\n🚨harap cek laporan!`; //ganti kata kata nya! :)
//                     await sendAlarmHidetag(conn, chatId, alarmMessage);
//                 }
//             }
//         }
//     }
// };


// schedule.scheduleJob('* * * * *', () => {
//     checkAlarmStatus(conn);
// });
