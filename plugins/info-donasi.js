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

// in-memory registry biar ga dobel polling per transaksi
global.donasiPolling = global.donasiPolling || {}

const getChatData = (chat) => {
    global.db.data.chats = global.db.data.chats || {}
    global.db.data.chats[chat] = global.db.data.chats[chat] || {}
    return global.db.data.chats[chat]
}

const clearPending = (chat) => {
    let cd = getChatData(chat)
    delete cd.pendingDonasi
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

// Beberapa wrapper conn.sendMessage() ga balikin proto message lengkap {key, message}
// yang dibutuhin WA buat render quote. Ini fallback biar tetep bisa di-quote.
const toQuotable = (sentMsg, chat, messageContent) => {
    if (!sentMsg) return null
    if (sentMsg.key && sentMsg.message) return sentMsg // udah proto lengkap, pake langsung
    let id = sentMsg.key?.id || sentMsg.id || sentMsg.messageID || sentMsg?.msg?.key?.id
    if (!id) {
        console.log('[donasi] gagal ambil message id buat quoted, cek struktur return conn.sendMessage:', sentMsg)
        return null
    }
    return {
        key: { id, remoteJid: chat, fromMe: true },
        message: messageContent
    }
}

const buildCaption = (trx, _p) => {
    let expired = new Date(trx.expiredAt)
    return `
┌ ◦ *DONASI QRIS*
│ ◦ ID Trx     : ${trx.transactionId}
│ ◦ Nominal    : Rp${Number(trx.amount).toLocaleString('id-ID')}
│ ◦ Biaya      : Rp${Number(trx.fee).toLocaleString('id-ID')}
│ ◦ Total Bayar: Rp${Number(trx.totalAmount).toLocaleString('id-ID')}
│ ◦ Status     : ${trx.status}
│ ◦ Catatan    : ${trx.notes}
│ ◦ Kadaluarsa : ${expired.toLocaleString('id-ID')}
└ ◦ Link Bayar : ${trx.paymentUrl}

Scan QR di atas untuk membayar.
Cek status: *${_p}cekdonasi*
Batalkan   : *${_p}canceldonasi*
`.trim()
}

// ==== Auto-polling status ====
function startPolling(conn, chat, trx, qrMsg, _p, m) {
    if (global.donasiPolling[trx.transactionId]) return

    let expiredTime = new Date(trx.expiredAt).getTime()
    let apikey = getApiKey()

    let intervalId = setInterval(async () => {
        try {
            let res = await fetch(`${BTZPAYGATE_BASE_URL}/api/qris/transaction/${trx.transactionId}?key=${trx.accessKey}`)
            let json = await res.json()
            if (!json.success) return
            let data = json.data
            let now = Date.now()

            if (data.status === 'sukses' || data.status === 'success') {
                clearInterval(intervalId)
                delete global.donasiPolling[trx.transactionId]
                clearPending(chat)
                await conn.sendMessage(chat, {
                    text: `✅ *Donasi berhasil diterima!*\nID: ${trx.transactionId}\nNominal: Rp${Number(data.amount || trx.amount).toLocaleString('id-ID')}\nTerima kasih atas donasinya 🙏`
                }, { quoted: m })
                return
            }

            if (data.status === 'expired' || now > expiredTime) {
                clearInterval(intervalId)
                delete global.donasiPolling[trx.transactionId]
                clearPending(chat)
                if (qrMsg?.key) await conn.sendMessage(chat, { delete: qrMsg.key }).catch(() => {})
                await conn.sendMessage(chat, {
                    text: `⌛ Donasi dengan ID *${trx.transactionId}* sudah *expired*. QR sebelumnya sudah dihapus.\nSilakan buat donasi baru dengan *${_p}donasi*.`
                }, { quoted: m })
                return
            }

            if (data.status === 'cancel' || data.status === 'cancelled') {
                clearInterval(intervalId)
                delete global.donasiPolling[trx.transactionId]
                clearPending(chat)
                if (qrMsg?.key) await conn.sendMessage(chat, { delete: qrMsg.key }).catch(() => {})
                await conn.sendMessage(chat, {
                    text: `❌ Donasi dengan ID *${trx.transactionId}* telah *dibatalkan*. QR sebelumnya sudah dihapus.`
                }, { quoted: m })
                return
            }
            // masih pending, lanjut polling
        } catch (e) {
            console.log('[donasi-polling] error:', e)
        }
    }, POLL_INTERVAL)

    global.donasiPolling[trx.transactionId] = intervalId
}

let handler = async (m, { conn, usedPrefix: _p, args = [], command }) => {
    try {
        const apikey = getApiKey()
        if (!apikey) {
            return m.reply(`Inisialasi ApiKey dari web.btzpay.my.id untuk menggunakan fitur ini`)
        }

        // ==== .donasi <amount> [catatan] ====
        if (/^donasi$/i.test(command)) {
            let cd = getChatData(m.chat)
            let pending = cd.pendingDonasi

            // Kalau masih ada trx pending punya user yg sama, cek dulu statusnya biar akurat
            if (pending) {
                let cekRes = await fetch(`${BTZPAYGATE_BASE_URL}/api/qris/transaction/${pending.transactionId}?key=${pending.accessKey}`).catch(() => null)
                let cekJson = cekRes ? await cekRes.json().catch(() => null) : null
                let stillPending = cekJson?.success && cekJson.data.status === 'pending' && Date.now() < new Date(pending.expiredAt).getTime()

                if (stillPending) {
                    let qrBuffer = await genQrBuffer(pending.qrisString)
                    return conn.sendMessage(
                        m.chat,
                        {
                            image: qrBuffer,
                            caption: `⚠️ Kamu masih punya donasi yang belum selesai!\n\nSilakan *scan QR ini* untuk menyelesaikan pembayaran, atau batalkan dulu dengan:\n*${_p}canceldonasi*\n\nID Trx: ${pending.transactionId}\nNominal: Rp${Number(pending.amount).toLocaleString('id-ID')}`
                        },
                        { quoted: m }
                    )
                } else {
                    // trx lama udah selesai/expired/cancel, bersihin
                    clearPending(m.chat)
                }
            }

            let amount = parseInt(args[0])
            if (!amount || isNaN(amount) || amount < 100) {
                return m.reply(`Masukkan nominal donasi (minimal 100).\n\nContoh:\n${_p}donasi 10000 Terima kasih supportnya`)
            }
            let notes = args.slice(1).join(' ') || `Donasi dari ${m.sender.split('@')[0]}`

            m.reply('⏳ Sedang membuat transaksi QRIS...')

            let createRes = await fetch(`${BTZPAYGATE_BASE_URL}/api/qris/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apikey,
                    amount,
                    fee: getFee(amount),
                    notes,
                    timeout: 900000,
                    metadata: {
                        orderId: `DONASI-${Date.now()}`,
                        sender: m.sender
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
                console.log('[donasi] gagal membuat transaksi:', createJson)
                return m.reply(`❌ Gagal membuat transaksi.\n${errText(createJson)}`)
            }

            let trx = createJson.data
            if (!trx.qrisString) {
                return m.reply(`❌ QRIS string tidak tersedia untuk transaksi ini.\nID: ${trx.transactionId}`)
            }

            let qrBuffer = await genQrBuffer(trx.qrisString)
            let caption = buildCaption(trx, _p)

            let qrMsgRaw = await conn.sendMessage(
                m.chat,
                { image: qrBuffer, caption },
                { quoted: m }
            )
            let qrMsg = toQuotable(qrMsgRaw, m.chat, { imageMessage: { caption } })

            // Simpan state pending + qrisString biar bisa regenerate/hapus nanti
            let cd2 = getChatData(m.chat)
            cd2.pendingDonasi = {
                transactionId: trx.transactionId,
                accessKey: trx.accessKey,
                qrisString: trx.qrisString,
                amount: trx.amount,
                expiredAt: trx.expiredAt,
                by: m.sender
            }

            startPolling(conn, m.chat, trx, qrMsg, _p, m)
            return
        }

        // ==== .cekdonasi [transactionId|accessKey] ====
        // Tanpa argumen -> pakai pendingDonasi yg tersimpan di chat ini.
        // Argumen tetap bisa dipakai buat cek trx lain (manual override).
        if (/^cekdonasi$/i.test(command)) {
            let input = args.join(' ').trim()
            let transactionId, accessKey

            if (input) {
                if (input.includes('|')) {
                    [transactionId, accessKey] = input.split('|').map(s => s.trim())
                } else {
                    transactionId = input
                    accessKey = getChatData(m.chat).pendingDonasi?.accessKey
                }
            } else {
                let pending = getChatData(m.chat).pendingDonasi
                if (!pending) return m.reply(`Kamu belum punya donasi yang berjalan.\nBuat dulu dengan *${_p}donasi <nominal>*`)
                transactionId = pending.transactionId
                accessKey = pending.accessKey
            }

            if (!transactionId || !accessKey) {
                return m.reply(`Gagal menemukan data transaksi. Kalau mau cek trx lain, gunakan:\n${_p}cekdonasi <transactionId>|<accessKey>`)
            }

            let res = await fetch(`${BTZPAYGATE_BASE_URL}/api/qris/transaction/${transactionId}?key=${accessKey}`)
            let json = await res.json()

            if (!json.success) {
                console.log('[donasi] gagal cek status:', json)
                return m.reply(`❌ Gagal mengambil status transaksi.\n${errText(json)}`)
            }

            let trx = json.data
            let statusEmoji = trx.status === 'sukses' ? '✅' : trx.status === 'pending' ? '⏳' : '❌'

            let text = `
┌ ◦ *STATUS DONASI*
│ ◦ ID Trx  : ${trx.transactionId}
│ ◦ Nominal : Rp${Number(trx.amount || 0).toLocaleString('id-ID')}
│ ◦ Total   : Rp${Number(trx.totalAmount || 0).toLocaleString('id-ID')}
│ ◦ Status  : ${statusEmoji} ${trx.status}
│ ◦ Catatan : ${trx.notes || '-'}
│ ◦ Dibuat  : ${trx.createdAt ? new Date(trx.createdAt).toLocaleString('id-ID') : '-'}
│ ◦ Dibayar : ${trx.paidAt ? new Date(trx.paidAt).toLocaleString('id-ID') : '-'}
└
`.trim()

            return m.reply(text)
        }

        // ==== .canceldonasi [transactionId] [alasan] ====
        // Tanpa argumen -> cancel pendingDonasi yg tersimpan di chat ini.
        // Argumen pertama tetap bisa dipakai buat cancel trx lain (manual override).
        if (/^canceldonasi$/i.test(command)) {
            let pending = getChatData(m.chat).pendingDonasi
            let transactionId, reason

            if (args[0]) {
                transactionId = args[0]
                reason = args.slice(1).join(' ') || 'cancelled_by_user'
            } else {
                if (!pending) return m.reply(`Kamu belum punya donasi yang berjalan.\nBuat dulu dengan *${_p}donasi <nominal>*`)
                transactionId = pending.transactionId
                reason = 'cancelled_by_user'
            }

            let res = await fetch(`${BTZPAYGATE_BASE_URL}/api/qris/cancel/${transactionId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ apikey, reason })
            })
            let json = await res.json()

            if (!json.success) {
                console.log('[donasi] gagal cancel transaksi:', json)
                return m.reply(`❌ Gagal membatalkan transaksi.\n${errText(json)}`)
            }

            // stop polling & bersihin state kalau ini trx yg sedang di-track
            if (global.donasiPolling[transactionId]) {
                clearInterval(global.donasiPolling[transactionId])
                delete global.donasiPolling[transactionId]
            }
            let cd = getChatData(m.chat)
            if (cd.pendingDonasi?.transactionId === transactionId) {
                clearPending(m.chat)
            }

            return conn.sendMessage(m.chat, {
                text: `✅ Transaksi ${json.data.transactionId} berhasil dibatalkan.\nStatus: ${json.data.status}`
            }, { quoted: m })
        }

    } catch (e) {
        console.log(e)
        throw e
    }
}

handler.help = ['donasi <nominal> [catatan]', 'cekdonasi [id|key]', 'canceldonasi [id] [alasan]']
handler.tags = ['tools']
handler.command = /^(donasi|cekdonasi|canceldonasi)$/i

export default handler