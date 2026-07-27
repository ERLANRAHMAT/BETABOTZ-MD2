import fetch from 'node-fetch';

let timeout = 100000;
let poin = 10000;

let handler = async (m, { conn, usedPrefix }) => {
    try {
        conn.tebakkode = conn.tebakkode ? conn.tebakkode : {};
        let id = m.chat;
        
        if (id in conn.tebakkode) {
            await conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakkode[id][0]);
            return;
        }

        let json;
        try {
            let src = await (await fetch(`https://api.betabotz.eu.org/api/game/tebakkode?apikey=${lann}`)).json();
            json = src;
        } catch (e) {
            console.log(e);
            throw e;
        }

        if (!json || !json.soal || !json.pilihan || !json.jawaban) {
            throw new Error('Format data tebakkode tidak valid dari API.');
        }

        let options = json.pilihan.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join('\n');
        
        let caption = `
${json.soal}

${options}

┌─⊷ *SOAL*
▢ Bahasa: *${json.bahasa || '-'}*
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Bonus: ${poin} money
▢ Ketik ${usedPrefix}kdo untuk clue jawaban
▢ *Balas/ replay soal ini untuk menjawab dengan a, b, c, atau d*
└──────────────
`.trim();

        conn.tebakkode[id] = [
            await conn.reply(m.chat, caption, m),
            json, 
            poin,
            setTimeout(() => {
                if (conn.tebakkode[id]) {
                    conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakkode[id][0]);
                    delete conn.tebakkode[id];
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

handler.help = ['tebakkode'];
handler.tags = ['game'];
handler.command = /^tebakkode/i;
handler.register = false;
handler.group = true;

export default handler;