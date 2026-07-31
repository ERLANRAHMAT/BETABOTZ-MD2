import fetch from 'node-fetch';

let timeout = 100000;
let poin = 10000;

let handler = async (m, { conn, usedPrefix }) => {
    try {
        conn.siapakahaku = conn.siapakahaku ? conn.siapakahaku : {};
        let id = m.chat;
        
        if (id in conn.siapakahaku) {
            await conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.siapakahaku[id][0]);
            return;
        }

        let json;
        try {
            let src = await (await fetch(`https://api.betabotz.eu.org/api/game/siapakahaku?apikey=${lann}`)).json();
            json = src;
        } catch (e) {
            console.log(e);
            throw e;
        }

        if (!json || !json.jawaban) throw new Error('Format data siapakahaku tidak valid dari API.');

        let caption = `
${json.soal}

┌─⊷ *SOAL*
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Ketik ${usedPrefix}maka untuk bantuan
▢ Bonus: ${poin} money
▢ *Balas/ replay soal ini untuk menjawab*
└──────────────
`.trim();

        conn.siapakahaku[id] = [
            await conn.reply(m.chat, caption, m),
            json, 
            poin,
            setTimeout(() => {
                if (conn.siapakahaku[id]) {
                    conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.siapakahaku[id][0]);
                    delete conn.siapakahaku[id];
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

handler.help = ['siapakahaku'];
handler.tags = ['game'];
handler.command = /^siapakahaku/i;
handler.register = false;
handler.group = true;

export default handler;