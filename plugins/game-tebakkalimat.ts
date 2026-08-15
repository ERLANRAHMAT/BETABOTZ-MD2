// @ts-nocheck
// Converted from plugins-esm - automated
import fetch from 'node-fetch';

let timeout = 100000;
let poin = 500;

let handler: WaPlugin = async (m, { conn, usedPrefix }) => {
    try {
        conn.tebakkalimat = conn.tebakkalimat ? conn.tebakkalimat : {};
        let id = m.chat;
        
        if (id in conn.tebakkalimat) {
            await conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakkalimat[id][0]);
            return;
        }

        let json;
        try {
            let src = await (await fetch(`https://api.betabotz.eu.org/api/game/tebakkalimat?apikey=${lann}`)).json();
            json = src;
        } catch (e) {
            console.log(e);
            throw e;
        }

        if (!json || !json.soal || !json.jawaban) throw new Error('Format data tebakkalimat tidak valid dari API.');

        let caption = `
${json.soal}

┌─⊷ *SOAL*
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Ketik ${usedPrefix}tela untuk bantuan
▢ Bonus: ${poin} Kredit sosial
▢ *Balas/ replay soal ini untuk menjawab*
└──────────────
`.trim();

        conn.tebakkalimat[id] = [
            await conn.reply(m.chat, caption, m),
            json, 
            poin,
            setTimeout(() => {
                if (conn.tebakkalimat[id]) {
                    conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakkalimat[id][0]);
                    delete conn.tebakkalimat[id];
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

handler.help = ['tebakkalimat'];
handler.tags = ['game'];
handler.command = /^tebakkalimat/i;
handler.register = false;
handler.group = true;

export default handler;
