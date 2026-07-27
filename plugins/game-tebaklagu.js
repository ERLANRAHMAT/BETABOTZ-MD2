import fetch from 'node-fetch';

let timeout = 100000;
let poin = 10000;

let handler = async (m, { conn, command, usedPrefix }) => {
    try {
        conn.tebaklagu = conn.tebaklagu ? conn.tebaklagu : {};
        let id = m.chat;
        
        if (id in conn.tebaklagu) {
            await conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebaklagu[id][0]);
            return;
        }

        let json;
        try {
            let data = await (await fetch(`https://api.betabotz.eu.org/api/game/tebaklagu?apikey=${lann}`)).json();
            json = data;
        } catch (e) {
            console.log(e);
            throw e;
        }

        if (!json || !json.lagu || !json.judul) {
            throw new Error('Format data tebaklagu tidak valid dari API.');
        }

        let caption = `*${command.toUpperCase()}*
Penyanyi: ${json.artis || '-'}

┌─⊷ *SOAL*
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Ketik *${usedPrefix}lag* untuk bantuan
▢ Bonus: ${poin} money
▢ *Balas/ replay soal ini untuk menjawab*
└──────────────
`.trim();

        conn.tebaklagu[id] = [
            await conn.reply(m.chat, caption, m),
            json, 
            poin,
            setTimeout(() => {
                if (conn.tebaklagu[id]) {
                    conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.judul}*`, conn.tebaklagu[id][0]);
                    delete conn.tebaklagu[id];
                }
            }, timeout)
        ];

        await conn.sendFile(m.chat, json.lagu, 'tebaklagu.mp3', '', conn.tebaklagu[id][0]);
    } catch (e) {
        if (e !== false) {
            console.log(e);
            throw e;
        }
    }
};

handler.help = ['tebaklagu'];
handler.tags = ['game'];
handler.command = /^tebaklagu/i;
handler.limit = true;

export default handler;