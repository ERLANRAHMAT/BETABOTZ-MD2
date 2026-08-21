const __dirname = import.meta.dirname;
import fetch from 'node-fetch'

const BTZPAYGATE_BASE_URL = 'https://web.btzpay.my.id'
const getApiKey = () => global.config?.btzPaygateApiKey || global.btzPaygateApiKey

// Fee transaksi dihitung dari persen global.feeBtzPaygate (default 0.7%).
const getFee = (amount) => {
    let percent = typeof global.feeBtzPaygate === 'number' ? global.feeBtzPaygate : 0.7
    return Math.round(Number(amount) * percent / 100)
}

// Teks error ramah untuk user, detail error asli dicatat di terminal.
const errText = (obj) => typeof obj?.message === 'string' && obj.message ? obj.message : 'Terjadi kesalahan, silakan coba lagi nanti.'

const POLL_INTERVAL = 15000 // cek status tiap 15 detik
const LINK_TIMEOUT = 10 * 60 * 1000 // batas waktu kirim link grup setelah bayar: 10 menit

// in-memory registry biar ga dobel polling per transaksi
global.sewaPolling = global.sewaPolling || {}

// Race condition: cooldown per user (5 detik) biar ga double order
global.sewaCooldown = global.sewaCooldown || {}

// Race condition: processing lock per user di handler.before (link processing)
global.sewaProcessing = global.sewaProcessing || {}

// ==== Batasi akses fitur sewabot cuma di grup resmi owner ====
// Set global.sewaGroupJid di config contoh:
// global.sewaGroupJid = '120363xxxxxxxxxx@g.us'
const getSewaGroupJid = () => global.sewaGroupJid

const DAY = 24 * 60 * 60 * 1000

// ====================================================================
// HARDCODE PRICELIST DI SINI — tinggal tambah/ubah/hapus paketnya
// key = kode yang diketik user (mis. .sewabot perbulan1)
// Harga di sini adalah harga PER GRUP. Kalau user order > 1 grup,
// harga dikali otomatis (lihat parsing command di bawah).
// ====================================================================
const PRICELIST = {
    perminggu1: { category: 'Perminggu', label: 'Mingguan', price: 5000, durationMs: 7 * DAY },
    perbulan1: { category: 'Perbulan', label: 'Bulanan', price: 15000, durationMs: 30 * DAY },
    perbulan3: { category: 'Perbulan', label: 'Bulanan (3 Bulan)', price: 40000, durationMs: 90 * DAY },
    pertahun1: { category: 'Pertahun', label: 'Tahunan', price: 150000, durationMs: 365 * DAY },
}
const CATEGORY_ORDER = ['Perminggu', 'Perbulan', 'Pertahun']
const MAX_GROUPS_PER_ORDER = 20 // batas wajar biar ga disalahgunain ( grup order )

const getChatData = (chat) => {
    global.db.data.chats = global.db.data.chats || {}
    global.db.data.chats[chat] = global.db.data.chats[chat] || {}
    return global.db.data.chats[chat]
}

// Semua state sewa disimpan PER NOMOR (sender), bukan per chat,
// biar user lain di group yang sama tetap bisa order tanpa ke-block.
const getPendingSewa = (chat, sender) => getChatData(chat).pendingSewa?.[sender] || null

const setPendingSewa = (chat, sender, data) => {
    let cd = getChatData(chat)
    cd.pendingSewa = cd.pendingSewa || {}
    cd.pendingSewa[sender] = data
}

const clearPendingSewa = (chat, sender) => {
    let cd = getChatData(chat)
    if (cd.pendingSewa && sender) delete cd.pendingSewa[sender]
}

const getAwaiting = (chat, sender) => getChatData(chat).awaitingGroupLink?.[sender] || null

const setAwaiting = (chat, sender, data) => {
    let cd = getChatData(chat)
    cd.awaitingGroupLink = cd.awaitingGroupLink || {}
    cd.awaitingGroupLink[sender] = data
}

const clearAwaiting = (chat, sender) => {
    let cd = getChatData(chat)
    if (cd.awaitingGroupLink && sender) delete cd.awaitingGroupLink[sender]
}

