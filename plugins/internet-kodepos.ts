
import fetch from 'node-fetch';

let handler: WaPlugin = async (m, { text, usedPrefix, command }) => {
    if (!text) throw `Penggunaan:\n${usedPrefix + command} <nama daerah>\n\nContoh:\n${usedPrefix + command} Cilacap`;
    try {
      let res = await fetch(
        `https://api.betabotz.eu.org/api/search/kodepos?query=${encodeURIComponent(text)}&apikey=${lann}`,
      );
      if (!res.ok) throw "Data tidak ditemukan";
      let json = await res.json();
      if (!json.status || json.code !== 200) throw eror;
      let result = json.result;
      if (result.length === 0) throw "Kode pos tidak ditemukan";

      let message = result
        .map(
          (item, index) =>
            `${index + 1}. Provinsi: ${item.province}\nKota: ${item.city}\nKecamatan: ${item.district}\nDesa: ${item.village}\nKode Pos: ${item.postalCode}`,
        )
        .join("\n\n");

      m.reply(message);
    } catch (e) {
      console.log(e);
      throw e;
    }
};

handler.help = ['kodepos'];
handler.tags = ['internet'];
handler.command = /^(kodepos)$/i;

export default handler;
