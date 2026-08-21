import fetch from 'node-fetch'

const BTZPAYGATE_BASE_URL = 'https://web.btzpay.my.id'
const getApiKey = () => global.config?.btzPaygateApiKey || global.btzPaygateApiKey
const errText = (obj) => typeof obj?.message === 'string' && obj.message ? obj.message : 'Terjadi kesalahan, silakan coba lagi nanti.'
 
const getFee = (amount) => {
    let percent = typeof global.feeBtzPaygate === 'number' ? global.feeBtzPaygate : 0.7
    return Math.round(Number(amount) * percent / 100)
}

const POLL_INTERVAL = 15000

global.premiumPolling = global.premiumPolling || {}
global.premiumCooldown = global.premiumCooldown || {}

const getChatData = (chat) => {
    global.db.data.chats = global.db.data.chats || {}
    global.db.data.chats[chat] = global.db.data.chats[chat] || {}
    return global.db.data.chats[chat]
}

const getPendingPremium = (chat, sender) => getChatData(chat).pendingPremium?.[sender] || null

const setPendingPremium = (chat, sender, data) => {
    let cd = getChatData(chat)
    cd.pendingPremium = cd.pendingPremium || {}
    cd.pendingPremium[sender] = data
}

const clearPendingPremium = (chat, sender) => {
    let cd = getChatData(chat)
    if (cd.pendingPremium && sender) delete cd.pendingPremium[sender]
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
        console.log('[premium] gagal ambil message id buat quoted:', sentMsg)
        return null
    }
    return {
        key: { id, remoteJid: chat, fromMe: true },
        message: messageContent
    }
}

const DAY = 24 * 60 * 60 * 1000

const PRICELIST = {
    '7d': { label: 'Premium 7 Hari', price: 3000, durationMs: 7 * DAY },
    '30d': { label: 'Premium 30 Hari', price: 5000, durationMs: 30 * DAY },
}

const buildPricelistText = (_p) => {
    let text = `╭─「 *LIST PREMIUM* 」\n│\n`
    for (let [key, pkg] of Object.entries(PRICELIST)) {
        text += `│ • \`${key}\` — Rp${pkg.price.toLocaleString('id-ID')} (${Math.floor(pkg.durationMs / DAY)} hari)\n`
    }
    text += `╰─\n\nCara pesan:\n*${_p}buyprem <kode paket>*\nContoh: *${_p}buyprem 30d*\n\nFitur premium:\n- Akses semua fitur tanpa limit\n- Priority response`
    return text
}

const buildCaption = (trx, pkg, _p) => {
    let expired = new Date(trx.expiredAt)
    return `
┌ ◦ *PREMIUM - ${pkg.label}*
│ ◦ ID Trx     : ${trx.transactionId}
│ ◦ Harga      : Rp${pkg.price.toLocaleString('id-ID')}
│ ◦ Nominal    : Rp${Number(trx.amount).toLocaleString('id-ID')}
│ ◦ Biaya      : Rp${Number(trx.fee).toLocaleString('id-ID')}
│ ◦ Total Bayar: Rp${Number(trx.totalAmount).toLocaleString('id-ID')}
│ ◦ Status     : ${trx.status}
│ ◦ Kadaluarsa : ${expired.toLocaleString('id-ID')}
└ ◦ Link Bayar : ${trx.paymentUrl}

Scan QR di atas untuk membayar.
Cek status: *${_p}cekprem*
Batalkan   : *${_p}cancelprem*
`.trim()
}

