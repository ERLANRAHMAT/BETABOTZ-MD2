// @ts-nocheck
// Converted from plugins-esm - automated
import fetch from 'node-fetch';

let timeout = 100000;
let poin = 1000;

let handler: WaPlugin = async (m, { conn, usedPrefix }) => {
    try {
        conn.tebakemoji = conn.tebakemoji ? conn.tebakemoji : {};
        let id = m.chat;
        
        if (id in conn.tebakemoji) {
            await conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakemoji[id][0]);
            return;
        }

        let json;
        try {
            let src = await (await fetch(`https://api.betabotz.eu.org/api/game/tebakemoji?apikey=${lann}`)).json();
            json = src;
        } catch (e) {
            console.log(e);
            throw e;
        }

        if (!json || !json.jawaban) throw new Error('Format data tebakemoji tidak valid dari API.');

        let caption = `
*TEBAK EMOJI*
Emoji nya: ${json.emoticon} 

┌─⊷ *SOAL*
▢ ${json.soal}
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Ketik ${usedPrefix}hemo untuk bantuan
▢ Bonus: ${poin} money
▢ *Balas/ replay soal ini untuk menjawab*
└──────────────
`.trim();

        conn.tebakemoji[id] = [
            await conn.reply(m.chat, caption, m),
            json, 
            poin,
            setTimeout(() => {
                if (conn.tebakemoji[id]) {
                    conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*\n\nDeskripsi: ${json.deskripsi}`, conn.tebakemoji[id][0]);
                    delete conn.tebakemoji[id];
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

handler.help = ['tebakemoji'];
handler.tags = ['game'];
handler.command = /^tebakemoji/i;
handler.register = false;
handler.group = true;

export default handler;
