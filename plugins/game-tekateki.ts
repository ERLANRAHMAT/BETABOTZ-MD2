// @ts-nocheck
// Converted from plugins-esm - automated
import fs from 'fs';
import fetch from 'node-fetch';

let timeout = 100000;
let poin = 10000;

let handler: WaPlugin = async (m, { conn, usedPrefix }) => {
    try {
        conn.tekateki = conn.tekateki ? conn.tekateki : {};
        let id = m.chat;
        
        if (id in conn.tekateki) {
            if (conn.tekateki[id].length !== 0) {
                await conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tekateki[id][0]);
                return;
            }
            delete conn.tekateki[id];
        }

        conn.tekateki[id] = [];

        let json;
        try {
            let src = await (await fetch(`https://api.betabotz.eu.org/api/game/tekateki?apikey=${lann}`)).json();
            json = src;
        } catch (e) {
            console.log(e);
            throw e;
        }

        if (!json || !json.data || !json.data.pertanyaan || !json.data.jawaban) {
            throw new Error('Format data tekateki tidak valid dari API.');
        }

        let caption = `
*TEKA TEKI*

${json.data.pertanyaan}
┌─⊷ *SOAL*
▢ Waktu jawab *${(timeout / 1000).toFixed(2)} detik*
▢ Bonus: ${poin} money
▢ Bantuan ${usedPrefix}tete
▢ *Balas/ replay soal ini untuk menjawab*
└──────────────
`.trim();

        conn.tekateki[id] = [
            await conn.reply(m.chat, caption, m),
            json, 
            poin,
            setTimeout(() => {
                if (conn.tekateki[id]) {
                    conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.data.jawaban}*`, conn.tekateki[id][0]);
                    delete conn.tekateki[id];
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

handler.help = ['tekateki'];
handler.tags = ['game'];
handler.command = /^tekateki/i;
handler.group = true;

export default handler;
