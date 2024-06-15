let fetch = require('node-fetch')
let handler = async (m, { conn }) => {
try {
  let res = await fetch(`https://api.betabotz.eu.org/api/news/detik?&apikey=${lann}`);
  let json = await res.json()
  // array berisi result berita
  global.anu = [
       `―DETIK―\n\nBerita: ${json.result[0].berita}\n\nBeritaUrl: ${json.result[0].berita_url}\n\nBerita di upload: ${json.result[0].berita_diupload} `, 
       `―DETIK―\n\nBerita: ${json.result[1].berita}\n\nBeritaUrl: ${json.result[1].berita_url}\n\nBerita di upload: ${json.result[1].berita_diupload} `, 
       `―DETIK―\n\nBerita: ${json.result[2].berita}\n\nBeritaUrl: ${json.result[2].berita_url}\n\nBerita di upload: ${json.result[2].berita_diupload} `, 
       `―DETIK―\n\nBerita: ${json.result[3].berita}\n\nBeritaUrl: ${json.result[3].berita_url}\n\nBerita di upload: ${json.result[3].berita_diupload} `, 
       `―DETIK―\n\nBerita: ${json.result[4].berita}\n\nBeritaUrl: ${json.result[4].berita_url}\n\nBerita di upload: ${json.result[4].berita_diupload} `, 
       `―DETIK―\n\nBerita: ${json.result[5].berita}\n\nBeritaUrl: ${json.result[5].berita_url}\n\nBerita di upload: ${json.result[5].berita_diupload} `, 
       `―DETIK―\n\nBerita: ${json.result[6].berita}\n\nBeritaUrl: ${json.result[6].berita_url}\n\nBerita di upload: ${json.result[6].berita_diupload} `, 
       `―DETIK―\n\nBerita: ${json.result[7].berita}\n\nBeritaUrl: ${json.result[7].berita_url}\n\nBerita di upload: ${json.result[7].berita_diupload} `, 
       `―DETIK―\n\nBerita: ${json.result[8].berita}\n\nBeritaUrl: ${json.result[8].berita_url}\n\nBerita di upload: ${json.result[8].berita_diupload} `, 
    
    ]
//   conn.reply(m.chat, `―CNBC―\n\n"${json.result[0].berita}"`,)
// variabel dapat di ganti jika diperlukan
conn.reply(m.chat,`${pickRandom(global.anu)}`);;
} catch (e) {
throw `Internal server eror!`
  }
}
  
    handler.help = ['detik']
    handler.tags = ['news']
    handler.command = /^(detik)$/i
    handler.group = true
    
    module.exports = handler

    function pickRandom(list) {
      return list[Math.floor(list.length * Math.random())]
    }
    



    // let anu = `―CNNC―\n\nBerita: ${json.result[0].berita}\n\nBeritaUrl: ${json.result[0].berita_url}`  