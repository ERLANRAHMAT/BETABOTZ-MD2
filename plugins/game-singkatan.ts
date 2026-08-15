
import fetch from 'node-fetch';

let timeout = 100000;
let poin = 10000;

let handler: WaPlugin = async (m, { conn, usedPrefix }) => {
    try {
        conn.singkatan = conn.singkatan ? conn.singkatan : {};
        let id = m.chat;
        
        if (id in conn.singkatan) {
            await conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.singkatan[id][0]);
            return;
        }

        let json;
        try {
            let src = await (await fetch(`https://api.betabotz.eu.org/api/game/singkatan?apikey=${lann}`)).json();
            json = src;
        } catch (e) {
            console.log(e);
            throw e;
        }

        if (!json || !json.kepanjangan) throw new Error('Format data singkatan tidak valid dari API.');

        let caption = `
┌─⊷ *SOAL*
▢ Singkatan nya: ${json.singkatan}, Tebak kepanjangannya apa?
▢ Deskripsi: ${json.deskripsi}
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Ketik ${usedPrefix}sktn untuk bantuan
▢ Bonus: ${poin} money
▢ *Balas/ replay soal ini untuk menjawab*
└──────────────
`.trim();

        conn.singkatan[id] = [
            await conn.reply(m.chat, caption, m),
            json, 
            poin,
            setTimeout(() => {
                if (conn.singkatan[id]) {
                    conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.kepanjangan}*`, conn.singkatan[id][0]);
                    delete conn.singkatan[id];
                }
            }, timeout)
        ];
    } catch (e) {
        if (e !== false) {
            console.log(e);
            throw e;
        }
    }
};

handler.help = ['singkatan'];
handler.tags = ['game'];
handler.command = /^singkatan/i;
handler.register = false;
handler.group = true;

export default handler;
