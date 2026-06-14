let handler = async (m, { conn, command, args }) => {
    try { 
        const API_URL = `https://task.aniqu.biz.id/api/bot/tasks?token=${taskToken}`;
        
        let response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Gagal mengambil data dari API (Status: ${response.status})`);
        
        let resJson = await response.json();
        let tasksList = resJson.data; 
        
        if (!Array.isArray(tasksList)) throw new Error('Format data dari API tidak valid.');
        if (tasksList.length === 0) return conn.reply(m.chat, 'Gak ada tugas/ Db nya error. Konfirmasi ke Moderator kelas', m);

        const getUniqueJenis = (tasks) => {
            const jenisSet = new Set();
            tasks.forEach(t => {
                if (t.jenis && Array.isArray(t.jenis)) {
                    t.jenis.forEach(j => jenisSet.add(j.toLowerCase()));
                }
            });
            return Array.from(jenisSet);
        };

        const uniqueCategories = getUniqueJenis(tasksList);

        const calculateRemainingDays = (deadline) => {
            const now = new Date();
            const dueDate = new Date(deadline);
            now.setHours(0, 0, 0, 0);
            dueDate.setHours(0, 0, 0, 0);
            const diffTime = dueDate.getTime() - now.getTime();
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        };

        const formatTasks = (title, tasks) => {
            if (!tasks || tasks.length === 0) return '';
            let formatted = `*== ${title.toUpperCase()} ==*\n\n`;
            tasks.forEach((t, i) => {
                const remainingDays = calculateRemainingDays(t.deadline);
                let deadlineText;
                if (remainingDays < 0) deadlineText = `🔴 Terlambat ${Math.abs(remainingDays)} hari`;
                else if (remainingDays === 0) deadlineText = `🔵 Deadline HARI INI!`;
                else deadlineText = `Sisa ${remainingDays} hari lagi`;

                const subjectName = t.subject || 'Tanpa Nama Matkul';
                const taskTitle = t.taskName ? `${t.taskName} - ${t.title}` : (t.title || 'Gak ada judulnya woy');

                formatted += `${i + 1}. *${subjectName}*\n   - ${taskTitle}\n   - Deadline: ${deadlineText}\n\n`;
            });
            return formatted;
        };

        const kategori = (args[0] || '').toLowerCase();

        if (!kategori) {
            let msg = `*Pilih kategori rekap tugas yang ingin dilihat:*\n\n`;
            msg += `• .${command} semua\n`;
            
            uniqueCategories.forEach(kat => {
                msg += `• .${command} ${kat}\n`;
            });
            return conn.reply(m.chat, msg, m);
        }

        let result = '';

        if (kategori === 'semua') {
            const className = resJson.classInfo?.nama || 'Kelas Ini';
            result = `*-> REKAP SEMUA TUGAS ${className} <-*\n\n`;
            // result += "Coba fitur KA14 baru di:\nhttps://task.aniqu.biz.id/login-member\n\n";
            
            uniqueCategories.forEach(kat => {
                const filteredTasks = tasksList.filter(t => t.jenis && t.jenis.some(j => j.toLowerCase() === kat));
                result += formatTasks(kat, filteredTasks);
            });
        } else {
            if (!uniqueCategories.includes(kategori)) {
                return conn.reply(m.chat, `Kategori *${kategori}* gak ada atau belum ada tugasnya saat ini.\nKetik .${command} untuk melihat list kategori yang tersedia.`, m);
            }
            const filteredTasks = tasksList.filter(t => t.jenis && t.jenis.some(j => j.toLowerCase() === kategori));
            
            if (filteredTasks.length === 0) {
                return conn.reply(m.chat, `Mau cari apa hayooo kan ngga ada tugas buat *${kategori}*`, m);
            }

            result = formatTasks(kategori, filteredTasks);
        }

        conn.reply(m.chat, result.trim(), m);

    } catch (err) {
        console.error(err);
        conn.reply(m.chat, `Terjadi kesalahan: ${err.message}`, m);
    }
};

handler.help = ['rekaptugas', 'rekaptugas semua'];
handler.tags = ['tools'];
handler.command = ["rekaptugas", "rekaptugas semua"];

module.exports = handler;