const genQrBuffer = async (qrisString) => {
    let res = await fetch(`${BTZPAYGATE_BASE_URL}/api/qris/create-qr-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            data: qrisString,
            size: '500x500',
            style: '4',
            color: '0f1056',
            format: 'png',
            pngMode: 'styled',
            viewer: '0'
        })
    })
    return await res.buffer()
}

const toQuotable = (sentMsg, chat, messageContent) => {
    if (!sentMsg) return null
    if (sentMsg.key && sentMsg.message) return sentMsg
    let id = sentMsg.key?.id || sentMsg.id || sentMsg.messageID || sentMsg?.msg?.key?.id
    if (!id) {
        console.log('[sewabot] gagal ambil message id buat quoted:', sentMsg)
        return null
    }
    return {
        key: { id, remoteJid: chat, fromMe: true },
        message: messageContent
    }
}

const msToDurationText = (ms) => {
    let days = Math.floor(ms / DAY)
    let hours = Math.floor((ms % DAY) / 3600000)
    let parts = []
    if (days > 0) parts.push(`${days} hari`)
    if (hours > 0) parts.push(`${hours} jam`)
    return parts.length ? parts.join(' ') : '< 1 jam'
}

const extractGroupId = (result) => {
    if (!result) return null
    if (typeof result === 'string') return result
    if (typeof result === 'object') {
        return result.jid || result.id || null
    }
    return null
}

const buildPricelistText = (_p) => {
    let byCategory = {}
    for (let [key, pkg] of Object.entries(PRICELIST)) {
        byCategory[pkg.category] = byCategory[pkg.category] || []
        byCategory[pkg.category].push({ key, ...pkg })
    }

    let text = `╭─「 *LIST SEWABOT* 」\n│\n`
    for (let cat of CATEGORY_ORDER) {
        if (!byCategory[cat]) continue
        text += `│ *${cat}*\n`
        for (let item of byCategory[cat]) {
            text += `│ • \`${item.key}\` — Rp${item.price.toLocaleString('id-ID')}/grup (${msToDurationText(item.durationMs)})\n`
        }
        text += `│\n`
    }
    text += `╰─\n\nCara pesan (1 grup):\n*${_p}sewabot <kode paket>*\nContoh: *${_p}sewabot perbulan1*\n\nCara pesan (banyak grup):\n*${_p}sewabot <kode paket> <jumlah grup>*\nContoh: *${_p}sewabot perminggu1 2* (2 grup, seminggu = Rp5.000 x 2 = Rp10.000)\n\nMax ${MAX_GROUPS_PER_ORDER} grup per order.`
    return text
}

const buildCaption = (trx, pkg, _p, groupCount) => {
    let expired = new Date(trx.expiredAt)
    return `
┌ ◦ *SEWA BOT - ${pkg.label}*
│ ◦ ID Trx     : ${trx.transactionId}
│ ◦ Jumlah Grup: ${groupCount}
│ ◦ Harga/Grup : Rp${pkg.price.toLocaleString('id-ID')}
│ ◦ Nominal    : Rp${Number(trx.amount).toLocaleString('id-ID')}
│ ◦ Biaya      : Rp${Number(trx.fee).toLocaleString('id-ID')}
│ ◦ Total Bayar: Rp${Number(trx.totalAmount).toLocaleString('id-ID')}
│ ◦ Status     : ${trx.status}
│ ◦ Kadaluarsa : ${expired.toLocaleString('id-ID')}
└ ◦ Link Bayar : ${trx.paymentUrl}

Scan QR di atas untuk membayar.
Cek status: *${_p}ceksewa*
Batalkan   : *${_p}cancelsewa*
`.trim()
}

