let fetch = require('node-fetch')

let handler = async (m, { text, usedPrefix, command }) => {
    try {
    if (!text) throw `Masukan Judul Anime!\n\ncontoh:\n${usedPrefix + command} spy x family`;    
        const res = await fetch(`https://api.betabotz.eu.org/api/webzone/samehadaku-search?query=${text}&apikey=${lann}`);
        const json = await res.json();
        const search = json.result;
        let caption = `⦿  *SAMEHADAKU SEARCH*\n\n`
        for (let item of search) { 
            caption += `
⦿ ${item.title} ⦿ 
◦ id: ${item.id}
◦ title: ${item.title}
◦ description: ${item.description}
◦ genre: ${item.genre}
◦ type: ${item.type}
◦ star: ${item.star}
◦ views: ${item.views}
◦ link: ${item.link}
`
        }

        // caption += `◦ published: ${json.result.published}\n`
        // caption += `◦ trailer: ${json.result.trailer}\n`
        // caption += `◦ rating: ${json.result.rating}\n`
        // caption += `◦ description: ${json.result.description}\n`
        // caption += `◦ genre: ${json.result.genre}\n`
      
        conn.relayMessage(m.chat, {
            extendedTextMessage: {
                text: caption,
                contextInfo: {
                    externalAdReply: {
                        title: wm,
                        mediaType: 1,
                        previewType: 0,
                        renderLargerThumbnail: true,
                        thumbnailUrl: json.result[0].thumbnail,
                        sourceUrl: ''
                    }
                }, mentions: [m.sender]
            }
        }, {})
    }catch (e) {
        m.reply('Masukan nama anime dengan benar!')
    }
    } 
handler.help = ['samehadasearch']
handler.tags = ['internet']
handler.command = /^(samehadasearch)$/i
handler.limit = true
handler.group = true

module.exports = handler
