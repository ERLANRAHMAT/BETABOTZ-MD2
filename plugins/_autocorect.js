let didyoumean = require('didyoumean')
let similarity = require('similarity')

let handler = m => m

handler.before = function (m, { match, usedPrefix, text, args }) {
	if ((usedPrefix = (match[0] || '')[0])) {
		let noPrefix = m.text.replace(usedPrefix, '').trim()
		let args = noPrefix.trim().split` `.slice(1)
		let alias = Object.values(global.plugins).filter(v => v.help && !v.disabled).map(v => v.help).flat(1)
		if (alias.includes(noPrefix)) return
		let mean = didyoumean(noPrefix, alias)
		let sim = similarity(noPrefix, mean)
		let som = sim * 100
		let tio = `• Hi, Kak @${m.sender.split`@`[0]}  Are you currently looking for ${usedPrefix + mean}? 😄

◦ Menu name: *${usedPrefix + mean}*
◦ Similarity: *${parseInt(som)}%*`
	 if (mean) 
	 this.reply(m.chat, tio, m, { contextInfo: {
mentionedJid: [m.sender],
    forwardingScore: 4,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: '120363185476698770@newsletter',
      serverMessageId: null,
      newsletterName: 'Corrected Command'
    }}})
	}
  }

module.exports = handler
