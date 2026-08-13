import uploadImage from '../lib/uploadImage.js';
import fetch from 'node-fetch';
import axios from 'axios';

let handler = async (m, { conn, usedPrefix, command, text }) => {
    if (['imageedit', 'imgedit', 'img2img', 'editimg'].includes(command) && !text) {
        return m.reply('Tolong masukkan text prompt untuk mengedit gambar.');
    }

    var q = m.quoted ? m.quoted : m;
    var mime = (q.msg || q).mimetype || q.mediaType || '';

    let endpoint = '';

    switch (command) {
        case 'jadidisney':
        case 'todisney':
            endpoint = 'jadidisney';
            break;
        case 'jadipixar':
        case 'topixar':
            endpoint = 'jadipixar';
            break;
        case 'jadicartoon':
        case 'tocartoon':
            endpoint = 'jadicartoon';
            break;
        case 'jadicyberpunk':
        case 'tocyberpunk':
            endpoint = 'jadicyberpunk';
            break;
        case 'jadivangogh':
        case 'tovangogh':
            endpoint = 'jadivangogh';
            break;
        case 'jadipixelart':
        case 'topixelart':
            endpoint = 'jadipixelart';
            break;
        case 'jadicomicbook':
        case 'tocomicbook':
            endpoint = 'jadicomicbook';
            break;
        case 'jadihijab':
        case 'tohijab':
            endpoint = 'jadihijab';
            break;
        case 'jadihitam':
        case 'hitamkan':
        case 'tohitam':
            endpoint = 'jadihitam';
            break;
        case 'jadiputih':
        case 'toputih':
            endpoint = 'jadiputih';
            break;
        case 'jadighibili':
        case 'toghibili':
            endpoint = 'jadighibili';
            break;
        case 'jadisdmtinggi':
        case 'tosdmtinggi':
        case 'tosdm':
            endpoint = 'jadisdmtinggi';
            break;
        case 'jadifigure':
        case 'tofigure':
            endpoint = 'tofigure'
            break
        case 'jadifigure2':
        case 'tofigure2':
            endpoint = 'tofigurev2'
            break
        case 'jadifigure3':
        case 'tofigure3':
            endpoint = 'tofigurev3'
            break
        case 'imageedit':
        case 'imgedit':
        case 'img2img':
        case 'editimg':
            if (!text) return m.reply('Tolong masukkan text prompt untuk mengedit gambar.');
            endpoint = 'imgedit';
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

            let isImgEdit = ['imageedit', 'imgedit', 'img2img', 'editimg'].includes(command);

            // Step 1: submit job
            let jobId, jobType, submitData;

            if (isImgEdit) {
                const { data } = await axios.post("https://api.betabotz.eu.org/api/maker/imgedit", {
                    text: text,
                    url: out,
                    apikey: lann
                });
                submitData = data;
            } else {
                const { data } = await axios.get(`https://api.betabotz.eu.org/api/maker/${endpoint}`, {
                    params: { url: out, apikey: lann }
                });
                submitData = data;
            }

            if (!submitData.status || !submitData.jobId) {
                throw new Error(submitData.message || 'Gagal submit job.');
            }
            jobId = submitData.jobId;
            jobType = submitData.type; // ambil langsung dari response, bukan asumsi manual

            // Step 2: poll until done
            // - untuk imgedit: hasil akhirnya JSON { status, creator, result: "url" } -> perlu fetch url itu lagi
            // - untuk selain imgedit: hasil akhirnya LANGSUNG buffer gambar, ga perlu fetch lagi
            let convert = await pollJobResult(jobType, jobId, { isJsonResult: isImgEdit });

            if (isImgEdit) {
                await conn.sendMessage(m.chat, {
                    image: convert,
                    caption: `🎨 *Style:* Edit Gambar\n📋 *Prompt*: ${text}\n⏳ *Waktu:* ${(new Date() - startTime)} ms`
                }, { quoted: m });
            } else {
                await conn.sendMessage(m.chat, {
                    image: convert,
                    caption: `🎨 *Style:* Jadi ${endpoint}\n⏳ *Waktu:* ${(new Date() - startTime)} ms`
                }, { quoted: m });
            }

        } catch (e) {
            console.error(e);
            throw e;
        }
    } else {
        m.reply(`Kirim gambar dengan caption *${usedPrefix + command}* atau tag gambar yang sudah dikirim.`);
    }
};
handler.help = handler.command = ['jadidisney', 'todisney', 'jadipixar', 'topixar', 'jadicartoon', 'tocartoon', 'jadicyberpunk', 'tocyberpunk', 'jadivangogh', 'tovangogh', 'jadipixelart', 'topixelart', 'jadicomicbook', 'tocomicbook', 'jadihijab', 'tohijab', 'jadihitam', 'hitamkan', 'tohitam', 'jadiputih', 'toputih', 'jadighibili', 'toghibili', 'jadifigure', 'tofigure', 'jadifigure2', 'tofigure2', 'jadifigure3', 'tofigure3', 'tosdm' ,'tosdmtinggi', 'jadisdmtinggi', 'imageedit', 'imgedit', 'img2img', 'editimg'];
handler.tags = ['maker'];
handler.premium = false;
handler.limit = true;

