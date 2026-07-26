global.anticall = global.anticall ?? true
let initialized = false

async function init(conn) {
  if (initialized) return
  if (!conn?.ev) return
  conn.ev.on("call", async (call) => {
    if (!global.anticall) return
    if (!Array.isArray(call) || !call[0]) return
    if (call[0].status !== "offer") return
    try {
      await conn.rejectCall(call[0].id, call[0].from)
      await conn.updateBlockStatus(call[0].from, "block")
    } catch (e) {
      console.error("anticall error", e)
    }
  })
  initialized = true
}

async function before(m, { conn }) {
  if (global.anticall === false) return
  init(conn)
}
export default  { before }

//admin mohon maaf atas kesalahan kode sebelum nya