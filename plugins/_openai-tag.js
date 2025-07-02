const axios = require('axios');
let search = require("yt-search");

let handler = async (m, { conn, text, command }) => {
// kosong
};

handler.before = async (m, { conn }) => {
    try {
        if (!m.isGroup) return;
        conn.selfai = conn.selfai || {};
        if (m.isBaileys && m.fromMe) return;
        if (m.mentionedJid && m.mentionedJid.length > 0) {
            const botNumber = conn.user.jid.split('@')[0];
            
            const isMention = m.mentionedJid.some(mentioned => 
                mentioned.includes(botNumber)
            );
            
            if (isMention) {
                const filter = m.text.replace(/@\d+/g, '').trim();
                
                if (filter.toLowerCase() === '/reset') {
                    delete conn.selfai[m.sender];
                    await m.reply('Session chat berhasil direset.');
                    return true;
                }
                
                // Jika mau ada fitur reset global sessions AI
                /**if (filter.toLowerCase() === '/resetall') {
                    conn.selfai = {};
                    await m.reply('Semua session chat berhasil direset.');
                    return true;
                }
                **/
                
                if (filter.toLowerCase().startsWith('/imagine')) {
                    const imagePrompt = filter.replace('/imagine', '').trim();
                    if (!imagePrompt) {
                        await m.reply('Silakan berikan deskripsi gambar yang ingin dibuat.');
                        return true;
                    }

                    try {
                        await conn.sendPresenceUpdate('composing', m.chat);
                        const response = await axios.get(`https://api.betabotz.eu.org/api/search/openai-image?apikey=${global.lann}&text=${encodeURIComponent(imagePrompt)}`, {
                            responseType: 'arraybuffer'
                        });
                        
                        const image = response.data;
                        await conn.sendFile(m.chat, image, 'aiimg.jpg', null, m);
                    } catch (error) {
                        console.error(error)
                        await m.reply('Terjadi kesalahan saat membuat gambar. Mohon coba lagi.');
                    }
                    return true;
                }

                if (filter.toLowerCase().startsWith('/lagu')) {
                    const songprompt = filter.replace('/lagu', '').trim();
                    if (!songprompt) {
                        await m.reply('Silakan berikan judul lagu yang akan di cari.');
                        return true;
                    }
                        await conn.sendPresenceUpdate('composing', m.chat);
                    
                                const look = await search(songprompt);
                                const convert = look.videos[0];
                                if (!convert) throw 'Video/Audio Tidak Ditemukan';
                                if (convert.seconds >= 3600) {
                                    return conn.reply(m.chat, 'Video is longer than 1 hour!', m);
                                } else {
                                    let audioUrl;
                                    try {
                                        audioUrl = await youtube(convert.url);
                                    } catch (e) {
                                        conn.reply(m.chat, 'Please wait...', m);
                                        audioUrl = await youtube(convert.url);
                                    }
                        
                                    let caption = '';
                                    caption += `∘ Title : ${convert.title}\n`;
                                    caption += `∘ Ext : Search\n`;
                                    caption += `∘ ID : ${convert.videoId}\n`;
                                    caption += `∘ Duration : ${convert.timestamp}\n`;
                                    caption += `∘ Viewers : ${convert.views}\n`;
                                    caption += `∘ Upload At : ${convert.ago}\n`;
                                    caption += `∘ Author : ${convert.author.name}\n`;
                                    caption += `∘ Channel : ${convert.author.url}\n`;
                                    caption += `∘ Url : ${convert.url}\n`;
                                    caption += `∘ Description : ${convert.description}\n`;
                                    caption += `∘ Thumbnail : ${convert.image}`;
                        
                                    await conn.sendMessage(m.chat, {
                                        audio: {
                                            url: audioUrl.result.mp3
                                        },
                                        mimetype: 'audio/mpeg',
                                        contextInfo: {
                                            externalAdReply: {
                                                title: convert.title,
                                                body: "",
                                                thumbnailUrl: convert.image,
                                                sourceUrl: audioUrl.mp3,
                                                mediaType: 1,
                                                showAdAttribution: false,
                                                renderLargerThumbnail: true
                                            }
                                        }
                                    }, {
                                        quoted: m
                                    });
                                }
                            
                    return true;
                }
                async function youtube(url) {
                    try {
                    const { data } = await axios.get("https://api.betabotz.eu.org/api/download/yt?url="+url+"&apikey="+lann)
                    return data;
                    } catch (e) {
                    return e;
                    }
                 }

                await conn.sendPresenceUpdate('composing', m.chat);

                if (filter.toLowerCase().startsWith('/video')) {
                    const searchvideo = filter.replace('/video', '').trim();
                    if (!searchvideo) {
                        await m.reply('Silakan berikan judul video yang ingin dicari.');
                        return true;
                    }

                    try {
                        await conn.sendPresenceUpdate('composing', m.chat);
                         try {
                                const look = await search(searchvideo);
                                const convert = look.videos[0];
                                if (!convert) throw 'Video/Audio Tidak Ditemukan';
                                if (convert.seconds >= 3600) {
                                    return conn.reply(m.chat, 'Video is longer than 1 hour!', m);
                                } else {
                                    let videoUrl;
                                    try {
                                        videoUrl = await yts(convert.url);
                                    } catch (e) {
                                        conn.reply(m.chat, 'Please wait...', m);
                                        videoUrl = await yts(convert.url);
                                    }
                        
                                    let caption = '';
                                    caption += `∘ Title : ${convert.title}\n`;
                                    caption += `∘ Ext : Search\n`;
                                    caption += `∘ ID : ${convert.videoId}\n`;
                                    caption += `∘ Duration : ${convert.timestamp}\n`;
                                    caption += `∘ Viewers : ${convert.views}\n`;
                                    caption += `∘ Upload At : ${convert.ago}\n`;
                                    caption += `∘ Author : ${convert.author.name}\n`;
                                    caption += `∘ Channel : ${convert.author.url}\n`;
                                    caption += `∘ Url : ${convert.url}\n`;
                                    caption += `∘ Description : ${convert.description}\n`;
                                    caption += `∘ Thumbnail : ${convert.image}`;
                    
                        
                                    await conn.sendMessage(m.chat, {
                                        video: {
                                            url: videoUrl.result.mp4
                                        },
                                        mimetype: 'video/mp4',
                                        contextInfo: {
                                            externalAdReply: {
                                                title: convert.title,
                                                body: "",
                                                thumbnailUrl: convert.image,
                                                sourceUrl: videoUrl.mp4,
                                                mediaType: 1,
                                                showAdAttribution: false,
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


                    } catch (error) {
                        console.error(error)
                        await m.reply('Terjadi kesalahan saat mencari video. Mohon coba lagi.');
                    }
                    return true;
                }
                async function yts(url) {
                   try {
                   const { data } = await axios.get("https://api.betabotz.eu.org/api/download/ytmp4?url="+url+"&apikey="+lann)
                   return data;
                   } catch (e) {
                   return e;
                   }
                }

                await conn.sendPresenceUpdate('composing', m.chat);
    
                if (!filter) {
                    const empty_response = [
                        `Hi ${m.name}, how can I assist you today?`,
                        `Ada yang bisa saya bantu, ${m.name}?`,
                        `Hai ${m.name}, silakan beritahu saya apa yang Anda butuhkan.`,
                        `${m.name}, saya siap membantu. Ada pertanyaan?`,
                        `Apa yang ingin kamu diskusikan, ${m.name}?`
                    ];
                    
                    const _response_pattern = empty_response[Math.floor(Math.random() * empty_response.length)];
                    
                    await m.reply(_response_pattern);
                    return true;
                }

                if (!conn.selfai[m.sender]) {
                    conn.selfai[m.sender] = { sessionChat: [] };
                }
                
                if ([".", "#", "!", "/", "\\"].some(prefix => filter.startsWith(prefix))) return;
                
                const previousMessages = conn.selfai[m.sender].sessionChat || [];
                const messages = [
                    { role: "system", content: "kamu adalah BTZ, Seorang Asisten pribadi yang di buat oleh betabotz yang siap membantu kapan pun, jawab setiap pertanyaan menggunakan emoticon dan seramah mungkin kepada user jangan lupa sertakan lelcuon pada jawaban yang membuat user betah:)!" },
                    { role: "assistant", content: `Saya BTZ, asisten pribadi yang siap membantu kamu kapan pun! Apa yang bisa saya bantu hari ini?` },
                    ...previousMessages.map((msg, i) => ({ role: i % 2 === 0 ? 'user' : 'assistant', content: msg })),
                    { role: "user", content: filter }
                ];
                
                try {
                    const chat = async function(message) {
                        return new Promise(async (resolve, reject) => {
                            try {
                                const params = {
                                    message: message,
                                    apikey: global.lann
                                };
                                const { data } = await axios.post('https://api.betabotz.eu.org/api/search/openai-custom', params);
                                resolve(data);
                            } catch (error) {
                                reject(error);
                            }
                        });
                    };
                    
                    let res = await chat(messages);
                    if (res && res.result) {
                        await m.reply(res.result);
                        conn.selfai[m.sender].sessionChat = [
                            ...conn.selfai[m.sender].sessionChat,
                            filter,
                            res.result
                        ];
                    } else {
                        m.reply("Kesalahan dalam mengambil data silahkan @mention /reset untuk mencoba percakapan baru.");
                    }
                } catch (e) {
                    console.error(e);
                    m.reply("Terjadi kesalahan dalam memproses permintaan.");
                }
                return true;
            }
        }
        return true;
    } catch (error) {
        console.error(error);
        return true;
    }
};

module.exports = handler;