// @ts-nocheck
// Converted from plugins-esm - automated
import axios from 'axios';
import { load } from 'cheerio';

let handler: WaPlugin = async (m, { conn, command, usedPrefix }) => {
    conn.sessionsMail = conn.sessionsMail || {};

    for (let user in conn.sessionsMail) {
        let { lastCheckedAt } = conn.sessionsMail[user];
        if (Date.now() - lastCheckedAt > 30 * 60 * 1000) {
            delete conn.sessionsMail[user];
        }
    }

    if (command === "tempmail") {
        if (conn.sessionsMail[m.sender]) {
            return m.reply(`🚀 Anda sudah memiliki Temp Mail!\n📩 *Email:* ${conn.sessionsMail[m.sender].email}\n⏳ *Tunggu sekitar 5-10 menit sebelum cek.*`);
        }

        try {
            let res = await axios.get(`https://api.betabotz.eu.org/api/tools/create-temp-mail?apikey=${lann}`);
            if (!res.data.status) throw "❌ Gagal membuat email sementara!";

            let email = res.data.result;
            conn.sessionsMail[m.sender] = {
                email,
                createdAt: Date.now(),
                lastCheckedAt: Date.now()
            };

            m.reply(`✅ *Temp Mail Anda:*\n📩 *Email:* ${email}\n⏳ *Tunggu sekitar 5-10 menit sebelum cek.*`);
        } catch (e) {
            console.log(e);
            throw e;
        }
    } else if (command === "cekmail" || command === "checkmail") {
        if (!conn.sessionsMail[m.sender]) {
            return m.reply("⚠️ Anda belum memiliki Temp Mail!\nGunakan `${usedPrefix + command}` untuk membuatnya.");
        }

        let { email } = conn.sessionsMail[m.sender];

        conn.sessionsMail[m.sender].lastCheckedAt = Date.now();

        try {
            let res = await axios.get(`https://api.betabotz.eu.org/api/tools/cek-msg-tmp-mail?email=${email}&apikey=${lann}`);
            if (!res.data.status) throw "❌ Gagal mengambil pesan email!";
            
            let messages = res.data.result;
            if (messages.length === 0) {
                return m.reply(`📭 *Belum ada pesan masuk di ${email}.*\n⏳ *Coba cek lagi nanti.*`);
            }

            let pesan = messages.map((msg) => {
                let cleanText = extractText(msg.html || msg.text);
                return `📬 *Pesan Baru!*\n💌 *Dari:* ${msg.sf}\n📢 *Subjek:* ${msg.s}\n🕒 *Waktu:* ${msg.rr}\n\n📝 *Isi Pesan:*\n${cleanText}`;
            }).join("\n\n");

            m.reply(pesan);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
};

handler.command = ['tempmail', 'cekmail', 'checkmail'];
handler.tags = ['tools'];
handler.help = ['tempmail', 'cekmail', 'checkmail'];
handler.limit = true;



function extractText(html) {
    let $ = cheerio.load(html);
    return $.text().trim();
}

export default handler;
