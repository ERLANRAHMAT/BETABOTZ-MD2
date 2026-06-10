let fetch = require('node-fetch')

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `*Contoh:* ${usedPrefix}${command} https://www.instagram.com/p/ByxKbUSnubS/?utm_source=ig_web_copy_link`

    if (!args[0].match(/instagram/gi)) {
        throw `URL Instagram Tidak Valid!`
    }
    await m.reply(wait)
    let res, api, isV2 = false;
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
            if (!res.message || !Array.isArray(res.message) || res.message.length === 0) {
                throw 'Gagal mengambil media Instagram!';
            }
            const urls = [];
            const seen = new Set();
            for (const item of res.message) {
                if (!item || !item._url) continue;
                if (seen.has(item._url)) continue;
                seen.add(item._url);
                urls.push(item._url);
            }
            if (urls.length === 0) {
                throw 'Gagal mengambil media Instagram!';
            }
            for (const url of urls) {
                await sleep(3000);
                await conn.sendFile(m.chat, url, null, `*Instagram Downloader*`, m);
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
            const sendCaption = (index) => index === 0 ? (caption ? `*Instagram Downloader*\n${caption}` : '*Instagram Downloader*') : '';
            const items = [];
            if (media.edge_sidecar_to_children && media.edge_sidecar_to_children.edges && media.edge_sidecar_to_children.edges.length > 0) {
                const seen = new Set();
                for (const edge of media.edge_sidecar_to_children.edges) {
                    const node = edge.node;
                    if (!node) continue;
                    let url = null;
                    if (node.is_video && node.video_url) url = node.video_url;
                    else url = node.display_url || node.thumbnail_src || (node.display_resources && node.display_resources[0] && node.display_resources[0].src);
                    if (!url || seen.has(url)) continue;
                    seen.add(url);
                    items.push({ url, isVideo: !!node.is_video, node });
                }
            }
            if (items.length === 0) {
                if (typeof media.has_audio !== 'undefined' && media.has_audio === true && media.video_url) {
                    items.push({ url: media.video_url, isVideo: true, node: media });
                } else {
                    const img = media.display_url || media.thumbnail_src || (media.display_resources && media.display_resources[0] && media.display_resources[0].src);
                    if (!img) throw 'Gagal mengambil media Instagram!';
                    items.push({ url: img, isVideo: false, node: media });
                }
            }
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                await sleep(3000);
                if (item.isVideo) {
                    await conn.sendMessage(m.chat, { video: { url: item.url }, caption: sendCaption(i) }, { quoted: m });
                } else {
                    await conn.sendMessage(m.chat, { image: { url: item.url }, caption: sendCaption(i) }, { quoted: m });
                }
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