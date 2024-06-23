let fetch = require('node-fetch')
let handler = async (m, { conn, text, usedPrefix, command }) => {
// if (!text) throw `Masukkan Nama!\n\ncontoh: ${usedPrefix + command} "dana"`;
if (!text) throw `Masukkan Mimpi kamu!\n\ncontoh: ${usedPrefix + command} mandi `;
try {
  await m.reply(wait)
  let res = await fetch(`https://api.betabotz.eu.org/api/primbon/artimimpi?mimpi=${text}&apikey=${lann}`);
  let json = await res.json()
  let anu = [
       `―-ARTI MIMPI-―\n\nMimpi: ${json.result.message.mimpi}\n\nArti: ${json.result.message.arti}\n\nSolusi: ${json.result.message.solusi}`, 
    ]
conn.reply(m.chat,`${(anu)}`);;
} catch (e) {
throw `Internal server eror!\n\nulangi lagi perintah`
  }
}
  
    handler.help = ['artimimpi']
    handler.tags = ['fun']
    handler.command = /^(artimimpi)$/i
    handler.group = true
    
    module.exports = handler
    

  //   {
  //     "status": true,
  //     "code": 200,
  //     "creator": "BetaBotz",
  //     "result": {
  //         "status": true,
  //         "message": {
  //             "mimpi": "mandi",
  //             "arti": "Mimpi mandi air dingin = Akan dapat mengalahkan musuh-musuhnya.Mimpi mandi air jernih sekali = Alamat suatu kebahagiaan.Mimpi mandi air panas = Alamat kena penyakit (sakit).Mimpi mandi air yang keruh = Akan sakit atau rugi.Mimpi mandi di sungai = Akan mendapat keberkatan.Mimpi mandi di tempat terbuka = Alamat bisa tabah.Mimpi mandi di tepi laut = Akan menemui suatu keasyikan bercinta.Mimpi sedang mandi = Pertanda akan terlepas dari malapetaka atau kesialan.Mimpi mandi di sungai = Pertanda akan selalu terjaga kesehatannya.",
  //             "solusi": "Menanggulangi akibat dari tafsir mimpi yang buruk\n      Jika anda bermimpi sesuatu yang dapat berakibat buruk bagi anda dan keluarga \n      (seperti mimpi gigi copot dll) anda di harapkan melakukan hal-hal sebagai \n      berikut untuk menanggulanginya:\n      Ambillah sapu lidi (bisa juga tusuk gigi, bambu kecil dll). Lalu potong \n      atau patahkan dengan tangan anda menjadi 7 (tujuh) batang, kecil-kecil, \n      kira-kira 3 sentimeter. Sediakan selembar kertas atau tissue. Siapkan \n      garam dapur, sedikit saja. Taruhlah potongan ke tujuh sapu lidi dan garam \n      dapur tadi ke dalam tissue atau kertas. Lipat kertas tersebut dan kuburkan \n      ke dalam tanah (pekarangan, halaman rumah anda). Kalimat yang anda harus \n      ucapkan ketika akan mengubur/membenam kertas (yang berisi 7 potong sapu \n      lidi dan garam) tersebut adalah kalimat yang meminta kepada Yang Maha \n      Kuasa agar di jauhi dari akibat buruk mimpi anda.\n      Contoh kalimat:\"Ya Tuhan.. Jauhkanlah saya dan keluarga saya dari \n      malapetaka. Tidak akan tumbuh/jadi, garam yang saya kubur ini. Seperti \n      halnya mimpi saya yang dapat berakibat buruk bagi kami tidak akan menjadi \n      kenyataan atau tidak akan terjadi. Amien..\"\n\n\n< Kembali"
  //         }
  //     }
  // }



//danaputra133