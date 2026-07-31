export default {
before: async function(m) {
    // let setting = global.db.data.settings[conn.user.jid]
    let chat = global.db.data.chats[m.chat]
    let today = new Date();
    if (chat.autobio) 
    { 
        {
            let _uptime = process.uptime() * 1000
            let uptime = clockString(_uptime);
            let tanggal = today.toLocaleDateString("id-ID", { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
            })
            let bio = `『${global.wm}』Aktif selama ${uptime} || Mode: ${global.opts['self'] ? 'Private' : 'Public'}, Tanggal: ${tanggal}`
            await conn.updateProfileStatus(bio).catch(_ => _)
        }
     }
   }
}
function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
// By: Offmonpreset