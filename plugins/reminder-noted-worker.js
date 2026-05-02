/*
const axios = require("axios");

const API_URL = "https://api.betabotz.eu.org";

let lastReminded = {};

function getLocalDateString(daysToAdd = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysToAdd);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function sendReminderToGroup(jid, text) {
  const conn = global.conn || global.default;
  if (!conn)
    return console.error(
      "[REMINDER NOTED] global.conn belum tersedia, menunggu bot login...",
    );
  try {
    await conn.sendMessage(jid, { text });
  } catch (e) {
    console.error(
      `[REMINDER NOTED] Gagal mengirim pesan ke ${jid}:`,
      e.message,
    );
  }
}

async function checkAndSendReminder(targetDates, title) {
  const apikey = global.lann;
  const conn = global.conn || global.default;
  if (!conn) return;

  let groups = [];
  try {
    // gua tau ini bebanin api ke apikey apa lagi kalau grub nya banyak, tapi mau gimana lagi
    const getGroups = await conn.groupFetchAllParticipating();
    groups = Object.keys(getGroups);
    console.log(
      `[REMINDER NOTED] Total grup yang akan dicek: ${groups.length} grup`,
    );
  } catch (err) {
    console.error(
      "[REMINDER NOTED] Gagal fetch partisipasi grup, mengambil dari cache...",
      err.message,
    );
    // Fallback kalau gagal fetch dari server WA
    groups = Object.keys(conn.chats || {}).filter((jid) =>
      jid.endsWith("@g.us"),
    );
  }

  if (groups.length === 0) {
    console.log(
      "[REMINDER NOTED] Tidak ada grup yang terdeteksi, bot belum masuk grup mana pun.",
    );
    return;
  }

  for (const jidgrub of groups) {
    try {
      const url = `${API_URL}/api/tools/reminder/get/noted?jidgrub=${jidgrub}&apikey=${apikey}`;
      const { data: json1 } = await axios.get(url);
      const json = json1.result;

      if (
        json.status === "sukses" &&
        json.data &&
        Array.isArray(json.data) &&
        json.data.length > 0
      ) {
        const remindersToSend = json.data.filter((v) => {
          const apiDate = v.tanggal.split("T")[0];
          return targetDates.includes(apiDate);
        });

        if (remindersToSend.length > 0) {
          let msg = `=== 🔔 *REMINDER GRUP: ${title}* 🔔 ===\n\n`;
          remindersToSend.forEach((v, i) => {
            const apiDate = v.tanggal.split("T")[0];
            msg += `*${i + 1}. Catatan:* ${v.noted}\n`;
            msg += `📆 *Tanggal:* ${apiDate}\n`;
            msg += `⏰ *Jam:* ${v.jam}\n\n`;
          });

          await sendReminderToGroup(jidgrub, msg.trim());
          console.log(
            `[REMINDER NOTED] Berhasil mengirim reminder ke grup: ${jidgrub}`,
          );
        }
      }
    } catch (e) {
      //  console.log("ERROR REMINDER:", e.message); // biar gak spam di matiin, debug nyalain aja
    }
  }
}

console.log(
  "[REMINDER NOTED] Worker interval berhasil dimuat dan bersiap jalan...",
);

setInterval(async () => {
  if (!global.conn) return;

  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const todayStr = getLocalDateString(0);

  // GANTI INI KALAU MAU UABH JAM REMINDER UNTUK HARI H
  //CONTOH  else if (hours 4 ===  && minutes === 3) ini jam 4:03
  if (hours ===  && minutes === ) {
    const triggerKey = `${todayStr}-`;

    if (!lastReminded[triggerKey]) {
      console.log(
        "[REMINDER NOTED] Mengecek reminder Hari H pada jam :00...",
      );
      const targetHariH = getLocalDateString(0); // HARI H

      await checkAndSendReminder([targetHariH], "HARI INI");
      lastReminded[triggerKey] = true;
    }
  }

  // GANTI INI KALAU MAU UBAH JAM REMINDER UNTUK HARI H-2 & H-3
  //CONTOH  else if (hours 4 ===  && minutes === 3) ini jam 4:03
  else if (hours ===  && minutes === ) {
    const triggerKey = `${todayStr}-`;

    if (!lastReminded[triggerKey]) {
      console.log(
        "[REMINDER NOTED] Mengecek reminder H-1 & H-3 pada jam :00...",
      );
      const targetHMinus1 = getLocalDateString(1); // H-1
      const targetHMinus3 = getLocalDateString(3); // H-3

      await checkAndSendReminder(
        [targetHMinus1, targetHMinus3],
        "MENDEKATI DEADLINE",
      );
      lastReminded[triggerKey] = true;
    }
  } else if (hours === 0 && minutes === 0) {
    lastReminded = {};
  }
}, 60 * 1000);

*/

// DIMATIKAN JIKA INGIN DI GUNAKAN HAPUS TANDA KOMENTAR