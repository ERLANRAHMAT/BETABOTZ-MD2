async function before(m) {
  this.ev.on('call', async (call) => {
      if (call[0].status == 'offer') {
        await this.sendMessage(call[0].from, {
          text: "Kamu Di banned + block + warn + kick oleh bot karena telah melanggar aturan bot\n\n*📮Dilarang menelepon Bot!",
          quoted: call[0]
        });
        await this.rejectCall(call[0].id, call[0].from);
        await this.updateBlockStatus(call[0].from, "block");
      }
  });
}
module.exports = {
  before
};
