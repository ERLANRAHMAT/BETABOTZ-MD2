let fetch = require('node-fetch')

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `*Contoh:* ${usedPrefix}${command} https://www.instagram.com/p/ByxKbUSnubS/?utm_source=ig_web_copy_link`

    if (!args[0].match(/instagram/gi)) {
        throw `URL Instagram Tidak Valid!`
    }
    await m.reply(wait)
    let res, api, limitnya = 3, isV2 = false;
    try {
        api = await fetch(`https://api.betabotz.eu.org/api/download/igdowloader?url=${args[0]}&apikey=${lann}`)
        try {
            res = await api.json()
        } catch (err) {
            // jika gagal parse JSON, fallback ke v2
            api = await fetch(`https://api.betabotz.eu.org/api/download/igdowloader-v2?url=${args[0]}&apikey=${lann}`)
            try {
                res = await api.json()
                isV2 = true;
            } catch (err2) {
                throw 'Gagal mengambil media Instagram! (response bukan JSON)';
            }
        }
        if (!isV2) {
            if (!res.message || !Array.isArray(res.message) || res.message.length === 0 || !res.message[0]._url) {
                throw 'Gagal mengambil media Instagram!';
            }
            for (let i = 0; i < Math.min(limitnya, res.message.length); i++) {
                await sleep(3000)
                conn.sendFile(m.chat, res.message[i]._url, null, `*Instagram Downloader*`, m)
            }
        } else {
            if (!res.result || !res.result.data || !res.result.data.xdt_shortcode_media) {
                throw 'Gagal mengambil media Instagram! (v2)';
            }
            const media = res.result.data.xdt_shortcode_media;
            let caption = '';
            if (media.edge_media_to_caption && media.edge_media_to_caption.edges && media.edge_media_to_caption.edges.length > 0) {
                caption = media.edge_media_to_caption.edges[0].node.text;
            }
            if (typeof media.has_audio !== 'undefined' && media.has_audio === true && media.video_url) {
                await conn.sendMessage(m.chat, { video: { url: media.video_url }, caption: caption ? `*Instagram Downloader*\n${caption}` : '*Instagram Downloader*' }, { quoted: m });
            } else {
                let img = media.display_url || media.thumbnail_src || (media.display_resources && media.display_resources[0] && media.display_resources[0].src);
                await conn.sendMessage(m.chat, { image: { url: img }, caption: caption ? `*Instagram Downloader*\n${caption}` : '*Instagram Downloader*' }, { quoted: m });
            }
        }
    } catch (e) {
        throw e
    }
}

handler.help = ['instagram'].map(v => v + ' <url>')
handler.tags = ['downloader']
handler.command = /^(ig|instagram|igdl|instagramdl|igstory)$/i
handler.limit = true

module.exports = handler

function sleep(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
}