let fetch = require('node-fetch')
let handler = async (m, { conn, command }) => {
const buffer = await fetch(API('lann', `/api/anime/${command}`, { apikey: lann }))
.then(res => res.buffer())
conn.sendFile(m.chat, buffer, 'hasil.jpg', "Random " + command, m)
}
handler.command = handler.help = ['umaru','kaneki','megumin','yotsuba','shinomiya','yumeko','tejina','chiho','toukachan','akira','itori','kurumi','sagiri','eba','deidara','itachi','madara','asuna','ayuzawa','chitoge','emilia','hestia','inori','ana','miku','kaori','shizuka','doraemon','kaga','koturi','mikasa','akiyama','gremory','isuzu','shina','kagura','shinka','tsunade','sasuke','sakura','rize','nezuko','boruto','naruto','erza','minato','elaina','yuri','shota','waifu','loli','hinata']
handler.tags = ['image']
handler.limit = true;
module.exports = handler;
