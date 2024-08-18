let fetch = require('node-fetch')

let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) throw `Masukan URL!\n\ncontoh:\n${usedPrefix + command} https://samehadaku.email/anime/spy-x-family-code-white/`;    
        const res = await fetch(`https://api.betabotz.eu.org/api/webzone/samehadaku-detail?query=${text}&apikey=${lann}`);
        const json = await res.json();
        const anime = json.result.detail;
        let caption = `⦿  *SAMEHADAKU DETAIL*\n\n`
        caption += `◦ title: ${json.result.title}\n`
        caption += `◦ published: ${json.result.published}\n`
        caption += `◦ trailer: ${json.result.trailer}\n`
        caption += `◦ rating: ${json.result.rating}\n`
        caption += `◦ description: ${json.result.description}\n`
        caption += `◦ genre: ${json.result.genre}\n`
        for (let item of anime) {
            caption += `
        ◦ nama: ${item.name}
        ◦ data: ${item.data}
            `;
        }
        // caption += `	◦ : ${json.result.detail}\n`
        caption += `◦batch : ${json.result.batch}\n`
        caption += `◦title : ${json.result.episode[0].title}\n`
        caption += `◦date : ${json.result.episode[0].date}\n`
        caption += `◦link : ${json.result.episode[0].link}\n`
        conn.relayMessage(m.chat, {
            extendedTextMessage: {
                text: caption,
                contextInfo: {
                    externalAdReply: {
                        title: wm,
                        mediaType: 1,
                        previewType: 0,
                        renderLargerThumbnail: true,
                        thumbnailUrl: json.result.thumbnail,
                        sourceUrl: ''
                    }
                }, mentions: [m.sender]
            }
        }, {})
    } 
handler.help = ['samehadadetail']
handler.tags = ['internet']
handler.command = /^(samehadadetail)$/i
handler.limit = true
handler.group = true

module.exports = handler
