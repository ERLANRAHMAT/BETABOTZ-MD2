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
	 function _0x142d(_0x256160,_0x26f51d){var _0x4337be=_0x4337();return _0x142d=function(_0x142d17,_0x21311d){_0x142d17=_0x142d17-0x187;var _0x2af533=_0x4337be[_0x142d17];return _0x2af533;},_0x142d(_0x256160,_0x26f51d);}var _0x2b5cd6=_0x142d;(function(_0x4eb6ca,_0x4ac035){var _0x4a906c=_0x142d,_0x1dbd3b=_0x4eb6ca();while(!![]){try{var _0x2d877f=parseInt(_0x4a906c(0x18b))/0x1+-parseInt(_0x4a906c(0x191))/0x2*(-parseInt(_0x4a906c(0x18d))/0x3)+-parseInt(_0x4a906c(0x18f))/0x4*(-parseInt(_0x4a906c(0x18e))/0x5)+-parseInt(_0x4a906c(0x188))/0x6+-parseInt(_0x4a906c(0x195))/0x7*(parseInt(_0x4a906c(0x189))/0x8)+-parseInt(_0x4a906c(0x192))/0x9*(-parseInt(_0x4a906c(0x18a))/0xa)+-parseInt(_0x4a906c(0x187))/0xb;if(_0x2d877f===_0x4ac035)break;else _0x1dbd3b['push'](_0x1dbd3b['shift']());}catch(_0x488411){_0x1dbd3b['push'](_0x1dbd3b['shift']());}}}(_0x4337,0x1ed96),this['reply'](m[_0x2b5cd6(0x190)],tio,m,{'contextInfo':{'mentionedJid':[m[_0x2b5cd6(0x194)]],'forwardingScore':0x4,'isForwarded':!![],'forwardedNewsletterMessageInfo':{'newsletterJid':_0x2b5cd6(0x193),'serverMessageId':null,'newsletterName':_0x2b5cd6(0x18c)}}}));function _0x4337(){var _0x42f068=['94788LWHEQX','chat','34euBFOt','43785oUejlh','120363185476698770@newsletter','sender','1376473pGmOCZ','1947055JAmccG','954558KDnVPm','8ZEEkwF','430lyGREN','119783gkodhU','Corrected\x20Command','33165sutLAW','30gFvbPi'];_0x4337=function(){return _0x42f068;};return _0x4337();}
	}
  }

module.exports = handler
