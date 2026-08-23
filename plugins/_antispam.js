export async function before(m, { isAdmin, isOwner }) {
   
    let user = global.db.data.users[m.sender];
    let chat = global.db.data.chats[m.chat];

    if (!user || !chat) return; 

    if (chat.antispam === false) return;
    if (isAdmin || isOwner || !user || !chat) return; 
    if ((m.chat.endsWith('broadcast') || m.fromMe) && !m.message && !chat.isBanned) return;
    
    if (!m.text) return;

    let isCommand = /^[.#!\\/]/.test(m.text);
    if (!isCommand) return;

    let now = Date.now();
    if (user.banned && now >= user.bannedTime) {
        user.banned = false;
        user.bannedTime = 0;
    }
    
    if (user.banned) return;

    this.spam = this.spam || {};
    
    if (m.sender in this.spam) {
        this.spam[m.sender].count++;
        
       // Menghitung selisih waktu (dalam milidetik) antara waktu saat ini (now)
        // dengan waktu terakhir kali user tersebut mengirim pesan (lastspam).
        let timeDiff = now - this.spam[m.sender].lastspam;
        
        // Mengecek kecepatan mengetik. 
        // 2500 milidetik = 2,5 detik. 
        // Jika selisih waktunya di bawah 2,5 detik, berarti user mengetik sangat cepat.
        if (timeDiff < 2500) { 
            
            // Mengecek jumlah pesan.
            // Jika dalam waktu super cepat itu (di bawah 2,5 detik) dia sudah mmebuat
            // pesan ke-3 (atau lebih), maka sistem fix menganggapnya sebagai SPAM.
            // jadi kalau mau ubah berapa ban yak user bisa perintah bot dalam waktu 2.5 detik disini
            if (this.spam[m.sender].count >= 3) {
                
                // user banned 
                user.banned = true; 
                
                // Menentukan durasi hukuman (10.000 milidetik = 10 detik) atur aja kalau mau kurang atau lebih durasi banned nya
                let penalty = 10000; 
                
                // persiapan waktu kapan hukuman ini akan berakhir ke dalam database
                // Waktu sekarang ditambah 10 detik ke depan.
                user.bannedTime = now + penalty; 
                
                // Memberikan peringatan ke user bahwa mereka terkena mute
                m.reply('🚫 *SPAM TERDETEKSI!* 🚫\n\nKamu mengetik command terlalu cepat! Tunggu *10 detik* sebelum bisa menggunakan bot kembali. ⏳');
            }
        } else {
            // Jika selisih waktunya lebih dari 2,5 detik (mengetik dengan santai/normal),
            // maka hitungan pesannya dikembalikan lagi ke angka 1.
            this.spam[m.sender].count = 1;
        }
        
        this.spam[m.sender].lastspam = now;
    } else {
        this.spam[m.sender] = {
            jid: m.sender,
            count: 1,
            lastspam: now
        };
    }
}