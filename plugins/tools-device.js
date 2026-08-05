;
let handler = async (m) => {
  if (!baileys) baileys = await loadBaileys();
  const { getDevice } = baileys;
  m.reply(await getDevice(m.quoted ? m.quoted.id : m.key.id));
};

handler.help = ["device"];
handler.tags = ["tools"];
handler.command = /^(device)$/i;

export default handler;
