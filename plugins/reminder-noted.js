const fetch = require('node-fetch')

const API_URL = "https://api.betabotz.eu.org";

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let [action, ...args] = text.split(' ')
    let payload = args.join(' ')
    let jidgrub = m.chat
    let apikey = global.lann

    const showHelp = () => {
        m.reply(`*Format Penggunaan Reminder Group:*
Fitur reminder ini memungkinkan kamu untuk menyimpan catatan penting dengan waktu pengingat di grup.\nBerikut cara penggunaannya:

1. *Tambah:* ${usedPrefix}${command} HH:MM|YYYY-MM-DD|Catatan panjang
2. *Lihat:* ${usedPrefix}${command} get
3. *Update:* ${usedPrefix}${command} update Nomorid|HH:MM|YYYY-MM-DD|Catatan baru  
4. *Hapus:* ${usedPrefix}${command} delete Nomorid

_Contoh:_ ${usedPrefix}${command} noted 13:20|2026-04-30|Meeting project baru`)
    }

    if (!action) return showHelp()

    try {
        switch (action.toLowerCase()) {
            case 'noted': {
                if (!payload.includes('|')) return m.reply(`Format salah!\nContoh: ${usedPrefix}${command} noted 13:20|2026-04-30|Meeting project`)
                let [jam, tanggal, ...notedArr] = payload.split('|')
                let noted = notedArr.join('|')

                let body = {
                    apikey: apikey, 
                    jidgrub: jidgrub,
                    jam: jam.trim(),
                    tanggal: tanggal.trim(),
                    noted: noted.trim(),
                    img: ""
                }

                let res = await fetch(`${API_URL}/api/tools/reminder/post/noted`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                })
                let json1 = await res.json();
                let json = json1.result;

                if (json.status === "sukses") {
                  m.reply(
                    `✅ *${json.message}*\n\nCatatan: ${json.data.noted}\nWaktu: ${json.data.tanggal} Jam ${json.data.jam}`,
                  );
                } else {
                  m.reply("❌ Gagal menyimpan reminder.");
                }
                break
            }

            case 'get': {
                let res = await fetch(`${API_URL}/api/tools/reminder/get/noted?jidgrub=${jidgrub}&apikey=${apikey}`)
                let json1 = await res.json()
                let json = json1.result 

                if (json.status !== 'sukses' || !json.data || json.data.length === 0) {
                    return m.reply('📂 Tidak ada reminder di grup ini.')
                }

                let txt = '*DAFTAR REMINDER GRUP*\n\n'
                json.data.forEach((v, i) => {
                    let tgl = v.tanggal.split('T')[0]
                    txt += `*${i + 1}.* [${tgl} | ${v.jam}]\n📝 ${v.noted}\n\n`
                })
                txt += `_Gunakan *${usedPrefix}${command} update/delete Nomor* untuk mengatur reminder._`
                m.reply(txt.trim())
                break
            }

            case 'update': {
                if (!payload.includes('|')) return m.reply(`Format salah!\nContoh: ${usedPrefix}${command} update 1|14:00|2026-04-30|Catatan diubah`)
                let [idStr, jam, tanggal, ...notedArr] = payload.split('|')
                let noted = notedArr.join('|')
                let id = parseInt(idStr) - 1
                let getRes = await fetch(`${API_URL}/api/tools/reminder/get/noted?jidgrub=${jidgrub}&apikey=${apikey}`)
                let getJson1 = await getRes.json()
                let getJson = getJson1.result

                if (!getJson.data || !getJson.data[id]) return m.reply(`❌ Reminder nomor ${idStr} tidak ditemukan. Cek list dengan ${usedPrefix}${command} get`)

                let targetId = getJson.data[id].id
                let body = {
                  apikey: apikey,
                  id: targetId, 
                  jidgrub: jidgrub,
                  jam: jam.trim(),
                  tanggal: tanggal.trim(),
                  noted: noted.trim(),
                  img: "",
                };

                let patchRes = await fetch(`${API_URL}/api/tools/reminder/patch/noted`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                })
                
                let patchJson1 = await patchRes.json();
                let patchJson = patchJson1?.result;

                if (patchJson?.status === "sukses") {
                  m.reply("✅ Reminder berhasil diupdate!");
                } else {
                  m.reply("❌ Gagal update reminder.");
                }
                break
            }

            case 'delete': {
                let id = parseInt(payload) - 1
                if (isNaN(id)) return m.reply('Masukkan nomor id yang valid.')
                let getRes = await fetch(`${API_URL}/api/tools/reminder/get/noted?jidgrub=${jidgrub}&apikey=${apikey}`)
                let getJson1 = await getRes.json()
                let getJson = getJson1.result

                if (!getJson.data || !getJson.data[id]) return m.reply(`❌ Reminder nomor ${payload} tidak ditemukan.`)

                let targetId = getJson.data[id].id
                
                let delRes = await fetch(`${API_URL}/api/tools/reminder/delete/noted?jidgrub=${jidgrub}&id=${targetId}&apikey=${apikey}`, {
                    method: 'DELETE'
                })
                
                m.reply(`🗑️ Reminder nomor ${payload} berhasil dihapus.`)
                break
            }

            default:
                showHelp()
        }
    } catch (e) {
        console.error(e)
        m.reply('Terjadi kesalahan pada sistem/API.')
    }
}

handler.help = ['reminder']
handler.tags = ['group']
handler.command = /^reminder$/i
handler.group = true

module.exports = handler