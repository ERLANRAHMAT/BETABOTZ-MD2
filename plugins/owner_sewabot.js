import fetch from 'node-fetch'
const BTZPAYGATE_BASE_URL = 'https://web.btzpay.my.id'
const getApiKey = () => global.config?.btzPaygateApiKey || global.btzPaygateApiKey
const errText = (obj) => typeof obj?.message === 'string' && obj.message ? obj.message : 'Terjadi kesalahan, silakan coba lagi nanti.'

let handler = async (m, { conn, command, usedPrefix, text, args }) => {
    try {
        // ==== .forcetrx ====
        // Owner bisa lihat daftar transaksi pending & force konfirmasi via callback btzpay.
        if (/^forcetrx$/i.test(command)) {
            const apikey = getApiKey()
            if (!apikey) {
                return conn.reply(m.chat, 'ApiKey btzpay belum dikonfigurasi di `global.btzPaygateApiKey`', m)
            }

            // Kumpulkan semua transaksi pending dari semua chat (sewa per nomor)
            let allChats = global.db.data.chats || {}
            let pendingTrxList = []
            for (let [chatId, cd] of Object.entries(allChats)) {
                if (cd.pendingSewa && typeof cd.pendingSewa === 'object') {
                    for (let [sender, p] of Object.entries(cd.pendingSewa)) {
                        if (p && p.transactionId) {
                            pendingTrxList.push({ chatId, sender, ...p })
                        }
                    }
                }
            }

            // Tanpa argumen → tampilkan daftar
            if (!args[0]) {
                if (!pendingTrxList.length) {
                    return conn.reply(m.chat, '✅ Tidak ada transaksi yang belum selesai saat ini.', m)
                }
                let text_ = '`F O R C E - T R X`\n\n'
                pendingTrxList.forEach((p, i) => {
                    let total = Number(p.totalAmount) || (Number(p.amount || 0) + Number(p.fee || 0))
                    text_ += `*${i + 1}.* ID Trx  : ${p.transactionId}\n`
                    text_ += `   ◦ Pembeli : ${p.sender.split('@')[0]}\n`
                    text_ += `   ◦ Paket   : ${p.packageKey || '-'} (${p.groupCount || 1} grup)\n`
                    text_ += `   ◦ Nominal : Rp${Number(p.amount || 0).toLocaleString('id-ID')}\n`
                    text_ += `   ◦ Biaya   : Rp${Number(p.fee || 0).toLocaleString('id-ID')}\n`
                    text_ += `   ◦ Total   : Rp${Number(total).toLocaleString('id-ID')}\n\n`
                })
                text_ += `Ketik *${usedPrefix}forcetrx <ID Trx>* untuk konfirmasi\nAtau *${usedPrefix}forcetrx <ID Trx>|<nominal>* untuk force nominal`
                return conn.reply(m.chat, text_.trim(), m)
            }

            // Dengan argumen → force callback
            let parts = args.join(' ').split('|')
            let trxId = parts[0].trim()
            let nominal = parts[1] ? parseInt(parts[1].trim(), 10) : null

            // Cari transaksi di daftar pending
            let found = pendingTrxList.find(p => p.transactionId === trxId)
            if (!found) {
                return conn.reply(m.chat, `❌ Transaksi *${trxId}* tidak ditemukan di daftar pending.`, m)
            }

            let amount = nominal || Number(found.totalAmount) || (Number(found.amount || 0) + Number(found.fee || 0))

            await conn.reply(m.chat, `⏳ Sedang memproses callback transaksi *${trxId}*...`, m)

            let callbackRes = await fetch(`${BTZPAYGATE_BASE_URL}/api/qris/callback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'update',
                    app: 'com.dana.id',
                    notification: `Kamu menerima Rp${Number(amount).toLocaleString('id-ID')} dari ${found.sender.split('@')[0]}`,
                    amount,
                    appVersionCode: 123,
                    apikey
                })
            })
            let callbackJson = await callbackRes.json()

            if (!callbackJson.success) {
                console.log('[owner-sewabot] forcetrx gagal:', callbackJson)
                return conn.reply(m.chat, `❌ Gagal konfirmasi transaksi *${trxId}*.\n${errText(callbackJson)}`, m)
            }

            // Hapus dari pending setelah berhasil
            let cd = global.db.data.chats[found.chatId]
            if (cd?.pendingSewa?.[found.sender]) {
                delete cd.pendingSewa[found.sender]
            }

            return conn.reply(m.chat, `✅ Transaksi *${trxId}* berhasil dikonfirmasi!\nNominal: Rp${Number(amount).toLocaleString('id-ID')}\nPembeli: @${found.sender.split('@')[0]}\nStatus: ${callbackJson.data?.status || 'sukses'}`, m)
        }

        // ==== .forceprem ====
        // Owner bisa lihat daftar transaksi premium pending & force konfirmasi.
        if (/^forceprem$/i.test(command)) {
            const apikey = getApiKey()
            if (!apikey) {
                return conn.reply(m.chat, 'ApiKey btzpay belum dikonfigurasi di `global.btzPaygateApiKey`', m)
            }

            // Kumpulkan semua transaksi premium pending dari semua chat
            let allChats = global.db.data.chats || {}
            let pendingPremList = []
            for (let [chatId, cd] of Object.entries(allChats)) {
                if (cd.pendingPremium && typeof cd.pendingPremium === 'object') {
                    for (let [sender, p] of Object.entries(cd.pendingPremium)) {
                        if (p && p.transactionId) {
                            pendingPremList.push({ chatId, sender, ...p })
                        }
                    }
                }
            }

            // Tanpa argumen → tampilkan daftar
            if (!args[0]) {
                if (!pendingPremList.length) {
                    return conn.reply(m.chat, '✅ Tidak ada transaksi premium yang belum selesai saat ini.', m)
                }
                let text_ = '`F O R C E - P R E M`\n\n'
                pendingPremList.forEach((p, i) => {
                    let total = Number(p.totalAmount) || (Number(p.amount || 0) + Number(p.fee || 0))
                    text_ += `*${i + 1}.* ID Trx  : ${p.transactionId}\n`
                    text_ += `   ◦ Pembeli : ${p.sender.split('@')[0]}\n`
                    text_ += `   ◦ Paket   : ${p.packageKey || '-'}\n`
                    text_ += `   ◦ Nominal : Rp${Number(p.amount || 0).toLocaleString('id-ID')}\n`
                    text_ += `   ◦ Biaya   : Rp${Number(p.fee || 0).toLocaleString('id-ID')}\n`
                    text_ += `   ◦ Total   : Rp${Number(total).toLocaleString('id-ID')}\n\n`
                })
                text_ += `Ketik *${usedPrefix}forceprem <ID Trx>* untuk konfirmasi\nAtau *${usedPrefix}forceprem <ID Trx>|<nominal>* untuk force nominal`
                return conn.reply(m.chat, text_.trim(), m)
            }

            // Dengan argumen → force callback
            let parts = args.join(' ').split('|')
            let trxId = parts[0].trim()
            let nominal = parts[1] ? parseInt(parts[1].trim(), 10) : null

            let found = pendingPremList.find(p => p.transactionId === trxId)
            if (!found) {
                return conn.reply(m.chat, `❌ Transaksi premium *${trxId}* tidak ditemukan di daftar pending.`, m)
            }

            let amount = nominal || Number(found.totalAmount) || (Number(found.amount || 0) + Number(found.fee || 0))

            await conn.reply(m.chat, `⏳ Sedang memproses callback transaksi premium *${trxId}*...`, m)

            let callbackRes = await fetch(`${BTZPAYGATE_BASE_URL}/api/qris/callback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'update',
                    app: 'com.dana.id',
                    notification: `Kamu menerima Rp${Number(amount).toLocaleString('id-ID')} dari ${found.sender.split('@')[0]}`,
                    amount,
                    appVersionCode: 123,
                    apikey
                })
            })
            let callbackJson = await callbackRes.json()

            if (!callbackJson.success) {
                console.log('[owner-sewabot] forceprem gagal:', callbackJson)
                return conn.reply(m.chat, `❌ Gagal konfirmasi transaksi premium *${trxId}*.\n${errText(callbackJson)}`, m)
            }

            // Aktifkan premium + hapus pending
            let user = global.db.data.users[found.sender]
            if (!user) {
                global.db.data.users[found.sender] = { premium: false, premiumTime: 0 }
                user = global.db.data.users[found.sender]
            }
            let currentTime = Date.now()
            let durationMs = found.packageKey === '30d' ? 30 * 86400000 : 7 * 86400000
            user.premium = true
            user.premiumTime = (user.premiumTime > currentTime ? user.premiumTime : currentTime) + durationMs

            let cd = global.db.data.chats[found.chatId]
            if (cd?.pendingPremium?.[found.sender]) {
                delete cd.pendingPremium[found.sender]
            }

            let sisaHari = Math.floor((user.premiumTime - currentTime) / 86400000)
            return conn.reply(m.chat, `✅ Transaksi premium *${trxId}* berhasil dikonfirmasi!\nPembeli: @${found.sender.split('@')[0]}\nPaket: ${found.packageKey}\nPremium aktif sampai: ${new Date(user.premiumTime).toLocaleString('id-ID')} (sisa ${sisaHari} hari)\nStatus: ${callbackJson.data?.status || 'sukses'}`, m)
        }

        // ==== Ambil semua grup untuk command lain ====
        let groupsData = await conn.groupFetchAllParticipating()
        const groups = Object.values(groupsData)

        // ==== .listsewa ====
        // Nampilin semua grup di db yang punya data sewa: id, nama, kapan sewa,
        // siapa yang sewa, expired kapan, dan status aktif/habis.
        if (/^listsewa$/i.test(command)) {
        let allChats = global.db.data.chats || {}
        let groupNameById = {}
        for (let g of groups) groupNameById[g.id] = g.subject

        let entries = Object.entries(allChats).filter(([gid, gc]) => gc && typeof gc.expired === 'number' && gc.expired > 0)

        if (!entries.length) {
            return conn.reply(m.chat, 'Belum ada grup yang tercatat sewa di database.', m)
        }

        let now = Date.now()
        // aktif duluan (paling deket abis di atas), baru yang udah habis
        entries.sort((a, b) => {
            let aActive = a[1].expired > now
            let bActive = b[1].expired > now
            if (aActive !== bActive) return aActive ? -1 : 1
            return a[1].expired - b[1].expired
        })

        let aktif = entries.filter(([, gc]) => gc.expired > now)
        let habis = entries.filter(([, gc]) => gc.expired <= now)

        let fmtNomor = (jid) => jid ? jid.split('@')[0] : '-'
        let fmtRenters = (gc) => {
            let renters = Array.isArray(gc.sewaBy) ? gc.sewaBy : (gc.sewaBy ? [gc.sewaBy] : [])
            return renters.map(j => j.split('@')[0]).join(', ') || '-'
        }

        let renderRow = (index, [gid, gc]) => {
            let nama = groupNameById[gid] || gc.subject || '(bot sudah tidak di grup ini / nama tidak diketahui)'
            let sisaMs = gc.expired - now
            let statusText = sisaMs > 0 ? `✅ Aktif (sisa ${msToDate(sisaMs)})` : `❌ Habis`
            let sewaTanggal = gc.sewaLastOrderAt ? new Date(gc.sewaLastOrderAt).toLocaleString('id-ID') : '-'
            let expiredTanggal = new Date(gc.expired).toLocaleString('id-ID')
            return `*${index}.* ${nama}\n   ◦ ID Grup : ${gid}\n   ◦ Nomor   : ${fmtRenters(gc)}\n   ◦ Paket   : ${gc.sewaPackage || '-'}\n   ◦ Sewa    : ${sewaTanggal}\n   ◦ Expired : ${expiredTanggal}\n   ◦ Status  : ${statusText}\n`
        }

        let text_ = `\`L I S T - S E W A - B O T\`\n\nTotal tercatat: ${entries.length} | Aktif: ${aktif.length} | Habis: ${habis.length}\n\n`

        if (aktif.length) {
            text_ += `── Grup Aktif ──\n\n`
            aktif.forEach((entry, i) => { text_ += renderRow(i + 1, entry) + '\n' })
        }
        if (habis.length) {
            text_ += `── Grup Habis Masa Aktif ──\n\n`
            habis.forEach((entry, i) => { text_ += renderRow(i + 1, entry) + '\n' })
        }

        return conn.reply(m.chat, text_.trim(), m)
    }

    let [id, expired] = text.split('|');
    if (!text) {
        const list = groups.map((group, index) => {
            let gc = global.db.data.chats[group.id]
            let status = '⚪ Belum sewa'
            if (gc && typeof gc.expired === 'number' && gc.expired > 0) {
                status = gc.expired > Date.now() ? `✅ Aktif (sisa ${durationToText(gc.expired - Date.now())})` : `❌ Habis`
            }
            return `*${index + 1}.* ${group.subject}\n   ◦ ID  : ${group.id}\n   ◦ Sewa: ${status}`
        }).join('\n');
        const teks = '`L I S T - G R O U P - J O I N I N G`\n\n'
        let _info = `Perintah salah, contoh:\n${usedPrefix}addsewa <nomor grup>|<durasi, mis. 7d>\n${usedPrefix}setsewa <nomor grup>|<durasi, mis. 7d>\n${usedPrefix}delsewa <nomor grup>|stay atau out\n${usedPrefix}listsewa\n\nSatuan durasi: s, m, h, d, w, mo, y (bisa digabung, mis. 1d12h30m)`
        conn.reply(m.chat, `${teks}${list}\n\n${_info}`, m);
    } else if (id && /^\d+$/.test(id)) {
        const index = parseInt(id) - 1;
        if (index >= 0 && index < groups.length) {
            let d = new Date(new Date + 3600000)
            let locale = 'id'
            let date = d.toLocaleDateString(locale, {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })
            let now = new Date() * 1;
            let group = groups[index];
            let who = group.id
            let namegc = group.subject
            switch (command) {
                case "addsewa": {
                    if (!expired) throw `Masukan jangka waktu.\nContoh satuan: s (detik), m (menit), h (jam), d (hari), w (minggu), mo (bulan), y (tahun)\nBisa digabung, contoh: 1d12h30m\n\nContoh: ${usedPrefix + command} ${id}|7d`
                    let jumlahWaktu = parseDuration(expired);
                    if (!jumlahWaktu) throw `Format jangka waktu tidak valid: "${expired}"\nContoh satuan: s, m, h, d, w, mo, y (bisa digabung, mis. 1d12h)\n\nContoh: ${usedPrefix + command} ${id}|7d`
                    if (!global.db.data.chats[who]) global.db.data.chats[who] = {};

                    if (global.db.data.chats[who].expired && now < global.db.data.chats[who].expired) {
                        global.db.data.chats[who].expired += jumlahWaktu;
                    } else {
                        global.db.data.chats[who].expired = now + jumlahWaktu;
                    }
                    global.db.data.chats[who].expiredWarned = false // reset warning flag saat renewal
                    // catat owner sebagai penyewa grup ini (bisa lebih dari 1 orang)
                    if (!Array.isArray(global.db.data.chats[who].sewaBy)) global.db.data.chats[who].sewaBy = global.db.data.chats[who].sewaBy ? [global.db.data.chats[who].sewaBy] : []
                    if (!global.db.data.chats[who].sewaBy.includes(m.sender)) global.db.data.chats[who].sewaBy.push(m.sender)
                    let capt = `[ *Groups Notifikasi* ]
  
  *Menambahkan jangka waktu sewa group bot.*
  *Nama group:* ${namegc}
  *Id group:* ${who}
  *Tanggal:* ${date}
  *Jangka waktu:* ${msToDate(global.db.data.chats[who].expired - now)}
  hai all member, terimakasih telah sewa bot kami`
                    await conn.sendMessage(who, {
                        text: capt,
                    })
                    conn.reply(m.chat, `Berhasil menambahkan masa sewa untuk Grup ini selama ${durationToText(jumlahWaktu)}.\n\nHitung Mundur: ${msToDate(global.db.data.chats[who].expired - now)}`, m);
                    break;
                }

                case 'delsewa': {
                    if (!global.db.data.chats[who]) throw `Grup tidak ditemukan di database.`;

                    let opsi = (expired || '').toLowerCase().trim();
                    if (opsi !== 'stay' && opsi !== 'out') {
                        throw `Masukan opsi *stay* atau *out*.\nContoh: ${usedPrefix + command} ${id}|stay\natau: ${usedPrefix + command} ${id}|out`;
                    }

                    global.db.data.chats[who].expired = 0;

                    if (opsi === 'stay') {
                        let captStay = `[ *Groups Notifikasi* ]

*Masa sewa grup ini telah dihapus oleh owner.*
*Nama group:* ${namegc}
*Id group:* ${who}
*Tanggal:* ${date}
Bot akan tetap berada di grup ini (stay).`
                        await conn.sendMessage(who, { text: captStay });
                        conn.reply(m.chat, `Berhasil menghapus masa sewa untuk grup *${namegc}*.\nBot akan tetap berada di grup ini (stay).`, m);
                    } else {
                        let captOut = `[ *Groups Notifikasi* ]

*Masa sewa grup ini telah dihapus oleh owner.*
*Nama group:* ${namegc}
*Id group:* ${who}
*Tanggal:* ${date}
Bot akan keluar dari grup ini sekarang.`
                        try {
                            await conn.sendMessage(who, { text: captOut });
                        } catch (e) {}
                        await conn.groupLeave(who);
                        conn.reply(m.chat, `Berhasil menghapus masa sewa untuk grup *${namegc}*.\nBot telah keluar dari grup ini (out).`, m);
                    }
                    break;
                }

                case 'setsewa': {
                    if (!global.db.data.chats[who]) throw `Grup tidak ditemukan di database.`;
                    if (!expired) throw `Masukan jangka waktu.\nContoh satuan: s, m, h, d, w, mo, y (bisa digabung, mis. 1d12h)\n\nContoh: ${usedPrefix + command} ${id}|7d`
                    let jumlahWaktu = parseDuration(expired);
                    if (!jumlahWaktu) throw `Format jangka waktu tidak valid: "${expired}"\nContoh satuan: s, m, h, d, w, mo, y (bisa digabung, mis. 1d12h)\n\nContoh: ${usedPrefix + command} ${id}|7d`
                    global.db.data.chats[who].expired = now + jumlahWaktu;
                    global.db.data.chats[who].expiredWarned = false // reset warning flag
                    let caption = `[ *Groups Notifikasi* ]
  
  *Perubahan jangka waktu sewa group bot.*
  *Nama group:* ${namegc}
  *Id group:* ${who}
  *Tanggal:* ${date}
  *Jangka waktu:* ${msToDate(global.db.data.chats[who].expired - now)}
  hai all member, owner bot ku telah mengubah waktu sewa gc bot`
                    await conn.sendMessage(who, {
                        text: caption,
                    });
                    await sleep(3000)
                    conn.reply(m.chat, `Berhasil mengubah masa sewa untuk Grup ini menjadi ${durationToText(jumlahWaktu)}.\n\nHitung Mundur: ${msToDate(global.db.data.chats[who].expired - now)}`, m);
                    break;
                }
            }
        } else {
            conn.reply(m.chat, 'Grup dengan urutan tersebut tidak ditemukan.', m);
        }
    } else {
        const gcname = groups.map((group, index) => {
            let gc = global.db.data.chats[group.id]
            let status = '⚪ Belum sewa'
            if (gc && typeof gc.expired === 'number' && gc.expired > 0) {
                status = gc.expired > Date.now() ? `✅ Aktif (sisa ${durationToText(gc.expired - Date.now())})` : `❌ Habis`
            }
            return `*${index + 1}.* ${group.subject}\n   ◦ ID  : ${group.id}\n   ◦ Sewa: ${status}`
        }).join('\n');
        const tekss = '`L I S T - G R O U P - J O I N I N G`\n\n'
        let info = `Perintah salah, contoh:\n${usedPrefix}addsewa <nomor grup>|<durasi, mis. 7d>\n${usedPrefix}setsewa <nomor grup>|<durasi, mis. 7d>\n${usedPrefix}delsewa <nomor grup>|stay atau out\n${usedPrefix}listsewa\n\nSatuan durasi: s, m, h, d, w, mo, y (bisa digabung, mis. 1d12h30m)`
        conn.reply(m.chat, `${tekss}${gcname}\n\n${info}`, m);
    }
    } catch (e) {
        console.log('[owner-sewabot] error:', e)
        throw e
    }
};
handler.help = ['addsewa <grup>|<durasi>', 'delsewa <grup>|stay/out', 'setsewa <grup>|<durasi>', 'listsewa', 'forcetrx [id trx]', 'forceprem [id trx]']
handler.tags = ['owner']
handler.command = /^(addsewa|delsewa|setsewa|listsewa|forcetrx|forceprem)$/i

