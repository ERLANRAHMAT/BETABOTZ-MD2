async function handler(m, { conn, text, usedPrefix, command }) {
 if (!text) {
 throw `Masukan pesannya\nContoh: ${usedPrefix + command} tes`
 }
let warna = pickRandom(['#ef1a11', '#89cff0', '#660000', '#87a96b', '#e9f6ff', '#ffe7f7', '#ca86b0', '#83a3ee', '#abcc88', '#80bd76', '#6a84bd', '#5d8d7f', '#530101', '#863434', '#013337', '#133700', '#2f3641', '#cc4291', '#7c4848', '#8a496b', '#722f37', '#0fc163', '#2f3641', '#e7a6cb', '#64c987', '#e6e6fa', '#ffa500'])
await conn.sendMessage("status@broadcast", {
text: `${text}`
}, {
backgroundColor: warna,
      font: Math.floor(Math.random() * 9),
      statusJidList: Object.keys(global.db.data.users)
})
m.reply('*Success*')
}

handler.command = handler.help = ['upsw', 'postsw']
handler.tags = ['owner']
handler.owner = true

module.exports = handler

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
        }
