const fetch = require('node-fetch');
let handler = async (m, { 
 conn,
 text,
 usedPrefix,
 command
 }) => {
	var [from, to] = text.split`|`
	if (!(from && to)) throw `Ex: ${usedPrefix + command} jakarta|bandung`
	try {
		let data = await fetch(`https://api.betabotz.eu.org/api/search/jarak?from=${from}&to=${to}&apikey=${lann}`)
		let json = await data.json()
		if (!json.status) throw `🚩 *Jarak Tidak Ditemukan*`

		let detail = json.message.detail;
		let asal = json.message.asal;
		let tujuan = json.message.tujuan;
		let estimasiBiaya = json.message.estimasi_biaya_bbm;
		let arahPenunjukJalan = json.message.arah_penunjuk_jalan;
		let petaStatis = json.message.peta_statis;
		let rute = json.message.rute;

		let message = `*Detail Perjalanan*\n\n${detail}\n\n` +
			`*Asal:*\n- Nama: ${asal.nama}\n- Alamat: ${asal.alamat}\n- Koordinat: ${asal.koordinat.lat}, ${asal.koordinat.lon}\n\n` +
			`*Tujuan:*\n- Nama: ${tujuan.nama}\n- Alamat: ${tujuan.alamat}\n- Koordinat: ${tujuan.koordinat.lat}, ${tujuan.koordinat.lon}\n\n` +
			`*Estimasi Biaya BBM:*\n- Total Liter: ${estimasiBiaya.total_liter}\n- Total Biaya: ${estimasiBiaya.total_biaya}\n\n` +
			`*Arah Penunjuk Jalan:*\n${arahPenunjukJalan.map(step => `- Langkah ${step.langkah}: ${step.instruksi} (${step.jarak})`).join('\n')}\n\n` +
			`*Peta Statis:*\n${petaStatis}\n\n` +
			`*Rute:*\n${rute}`;

		await conn.sendFile(m.chat, petaStatis, 'peta.png', message, m);
	} catch (error) {
		throw `🚩 *Jarak Tidak Ditemukan*`
	}
}
handler.command = handler.help = ['jarak']
handler.tags = ['internet']
handler.limit = true
module.exports = handler
