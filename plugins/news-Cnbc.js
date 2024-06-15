let fetch = require('node-fetch')
let handler = async (m, { conn }) => {
try {
  let res = await fetch(`https://api.betabotz.eu.org/api/news/cnbc?&apikey=${lann}`);
  let json = await res.json()
//   array 1-> array terakhir
  let anu = `―CNBC―\n\nBerita: ${json.result[0].berita}\n\nBeritaUrl: ${json.result[0].berita_url}\n\nBerita di upload: ${json.result[0].berita_diupload} `  
//   let anu1 = `―CNBC―\n\nBerita: ${json.result[1].berita}\n\nBeritaUrl: ${json.result[1].berita_url}\n\nBerita di upload: ${json.result[1].berita_diupload} `  

//   conn.reply(m.chat, `―CNBC―\n\n"${json.result[0].berita}"`,)
// variabel dapat di ganti jika diperlukan
conn.reply(m.chat, anu);;
} catch (e) {
throw `Internal server eror!`
  }
}
  
    handler.help = ['cnbc']
    handler.tags = ['news']
    handler.command = /^(cnbc)$/i
    handler.group = true
    
    module.exports = handler
    