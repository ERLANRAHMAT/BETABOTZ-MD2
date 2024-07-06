//import db from '../lib/database.js'

let handler = async (m, { conn, text }) => {
	function no(number){
    return number.replace(/\s/g,'').replace(/([@+-])/g,'')
  }

	text = no(text)

  if(isNaN(text)) {
		var number = text.split`@`[1]
  } else if(!isNaN(text)) {
		var number = text
  }

  if(!text && !m.quoted) return conn.reply(m.chat, `*❏ USER RESTART*\n\nTandai pengguna, ketik nomor, atau balas pesan pengguna yang ingin di reset database nya`, m)
  //let exists = await conn.isOnWhatsApp(number)
  // if (exists) return conn.reply(m.chat, `*El número no está registrado en WhatsApp*`, m)
  if(isNaN(number)) return conn.reply(m.chat, `*❏ PENGGUNA DIMULAI ULANG*\n\nNomor yang Anda masukkan tidak valid`, m)
 // if(number.length > 8) return conn.reply(m.chat, `*❏ USUARIO REINICIADO*\n\n¡El número que ingresó no es válido!`, m)
  try {
		if(text) {
			var user = number + '@s.whatsapp.net'
		} else if(m.quoted.sender) {
			var user = m.quoted.sender
		} else if(m.mentionedJid) {
  		  var user = number + '@s.whatsapp.net'
			}  
		} catch (e) {
  } finally {
  
	let groupMetadata = m.isGroup ? await conn.groupMetadata(m.chat) : {}
  let participants = m.isGroup ? groupMetadata.participants : []
	let users = m.isGroup ? participants.find(u => u.jid == user) : {}
	let number = user.split('@')[0]
  
	delete global.global.db.data.users[user]
 	
 	conn.reply(m.chat, `*❏ PENGGUNA DIMULAI ULANG*\n\n✅ Mulai ulang ke @${number} dari *DATABASE*`, null, { mentions: [user] })

 
 }
}
handler.help = ['reset <62xxx>']
handler.tags = ['owner']
handler.command = ['reset'] 
handler.admin = false
handler.rowner = true

module.exports = handler