function startPolling(conn, chat, trx, qrMsg, _p, pkg, kode, buyer, m) {
    if (global.premiumPolling[trx.transactionId]) return

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
                delete global.premiumPolling[trx.transactionId]
                clearPendingPremium(chat, buyer)

                // Aktifkan premium untuk user
                let user = global.db.data.users[buyer]
                if (!user) {
                    global.db.data.users[buyer] = { premium: false, premiumTime: 0 }
                    user = global.db.data.users[buyer]
                }
                let currentTime = Date.now()
                user.premium = true
                user.premiumTime = (user.premiumTime > currentTime ? user.premiumTime : currentTime) + pkg.durationMs

                let sisaHari = Math.floor((user.premiumTime - currentTime) / DAY)
                await conn.sendMessage(chat, {
                    text: `✅ *Premium berhasil diaktifkan!*\n\nPaket: ${pkg.label}\nDurasi: ${sisaHari} hari\nBerlaku sampai: ${new Date(user.premiumTime).toLocaleString('id-ID')}\n\nNikmati fitur tanpa batas! 🎉`,
                    mentions: [buyer]
                }, { quoted: m })
                return
            }

            if (data.status === 'expired' || now > expiredTime) {
                clearInterval(intervalId)
                delete global.premiumPolling[trx.transactionId]
                clearPendingPremium(chat, buyer)
                if (qrMsg?.key) await conn.sendMessage(chat, { delete: qrMsg.key }).catch(() => {})
                await conn.sendMessage(chat, {
                    text: `⌛ Transaksi premium dengan ID *${trx.transactionId}* sudah *expired*.\nSilakan pesan ulang dengan *${_p}buyprem*.`
                }, { quoted: m })
                return
            }

            if (data.status === 'cancel' || data.status === 'cancelled') {
                clearInterval(intervalId)
                delete global.premiumPolling[trx.transactionId]
                clearPendingPremium(chat, buyer)
                if (qrMsg?.key) await conn.sendMessage(chat, { delete: qrMsg.key }).catch(() => {})
                await conn.sendMessage(chat, {
                    text: `❌ Transaksi premium dengan ID *${trx.transactionId}* telah *dibatalkan*.`
                }, { quoted: m })
                return
            }
        } catch (e) {
            console.log('[premium-polling] error:', e)
        }
    }, POLL_INTERVAL)

    global.premiumPolling[trx.transactionId] = intervalId
}