export default handler;

/*
 * @ Poll job status until done/failed, or timeout.
 * @ Param {string} type - job type (e.g. "imgedit", "disney", "pixar", ...)
 * @ Param {string} jobId - job id returned from submit call
 * @ Param {object} [opts] - { intervalMs, timeoutMs, isJsonResult }
 *   - isJsonResult: true jika saat status "pending" respon berupa JSON status,
 *     dan saat selesai juga JSON berisi { result: "url" } (khusus imgedit).
 *     false jika saat selesai responnya LANGSUNG buffer gambar (bukan JSON).
 * @ Returns {Buffer} - the final image buffer
 * @ Throws {Error} - on failure or timeout
 */
async function pollJobResult(type, jobId, opts = {}) {
    const intervalMs = opts.intervalMs || 3000;
    const timeoutMs = opts.timeoutMs || 240000; // 2 minutes
    const isJsonResult = !!opts.isJsonResult;
    const startedAt = Date.now();
    const statusUrl = 'https://api.betabotz.eu.org/api/maker/status/editing-image';

    while (true) {
        if (Date.now() - startedAt > timeoutMs) {
            throw new Error(`Timeout menunggu hasil job (${type}/${jobId}).`);
        }

        // Ambil sebagai arraybuffer dulu supaya bisa deteksi apakah respon JSON atau buffer gambar
        const res = await axios.get(statusUrl, {
            params: { type, jobId },
            responseType: 'arraybuffer',
            validateStatus: () => true
        });

        const contentType = (res.headers['content-type'] || '').toLowerCase();
        const isJson = contentType.includes('application/json');

        if (isJson) {
            let data;
            try {
                data = JSON.parse(Buffer.from(res.data).toString('utf-8'));
            } catch {
                throw new Error(`Gagal parse response status job (${type}/${jobId}).`);
            }

            // masih diproses -> status string "pending"
            if (data.status === 'pending') {
                await new Promise(r => setTimeout(r, intervalMs));
                continue;
            }

            if (data.status === false) {
                throw new Error(data.message || `Job ${type}/${jobId} gagal diproses.`);
            }

            const resultUrl = data.result || data.url || data.data?.result || data.data?.url;

            if (isJsonResult) {
                // imgedit: selesai kalau status:true dan ada result url
                if (resultUrl) {
                    const imgRes = await axios.get(resultUrl, { responseType: 'arraybuffer' });
                    return Buffer.from(imgRes.data);
                }
                // status bukan pending tapi belum ada result juga -> anggap belum siap, poll lagi
                await new Promise(r => setTimeout(r, intervalMs));
                continue;
            }

            // non-imgedit: kalau masih dapat JSON selain "pending" tanpa buffer, poll lagi
            await new Promise(r => setTimeout(r, intervalMs));
            continue;
        }

        // Bukan JSON -> berarti ini sudah buffer gambar final (khusus non-imgedit)
        return Buffer.from(res.data);
    }
            }
