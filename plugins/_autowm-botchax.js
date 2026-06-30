const { Image } = require("node-webpmux");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

let handler = (m) => m;

handler.all = async function (m) {
  let chat = global.db.data.chats[m.chat];
  let user = global.db.data.users[m.sender];

  if (!chat || !chat.autowm) return;
  if (chat.isBanned || user.banned || m.isBaileys) return;

  let q = m;
  let mime = (q.msg || q).mimetype || "";
  let mtype = m.mtype || "";

  if (/webp|sticker/.test(mime) || mtype === "stickerMessage") {
    try {
      let stickerBuffer = await q.download();
      if (!stickerBuffer) return;

      let img = new Image();
      await img.load(stickerBuffer);

      let packnameExif = "";
      let authorExif = "";

      if (img.exif) {
        try {
          let exifData = JSON.parse(img.exif.slice(22).toString());
          packnameExif = exifData["sticker-pack-name"] || "";
          authorExif = exifData["sticker-pack-publisher"] || "";
        } catch (jsonErr) {
          packnameExif = "";
          authorExif = "";
        }
      }

      if (packnameExif === global.packname && authorExif === global.author) {
        return;
      }
      let isAnimated = q.isAnimated || (q.msg && q.msg.isAnimated) || false;

      if (isAnimated) {
        if (typeof uploadImage === "function") {
          let mediaUrl = await uploadImage(stickerBuffer);
          let res = await fetch(
            `https://api.betabotz.eu.org/api/tools/webp2mp4?url=${mediaUrl}&apikey=${global.lann}`,
          );
          let json = await res.json();

          if (json.result) {
            await this.sendVideoAsSticker(m.chat, json.result, m, {
              packname: global.packname,
              author: global.author,
            });
            return !0;
          }
        }
        let resultUrl = await uploadKeBotcahx(stickerBuffer);
        if (resultUrl) {
          let res = await fetch(
            `https://api.betabotz.eu.org/api/tools/webp2mp4?url=${resultUrl}&apikey=${global.lann}`,
          );
          let json = await res.json();
          if (json.result) {
            await this.sendVideoAsSticker(m.chat, json.result, m, {
              packname: global.packname,
              author: global.author,
            });
          }
        }
      } else {
        let tmpPath = path.join(__dirname, `../tmp/wm_${Date.now()}.webp`);
        if (!fs.existsSync(path.dirname(tmpPath))) {
          fs.mkdirSync(path.dirname(tmpPath), { recursive: true });
        }

        fs.writeFileSync(tmpPath, stickerBuffer);

        await this.sendImageAsSticker(m.chat, tmpPath, m, {
          packname: global.packname,
          author: global.author,
        });

        if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
      }
    } catch (e) {
      console.error("Error pada Auto-WM:", e);
    }
  }
  return !0;
};

module.exports = handler;

async function uploadKeBotcahx(buffer) {
  const FormData = require("form-data");
  const { fromBuffer } = require("file-type");
  try {
    let { ext } = await fromBuffer(buffer);
    let bodyForm = new FormData();
    bodyForm.append("file", buffer, "file." + ext);
    let res = await fetch("https://file.botcahx.eu.org/api/upload.php", {
      method: "post",
      body: bodyForm,
    });
    let data = await res.json();
    return data.result ? data.result.url : "";
  } catch {
    return "";
  }
}
