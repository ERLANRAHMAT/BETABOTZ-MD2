const uploadImage = require('../lib/uploadImage');
const fetch = require('node-fetch');
const axios = require('axios');

let handler = async (m, { conn, usedPrefix, command, text }) => {
    if (['imageedit', 'imgedit', 'img2img', 'editimg'].includes(command) && !text) {
        return m.reply('Tolong masukkan text prompt untuk mengedit gambar.');
    }

    var q = m.quoted ? m.quoted : m;
    var mime = (q.msg || q).mimetype || q.mediaType || '';
    
    let endpoint = '';

    switch(command) {
        case 'jadidisney':
        case 'todisney':
            endpoint = 'disney';
            break;
        case 'jadipixar':
        case 'topixar':
            endpoint = 'pixar';
            break;
        case 'jadicartoon':
        case 'tocartoon':
            endpoint = 'cartoon';
            break;
        case 'jadicyberpunk':
        case 'tocyberpunk':
            endpoint = 'cyberpunk';
            break;
        case 'jadivangogh':
        case 'tovangogh':
            endpoint = 'vangogh';
            break;
        case 'jadipixelart':
        case 'topixelart':
            endpoint = 'pixelart';
            break;
        case 'jadicomicbook':
        case 'tocomicbook':
            endpoint = 'comicbook';
            break;
        case 'jadihijab':
        case 'tohijab':
            endpoint = 'hijab';
            break;
        case 'jadihitam':
        case 'hitamkan':
        case 'tohitam':
            endpoint = 'hitam';
            break;
        case 'jadiputih':
        case 'toputih':
            endpoint = 'putih';
            break;
        case 'jadighibili':
        case 'toghibili':
            endpoint = 'ghibili';
            break;
        case 'imageedit':
        case 'imgedit':
        case 'img2img':
        case 'editimg':
            if (!text) return m.reply('Tolong masukkan text prompt untuk mengedit gambar.');
            endpoint = 'editimg';
            break;
        default:
            return m.reply("[ ! ] Command tidak dikenali.");
    }

    if (/image/g.test(mime) && !/webp/g.test(mime)) {
        await conn.reply(m.chat, wait, m);
        try {
            const img = await q.download?.();
            let out = await uploadImage(img);
            let startTime = new Date();
            /*
            Image Edit With Prompt 
            **/
            if (['imageedit', 'imgedit', 'img2img', 'editimg'].includes(command)) {
                let result = await imageedit(text, out);
                await conn.sendMessage(m.chat, { 
                    image: { url: result }, 
                    caption: `🎨 *Style:* Edit Gambar\n📋 *Prompt*: ${text}\n⏳ *Waktu:* ${((new Date() - startTime) * 1)} ms`
                }, { quoted: m });
            } else {
                /*
                Edit image no prompt 
                */
                let res = await fetch(`https://api.betabotz.eu.org/api/maker/jadi${endpoint}?url=${out}&apikey=${lann}`);
                let convert = await res.buffer();
                
                await conn.sendMessage(m.chat, { 
                    image: convert, 
                    caption: `🎨 *Style:* Jadi ${endpoint}\n⏳ *Waktu:* ${((new Date() - startTime) * 1)} ms`
                }, { quoted: m });
            }

        } catch (e) {
            console.error(e);
            m.reply("[ ! ] Terjadi kesalahan saat memproses gambar.");
        }
    } else {
        m.reply(`Kirim gambar dengan caption *${usedPrefix + command}* atau tag gambar yang sudah dikirim.`);
    }
};

handler.help = handler.command = ['jadidisney', 'todisney', 'jadipixar', 'topixar', 'jadicartoon', 'tocartoon', 'jadicyberpunk', 'tocyberpunk', 'jadivangogh', 'tovangogh', 'jadipixelart', 'topixelart', 'jadicomicbook', 'tocomicbook', 'jadihijab', 'tohijab', 'jadihitam', 'hitamkan', 'tohitam', 'jadiputih', 'toputih', 'jadighibili', 'toghibili', 'imageedit', 'imgedit', 'img2img', 'editimg'];
handler.tags = ['maker'];
handler.premium = false;
handler.limit = true;

module.exports = handler;

/*
 * @ CJS Image Edit Ai Use BetaBotz Api
 * @ Param {string} text - The text prompt for the image generation.
 * @ Param {string} url - The URL of the image to be edited.
 * @ Param {string} [apikey] - API key for authentication.
 * @ Returns {Buffer} - The edited image as a Buffer.
 * @ Throws {Error} - If the image generation fails.
 * @ Example Usage:
 */

async function imageedit(text, url) {
  try {
    const { data } = await axios.post("https://api.betabotz.eu.org/api/maker/imgedit", {
      text: text,
      url: url,
      apikey: lann
    });
    
    return data.result;
  } catch (error) {
    throw new Error("Failed to fetch image: " + error.message);
  };
};