// ==== Auto-polling status pembayaran sewa ====
function startPolling(conn, chat, trx, qrMsg, _p, pkg, kode, buyer, groupCount, m) {
    if (global.sewaPolling[trx.transactionId]) return

    let expiredTime = new Date(trx.expiredAt).getTime()

    let intervalId = setInterval(async () => {
        try {
            let res = await fetch(`${BTZPAYGATE_BASE_URL}/api/qris/transaction/${trx.transactionId}?key=${trx.accessKey}`)
            let json = await res.json()
            if (!json.success) return
            let data = json.data
            let now = Date.now()

            if (data.status === 'sukses' || data.status === 'success') {
                clearInterval(intervalId)
                delete global.sewaPolling[trx.transactionId]
                clearPendingSewa(chat, buyer)

                // simpan state nunggu link grup (bisa lebih dari 1 grup)
                setAwaiting(chat, buyer, {
                    transactionId: trx.transactionId,
                    packageKey: kode,
                    durationMs: pkg.durationMs,
                    by: buyer,
                    groupCount,
                    joinedCount: 0,
                    joinedGroupIds: [],
                    expireAt: Date.now() + LINK_TIMEOUT
                })

                await conn.sendMessage(chat, {
                    text: `✅ *Pembayaran sewa bot "${pkg.label}" berhasil diterima!*\nID: ${trx.transactionId}\nJumlah grup dipesan: *${groupCount}*\n\nSekarang, silakan kirimkan *link invite grup WhatsApp* kamu di chat ini.\nKalau grupnya lebih dari 1, boleh kirim sekaligus (satu link per baris) atau kirim satu-satu, nanti diproses berurutan.\n\n⚠️ *Pastikan* fitur *Persetujuan Anggota Baru* (Approve New Members) di tiap grup sudah *DIMATIKAN*, supaya bot bisa langsung join otomatis.\n\nKamu punya waktu ${LINK_TIMEOUT / 60000} menit untuk mengirim semua link. Kalau lewat, hubungi owner ya.`
                }, { quoted: m })
                return
            }

            if (data.status === 'expired' || now > expiredTime) {
                clearInterval(intervalId)
                delete global.sewaPolling[trx.transactionId]
                clearPendingSewa(chat, buyer)
                if (qrMsg?.key) await conn.sendMessage(chat, { delete: qrMsg.key }).catch(() => { })
                await conn.sendMessage(chat, {
                    text: `⌛ Transaksi sewa bot dengan ID *${trx.transactionId}* sudah *expired*. QR sebelumnya sudah dihapus.\nSilakan pesan ulang dengan *${_p}sewabot*.`
                }, { quoted: m })
                return
            }

            if (data.status === 'cancel' || data.status === 'cancelled') {
                clearInterval(intervalId)
                delete global.sewaPolling[trx.transactionId]
                clearPendingSewa(chat, buyer)
                if (qrMsg?.key) await conn.sendMessage(chat, { delete: qrMsg.key }).catch(() => { })
                await conn.sendMessage(chat, {
                    text: `❌ Transaksi sewa bot dengan ID *${trx.transactionId}* telah *dibatalkan*. QR sebelumnya sudah dihapus.`
                }, { quoted: m })
                return
            }
            // masih pending, lanjut polling
        } catch (e) {
            console.log('[sewabot-polling] error:', e)
        }
    }, POLL_INTERVAL)

    global.sewaPolling[trx.transactionId] = intervalId
}

