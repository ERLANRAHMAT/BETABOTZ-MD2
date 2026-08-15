
/*
*reset limit auto on/off*
di buat oleh dana putra | Betabotz | aqua bot
wm ini boleh di hapus bebas kalian juga boleh belajar cara kerja code ny. Happy code!:)
jangan lupa follow github admin = danaputra133
*/

let isAutoResetEnabled = false; 
let autoResetTimeout = null; 

let handler: WaPlugin = async (m, { conn, args, command }) => {
    try {
        let lim = 10; 

        if (args.length === 0) {
            
            return conn.reply(
                m.chat,
                `*'on' atau 'off'!*\n\nContoh:\n- *.${command} on* untuk mengaktifkan reset otomatis setiap jam 00:00\n- *.${command} off* untuk menonaktifkan reset otomatis`,
                null
            );
        }

        if (args[0] === 'on') {
            if (isAutoResetEnabled) {
                return conn.reply(m.chat, `*Reset limit otomatis sudah aktif!*`, null);
            }
            isAutoResetEnabled = true;
            scheduleDailyReset(conn, lim);
            conn.reply(m.chat, `*Reset limit otomatis akan dijalankan setiap jam 00:00.*`, null);
        } else if (args[0] === 'off') {
            if (!isAutoResetEnabled) {
                return conn.reply(m.chat, `*Reset limit otomatis sudah nonaktif!*`, null);
            }
            isAutoResetEnabled = false;
            cancelScheduledReset(); 
            conn.reply(m.chat, `*Reset limit otomatis dinonaktifkan.*`, null);
        } else {
            return conn.reply(
                m.chat,
                `*Argumen tidak valid!*\nHarap gunakan 'on' atau 'off'.\n\nContoh penggunaan:\n- *.${command} on*\n- *.${command} off*`,
                null
            );
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
};


function resetLimit(conn, lim) {
    try {
        let list = Object.entries(global.db.data.users);
        list.map(([user, data]) => (Number(data.limit = lim)));
        conn.reply('120363361439264023@g.us', `*Limit berhasil direset ${lim} / user*`, null); // Kirim info ke grup tertentu
    } catch (e) {
        console.log(e);
        throw e;
    }
}

function getTimeUntilMidnight() {
    try {
        let now = new Date();
        let nextMidnight = new Date(now);
        nextMidnight.setHours(24, 0, 0, 0); 
        return nextMidnight - now;
    } catch (e) {
        console.log(e);
        throw e;
    }
}


function scheduleDailyReset(conn, lim) {
    try {
        let timeUntilMidnight = getTimeUntilMidnight();

        autoResetTimeout = setTimeout(() => {
            try {
                if (isAutoResetEnabled) {
                    console.log(`Mereset limit pengguna menjadi ${lim}`);
                    resetLimit(conn, lim); 
                    scheduleDailyReset(conn, lim); 
                }
            } catch (e) {
                console.log(e);
                throw e;
            }
        }, timeUntilMidnight); 
    } catch (e) {
        console.log(e);
        throw e;
    }
}


function cancelScheduledReset() {
    try {
        if (autoResetTimeout) {
            clearTimeout(autoResetTimeout); 
            autoResetTimeout = null;
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
}

handler.help = ['resetauto'].map(v => 'on/off' + v);
handler.tags = ['owner'];
handler.command = /^(resetauto|rli)$/i;

handler.owner = true;

export default handler;
