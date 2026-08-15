// @ts-nocheck
// Converted from plugins-esm - automated
import PhoneNumber from 'awesome-phonenumber';
import { createHash } from 'crypto';
let handler: WaPlugin = async (m, { conn, text }) => {
  function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
  }

  const fitnahMessages = [
    "ati ati bro @user suka coli",
    "eh, tau nggak? @user sering ngutang nggak bayar",
    "waduh, @user katanya ketahuan ngintip kamar mandi tetangga",
    "bro, hati-hati sama @user, dia suka makan nggak bayar",
    "@user, katanya kamu jago joget TikTok ya?",
    "anjay, @user hobinya tidur di kelas",
    "muka nya @user kek kontol",
    "tau nggak? @user kemarin ketahuan curhat ke kucing.",
    "@user, katanya kemarin dipanggil guru karena tidur di meja",
    "eh, jangan-jangan @user sering nyolong Wifi tetangga?",
    "gila, @user ternyata koleksi meme-nya ribuan",
    "@user pernah makan bakso bayar pakai daun",
    "waduh, katanya @user ketahuan nge-stalk mantan semalaman",
    "@user, kemarin disuruh nyanyi malah nyanyi lagu iklan",
    "anjir, @user hobi banget rebutan colokan di kelas",
    "tau nggak? @user kalau di kantin suka ngambil gorengan dulu baru bayar 3 hari kemudian",
    "gokil, @user ternyata punya akun fake buat stalking gebetan",
    "bro, katanya @user pernah ketahuan nangis gara-gara kalah main game",
    "parah, @user kemarin ngaku-ngaku jadi selebgram padahal followers cuma 10",
    "woy @user, jangan suka mandi cuma pas ulang tahun aja dong",
    "eh, katanya @user suka tidur sambil ngorok keras banget sampai tetangga kebangun",
    "tau nggak? @user ternyata sering bikin status galau tiap malem",
    "waduh, @user kalau ditagih utang suka pura-pura lupa",
    "gila, @user hobinya ngakak sendiri pas baca chat",
    "@user, kemarin ngaku-ngaku punya mobil, pas dicek cuma mainan remote control",
    "bro, hati-hati sama @user, dia suka minjem barang terus lupa balikin",
    "@user suka banget ngedraft chat panjang, tapi nggak pernah dikirim",
    "anjay, @user ternyata suka karaoke lagu anak-anak di kamar mandi",
    "waduh, katanya @user pernah nulis surat cinta terus malu sendiri",
    "tau nggak? @user kemarin ke warung malah lupa bawa duit",
    "@user sering banget upload story makanan padahal itu makanan orang lain"
  ]

  if (!m.isGroup) return conn.reply(m.chat, 'Fitur ini hanya bisa digunakan di dalam grup!', m)

  const participants = (await conn.groupMetadata(m.chat)).participants

  let randomUser = null;

  if (!text) {
    randomUser = getRandomElement(participants).id
  } else {
    const mentionedUser = text.match(/@([0-9]{7,16})/);  // Regex untuk menangkap mention ID
    if (mentionedUser) {
      const mentionedUserId = mentionedUser[1]
      randomUser = participants.find(user => user.id.includes(mentionedUserId))?.id
    }
  }

  if (!randomUser) return conn.reply(m.chat, 'Pengguna yang disebutkan tidak ditemukan!', m)

  const selectedMessage = getRandomElement(fitnahMessages).replace(/@user/g, `@${randomUser.split('@')[0]}`)

  conn.reply(m.chat, selectedMessage, m, { mentions: [randomUser] })
}

handler.help = ['fitnah']
handler.tags = ['fun']
handler.command = /^fitnah$/i
handler.group = true

export default handler;