let handler = async (m, { conn, usedPrefix: _p, args = [], command, isOwner }) => {
    try {
        // Owner gabisa beli premium
        if (isOwner) return m.reply(`❌ Kamu adalah owner, tidak perlu beli premium.`)

        const apikey = getApiKey()
        if (!apikey) {
            return m.reply(`ApiKey btzpay belum dikonfigurasi.`)
        }

        // ==== .buyprem [kode paket] ====
        if (/^buyprem$/i.test(command)) {
            let kode = (args[0] || '').toLowerCase().trim()

            if (!kode) {
                return m.reply(buildPricelistText(_p))
            }
            let pkg = PRICELIST[kode]
            if (!pkg) {
                return m.reply(`Paket *${kode}* tidak ditemukan.\n\n${buildPricelistText(_p)}`)
            }

            // Cooldown 5 detik
            let cooldownUntil = global.premiumCooldown[m.sender] || 0
            if (Date.now() < cooldownUntil) {
                return m.reply(`⏳ Tunggu beberapa detik sebelum order lagi.`)
            }

            // Cek pending existing
            let pending = getPendingPremium(m.chat, m.sender)
            if (pending) {
                let cekRes = await fetch(`${BTZPAYGATE_BASE_URL}/api/qris/transaction/${pending.transactionId}?key=${pending.accessKey}`).catch(() => null)
                let cekJson = cekRes ? await cekRes.json().catch(() => null) : null
                let stillPending = cekJson?.success && cekJson.data.status === 'pending' && Date.now() < new Date(pending.expiredAt).getTime()

                if (stillPending) {
                    let qrBuffer = await genQrBuffer(pending.qrisString)
                    let total = Number(pending.totalAmount) || (Number(pending.amount) + Number(pending.fee || 0))
                    return conn.sendMessage(m.chat, {
                        image: qrBuffer,
                        caption: `⚠️ Kamu masih punya transaksi premium yang belum selesai!\n\nSilakan *scan QR ini* untuk menyelesaikan pembayaran, atau batalkan dulu dengan:\n*${_p}cancelprem*\n\nID Trx: ${pending.transactionId}\nPaket: ${pending.packageKey}\nNominal: Rp${Number(pending.amount).toLocaleString('id-ID')}\nBiaya  : Rp${Number(pending.fee || 0).toLocaleString('id-ID')}\nTotal  : Rp${Number(total).toLocaleString('id-ID')}`
                    }, { quoted: m })
                } else {
                    clearPendingPremium(m.chat, m.sender)
                }
            }

            m.reply(`⏳ Sedang membuat transaksi QRIS untuk paket *${pkg.label}*...`)
            let createRes = await fetch(`${BTZPAYGATE_BASE_URL}/api/qris/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apikey,
                    amount: pkg.price,
                    fee: getFee(pkg.price),
                    notes: `Premium - ${pkg.label}`,
                    timeout: 900000,
                    metadata: {
                        orderId: `PREM-${kode}-${Date.now()}`,
                        sender: m.sender,
                        packageKey: kode
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
                console.log('[premium] gagal membuat transaksi:', createJson)
                return m.reply(`❌ Gagal membuat transaksi.\n${errText(createJson)}`)
            }

            let trx = createJson.data
            if (!trx.qrisString) {
                return m.reply(`❌ QRIS string tidak tersedia.\nID: ${trx.transactionId}`)
            }

            let qrBuffer = await genQrBuffer(trx.qrisString)
            let caption = buildCaption(trx, pkg, _p)

            let qrMsgRaw = await conn.sendMessage(m.chat, { image: qrBuffer, caption }, { quoted: m })
            let qrMsg = toQuotable(qrMsgRaw, m.chat, { imageMessage: { caption } })

            setPendingPremium(m.chat, m.sender, {
                transactionId: trx.transactionId,
                accessKey: trx.accessKey,
                qrisString: trx.qrisString,
                amount: trx.amount,
                fee: trx.fee,
                totalAmount: trx.totalAmount,
                expiredAt: trx.expiredAt,
                packageKey: kode,
                by: m.sender
            })
            startPolling(conn, m.chat, trx, qrMsg, _p, pkg, kode, m.sender, m)
            global.premiumCooldown[m.sender] = Date.now() + 5000
            return
        }

        // ==== .cekprem ====
        if (/^cekprem$/i.test(command)) {
            let pending = getPendingPremium(m.chat, m.sender)
            if (!pending) return m.reply(`Kamu belum punya transaksi premium yang berjalan.\nBuat dulu dengan *${_p}buyprem*`)

            let res = await fetch(`${BTZPAYGATE_BASE_URL}/api/qris/transaction/${pending.transactionId}?key=${pending.accessKey}`)
            let json = await res.json()
            if (!json.success) {
                console.log('[premium] gagal cek status:', json)
                return m.reply(`❌ Gagal mengambil status transaksi.\n${errText(json)}`)
            }

            let trx = json.data
            let statusEmoji = trx.status === 'sukses' ? '✅' : trx.status === 'pending' ? '⏳' : '❌'
            let text = `
┌ ◦ *STATUS PREMIUM*
│ ◦ ID Trx  : ${trx.transactionId}
│ ◦ Paket   : ${pending.packageKey}
│ ◦ Nominal : Rp${Number(trx.amount || 0).toLocaleString('id-ID')}
│ ◦ Status  : ${statusEmoji} ${trx.status}
│ ◦ Dibuat  : ${trx.createdAt ? new Date(trx.createdAt).toLocaleString('id-ID') : '-'}
│ ◦ Dibayar : ${trx.paidAt ? new Date(trx.paidAt).toLocaleString('id-ID') : '-'}
└
`.trim()
            return m.reply(text)
        }

        // ==== .cancelprem ====
        if (/^cancelprem$/i.test(command)) {
            let pending = getPendingPremium(m.chat, m.sender)
            if (!pending) return m.reply(`Kamu belum punya transaksi premium yang berjalan.\nBuat dulu dengan *${_p}buyprem*`)

            let res = await fetch(`${BTZPAYGATE_BASE_URL}/api/qris/cancel/${pending.transactionId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ apikey, reason: 'cancelled_by_user' })
            })
            let json = await res.json()
            if (!json.success) {
                console.log('[premium] gagal cancel:', json)
                return m.reply(`❌ Gagal membatalkan transaksi.\n${errText(json)}`)
            }

            if (global.premiumPolling[pending.transactionId]) {
                clearInterval(global.premiumPolling[pending.transactionId])
                delete global.premiumPolling[pending.transactionId]
            }
            clearPendingPremium(m.chat, m.sender)
            return conn.sendMessage(m.chat, {
                text: `✅ Transaksi premium ${json.data.transactionId} berhasil dibatalkan.`
            }, { quoted: m })
        }

    } catch (e) {
        console.log(e)
        throw e
    }
}

handler.help = ['buyprem <kode paket>', 'cekprem', 'cancelprem']
handler.tags = ['info']
handler.command = /^(buyprem|cekprem|cancelprem)$/i
handler.group = true

export default handler
