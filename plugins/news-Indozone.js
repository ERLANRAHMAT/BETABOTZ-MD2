let fetch = require('node-fetch')
let handler = async (m, { conn }) => {
try {
  let res = await fetch(`https://api.betabotz.eu.org/api/news/Indozone?&apikey=${lann}`);
  let json = await res.json()
  // array berisi result berita
  global.anu = [
       `―INDOZONE―\n\nBerita: ${json.result[0].berita}\n\nBeritaUrl: ${json.result[0].berita_url}\n\nBerita di upload: ${json.result[0].berita_diupload}\n\nJenis Berita: ${json.result[0].berita_jenis} `, 
       `―INDOZONE―\n\nBerita: ${json.result[1].berita}\n\nBeritaUrl: ${json.result[1].berita_url}\n\nBerita di upload: ${json.result[0].berita_diupload}\n\nJenis Berita: ${json.result[1].berita_jenis} `, 
       `―INDOZONE―\n\nBerita: ${json.result[2].berita}\n\nBeritaUrl: ${json.result[2].berita_url}\n\nBerita di upload: ${json.result[0].berita_diupload}\n\nJenis Berita: ${json.result[2].berita_jenis} `, 
       `―INDOZONE―\n\nBerita: ${json.result[3].berita}\n\nBeritaUrl: ${json.result[3].berita_url}\n\nBerita di upload: ${json.result[0].berita_diupload}\n\nJenis Berita: ${json.result[3].berita_jenis} `, 
       `―INDOZONE―\n\nBerita: ${json.result[4].berita}\n\nBeritaUrl: ${json.result[4].berita_url}\n\nBerita di upload: ${json.result[0].berita_diupload}\n\nJenis Berita: ${json.result[4].berita_jenis} `, 
       `―INDOZONE―\n\nBerita: ${json.result[5].berita}\n\nBeritaUrl: ${json.result[5].berita_url}\n\nBerita di upload: ${json.result[0].berita_diupload}\n\nJenis Berita: ${json.result[5].berita_jenis} `, 
       `―INDOZONE―\n\nBerita: ${json.result[6].berita}\n\nBeritaUrl: ${json.result[6].berita_url}\n\nBerita di upload: ${json.result[0].berita_diupload}\n\nJenis Berita: ${json.result[6].berita_jenis} `, 
       `―INDOZONE―\n\nBerita: ${json.result[7].berita}\n\nBeritaUrl: ${json.result[7].berita_url}\n\nBerita di upload: ${json.result[0].berita_diupload}\n\nJenis Berita: ${json.result[7].berita_jenis} `, 
       `―INDOZONE―\n\nBerita: ${json.result[8].berita}\n\nBeritaUrl: ${json.result[8].berita_url}\n\nBerita di upload: ${json.result[0].berita_diupload}\n\nJenis Berita: ${json.result[8].berita_jenis} `, 
    
    ]
//   conn.reply(m.chat, `―CNBC―\n\n"${json.result[0].berita}"`,)
// variabel dapat di ganti jika diperlukan
conn.reply(m.chat,`${pickRandom(global.anu)}`);;
} catch (e) {
throw `Internal server eror!`
  }
}
  
    handler.help = ['Indozone']
    handler.tags = ['news']
    handler.command = /^(Indozone)$/i
    handler.group = true
    
    module.exports = handler

    function pickRandom(list) {
      return list[Math.floor(list.length * Math.random())]
    }
    



    // let anu = `―CNNC―\n\nBerita: ${json.result[0].berita}\n\nBeritaUrl: ${json.result[0].berita_url}`  