let handler = async (m, { conn }) => {
  let __timers = (new Date - global.db.data.users[m.sender].lastngojek)
  let _timers = (300000 - __timers)
  let order = global.db.data.users[m.sender].ojek
  let timers = clockString(_timers) 
  let name = conn.getName(m.sender)
  let user = global.db.data.users[m.sender]
  
  if (new Date - global.db.data.users[m.sender].lastngojek > 300000) {
      user.lastngojek = new Date * 1

      let randomaku1 = `${Math.floor(Math.random() * 10)}`
      let randomaku2 = `${Math.floor(Math.random() * 10)}`
      let randomaku4 = `${Math.floor(Math.random() * 5)}`
      let randomaku3 = `${Math.floor(Math.random() * 10)}`
      let randomaku5 = `${Math.floor(Math.random() * 10)}`

      .trim()

      let rbrb1 = (randomaku1 * 2)
      let rbrb2 = (randomaku2 * 10) 
      let rbrb3 = (randomaku3 * 1)
      let rbrb4 = (randomaku4 * 15729)
      let rbrb5 = (randomaku5 * 200)

      var zero1 = `${rbrb1}`
      var zero2 = `${rbrb2}`
      var zero3 = `${rbrb3}`
      var zero4 = `${rbrb4}`
      var zero5 = `${rbrb5}`



      global.db.data.users[m.sender].money += rbrb4
      global.db.data.users[m.sender].exp += rbrb5
      global.db.data.users[m.sender].ojek += 1

    m.reply(`*—[ Hasil Ngojek ]—*\n➕ 💹 Uang = [ ${zero4} ]\n➕ ✨ Exp = [ ${zero5} ]\n➕ 😍 Order Selesai = +1\n➕  📥Total Order Sebelumnya : ${order}`)
  } else m.reply(`Sepertinya anda sudah kecapekan silahkan istirahat dulu sekitar\n*${timers}*`)
}
handler.help = ['ojek']
handler.tags = ['rpg']
handler.command = /^(ojek|ngojek|gojek)$/i
handler.register = true
handler.rpg = true
module.exports = handler

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  console.log({ms,h,m,s})
  return [h, m, s].map(v => v.toString().padStart(2, 0) ).join(':')
}