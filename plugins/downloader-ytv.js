// import axios from 'axios'
// import cheerio from 'cheerio'
// // import ytdl from 'ytdl-core'

let ytdl = require('ytdl-core')

let handler = async (m, { conn, text, usedPrefix, command }) => {
let v = text
if (!text) throw 'Linknya Mana.??'
m.reply(wait)

ytmp4(v).then((result) => {
const video = result.url
const title = result.title
const duration = result.duration
const cenel = result.channel
const publish = result.published
const view = result.views
				
conn.sendFile(m.chat, video, title + '.mp4', `
*Downloader YouTube Mp4*
    
*Title* : ${title}
*Channel* : ${cenel}
*publish* : ${publish}
*views* : ${view}
*Resolusi* : 360p
*Url* : ${text}`, m)
})
}
handler.help = ['ytmp4 <link yt>']
handler.tags = ['downloader'] 
handler.command = /^(ytmp4|youtubemp4|ytv)$/i
handler.limit = 2
handler

module.exports = handler

async function ytmp4(url) {
  return new Promise((resolve, reject) => {
    try {
      const id = ytdl.getVideoID(url)
      const yutub = ytdl.getInfo(`https://www.youtube.com/watch?v=${id}`)
      .then((data) => {
        let pormat = data.formats
        let video = []
        for (let i = 0; i < pormat.length; i++) {
          if (pormat[i].container == 'mp4' && pormat[i].hasVideo == true && pormat[i].hasAudio == true) {
            let vid = pormat[i]
            video.push(vid.url)
          }
        }
        const title = data.player_response.microformat.playerMicroformatRenderer.title.simpleText
        const thumb = data.player_response.microformat.playerMicroformatRenderer.thumbnail.thumbnails[0].url
        const channel = data.player_response.microformat.playerMicroformatRenderer.ownerChannelName
        const views = data.player_response.microformat.playerMicroformatRenderer.viewCount
        const published = data.player_response.microformat.playerMicroformatRenderer.publishDate
        const duration = data.player_response.lengthSeconds
        
        const result = {
          title: title,
          duration: duration,
          thumb: thumb,
          channel: channel,
          published: published,
          views: views,
          url: video[0]
        }
        return(result)
      })
      resolve(yutub)
    } catch (error) {
        reject(error);
      }
      console.log(error)
  })
}


