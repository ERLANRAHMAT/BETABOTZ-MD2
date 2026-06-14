let handler = m => m

async function before(m) {
  if (!chat.antiCall) return;
  this.ev.on("call", async (call) => {
    if (call[0].status == "offer") {
      await this.rejectCall(call[0].id, call[0].from);
      await this.updateBlockStatus(call[0].from, "block");
    }
  });
}

module.exports = handler

//admin mohon maaf atas kesalahan kode sebelum nya