// ====================================================================
// Command handler: .sewabot, .ceksewa, .cancelsewa
// ====================================================================
let handler = async (m, { conn, usedPrefix: _p, args = [], command }) => {
    try {
        // Akses fitur cuma boleh dari grup sewabot resmi punya owner
        let sewaGroupJid = getSewaGroupJid()
        if (!sewaGroupJid) {
            return m.reply(`Fitur sewabot belum dikonfigurasi owner (global.sewaGroupJid belum di-set).`)
        }
        if (m.chat !== sewaGroupJid) {
            let linkTeks = global.sewaGroupLink ? `\n\nJoin group sewabot resmi di sini:\n${global.sewaGroupLink}` : ''
            return m.reply(`Kamu harus join *group sewabot owner* untuk mengakses fitur-fitur ini!${linkTeks}`)
        }
        const apikey = getApiKey()
        if (!apikey) {
            return m.reply(`Inisialasi ApiKey dari web.btzpay.my.id untuk menggunakan fitur ini`)
        }
        // ==== .sewabot [kode paket] [jumlah grup] ====
        if (/^sewabot$/i.test(command)) {
            let kode = (args[0] || '').toLowerCase().trim()

            if (!kode) {
                return m.reply(buildPricelistText(_p))
            }
            let pkg = PRICELIST[kode]
            if (!pkg) {
                return m.reply(`Paket *${kode}* tidak ditemukan.\n\n${buildPricelistText(_p)}`)
            }
            // ==== parsing jumlah grup (default 1) ====
            let groupCount = 1
            if (args[1]) {
                let parsed = parseInt(args[1], 10)
                if (!Number.isInteger(parsed) || parsed < 1) {
                    return m.reply(`Jumlah grup harus angka bulat minimal 1.\nContoh: *${_p}sewabot ${kode} 2*`)
                }
                if (parsed > MAX_GROUPS_PER_ORDER) {
                    return m.reply(`Maksimal ${MAX_GROUPS_PER_ORDER} grup per order ya.`)
                }
                groupCount = parsed
            }
            let totalPrice = pkg.price * groupCount
            // masih ada tahap "nunggu link grup" yang belum kelar (punya si pengirim ini)? jangan bisa beli baru dulu
            let awaiting = getAwaiting(m.chat, m.sender)
            if (awaiting && Date.now() < awaiting.expireAt) {
                let remaining = awaiting.groupCount - awaiting.joinedCount
                return m.reply(`Kamu masih punya pembelian sewa yang menunggu *link grup WhatsApp* (sisa ${remaining} grup lagi).\nSilakan kirim link grupnya dulu di chat ini sebelum pesan paket baru.`)
            }
            // masih ada trx pending yang belum dibayar (punya si pengirim ini)? tampilin lagi QR-nya
            let pending = getPendingSewa(m.chat, m.sender)
            if (pending) {
                let cekRes = await fetch(`${BTZPAYGATE_BASE_URL}/api/qris/transaction/${pending.transactionId}?key=${pending.accessKey}`).catch(() => null)
                let cekJson = cekRes ? await cekRes.json().catch(() => null) : null
                let stillPending = cekJson?.success && cekJson.data.status === 'pending' && Date.now() < new Date(pending.expiredAt).getTime()
                if (stillPending) {
                    let qrBuffer = await genQrBuffer(pending.qrisString)
                    let total = Number(pending.totalAmount) || (Number(pending.amount) + Number(pending.fee || 0))
                    return conn.sendMessage(
                        m.chat,
                        {
                            image: qrBuffer,
                            caption: `⚠️ Kamu masih punya transaksi sewa yang belum selesai!\n\nSilakan *scan QR ini* untuk menyelesaikan pembayaran, atau batalkan dulu dengan:\n*${_p}cancelsewa*\n\nID Trx: ${pending.transactionId}\nPaket: ${pending.packageKey}\nJumlah Grup: ${pending.groupCount || 1}\nNominal: Rp${Number(pending.amount).toLocaleString('id-ID')}\nBiaya  : Rp${Number(pending.fee || 0).toLocaleString('id-ID')}\nTotal  : Rp${Number(total).toLocaleString('id-ID')}`
                        },
                        { quoted: m }
                    )
                } else {
                    clearPendingSewa(m.chat, m.sender)
                }
            }
            // Cek batas maksimal grup per user (hanya hitung grup yang masih aktif)
            let maxGroups = typeof global.sewaMaxGroupsPerUser === 'number' ? global.sewaMaxGroupsPerUser : 20
            if (maxGroups > 0) {
                let allChats = global.db.data.chats || {}
                let userActiveGroups = Object.entries(allChats).filter(([gid, gc]) => {
                    if (!gc || !gc.expired || Date.now() >= gc.expired) return false
                    return Array.isArray(gc.sewaBy) ? gc.sewaBy.includes(m.sender) : gc.sewaBy === m.sender
                })
                if (userActiveGroups.length >= maxGroups) {
                    return m.reply(`❌ Kamu sudah mencapai batas maksimal *${maxGroups}* grup sewa aktif.\nHabis dulu/grup yang expired sebelum pesan baru.`)
                }
            }
            // Race condition: cooldown 5 detik per user biar ga double order
            let cooldownUntil = global.sewaCooldown[m.sender] || 0
            if (Date.now() < cooldownUntil) {
                return m.reply(`⏳ Tunggu beberapa detik sebelum order lagi.`)
            }
            m.reply(`⏳ Sedang membuat transaksi QRIS untuk paket *${pkg.label}* (${groupCount} grup)...`)
            let createRes = await fetch(`${BTZPAYGATE_BASE_URL}/api/qris/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apikey,
                    amount: totalPrice,
                    fee: getFee(totalPrice),
                    notes: `Sewa Bot - ${pkg.label} x${groupCount} grup`,
                    timeout: 900000,
                    metadata: {
                        orderId: `SEWA-${kode}-${Date.now()}`,
                        sender: m.sender,
                        packageKey: kode,
                        groupCount
                    },
                    customerInfo: {
                        name: m.pushName || m.sender.split('@')[0],
                        email: '',
                        phone: m.sender.split('@')[0]
                    }
                })
            })
            let createJson = await createRes.json()

            if (!createJson.success) {
                console.log('[sewabot] gagal membuat transaksi:', createJson)
                return m.reply(`❌ Gagal membuat transaksi.\n${errText(createJson)}`)
            }

            let trx = createJson.data
            if (!trx.qrisString) {
                return m.reply(`❌ QRIS string tidak tersedia untuk transaksi ini.\nID: ${trx.transactionId}`)
            }

            let qrBuffer = await genQrBuffer(trx.qrisString)
            let caption = buildCaption(trx, pkg, _p, groupCount)

            let qrMsgRaw = await conn.sendMessage(
                m.chat,
                { image: qrBuffer, caption },
                { quoted: m }
            )
            let qrMsg = toQuotable(qrMsgRaw, m.chat, { imageMessage: { caption } })
            setPendingSewa(m.chat, m.sender, {
                transactionId: trx.transactionId,
                accessKey: trx.accessKey,
                qrisString: trx.qrisString,
                amount: trx.amount,
                fee: trx.fee,
                totalAmount: trx.totalAmount,
                expiredAt: trx.expiredAt,
                packageKey: kode,
                groupCount,
                by: m.sender
            })
            startPolling(conn, m.chat, trx, qrMsg, _p, pkg, kode, m.sender, groupCount, m)
            // Set cooldown 5 detik setelah order berhasil
            global.sewaCooldown[m.sender] = Date.now() + 5000
            return
        };
        // ==== .ceksewa ====
        if (/^ceksewa$/i.test(command)) {
            let pending = getPendingSewa(m.chat, m.sender)
            if (!pending) return m.reply(`Kamu belum punya transaksi sewa yang berjalan.\nBuat dulu dengan *${_p}sewabot*`)

            let res = await fetch(`${BTZPAYGATE_BASE_URL}/api/qris/transaction/${pending.transactionId}?key=${pending.accessKey}`)
            let json = await res.json()
            if (!json.success) {
                console.log('[sewabot] gagal cek status:', json)
                return m.reply(`❌ Gagal mengambil status transaksi.\n${errText(json)}`)
            }

            let trx = json.data
            let statusEmoji = trx.status === 'sukses' ? '✅' : trx.status === 'pending' ? '⏳' : '❌'
            let text = `
┌ ◦ *STATUS SEWA BOT*
│ ◦ ID Trx  : ${trx.transactionId}
│ ◦ Paket   : ${pending.packageKey}
│ ◦ Jml Grup: ${pending.groupCount || 1}
│ ◦ Nominal : Rp${Number(trx.amount || 0).toLocaleString('id-ID')}
│ ◦ Status  : ${statusEmoji} ${trx.status}
│ ◦ Dibuat  : ${trx.createdAt ? new Date(trx.createdAt).toLocaleString('id-ID') : '-'}
│ ◦ Dibayar : ${trx.paidAt ? new Date(trx.paidAt).toLocaleString('id-ID') : '-'}
└
`.trim()
            return m.reply(text)
        }
        // .infosewa
        // nampilin semua grup yang lagi/pernah disewa oleh user yang manggil command ini
        if (/^infosewa$/i.test(command)) {
            let allChats = global.db.data.chats || {}
            let myGroups = Object.entries(allChats).filter(([gid, gc]) => {
                if (!gc || !gc.expired) return false
                return Array.isArray(gc.sewaBy) ? gc.sewaBy.includes(m.sender) : gc.sewaBy === m.sender
            })

            if (!myGroups.length) {
                return m.reply(`Kamu belum punya riwayat sewa bot di grup manapun.\nPesan dulu dengan *${_p}sewabot*`)
            }
            // urutin: yang masih aktif duluan, terbaru duluan
            let now = Date.now()
            myGroups.sort((a, b) => b[1].expired - a[1].expired)
            let aktif = myGroups.filter(([, gc]) => gc.expired > now)
            let habis = myGroups.filter(([, gc]) => gc.expired <= now)
            let text = `╭─「 *INFO SEWA BOT* 」\n│  ◦ Total grup tercatat: ${myGroups.length}\n│  ◦ Masih aktif: ${aktif.length}\n│  ◦ Sudah habis: ${habis.length}\n│\n`
            let renderGroup = async ([gid, gc]) => {
                let nama = gid
                try {
                    let meta = await conn.groupMetadata(gid)
                    if (meta?.subject) nama = meta.subject
                } catch (e) { }
                let sisaMs = gc.expired - now
                let statusText = sisaMs > 0 ? `✅ Aktif (sisa ${msToDurationText(sisaMs)})` : `❌ Habis`
                return `│ *${nama}*\n│  ID     : ${gid}\n│  Paket  : ${gc.sewaPackage || '-'}\n│  Status : ${statusText}\n│  Expired: ${new Date(gc.expired).toLocaleString('id-ID')}\n│\n`
            }
            if (aktif.length) {
                text += `│ ── Grup Aktif ──\n│\n`
                for (let g of aktif) text += await renderGroup(g)
            }
            if (habis.length) {
                text += `│ ── Grup Habis Masa Aktif ──\n│\n`
                for (let g of habis) text += await renderGroup(g)
            }
            text += `╰─\n\nMau perpanjang? Pesan lagi dengan *${_p}sewabot*`
            return m.reply(text.trim())
        };
        // .cancelsewa 
        if (/^cancelsewa$/i.test(command)) {
            let pending = getPendingSewa(m.chat, m.sender)
            if (!pending) return m.reply(`Kamu belum punya transaksi sewa yang berjalan.\nBuat dulu dengan *${_p}sewabot*`)

            let res = await fetch(`${BTZPAYGATE_BASE_URL}/api/qris/cancel/${pending.transactionId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ apikey, reason: 'cancelled_by_user' })
            })
            let json = await res.json()
            if (!json.success) {
                console.log('[sewabot] gagal cancel transaksi:', json)
                return m.reply(`❌ Gagal membatalkan transaksi.\n${errText(json)}`)
            }

            if (global.sewaPolling[pending.transactionId]) {
                clearInterval(global.sewaPolling[pending.transactionId])
                delete global.sewaPolling[pending.transactionId]
            };
            clearPendingSewa(m.chat, m.sender)
            return conn.sendMessage(m.chat, {
                text: `✅ Transaksi sewa ${json.data.transactionId} berhasil dibatalkan.\nStatus: ${json.data.status}`
            }, { quoted: m })
        }
    } catch (e) {
        console.log(e)
        throw e
    };
};

