`Cek Khodam Rek 🗿😹`


let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (command === 'cekkodam' || command === 'cekodam' || command === 'cekhodam' || command === 'cekkhodam') {
    const result = await cekkhodam();
    if (m.key.fromMe) {
        let txt = `- Khodam yang ada didalam diri \`@${m.quoted ? m.quoted.sender.split("@")[0] : m.sender.split("@")[0]}\` : ${result.khodam}\n\n> Penjelasan: ${result.description}`;
        await m.reply(txt, { edit: m.key, mentions: [m.quoted ? m.quoted.sender : m.sender] });
    } else {
        await m.reply(`- Khodam yang ada didalam diri \`@${m.quoted ? m.quoted.sender.split("@")[0] : m.sender.split("@")[0]}\` : ${result.khodam}\n\n> Penjelasan: ${result.description}`);
    }
  }
};
handler.help = ["cekkhodam"];
handler.tags = ["fun"];
handler.command = ["cekkhodam"];
module.exports = handler;

                async function cekkhodam() {
                    const animals = [
                        "Kucing", "Tikus", "Kadal", "Kuda Nil", "Bunglon", "Siput", "Koala", "Kodok", "Monyet", "Anjing",
                        "Harimau", "Kuda", "Komodo", "Gajah", "Cicak", "Ular", "Kura-kura", "Lele", "Singa", "Zebra",
                        "Bebek", "Ayam", "Buaya", "Gorila", "Naga", "Ikan", "Ubu-ubur", "Cacing", "Semut", "Udang",
                        "Musang", "Kecoak", "Kupu-kupu", "Laba-laba", "Elang", "Sapi", "Kambing", "Kelinci", "Belut", 
                        "Berang-berang", "Hiu", "Paus", "Lumba-lumba", "Burung Hantu", "Kakaktua", "Merpati", "Bebek",
                        "Ayam Kalkun", "Kepiting", "Lobster", "Ular Piton", "Iguana", "Salamander", "Katak Pohon", 
                        "Burung Pelikan", "Burung Cendrawasih", "Rubah", "Serigala", "Beruang", "Babi Hutan", "Kijang",
                        "Antelop", "Kudanil", "Jerapah", "Gajah Afrika", "Kanguru", "Koala", "Wombat", "Platipus", 
                        "Tarsius", "Orangutan", "Simba", "Mandril", "Gelada", "Gorila Gunung", "Panda", "Harimau Siberia",
                        "Macan Tutul", "Cheetah", "Lynx", "Jaguar", "Ocelot", "Serval", "Kucing Hutan", "Karacal", 
                        "Puma", "Rakun", "Binturong", "Kuskus", "Tenggiling", "Luwak", "Civet", "Kangguru Pohon", 
                        "Anoa", "Babi Rusa", "Kancil", "Tarsius", "Bekantan", "Monyet Ekor Panjang", "Lutung", 
                        "Orangutan Kalimantan", "Burung Maleo", "Kasuar", "Kakaktua Raja", "Cendrawasih Kuning Besar"
                    ];
                    const behaviours = [
                        "Jawa", "Depresi", "Mekanik", "Metal", "Insom", "Skizo", "Klepto", "Bunting", "Birahi", 
                        "Sigma", "Raksasa", "Berkaki Seribu", "Sad boy", "Mewing", "Gyatt", "Yapper", "Ambis", 
                        "Dribble", "Ngesot", "Sunda", "Kalimantan", "Kutub", "Sumatera", "Yapper", "Skizo", 
                        "Mendengkur", "Berjalan", "Melompat", "Terbang", "Berenang", "Berkelahi", "Mengunyah", 
                        "Mendaki", "Mengendus", "Memburu", "Merayap", "Bersarang", "Menangis", "Tertawa", "Bersorak"
                    ];
                    const things = [
                        "Speaker JBL", "Toa Masjid", "Lemari 2 Pintu", "Kulkas", "Taplak Meja", "Pecel Lele", 
                        "Charger Iphone", "TWS", "Kalkulator", "Sendal Jepit", "Undur-undur Maju", "Bagas Dribble", 
                        "Sapu Lidi", "Gagang Pintu", "Tutup Toples", "Rice Cooker", "Gerobak Ketoprak", "Ban Motor", 
                        "Bakwan Jagung", "Rice Cooker", "Kompor Gas", "Laptop", "Handphone", "Televisi", "Kipas Angin", 
                        "Mesin Cuci", "Sepeda Motor", "Mobil", "Traktor", "Oven", "Microwave", "Blender", "Lampu",
                        "Kamera", "Proyektor", "Mesin Jahit", "Mesin Tik", "Printer", "Fax", "Kopi Mesin", 
                        "Dispenser", "Pemanggang Roti", "Penggorengan", "Cetakan Kue", "Mixer", "Juicer", 
                        "Senter", "Kipas Angin Listrik", "AC", "Heater", "Vakum Cleaner", "Setrika", "Panci", 
                        "Wajan", "Cerobong Asap", "Mesin Kasir", "Komputer", "Monitor", "Mouse", "Keyboard", 
                        "Speakers", "Headphones", "Microphone", "Peralatan Dapur", "Peralatan Makan", "Peralatan Tidur",
                        "Peralatan Mandi", "Peralatan Kebersihan", "Peralatan Taman", "Peralatan Bengkel", 
                        "Peralatan Kantor", "Peralatan Sekolah", "Mainan", "Alat Musik", "Peralatan Olahraga", 
                        "Alat Memancing", "Alat Berkebun", "Peralatan Camping", "Peralatan Pertukangan", 
                        "Alat Pancing", "Peralatan Membuat Kue", "Peralatan Menjahit"
                    ];
            
                    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
                    const randomBehaviour = behaviours[Math.floor(Math.random() * behaviours.length)];
                    const randomThing = things[Math.floor(Math.random() * things.length)];
                    const randomTest = Math.random() > 0.5;
            
                    const animalDescriptions = [
                        `Khodam ini menunjukkan keberanian dan ketangkasan dari ${randomAnimal} yang ${randomBehaviour}.`,
                        `${randomAnimal} yang ${randomBehaviour} membawa energi yang kuat dan melindungi Anda.`,
                        `Kombinasi dari ${randomAnimal} dan ${randomBehaviour} memberikan Anda kekuatan luar biasa.`,
                        `${randomAnimal} yang ${randomBehaviour} akan membantu Anda dalam mengatasi berbagai rintangan.`,
                        `Keberadaan ${randomAnimal} yang ${randomBehaviour} dalam diri Anda menunjukkan sifat kepemimpinan dan kebijaksanaan.`
                    ];
                    
                    const thingDescriptions = [
                      "mampu menghasilkan suara luar biasa", "membawa berkah dalam setiap doa", "menyimpan kenangan dalam pintunya", 
                      "menyegarkan suasana dengan dinginnya", "menambah keindahan meja makan", "menggugah selera dengan citarasa lezat", 
                      "menyimpan daya untuk waktu yang lama", "memutar musik dengan kualitas terbaik", "memecahkan masalah dengan perhitungan cepat", 
                      "menjadikan setiap langkah nyaman", "bergerak mundur dengan ketepatan", "memiliki keahlian dribble yang luar biasa", 
                      "membersihkan segala kotoran", "membuka pintu kesempatan", "menjaga kesegaran makanan", 
                      "memasak nasi dengan sempurna", "membawa makanan ketoprak lezat", "menggulung dengan kekuatan", 
                      "menggoreng makanan hingga matang", "memasak nasi dengan sempurna", "menyediakan gas untuk memasak", 
                      "menjalankan banyak aplikasi dengan cepat", "menghubungkan dengan dunia luar", "menampilkan gambar yang jelas", 
                      "menyediakan angin sejuk", "membersihkan pakaian dengan mudah", "mengantar ke berbagai tempat", 
                      "menyediakan transportasi pribadi", "membajak sawah dengan kekuatan", "memasak makanan dengan efisien", 
                      "memanaskan makanan dengan cepat", "menghaluskan bahan makanan", "menerangi ruangan", 
                      "mengabadikan momen", "menampilkan presentasi dengan jelas", "menjahit pakaian dengan rapi", 
                      "mengetik dokumen dengan cepat", "mencetak dokumen dengan jelas", "mengirim faksimile", 
                      "menyeduh kopi dengan cepat", "menyediakan air minum", "memanggang roti hingga renyah", 
                      "menggoreng makanan dengan cepat", "membuat kue dengan bentuk sempurna", "mengaduk bahan makanan dengan cepat", 
                      "menyajikan jus segar", "menyediakan penerangan", "menyediakan angin dingin", 
                      "menghangatkan ruangan", "membersihkan debu dengan efisien", "menghilangkan kerutan pada pakaian", 
                      "memasak dengan sempurna", "menyajikan makanan dengan indah", "menyaring udara kotor", 
                      "menghitung uang dengan cepat", "menjalankan program dengan cepat", "menampilkan gambar dengan jelas", 
                      "mengontrol pointer dengan presisi", "mengetik dengan cepat", "menghasilkan suara berkualitas tinggi", 
                      "menyajikan suara jernih", "mengabadikan suara dengan jelas", "menyediakan alat dapur lengkap", 
                      "menyajikan makanan dengan indah", "menyediakan tidur nyaman", "menyediakan mandi yang menyegarkan", 
                      "membersihkan rumah dengan mudah", "menyediakan alat taman lengkap", "menyediakan alat bengkel lengkap", 
                      "menyediakan alat kantor lengkap", "menyediakan alat sekolah lengkap", "menyediakan mainan yang menghibur", 
                      "menyediakan alat musik berkualitas", "menyediakan alat olahraga lengkap", "menyediakan alat memancing lengkap", 
                      "menyediakan alat berkebun lengkap", "menyediakan alat camping lengkap", "menyediakan alat pertukangan lengkap", 
                      "menyediakan alat pancing lengkap", "menyediakan alat membuat kue lengkap", "menyediakan alat menjahit lengkap"
                  ];
            
                    const description = randomTest 
                        ? animalDescriptions[Math.floor(Math.random() * animalDescriptions.length)]
                        : thingDescriptions[Math.floor(Math.random() * thingDescriptions.length)];
            
                    return {
                        khodam: randomTest ? `${randomAnimal} ${randomBehaviour}` : randomThing,
                        description
                    };
                }