// let badwordRegex = /anj|asw|kont|ToIol|gblk|T0lol|Bgsd|ajn|anjingk|bajingan|bangsat|kontol|memek|pepekq|meki|titit|peler|tetek|toket|ngewe|goblok|tolol|idiot|ngentotd|jembut|bego|dajjal|jancuk|pantek|pukimak|kimak|kampang|lonte|colimek|pelacur|henceut|nigga|fuck|dick|bitch|tits|bastard|asshole/i; // tambahin sendiri

// async function before(m, { isBotAdmin }) {
//     if (m.isBaileys && m.fromMe) return;
//     let chat = global.db.data.chats[m.chat];
//     let user = global.db.data.users[m.sender];
//     let isBadword = badwordRegex.exec(m.text);
    
//     if (chat.antiToxic && isBadword && m.isGroup) {
//         user.warning += 1;
//         m.reply(`${user.warning >= 5 ? '*⚠️ Peringatan Kamu Sudah Mencapai 5 Maka Kamu Akan Di KICK! ⚠️*' : '*⚠️ Kata Kata Toxic Terdeteksi ⚠️ *'}

// PERINGATAN!: ${user.warning} / 5

// [❗] jika peringatan sampai 5 kali makan otomatis akan di KICK!`);
        
//         if (user.warning >= 5) {
//             user.warning = 0;
//             this.groupParticipantsUpdate(m.chat, [m.sender], 'remove')

            
//         }
//     }
//     return true;
// }

// module.exports = { before };

// //kalau mau fitur kick jalan eang agak ribet ahrus restart bot gakt ahu kenapa
// //pilih salah satu! antara kick/ non kick