const owner1 = '6281289694906@s.whatsapp.net';
const owner2 = '@s.whatsapp.net';
const owner3 = '62895628117900@s.whatsapp.net';
const owner4 = '@s.whatsapp.net';

// variabel di atas di isi nomor yang ingin di buat sambutan, ganti sama nomor kalian!


let handler = m => m
handler.before = async function(m, { conn, participants, isPrems, isAdmin }) {
  if (!conn.danil_join) {
    conn.danil_join = {
      join: false,
      time: 0,
    };
  }
  const currentTime = Math.floor(Date.now() / 1000);

  if (!m.isGroup || conn.danil_join.time > currentTime) {
    console.log("cooldown"); //cek di console server kalau muncul ini berarti masih cooldown
    return;
  }
  let messageText = "";
  let mentionedUsers = participants.map((u) => u.id).filter((v) => v !== conn.user.jid);
  switch (m.sender) {
    case `${owner1}`:
      messageText = "📣 *Perhatian semua* 📣, Owner telah datang";
      break;
    // case `${owner2}`:
    //   messageText = "📣 *Perhatian semua* 📣, Owner hytam datang";
    //   break;
    case `${owner3}`:
      messageText = "📣 *Perhatian semua* 📣, admin betabotz telah datang, beri hormat semua!!!";
      break;
    // case "6289660386999@s.whatsapp.net":
    //   messageText = "📣 *Perhatian semua*, Owner hytam datang";
    //   break;  
  }
  //yang di kasih tanda // bisa di hilangkan jika ingin di pakai
  if (messageText) {
    await conn.sendMessage(
      m.chat,
      {
        text: messageText,
      },
      {
        quoted: m,
        mentions: mentionedUsers,
      }
    );
    conn.danil_join = {
      join: true,
      time: currentTime + 1000, //
    };
  } else {
    console.log("error hubungi developer!");
  }
}

module.exports = handler

//base code by adrian
//edit by dana