handler.owner = true

export default handler

function msToDate(ms) {
    let temp = ms;
    let days = Math.floor(temp / (24 * 60 * 60 * 1000));
    let daysms = temp % (24 * 60 * 60 * 1000);
    let hours = Math.floor((daysms) / (60 * 60 * 1000));
    let hoursms = daysms % (60 * 60 * 1000);
    let minutes = Math.floor((hoursms) / (60 * 1000));
    let minutesms = hoursms % (60 * 1000);
    return `${days} hari ${hours} jam ${minutes} menit`;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Konversi angka+satuan durasi (mis. "1d", "12h", "1d12h30m") ke milidetik.
// Satuan didukung: s (detik), m (menit), h (jam), d (hari), w (minggu), mo (bulan~30hari), y (tahun~365hari)
// Kalau cuma angka polos tanpa satuan (mis. "7"), dianggap hari (backward compatible).
// Return null kalau formatnya nggak valid / kosong.
function parseDuration(str) {
    if (!str) return null;
    str = String(str).toLowerCase().trim();
    if (!str) return null;

    // angka polos = hari (biar command lama "7" masih jalan)
    if (/^\d+$/.test(str)) return parseInt(str, 10) * 86400000;

    const UNIT_MS = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000,
        w: 7 * 24 * 60 * 60 * 1000,
        mo: 30 * 24 * 60 * 60 * 1000,
        y: 365 * 24 * 60 * 60 * 1000,
    };
    // urutan penting: "mo" harus dicek sebelum "m" biar nggak salah kebaca menit
    const regex = /(\d+)\s*(y|mo|w|d|h|m|s)/g;

    let total = 0;
    let found = false;
    let match;
    while ((match = regex.exec(str)) !== null) {
        found = true;
        total += parseInt(match[1], 10) * UNIT_MS[match[2]];
    }
    return found ? total : null;
}

// Format ms jadi teks singkat, cuma nampilin unit yang > 0. Contoh: "1 hari 12 jam"
function durationToText(ms) {
    let days = Math.floor(ms / 86400000);
    let hours = Math.floor((ms % 86400000) / 3600000);
    let minutes = Math.floor((ms % 3600000) / 60000);
    let seconds = Math.floor((ms % 60000) / 1000);

    let parts = [];
    if (days > 0) parts.push(`${days} hari`);
    if (hours > 0) parts.push(`${hours} jam`);
    if (minutes > 0) parts.push(`${minutes} menit`);
    if (seconds > 0 && days === 0 && hours === 0) parts.push(`${seconds} detik`);
    return parts.length ? parts.join(' ') : '0 detik';
}