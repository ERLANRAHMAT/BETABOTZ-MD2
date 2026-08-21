let handler = m => m

// Race condition: processing lock per grup biar ga double leave
global.sewaExpiredProcessing = global.sewaExpiredProcessing || {}

// ============================================================
// Timer global: cek expired tiap 30 detik, nggak tergantung pesan.
// Tanpa ini, kalau nggak ada yang chat di grup → bot nggak keluar.
// ============================================================
if (!global._expiredTimerStarted) {
    global._expiredTimerStarted = true
    setInterval(async () => {
        let conn = global.conn
        if (!conn || !global.db?.data?.chats) return

        let allChats = global.db.data.chats
        let now = Date.now()
        let warnMinutes = typeof global.sewaExpireWarnMinutes === 'number' ? global.sewaExpireWarnMinutes : 1

        for (let [chatId, chat] of Object.entries(allChats)) {
            // Race condition: skip kalau grup ini sedang diproses
            if (global.sewaExpiredProcessing[chatId]) continue

            try {
                if (!chat || !chat.expired || chat.expired <= 0) continue

                // ---- Peringatan sebelum expired ----
                if (warnMinutes > 0 && chat.expired > now) {
                    let warnMs = warnMinutes * 60 * 1000
                    if ((chat.expired - now) <= warnMs && !chat.expiredWarned) {
                        let sisa = Math.ceil((chat.expired - now) / 60000)
                        try {
                            await conn.sendMessage(chatId, {
                                text: `⏰ Masa sewa bot di grup ini akan habis dalam *${sisa} menit*. Hubungi owner untuk perpanjang!`
                            })
                            chat.expiredWarned = true // set HANYA setelah berhasil kirim
                        } catch (e) {
                            console.log('[expired-timer] gagal kirim peringatan:', e?.message || e)
                        }
                    }
                }

                // ---- Expired: leave grup ----
                if (now >= chat.expired) {
                    global.sewaExpiredProcessing[chatId] = true
                    try {
                        await conn.sendMessage(chatId, {
                            text: `waktunya *${conn.user?.name || 'Bot'}* untuk meninggalkan grup\nJangan lupa sewa lagi ya!`
                        })
                    } catch (e) {
                        console.log('[expired-timer] gagal kirim pesan keluar:', e?.message || e)
                    }
                    try {
                        await conn.groupLeave(chatId)
                    } catch (e) {
                        console.log('[expired-timer] gagal groupLeave:', e?.message || e)
                    }
                    // Bersihkan record setelah percobaan leave
                    chat.expired = 0
                    chat.expiredWarned = false
                    delete global.sewaExpiredProcessing[chatId]
                }
            } catch (e) {
                console.log('[expired-timer] error grup', chatId, e?.message || e)
                delete global.sewaExpiredProcessing[chatId]
            }
        }
    }, 30 * 1000) // cek tiap 30 detik
}

// ============================================================
// Handler.before: trigger instan saat ada pesan di grup
// (backup / response cepat selain timer)
// ============================================================
handler.before = async function (m) {
    if (!m.isGroup) return
    if (m.fromMe) return

    let chat = global.db.data.chats[m.chat]
    if (!chat || !chat.expired) return

    // Race condition: skip kalau grup ini sedang diproses
    if (global.sewaExpiredProcessing[m.chat]) return

    let now = Date.now()

    // Peringatan sebelum expired
    let warnMinutes = typeof global.sewaExpireWarnMinutes === 'number' ? global.sewaExpireWarnMinutes : 1
    if (warnMinutes > 0 && chat.expired > now) {
        let warnMs = warnMinutes * 60 * 1000
        if ((chat.expired - now) <= warnMs && !chat.expiredWarned) {
            let sisa = Math.ceil((chat.expired - now) / 60000)
            try {
                await this.reply(m.chat, `⏰ Masa sewa bot di grup ini akan habis dalam *${sisa} menit*. Hubungi owner untuk perpanjang!`, null)
                chat.expiredWarned = true
            } catch (e) {
                console.log('[expired] gagal kirim peringatan:', e)
            }
        }
    }

    // Expired: leave grup
    if (now >= chat.expired) {
        global.sewaExpiredProcessing[m.chat] = true
        try {
            await this.reply(m.chat, `waktunya *${this.user.name}* untuk meninggalkan grup\nJangan lupa sewa lagi ya!`, null)
        } catch (e) {
            console.log('[expired] gagal kirim pesan keluar grup:', e)
        }
        try {
            await this.groupLeave(m.chat)
        } catch (e) {
            console.log('[expired] gagal groupLeave:', e)
        }
        chat.expired = 0
        chat.expiredWarned = false
        delete global.sewaExpiredProcessing[m.chat]
    }
}

export default handler
