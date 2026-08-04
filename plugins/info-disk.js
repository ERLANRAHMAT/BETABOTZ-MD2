import cp from 'child_process';
import { promisify } from 'util';

let exec = promisify(cp.exec).bind(cp);

let handler = async (m, { conn }) => {
    await conn.reply(m.chat, `Please Wait`, m);
    let o;
    try {
        o = await exec('cd && du -h --max-depth=1');
    } catch (e) {
        o = e;
    } finally {
        let { stdout, stderr } = o;
        if (stdout && stdout.trim()) m.reply(stdout);
        if (stderr && stderr.trim()) m.reply(stderr);
    }
}

handler.help = ['disk'];
handler.tags = ['info'];
handler.command = /^(disk)$/i;
handler.premium = false;

export default handler;