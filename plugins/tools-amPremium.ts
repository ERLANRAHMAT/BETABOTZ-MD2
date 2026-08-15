// @ts-nocheck
// Converted from plugins-esm - automated
import axios from 'axios'

const API_URL = 'https://api.betabotz.eu.org/api/tools'
const sessions = new Map()

const endpoints = {
  ammagiclink: 'am-magicLink',
  amverify: 'am-verifyMagicLink',
  ampremium: 'am-purchasePremium'
}

const getSession = (sender) => {
  if (!sessions.has(sender)) {
    sessions.set(sender, {
      email: null,
      token: null
    })
  }
  return sessions.get(sender)
}

const getErrorMessage = (error) => {
  const responseData = error.response?.data

  if (responseData) {
    if (typeof responseData === 'string') return responseData
    return (
      responseData?.result?.message ||
      responseData?.message ||
      responseData?.error ||
      responseData?.msg ||
      JSON.stringify(responseData, null, 2)
    )
  }

  return error.message || String(error)
}

const callAPI = async (endpoint, payload) => {
  const { data } = await axios.post(
    `${API_URL}/${endpoint}`,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      timeout: 60000
    }
  )

  if (data?.status === false) {
    throw new Error(
      data?.result?.message || data?.message || 'Permintaan API gagal.'
    )
  }

  return data
}

