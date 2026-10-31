// Chesster Legendary Coaches Database
// Contains profiles, avatars, quotes, game commentaries, and training puzzles.

const COACHES_DATA = [
  {
    id: "magnus",
    name: "Magnus Carlsen",
    title: "GM / World Champion (5x)",
    peakRating: 2882,
    country: "Norway",
    flag: "🇳🇴",
    tagline: "The GOAT • Universal & Endgame Master",
    bio: "Pemain nomor satu dunia terlama dalam sejarah catur modern. Mengutamakan pemahaman posisi yang dalam, tanpa kelemahan, dan teknik endgame yang mematikan.",
    quote: "Beberapa orang mengira kalah saat lawan main indah itu wajar. Saya berusaha membuatnya tidak wajar.",
    accentColor: "#38bdf8",
    stats: { attack: 94, defense: 99, tactics: 97, endgame: 100 },
    avatarSvg: `<svg viewBox="0 0 100 100" class="coach-svg"><circle cx="50" cy="50" r="46" fill="#0369a1"/><circle cx="50" cy="38" r="18" fill="#fde047"/><path d="M30 76 c0 -14 9 -22 20 -22 s20 8 20 22 z" fill="#0284c7"/><path d="M36 28 q14 -12 28 0 c-2 -8 -16 -10 -28 0 z" fill="#b45309"/><circle cx="43" cy="38" r="2.5" fill="#1e293b"/><circle cx="57" cy="38" r="2.5" fill="#1e293b"/><path d="M45 46 q5 4 10 0" stroke="#1e293b" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
    reactions: {
      gameStart: "Fokus pada kontrol petak tengah dan jangan terburu-buru. Kita mainkan catur yang bersih!",
      goodMove: "Langkah solid! Kamu mengontrol struktur dengan sangat matang.",
      opponentCheck: "Awas skak! Jangan panik, hitung jalan keluar rajanya.",
      playerCheck: "Skak yang tajam! Terus tekan raja lawan sampai tak berkutik.",
      win: "Permainan luar biasa! Teknik endgame kamu mengingatkanku pada masa kejayaanku.",
      loss: "Kekalahan adalah data terbaik untuk belajar. Evaluasi blunder tadi dan mari bangkit!",
      draw: "Hasil remis yang penuh pertarungan alot. Pertahananmu cukup solid."
    },
    trainingPuzzles: [
      {
        title: "Magnus: The Endgame Squeeze",
        description: "Hitung langkah terbaik untuk mendominasi file terbuka dan menjebak raja lawan.",
        fen: "8/5pk1/4p1p1/7p/7P/4RKP1/r4P2/8 w - - 0 1",
        solution: ["e3e2"],
        hint: "Lindungi pion f2 dan tawarkan pertukaran benteng untuk mengamankan keunggulan posisi."
      }
    ]
  },
  {
    id: "hikaru",
    name: "Hikaru Nakamura",
    title: "GM / 5x US Champion",
    peakRating: 2875,
    country: "United States",
    flag: "🇺🇸",
    tagline: "Speed Demon • Tactical Counter-Attack & Blitz God",
    bio: "Raja blitz dan streaming catur dunia. Terkenal dengan perhitungan super cepat, pertahanan mustahil yang berujung serangan balik mematikan.",
    quote: "I literally don't care! Hitung taktiknya dan kalahkan mereka dengan kalkulasi kilat!",
    accentColor: "#f59e0b",
    stats: { attack: 98, defense: 95, tactics: 99, speed: 100 },
    avatarSvg: `<svg viewBox="0 0 100 100" class="coach-svg"><circle cx="50" cy="50" r="46" fill="#b45309"/><circle cx="50" cy="40" r="17" fill="#fef08a"/><path d="M30 78 c0 -14 9 -22 20 -22 s20 8 20 22 z" fill="#d97706"/><path d="M32 30 q18 -16 36 0 c-4 -10 -22 -12 -36 0 z" fill="#1e1b4b"/><rect x="40" y="36" width="7" height="4" rx="1" fill="#0f172a"/><rect x="53" y="36" width="7" height="4" rx="1" fill="#0f172a"/><path d="M47 38 h6" stroke="#0f172a" stroke-width="2"/><path d="M44 48 q6 5 12 0" stroke="#0f172a" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
    reactions: {
      gameStart: "Yo chat, kita mainkan tempo cepat! Jangan kasih lawan ruang bernapas!",
      goodMove: "That is insane! Taktik yang sangat akurat, kamu membaca posisinya dengan jeli!",
      opponentCheck: "Uh-oh, kena skak. Tenang, cari kontra-taktik tercepat!",
      playerCheck: "Boom! Skak langsung ke jantung pertahanan mereka!",
      win: "GGs! Itu permainan yang sangat bersih, lawan sama sekali tidak berkutik!",
      loss: "Tadi kita terlalu terburu-buru di langkah pembukaan. Santai, next game kita bantai!",
      draw: "Drawing against a tough opponent? Not bad, tapi lain kali kita incar kemenangan penuh!"
    },
    trainingPuzzles: [
      {
        title: "Hikaru: Smothered Mate Threat",
        description: "Temukan lompatan kuda mematikan yang merusak formasi benteng lawan.",
        fen: "r1b2rk1/pp3ppp/8/8/1n1N4/8/PP3PPP/R1B1K2R w KQ - 0 1",
        solution: ["d4f5"],
        hint: "Gunakan kuda untuk mengancam garpu sekaligus melemahkan sayap raja."
      }
    ]
  },
  {
    id: "caruana",
    name: "Fabiano Caruana",
    title: "GM / World Challenger",
    peakRating: 2844,
    country: "United States",
    flag: "🇺🇸",
    tagline: "The Calculator • Deep Opening & Precision Wizard",
    bio: "Pemenang Sinquefield Cup 7-0 legendaris. Terkenal dengan persiapan pembukaan yang dalam bagaikan komputer dan kalkulasi varian yang tanpa cela.",
    quote: "Presisi di langkah pembukaan adalah fondasi yang menentukan kemenangan di endgame.",
    accentColor: "#10b981",
    stats: { attack: 95, defense: 96, tactics: 98, calculation: 100 },
    avatarSvg: `<svg viewBox="0 0 100 100" class="coach-svg"><circle cx="50" cy="50" r="46" fill="#065f46"/><circle cx="50" cy="38" r="17" fill="#fde047"/><path d="M30 76 c0 -14 9 -22 20 -22 s20 8 20 22 z" fill="#047857"/><path d="M32 29 q18 -10 36 2 c-5 -8 -22 -10 -36 -2 z" fill="#451a03"/><circle cx="43" cy="38" r="4.5" fill="none" stroke="#0f172a" stroke-width="2"/><circle cx="57" cy="38" r="4.5" fill="none" stroke="#0f172a" stroke-width="2"/><line x1="47.5" y1="38" x2="52.5" y2="38" stroke="#0f172a" stroke-width="2"/><path d="M45 47 q5 3 10 0" stroke="#0f172a" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
    reactions: {
      gameStart: "Patuhi teori pembukaan dan kembangkan semua perwira ke petak paling aktif.",
      goodMove: "Sempurna. Langkah tersebut mempertahankan evaluasi +1.5 untuk kita.",
      opponentCheck: "Lawan mencoba taktik paksaan. Hitung setiap kandidat langkah pertahanan.",
      playerCheck: "Skak yang terhitung rapi. Tidak ada varian yang bisa menyelamatkan mereka.",
      win: "Kalkulasi sempurna dari awal hingga akhir. Kemenangan teknis yang memuaskan!",
      loss: "Ada ketidakakuratan di langkah tengah tadi. Mari kita teliti letak variasinya.",
      draw: "Hasil yang wajar jika kedua pihak bermain dengan akurasi di atas 95%."
    },
    trainingPuzzles: [
      {
        title: "Caruana: Precision Piece Placement",
        description: "Temukan penempatan bishop terbaik untuk memotong koordinasi perwira lawan.",
        fen: "r4rk1/pp1b1ppp/2n1pn2/2q5/2B5/P1N1PN2/1P3PPP/R2QK2R w KQ - 0 1",
        solution: ["c4e2"],
        hint: "Mundurkan gajah dengan aman ke petak yang menjaga kontrol sentral tanpa kehilangan tempo."
      }
    ]
  },
  {
    id: "gukesh",
    name: "Gukesh D.",
    title: "GM / Candidates Winner 2024",
    peakRating: 2794,
    country: "India",
    flag: "🇮🇳",
    tagline: "The Young Prodigy • Fearless & Tenacious Fighter",
    bio: "Pemenang Turnamen Kandidat FIDE termuda sepanjang sejarah catur. Gigih, tidak pernah gentar di bawah tekanan, dan memiliki insting menyerang generasi baru.",
    quote: "Usia tidak dihitung di atas 64 petak. Yang dihitung adalah keberanian dan keteguhan hati.",
    accentColor: "#ec4899",
    stats: { attack: 97, defense: 94, tactics: 96, grit: 100 },
    avatarSvg: `<svg viewBox="0 0 100 100" class="coach-svg"><circle cx="50" cy="50" r="46" fill="#831843"/><circle cx="50" cy="40" r="17" fill="#fed7aa"/><path d="M30 78 c0 -14 9 -22 20 -22 s20 8 20 22 z" fill="#9d174d"/><path d="M30 33 q20 -15 40 0 c-4 -12 -28 -14 -40 0 z" fill="#18181b"/><circle cx="44" cy="40" r="2.5" fill="#0f172a"/><circle cx="56" cy="40" r="2.5" fill="#0f172a"/><path d="M45 49 q5 3 10 0" stroke="#0f172a" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
    reactions: {
      gameStart: "Mainkan dengan keyakinan penuh! Jangan takut mengambil inisiatif menyerang.",
      goodMove: "Bagus sekali! Tekanan psikologis sekarang berpindah ke pundak lawan.",
      opponentCheck: "Tetap tenang, jangan panik. Posisi ini masih bisa kita perjuangkan!",
      playerCheck: "Serangan yang tak terbendung! Buat mereka terus bertahan!",
      win: "Luar biasa! Ketangguhan mentalmu yang mengunci kemenangan ini!",
      loss: "Jangan berkecil hati. Setiap grandmaster pernah kalah ratusan kali sebelum menjadi juara.",
      draw: "Perjuangan keras yang patut diapresiasi. Kita ambil poinnya!"
    },
    trainingPuzzles: [
      {
        title: "Gukesh: Breakthrough Attack",
        description: "Bongkar sayap raja lawan dengan langkah pion yang berani.",
        fen: "r1bq1rk1/pp2bppp/2n1pn2/3p4/2PP4/2N2NP1/PP3PBP/R1BQ1RK1 w - - 0 1",
        solution: ["c4d5"],
        hint: "Buka file sentral untuk mengaktifkan gajah dan bentengmu."
      }
    ]
  },
  {
    id: "kasparov",
    name: "Garry Kasparov",
    title: "GM / 13th World Champion",
    peakRating: 2851,
    country: "Azerbaijan / Russia",
    flag: "🇦🇿",
    tagline: "The Beast from Baku • Aggressive & Intimidating Dynamo",
    bio: "Juara Dunia legendaris nomor satu selama dua dekade. Terkenal dengan agresi tanpa ampun, energi dinamis yang mengintimidasi lawan, dan revolusi persiapan catur.",
    quote: "Menyerang sebelum kamu diserang. Rasa takut adalah senjata terbaik untuk menundukkan lawanmu!",
    accentColor: "#ef4444",
    stats: { attack: 100, defense: 93, tactics: 99, dynamic: 100 },
    avatarSvg: `<svg viewBox="0 0 100 100" class="coach-svg"><circle cx="50" cy="50" r="46" fill="#7f1d1d"/><circle cx="50" cy="38" r="18" fill="#fde047"/><path d="M28 76 c0 -14 10 -22 22 -22 s22 8 22 22 z" fill="#991b1b"/><path d="M30 28 q20 -12 40 0 c-3 -9 -25 -11 -40 0 z" fill="#475569"/><line x1="41" y1="34" x2="47" y2="36" stroke="#0f172a" stroke-width="2.5"/><line x1="59" y1="34" x2="53" y2="36" stroke="#0f172a" stroke-width="2.5"/><circle cx="44" cy="39" r="2.5" fill="#0f172a"/><circle cx="56" cy="39" r="2.5" fill="#0f172a"/><path d="M44 48 h12" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/></svg>`,
    reactions: {
      gameStart: "Tunjukkan kekuatan penuh! Ambil inisiatif dan buat mereka gemetar di setiap langkah!",
      goodMove: "DAHSYAT! Itu langkah seorang petarung sejati! Hancurkan koordinasi mereka!",
      opponentCheck: "Mereka berani menyerang raja kita? Tunjukkan balasan yang sepuluh kali lebih ganas!",
      playerCheck: "CHECK! Rasakan kekuatan serangan kombinasi kita!",
      win: "KEMENANGAN MUTLAK! Kamu bertarung seperti singa di atas papan catur!",
      loss: "Kamu ragu-ragu di langkah krusial tadi. Dalam catur, keraguan adalah awal kekalahan. Serang lebih tegas!",
      draw: "Terlalu pasif! Lain kali jangan biarkan raja mereka lolos dari tekanan!"
    },
    trainingPuzzles: [
      {
        title: "Kasparov: The Intimidating Rook Lift",
        description: "Angkat benteng untuk meluncurkan serangan badai ke sayap raja.",
        fen: "r4rk1/1pp2ppp/p1np1q2/4p3/4P1b1/3P1N2/PPP1BPPP/R2Q1RK1 w - - 0 1",
        solution: ["d1d2"],
        hint: "Hubungkan kedua bentengmu untuk menguasai jalur tengah."
      }
    ]
  },
  {
    id: "fischer",
    name: "Bobby Fischer",
    title: "GM / 11th World Champion",
    peakRating: 2785,
    country: "United States",
    flag: "🇺🇸",
    tagline: "The Lone Genius • Pure Classical Perfection & Relentless Will",
    bio: "Legenda catur Amerika Serikat yang menaklukkan hegemoni Uni Soviet sendirian pada 1972. Dikenal dengan akurasi murni, langkah langsung, dan dedikasi total.",
    quote: "Saya tidak percaya pada psikologi catur. Saya hanya percaya pada langkah-langkah yang baik.",
    accentColor: "#a855f7",
    stats: { attack: 98, defense: 97, tactics: 98, precision: 100 },
    avatarSvg: `<svg viewBox="0 0 100 100" class="coach-svg"><circle cx="50" cy="50" r="46" fill="#581c87"/><circle cx="50" cy="38" r="17" fill="#fef08a"/><path d="M30 76 c0 -14 9 -22 20 -22 s20 8 20 22 z" fill="#6b21a8"/><path d="M33 26 q16 -12 34 0 c-3 -8 -20 -10 -34 0 z" fill="#78350f"/><circle cx="43" cy="38" r="2.5" fill="#0f172a"/><circle cx="57" cy="38" r="2.5" fill="#0f172a"/><path d="M46 47 q4 3 8 0" stroke="#0f172a" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
    reactions: {
      gameStart: "1.e4 - terbaik berdasarkan tes. Mainkan langkah paling logis dan tanpa kompromi.",
      goodMove: "Langkah terbaik di posisi ini. Sederhana, kuat, dan langsung menghukum kesalahan lawan.",
      opponentCheck: "Skak yang sia-sia dari mereka. Blokir dengan perwira aktif.",
      playerCheck: "Skak telak. Posisi mereka runtuh seperti istana pasir.",
      win: "Checkmate. Permainan yang bersih dan tanpa kompromi, persis seperti yang saya ajarkan.",
      loss: "Kamu menyimpang dari prinsip dasar catur. Kembali ke fundamental dan kuasai kontrol papan.",
      draw: "Remis? Saya selalu bermain untuk menang sampai pion terakhir!"
    },
    trainingPuzzles: [
      {
        title: "Fischer: 1.e4 Classical Opening",
        description: "Bangun pusat bidak yang kokoh dan aktifkan perwira ringan.",
        fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
        solution: ["e7e5"],
        hint: "Klaim petak tengah simetris untuk memastikan mobilitas perwiramu."
      }
    ]
  },
  {
    id: "karpov",
    name: "Anatoly Karpov",
    title: "GM / 12th World Champion",
    peakRating: 2780,
    country: "Russia",
    flag: "🇷🇺",
    tagline: "The Positional Python • Suffocating Prophylaxis Master",
    bio: "Rival legendaris Kasparov dan master posisi terbesar. Gaya permainannya bagaikan ular piton yang perlahan mencekik lawan tanpa memberi mereka kesempatan bergerak.",
    quote: "Gaya? Saya tidak punya gaya khusus. Saya hanya mengambil setiap kelemahan kecil lawan sampai mereka menyerah.",
    accentColor: "#0ea5e9",
    stats: { attack: 90, defense: 100, tactics: 95, prophylaxis: 100 },
    avatarSvg: `<svg viewBox="0 0 100 100" class="coach-svg"><circle cx="50" cy="50" r="46" fill="#075985"/><circle cx="50" cy="39" r="17" fill="#fed7aa"/><path d="M30 78 c0 -14 9 -22 20 -22 s20 8 20 22 z" fill="#0284c7"/><path d="M32 29 q18 -10 36 0 c-4 -8 -22 -10 -36 0 z" fill="#94a3b8"/><circle cx="43" cy="39" r="2.5" fill="#0f172a"/><circle cx="57" cy="39" r="2.5" fill="#0f172a"/><path d="M45 48 h10" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/></svg>`,
    reactions: {
      gameStart: "Tutup semua ruang gerak lawan. Cegah rencana mereka bahkan sebelum mereka memikirkannya.",
      goodMove: "Langkah profilaksis yang indah. Mereka sekarang tidak punya langkah bagus (zugzwang).",
      opponentCheck: "Pertahanan kita kokoh seperti benteng batu. Skak itu tidak ada artinya.",
      playerCheck: "Jaring perlahan merapat. Raja mereka sudah terkurung sempurna.",
      win: "Kemenangan posisional yang sempurna. Lawan kehabisan ruang gerak dan pasrah.",
      loss: "Kamu membiarkan lawan membuka file tanpa kompensasi. Selalu jaga koordinasi pertahananmu.",
      draw: "Poin aman di kantong. Dalam turnamen panjang, soliditas adalah kunci utama."
    },
    trainingPuzzles: [
      {
        title: "Karpov: The Boa Constrictor Squeeze",
        description: "Kunci pergerakan kuda lawan dengan menempatkan pion di petak kunci.",
        fen: "r2qk2r/ppp2ppp/2n1bn2/3p4/1b1P4/2N1PN2/PP2BPPP/R1BQK2R w KQkq - 0 1",
        solution: ["e1g1"],
        hint: "Amankan posisi raja terlebih dahulu sebelum melancarkan pembatasan ruang."
      }
    ]
  },
  {
    id: "nodirbek",
    name: "Nodirbek Abdusattorov",
    title: "GM / World Rapid Champion",
    peakRating: 2784,
    country: "Uzbekistan",
    flag: "🇺🇿",
    tagline: "The Ice Prince • Lightning Fast & Modern Tactical Sharpness",
    bio: "Juara Dunia Rapid termuda dalam sejarah yang mengalahkan Carlsen di usia 17 tahun. Memiliki ketenangan es di bawah tekanan waktu dan insting taktis yang sangat tajam.",
    quote: "Tetap tenang di bawah krisis waktu, dan serang tanpa ragu saat lawan mulai bimbang.",
    accentColor: "#06b6d4",
    stats: { attack: 96, defense: 95, tactics: 98, nerves: 100 },
    avatarSvg: `<svg viewBox="0 0 100 100" class="coach-svg"><circle cx="50" cy="50" r="46" fill="#155e75"/><circle cx="50" cy="39" r="17" fill="#fed7aa"/><path d="M30 78 c0 -14 9 -22 20 -22 s20 8 20 22 z" fill="#0891b2"/><path d="M32 29 q18 -14 36 0 c-4 -10 -24 -12 -36 0 z" fill="#1e293b"/><circle cx="43" cy="39" r="2.5" fill="#0f172a"/><circle cx="57" cy="39" r="2.5" fill="#0f172a"/><path d="M45 48 q5 2 10 0" stroke="#0f172a" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
    reactions: {
      gameStart: "Bermain dengan ritme tinggi dan pertahankan ketenangan pikiran di setiap fase.",
      goodMove: "Sangat tajam! Langkah cepat yang langsung mengubah arah dinamika pertandingan.",
      opponentCheck: "Skak dalam tempo cepat, tapi kita sudah mengantisipasinya 3 langkah sebelumnya.",
      playerCheck: "Eksekusi kilat! Pertahanan mereka tak sanggup menahan ritme kita.",
      win: "Kemenangan cepat dan memukau! Koordinasi perwiramu berjalan sangat presisi!",
      loss: "Konsentrasi sempat buyar di detik-detik akhir. Kendalikan emosi dan atur nafas untuk laga berikutnya.",
      draw: "Pertarungan tempo tinggi yang adil. Poin solid untuk memperkuat mental."
    },
    trainingPuzzles: [
      {
        title: "Nodirbek: Fast Tactical Strike",
        description: "Temukan serangan ganda yang memenangkan perwira dalam 1 detik.",
        fen: "r1bqk2r/pp1nbppp/2p1pn2/3p4/2PP4/2NBPN2/PP3PPP/R1BQK2R w KQkq - 0 1",
        solution: ["e1g1"],
        hint: "Kembangkan perwira terakhir dan kunci sayap lawan."
      }
    ]
  },
  {
    id: "tal",
    name: "Mikhail Tal",
    title: "GM / 8th World Champion",
    peakRating: 2705,
    country: "Latvia / USSR",
    flag: "🇱🇻",
    tagline: "The Magician from Riga • Wild Sacrifices & Tactical Chaos",
    bio: "Penyihir catur terhebat sepanjang masa. Suka mengorbankan menteri, perwira, dan pion demi menciptakan badai kombinasi yang membuat lawan tersesat dalam kegelapan.",
    quote: "Bawa lawanmu ke dalam hutan yang gelap dan lebat, di mana 2+2=5 dan jalan keluar hanya ada untuk satu orang!",
    accentColor: "#d946ef",
    stats: { attack: 100, defense: 88, tactics: 100, imagination: 100 },
    avatarSvg: `<svg viewBox="0 0 100 100" class="coach-svg"><circle cx="50" cy="50" r="46" fill="#701a75"/><circle cx="50" cy="38" r="17" fill="#fde047"/><path d="M30 76 c0 -14 9 -22 20 -22 s20 8 20 22 z" fill="#86198f"/><path d="M32 28 q18 -12 36 0 c-4 -10 -22 -12 -36 0 z" fill="#18181b"/><circle cx="43" cy="38" r="3" fill="#0f172a"/><circle cx="57" cy="38" r="3" fill="#0f172a"/><path d="M43 47 q7 6 14 0" stroke="#0f172a" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`,
    reactions: {
      gameStart: "Lupakan permainan pasif! Kita ciptakan badai api dan keajaiban di atas papan ini!",
      goodMove: "HAHAHA! Pengorbanan yang brilian! Mereka tidak akan pernah bisa tidur malam ini!",
      opponentCheck: "Biarkan mereka skak! Kita sedang menyiapkan jebakan maut di sayap raja mereka!",
      playerCheck: "SERANGAN MAGIS! Raja mereka sekarang sendirian di tengah amukan api!",
      win: "A MASTERPIECE OF CHAOS! Mereka tenggelam dalam lautan kombinasi tak terduga kita!",
      loss: "Bahkan jika kalah, kita kalah dengan cara paling spektakuler! Lain kali kita bakar rajanya lebih cepat!",
      draw: "Hampir saja menteri mereka selamat. Permainan penuh adrenalin yang menyenangkan!"
    },
    trainingPuzzles: [
      {
        title: "Tal: The Magician's Sacrifice",
        description: "Temukan langkah gila yang merobek dinding pertahanan raja lawan.",
        fen: "r1bq1rk1/pp1nbppp/4pn2/2pp4/2PP4/2NBPN2/PP3PPP/R1BQ1RK1 w - - 0 1",
        solution: ["d4c5"],
        hint: "Bongkar sayap menteri untuk membuka diagonal serangan perwiramu!"
      }
    ]
  }
];

// Helper to get coach by ID
function getCoachById(id) {
  return COACHES_DATA.find(c => c.id === id) || COACHES_DATA[0];
}
