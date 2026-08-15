
import fetch from 'node-fetch';

let timeout = 100000;
let poin = 10000;

let handler: WaPlugin = async (m, { conn, usedPrefix }) => {
    try {
        conn.tebaktempat = conn.tebaktempat ? conn.tebaktempat : {};
        let id = m.chat;
        
        if (id in conn.tebaktempat) {
            await conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebaktempat[id][0]);
            return;
        }

        let json;
        try {
            let res = await fetch(`https://api.betabotz.eu.org/api/game/tebaktempat?apikey=${lann}`);
            if (!res.ok) throw new Error('Gagal mengambil data dari API');
            let result = await res.json();
            json = result;
        } catch (e) {
            console.log(e);
            return conn.reply(m.chat, '❌ Gagal mengambil data soal. Coba lagi nanti.', m);
        }

        if (!json || !json.img || !json.pilihan || !json.jawaban) {
            throw new Error('Format data tebaktempat tidak valid dari API.');
        }

        let options = json.pilihan.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join('\n');
        
        let caption = `
${json.soal}

${options}

┌─⊷ *SOAL*
▢ Timeout: *${(timeout / 1000).toFixed(2)} detik*
▢ Bonus: ${poin} money
▢ Ketik ${usedPrefix}tpc untuk clue jawaban
▢ *Balas/reply soal ini untuk menjawab dengan A, B, C, atau D*
└──────────────
`.trim();

        conn.tebaktempat[id] = [
            await conn.sendMessage(m.chat, { image: { url: json.img }, caption: caption }, { quoted: m }),
            json, 
            poin,
            setTimeout(() => {
                if (conn.tebaktempat[id]) {
                    conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*\n\nDeskripsi: ${json.deskripsi || '-'}`, conn.tebaktempat[id][0]);
                    delete conn.tebaktempat[id];
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

handler.help = ['tebaktempat'];
handler.tags = ['game'];
handler.command = /^tebaktempat/i;
handler.register = false;
handler.group = true;

export default handler;