let handler: WaPlugin = async (m, { command, text, usedPrefix }) => {
  const cmd = command.toLowerCase()
  const endpoint = endpoints[cmd]

  if (!endpoint) return m.reply('Perintah tidak tersedia.')

  const key = typeof aksesKey === 'string' ? aksesKey : ''
  const session = getSession(m.sender)
  const input = text?.trim() || ''

  // ========== STEP 1: MAGIC LINK ==========
  if (cmd === 'ammagiclink') {
    if (!input) {
      return m.reply(
`📌 *Step 1 - Kirim Magic Link*

Contoh:
${usedPrefix}ammagiclink email@gmail.com`
      )
    }

    if (!input.includes('@') || !input.includes('.')) {
      return m.reply('❌ Email tidak valid.\nContoh: email@gmail.com')
    }

    try {
      await m.reply('⏳ Mengirim magic link...')

      const data = await callAPI(endpoints.ammagiclink, {
        aksesKey: key,
        email: input
      })

      session.email = input
      session.token = null

      return m.reply(
`✅ *STEP 1 - MAGIC LINK TERKIRIM!*

📧 Email: ${input}
📨 Status: ${data?.result?.message || 'Berhasil dikirim'}

📌 *Langkah Selanjutnya:*
1. Cek email (INBOX / SPAM)
2. Copy seluruh link OOB
3. Kirim:
${usedPrefix}amverify <rawUrl>`
      )
    } catch (e) {
      console.error('[ALIGHT MAGICLINK]', e)
      return m.reply(`❌ *Gagal mengirim magic link!*\n\n${getErrorMessage(e)}`)
    }
  }

  // ========== STEP 2: VERIFY + PURCHASE (otomatis) ==========
  if (cmd === 'amverify') {
    if (!session.email) {
      return m.reply(
`❌ Email belum tersimpan.

Jalankan dulu:
${usedPrefix}ammagiclink <email>`
      )
    }

    if (!input) {
      return m.reply(
`📌 *Step 2 - Verify + Purchase*

Email tersimpan: ${session.email}

Contoh:
${usedPrefix}amverify https://alightcreative.com/auth_action/?apiKey=...&oobCode=...`
      )
    }

    if (
      !input.includes('oobCode') &&
      !input.includes('alightcreative.com') &&
      !input.includes('firebaseapp.com')
    ) {
      return m.reply('❌ Link tidak valid. Pastikan link dari email Alight Creative (ada oobCode).')
    }

    try {
      await m.reply('⏳ Step 2/2: Verify link...')

      // --- VERIFY ---
      const verifyData = await callAPI(endpoints.amverify, {
        aksesKey: key,
        email: session.email,
        rawUrl: input
      })

      const token = verifyData?.result?.token
      if (!token) {
        throw new Error('Verifikasi berhasil, tapi token tidak ditemukan di response API.')
      }

      session.token = token

      await m.reply(
`✅ *VERIFY BERHASIL!*

📧 Email: ${session.email}
🔓 Status: ${verifyData?.result?.message || 'Link valid'}
🔑 Token: didapat

⏳ Lanjut purchase premium...`
      )

      // --- PURCHASE (otomatis) ---
      const purchaseData = await callAPI(endpoints.ampremium, {
        aksesKey: key,
        email: session.email,
        token
      })

      const purchase = purchaseData?.result?.purchase || {}
      const licenses = purchaseData?.result?.licenses || []
      const licence = licenses[0] || {}

      const expiryMs = licence.expires || purchase.expiryTimeMillis
      const expiry = expiryMs
        ? new Date(expiryMs).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
        : 'Tidak diketahui'

      // Token sekali pakai → hapus setelah sukses
      session.token = null

      return m.reply(
`🎉 *PREMIUM BERHASIL DIAKTIVASI!*

📧 Email: ${session.email}
✅ Status: ${purchaseData?.result?.message || 'Premium aktif'}
🔒 License: ${purchaseData?.result?.licenseStatus || 'OK'}
📅 Expired: ${expiry}
📦 Product: ${licence.productId || '-'}
🆔 Order: ${licence.orderNumber || '-'}

> Login di aplikasi Alight Motion dengan email di atas, lalu cek profil premium.`
      )
    } catch (e) {
      console.error('[ALIGHT VERIFY/PURCHASE]', e)
      return m.reply(`❌ *Gagal memproses!*\n\n${getErrorMessage(e)}`)
    }
  }

  // ========== OPTIONAL: ampremium manual (kalau perlu ulang) ==========
  if (cmd === 'ampremium') {
    if (!session.email) {
      return m.reply(
`❌ Email belum tersimpan.

Jalankan dulu:
${usedPrefix}ammagiclink <email>`
      )
    }

    if (!session.token) {
      return m.reply(
`❌ Token belum tersimpan.

Jalankan:
${usedPrefix}amverify <magic-link>

(Purchase sudah otomatis setelah verify. Command ini hanya untuk retry manual.)`
      )
    }

    try {
      await m.reply('⏳ Mengaktifkan premium...')

      const purchaseData = await callAPI(endpoints.ampremium, {
        aksesKey: key,
        email: session.email,
        token: session.token
      })

      const purchase = purchaseData?.result?.purchase || {}
      const licenses = purchaseData?.result?.licenses || []
      const licence = licenses[0] || {}

      const expiryMs = licence.expires || purchase.expiryTimeMillis
      const expiry = expiryMs
        ? new Date(expiryMs).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
        : 'Tidak diketahui'

      session.token = null

      return m.reply(
`🎉 *PREMIUM BERHASIL DIAKTIVASI!*

📧 Email: ${session.email}
✅ Status: ${purchaseData?.result?.message || 'Premium aktif'}
🔒 License: ${purchaseData?.result?.licenseStatus || 'OK'}
📅 Expired: ${expiry}
📦 Product: ${licence.productId || '-'}
🆔 Order: ${licence.orderNumber || '-'}

> Login di aplikasi Alight Motion dengan email di atas, lalu cek profil premium.`
      )
    } catch (e) {
      console.error('[ALIGHT PREMIUM]', e)
      return m.reply(`❌ *Gagal purchase!*\n\n${getErrorMessage(e)}`)
    }
  }
}

handler.help = [
  'ammagiclink <email>',
  'amverify <magic-link>'
]
handler.tags = ['tools']
handler.command = /^(ammagiclink|ampremium|amverify)$/i
handler.limit = true
handler.owner = true

export default handler;
