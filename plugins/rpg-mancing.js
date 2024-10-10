let {
	MessageType
} = require('@adiwajshing/baileys');

let wm = global.wm;
let handler = async (m, {
	conn,
	usedPrefix,
	owner
}) => {
		let lastFishingTime = global.db.data.users[m.sender].lastmancing || 0;
		let timeDiff = Date.now() - lastFishingTime;
		let remainingTime = 180000 - timeDiff; 

		if (global.db.data.users[m.sender].pancingan > 0) {
			if (timeDiff >= 180000) { 
				let ikan = Math.floor(Math.random() * 30);
				let lele = Math.floor(Math.random() * 15);
				let nila = Math.floor(Math.random() * 10);
				let bawal = Math.floor(Math.random() * 10);
				let udang = Math.floor(Math.random() * 39);
				let paus = Math.floor(Math.random() * 2);
				let kepiting = Math.floor(Math.random() * 27);

				let imageUrl = 'https://cdn.jsdelivr.net/gh/SazumiVicky/MakeMeow-Storage@main/mancing.jpg';
				let totalCatch = nila + bawal + ikan + lele + udang + paus + kepiting;

				let mcng = `•  *YOUR FISHING RESULTS:*
        
◦  🐟 Ikan nila: ${nila}
◦  🐡 Bawal: ${bawal}
◦  🐟 Lele: ${lele}
◦  🐟 Ikan: ${ikan}
◦  🦐 Udang: ${udang}
◦  🐋 Paus: ${paus}
◦  🦀 Kepiting: ${kepiting}`;

				setTimeout(() => {
					conn.sendFile(m.chat, imageUrl, 'mancing.jpg', mcng, m);
				}, 28000);
				setTimeout(() => {
					conn.reply(m.chat, `The hook is pulled by the fish, and you try to pull it`, m)
				}, 18000);
				setTimeout(() => {
					conn.reply(m.chat, `Waiting for the fish to be hooked`, m)
				}, 8000);
				setTimeout(() => {
					conn.reply(m.chat, `You go fishing🎣`, m)
				}, 0);

				global.db.data.users[m.sender].nila += nila;
				global.db.data.users[m.sender].ikan += ikan;
				global.db.data.users[m.sender].lele += lele;
				global.db.data.users[m.sender].bawal += bawal;
				global.db.data.users[m.sender].udang += udang;
				global.db.data.users[m.sender].lastmancing = Date.now();
				global.db.data.users[m.sender].udang += paus;
				global.db.data.users[m.sender].udang += kepiting;
				global.db.data.users[m.sender].pancingan -= 1;
				global.db.data.users[m.sender].totalPancingan += totalCatch;
			} else {
				let remainingTimeStr = formatTime(remainingTime);
				conn.reply(m.chat, `You're already fishing, wait until ${remainingTimeStr}`, m);
			}
		} else {
			conn.reply(m.chat, '[❗] You don\'t have any fishing gear 🎣', m);
		}
}

handler.help = ['mancing'];
handler.tags = ['rpg'];
handler.command = /^(mancing|memancing)$/i;

module.exports = handler;

function formatTime(ms) {
	let seconds = Math.floor(ms / 1000);
	let minutes = Math.floor(seconds / 60);
	let hours = Math.floor(minutes / 60);

	seconds %= 60;
	minutes %= 60;
	hours %= 24;

	let hStr = hours.toString().padStart(2, '0');
	let mStr = minutes.toString().padStart(2, '0');
	let sStr = seconds.toString().padStart(2, '0');

	return `${hStr}:${mStr}:${sStr}`;
}