// ====================================================================
// Listener pasif: nunggu user kirim link invite grup setelah bayar
// Support multi-grup: bisa kirim beberapa link sekaligus (per baris)
// atau nyicil beberapa pesan, sampai groupCount kepenuhin.
// ====================================================================
handler.before = async function (m) {
    try {
        if (!m.text) return
        let awaiting = getAwaiting(m.chat, m.sender)
        if (!awaiting) return
        // hanya pembeli yang bisa nyelesain proses ini
        if (m.sender !== awaiting.by) return
        // Race condition: lock per user biar ga double process link
        if (global.sewaProcessing[m.sender]) return
        if (Date.now() > awaiting.expireAt) {
            clearAwaiting(m.chat, m.sender)
            await this.sendMessage(m.chat, {
                text: `⌛ Waktu untuk mengirim link grup sudah habis.\nGrup yang sudah ke-join (${awaiting.joinedCount}/${awaiting.groupCount}) tetap aktif. Sisanya hubungi owner untuk dibantu manual.`
            })
            return
        }
        // ambil SEMUA link invite yang ada di pesan (bisa lebih dari 1, per baris/spasi)
        let matches = [...m.text.matchAll(/chat\.whatsapp\.com\/([0-9A-Za-z]+)/gi)]
        if (!matches.length) return // bukan link grup, biarin pesan lain lewat normal
        let remaining = awaiting.groupCount - awaiting.joinedCount
        if (remaining <= 0) {
            clearAwaiting(m.chat, m.sender)
            return
        }
        let inviteCodes = matches.map(x => x[1]).slice(0, remaining) // jangan proses lebih dari sisa kuota
        if (matches.length > remaining) {
            await this.reply(m.chat, `⚠️ Kamu kirim ${matches.length} link, tapi sisa kuota order kamu cuma ${remaining} grup. Cuma ${remaining} link pertama yang diproses.`, m)
        }
        // Set processing lock sebelum mulai proses
        global.sewaProcessing[m.sender] = true
        await this.reply(m.chat, `🔄 Sedang memproses ${inviteCodes.length} link grup, tunggu sebentar...`, m)
        for (let inviteCode of inviteCodes) {
            let raw
            try {
                raw = await this.groupAcceptInvite(inviteCode)
            } catch (e) {
                console.log('[sewabot-before] gagal join grup:', e)
                await this.reply(m.chat, `❌ Gagal join ke salah satu grup (kode: ${inviteCode}).\nKemungkinan penyebab:\n- Link invite sudah tidak berlaku\n- Fitur *Persetujuan Anggota Baru* masih aktif\n\nMatikan dulu pengaturannya, lalu kirim ulang link invite grup itu.`, m)
                continue
            }
            let groupId = extractGroupId(raw)
            if (!groupId) {
                console.log('[sewabot-before] groupId tidak ketemu dari hasil groupAcceptInvite:', raw)
                await this.reply(m.chat, `❌ Gagal join ke salah satu grup (kode: ${inviteCode}), kemungkinan masih butuh approval admin.\nMatikan dulu *Persetujuan Anggota Baru* di pengaturan grup, lalu kirim ulang link invite grup itu.`, m)
                continue
            }
            // set/tambah masa aktif sewa di grup yang baru di-join
            global.db.data.chats[groupId] = global.db.data.chats[groupId] || {}
            let gc = global.db.data.chats[groupId]
            let now = Date.now()
            if (gc.expired && now < gc.expired) {
                gc.expired += awaiting.durationMs
            } else {
                gc.expired = now + awaiting.durationMs
            }
            gc.expiredWarned = false // reset warning flag saat renewal
            // catat siapa yang nyewa grup ini (bisa lebih dari 1 orang), dipake buat .infosewa
            if (!Array.isArray(gc.sewaBy)) gc.sewaBy = gc.sewaBy ? [gc.sewaBy] : []
            if (!gc.sewaBy.includes(awaiting.by)) gc.sewaBy.push(awaiting.by)
            gc.sewaPackage = awaiting.packageKey
            gc.sewaLastOrderAt = now
            let expiredDate = new Date(gc.expired).toLocaleString('id-ID')
            awaiting.joinedCount += 1
            awaiting.joinedGroupIds.push(groupId)
            await this.sendMessage(m.chat, {
                text: `✅ *Bot berhasil join ke grup!* (${awaiting.joinedCount}/${awaiting.groupCount})\n\nID Grup: ${groupId}\nPaket: ${awaiting.packageKey}\nMasa aktif sampai: ${expiredDate}`
            })
            try {
                await this.sendMessage(groupId, {
                    text: `[ *Groups Notifikasi* ]\n\nBot telah bergabung dan diaktifkan di grup ini.\nMasa aktif sampai: ${expiredDate}\nTerima kasih telah sewa bot kami 🙏`
                })
            } catch (e) {
                console.log('[sewabot-before] gagal kirim notif ke grup:', e)
            }
        }
        if (awaiting.joinedCount >= awaiting.groupCount) {
            clearAwaiting(m.chat, m.sender)
            await this.sendMessage(m.chat, {
                text: `🎉 Semua ${awaiting.groupCount} grup sudah berhasil di-setup. Terima kasih sudah sewa bot kami 🙏`
            })
        } else {
            let sisa = awaiting.groupCount - awaiting.joinedCount
            await this.sendMessage(m.chat, {
                text: `Masih ada ${sisa} grup lagi yang belum kamu kirim link-nya. Silakan kirim link invite grup berikutnya.`
            }, { quoted: m })
        }
    } catch (e) {
        console.log(e);
        throw e;
    } finally {
        // Clear processing lock setelah selesai (baik sukses maupun gagal)
        delete global.sewaProcessing[m.sender]
    }
}

handler.help = ['sewabot [kode paket] [jumlah grup]', 'ceksewa', 'cancelsewa', 'infosewa']
handler.tags = ['info']
handler.command = /^(sewabot|ceksewa|cancelsewa|infosewa)$/i
handler.group = true

export default handler