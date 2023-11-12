const uploadImage = require('../lib/uploadImage');
const fetch = require('node-fetch');

var handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) throw 'Masukkan Judul';
    try {
        var js = await fetch(API('lann', '/api/search/yts', { query: text, apikey: lann }));
        var search = await js.json();
        var convert = search.result[0];
        if (!convert) throw 'Video/Audio Tidak Ditemukan';
        if (convert.duration >= 3600) {
            return conn.reply(m.chat, 'Video lebih dari 1 jam!', m);
        } else {
            var audioUrl;
            try {
                audioUrl = await (await fetch(API('lann', '/api/download/ytmp3', { url: convert.url, apikey: lann }))).json();
            } catch (e) {
                conn.reply(m.chat, wait, m);
                audioUrl = await (await fetch(API('lann', '/api/download/ytmp3', { url: convert.url, apikey: lann }))).json();
            } 
            var build = await fetch(convert.thumbnail);
            var buffer = await build.buffer();
            var image = await uploadImage(buffer);
            var caption = `∘ Judul : ${convert.title}\n∘ Ekstensi : Pencarian\n∘ ID : ${convert.videoId}\n∘ Durasi : ${convert.duration}\n∘ Penonton : ${convert.views}\n∘ Diunggah Pada : ${convert.published_at}\n∘ Penulis : ${convert.author.name}\n∘ Saluran : ${convert.author.url}\n∘ Tautan : ${convert.url}\n∘ Deskripsi : ${convert.description}\n∘ Thumbnail : ${image}`;
            var pesan = conn.relayMessage(m.chat, {
                extendedTextMessage:{
                    text: caption, 
                    contextInfo: {
                        externalAdReply: {
                            title: "Diberdayakan oleh",
                            mediaType: 1,
                            previewType: 0,
                            renderLargerThumbnail: true,
                            thumbnailUrl: image,
                            sourceUrl: audioUrl.result.mp3
                        }
                    }, mentions: [m.sender]
                }
            }, {});
            conn.sendMessage(m.chat, {
                audio: {
                    url: audioUrl.result.mp3
                },
                mimetype: 'audio/mpeg',
                contextInfo: {
                    externalAdReply: {
                        title: convert.title,
                        body: "",
                        thumbnailUrl: image,
                        sourceUrl: audioUrl.result.mp3,
                        mediaType: 1,
                        showAdAttribution: true,
                        renderLargerThumbnail: true
                    }
                }
            }, {
                quoted: m
            });
        }
    } catch (e) {
        conn.reply(m.chat, `*Error:* ` + e, m);
    }
};

handler.command = handler.help = ['play', 'song', 'ds'];
handler.tags = ['downloader'];
handler.exp = 0;
handler.limit = true;
handler.premium = false;
module.exports = handler;
