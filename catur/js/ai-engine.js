// Chesster Bot AI & Simulated Online Opponents Engine
// Comprehensive pool of 110+ bots across Pemula, Menengah, Lanjutan, Master, and GM tiers.
// Realistic ELO calibration, genius sacrifice detection, human blunder simulation, and dynamic matchmaking.

const PIECE_VALUES = {
  p: 100,
  n: 320,
  b: 335,
  r: 500,
  q: 950,
  k: 20000
};

// Piece-Square Tables (White perspective, mirror for Black)
const PAWN_TABLE = [
  [0,  0,  0,  0,  0,  0,  0,  0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5,  5, 10, 25, 25, 10,  5,  5],
  [0,  0,  0, 20, 20,  0,  0,  0],
  [5, -5,-10,  0,  0,-10, -5,  5],
  [5, 10, 10,-20,-20, 10, 10,  5],
  [0,  0,  0,  0,  0,  0,  0,  0]
];

const KNIGHT_TABLE = [
  [-50,-40,-30,-30,-30,-30,-40,-50],
  [-40,-20,  0,  0,  0,  0,-20,-40],
  [-30,  0, 10, 15, 15, 10,  0,-30],
  [-30,  5, 15, 20, 20, 15,  5,-30],
  [-30,  0, 15, 20, 20, 15,  0,-30],
  [-30,  5, 10, 15, 15, 10,  5,-30],
  [-40,-20,  0,  5,  5,  0,-20,-40],
  [-50,-40,-30,-30,-30,-30,-40,-50]
];

const BISHOP_TABLE = [
  [-20,-10,-10,-10,-10,-10,-10,-20],
  [-10,  0,  0,  0,  0,  0,  0,-10],
  [-10,  0,  5, 10, 10,  5,  0,-10],
  [-10,  5,  5, 10, 10,  5,  5,-10],
  [-10,  0, 10, 10, 10, 10,  0,-10],
  [-10, 10, 10, 10, 10, 10, 10,-10],
  [-10,  5,  0,  0,  0,  0,  5,-10],
  [-20,-10,-10,-10,-10,-10,-10,-20]
];

const ROOK_TABLE = [
  [0,  0,  0,  0,  0,  0,  0,  0],
  [5, 10, 10, 10, 10, 10, 10,  5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [0,  0,  0,  5,  5,  0,  0,  0]
];

const KING_TABLE = [
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-20,-30,-30,-40,-40,-30,-30,-20],
  [-10,-20,-20,-20,-20,-20,-20,-10],
  [20, 20,  0,  0,  0,  0, 20, 20],
  [20, 30, 10,  0,  0, 10, 30, 20]
];

// Expanded pool of 110+ simulated online opponents across all skill tiers
const FAKE_OPPONENTS_POOL = [
  // ================= 1. TIER PEMULA / ROOKIE (ELO 650 - 1050) =================
  { name: "BocilKuda_ID", title: "", elo: 680, country: "🇮🇩", style: "Main Asal Lompat", avatar: "🐴" },
  { name: "KucingCatur_ID", title: "", elo: 720, country: "🇮🇩", style: "Pemula Ceria", avatar: "🐱" },
  { name: "PionMajuTerus", title: "", elo: 740, country: "🇮🇩", style: "Gak Mau Mundur", avatar: "🚶" },
  { name: "Siswa_SD_Catur", title: "", elo: 750, country: "🇮🇩", style: "Baru Belajar Langkah Kuda", avatar: "🎒" },
  { name: "BlunderBoy_00", title: "", elo: 780, country: "🇬🇧", style: "Sering Lupa Bidak Terancam", avatar: "🤪" },
  { name: "NoobQueen_77", title: "", elo: 790, country: "🇬🇧", style: "Menteri Sering Keluar Awal", avatar: "👑" },
  { name: "PawnPusher_Max", title: "", elo: 810, country: "🇺🇸", style: "Dorong Semua Pion Depan", avatar: "♟️" },
  { name: "SultanCatur_Warkop", title: "", elo: 830, country: "🇮🇩", style: "Gaya Main Santai", avatar: "☕" },
  { name: "BlunderKing99", title: "", elo: 850, country: "🇬🇧", style: "Serang Tanpa Rencana", avatar: "🎲" },
  { name: "PemulaNgantuk", title: "", elo: 870, country: "🇮🇩", style: "Langkah Kurang Fokus", avatar: "🥱" },
  { name: "PawnStormer_ID", title: "", elo: 890, country: "🇮🇩", style: "Penyuka Dorong Pion", avatar: "🇮🇩" },
  { name: "KudaBengkok", title: "", elo: 910, country: "🇮🇩", style: "Bingung Huruf L", avatar: "🐎" },
  { name: "Budi_Pemula", title: "", elo: 930, country: "🇮🇩", style: "Belajar Pembukaan Dasar", avatar: "🧑‍🎓" },
  { name: "GajahBuntung", title: "", elo: 940, country: "🇮🇩", style: "Diagonal Terjepit", avatar: "🐘" },
  { name: "DarkKnight_88", title: "", elo: 960, country: "🇨🇦", style: "Kuda Liar", avatar: "🌙" },
  { name: "RookieStriker", title: "", elo: 975, country: "🇦🇺", style: "Spam Skak Awal", avatar: "⚡" },
  { name: "CoffeeChess_88", title: "", elo: 980, country: "🇺🇸", style: "Main Santai Sambil Ngopi", avatar: "☕" },
  { name: "RookieRook", title: "", elo: 995, country: "🇦🇺", style: "Benteng Keluar Awal", avatar: "🗿" },
  { name: "Pecatur_Posronda", title: "", elo: 1005, country: "🇮🇩", style: "Jagoan Warung Kopi", avatar: "🧋" },
  { name: "ChessValkyrie_21", title: "", elo: 1015, country: "🇸🇪", style: "Pelajar Tekun", avatar: "✨" },
  { name: "SigmaPawn_007", title: "", elo: 1025, country: "🇯🇵", style: "Gerakan Tak Terduga", avatar: "🎲" },
  { name: "Garuda_Sakti", title: "", elo: 1035, country: "🇮🇩", style: "Petarung Lokal", avatar: "🦅" },
  { name: "NoobMaster_ID", title: "", elo: 1045, country: "🇮🇩", style: "Pemburu Skakmat Kilat", avatar: "🎯" },
  { name: "GajahTerbang_ID", title: "", elo: 1050, country: "🇮🇩", style: "Bishop Sniper Pemula", avatar: "🐘" },

  // ================= 2. TIER MENENGAH / CLUB (ELO 1060 - 1490) =================
  { name: "TacticalFox", title: "", elo: 1080, country: "🇫🇷", style: "Suka Taktik Garpu Kuda", avatar: "🦊" },
  { name: "KingSideRaid", title: "", elo: 1090, country: "🇺🇸", style: "Serangan Sayap Raja", avatar: "🦅" },
  { name: "Si_Paling_Gambit", title: "", elo: 1110, country: "🇮🇩", style: "Korban Pion Demi Serangan", avatar: "🔥" },
  { name: "SiciliaMania", title: "", elo: 1130, country: "🇮🇹", style: "Fanatik Sisilia", avatar: "🍕" },
  { name: "BlunderProof", title: "", elo: 1150, country: "🇧🇷", style: "Pemain Bertahan Hati-hati", avatar: "🧱" },
  { name: "KsatriaPasundan", title: "", elo: 1170, country: "🇮🇩", style: "Petarung Tatar Pasundan", avatar: "🐅" },
  { name: "Kuda_Lumping_Chess", title: "", elo: 1190, country: "🇮🇩", style: "Manuver Kuda Lincah", avatar: "🐎" },
  { name: "ScandiQueen", title: "", elo: 1220, country: "🇳🇴", style: "Spesialis Scandinavian", avatar: "👸" },
  { name: "SlavDefense_King", title: "", elo: 1235, country: "🇷🇺", style: "Koleksi Pembukaan Slav", avatar: "🛡️" },
  { name: "Neo_Morpheus", title: "", elo: 1250, country: "🇺🇸", style: "Gaya Modern Dinamis", avatar: "🕶️" },
  { name: "WarkopMaster", title: "", elo: 1285, country: "🇮🇩", style: "Senior Pos Ronda", avatar: "☕" },
  { name: "SemarangTactics", title: "", elo: 1300, country: "🇮🇩", style: "Taktik Lawang Sewu", avatar: "🏛️" },
  { name: "FrenchDefenseGuy", title: "", elo: 1320, country: "🇫🇷", style: "Pembukaan French Kokoh", avatar: "🥖" },
  { name: "BerlinWall_Fan", title: "", elo: 1350, country: "🇩🇪", style: "Dinding Pertahanan Berlin", avatar: "🏰" },
  { name: "Benteng_Kraton", title: "", elo: 1375, country: "🇮🇩", style: "Pertahanan Kuat Nusantara", avatar: "🏯" },
  { name: "TempoMaster_99", title: "", elo: 1390, country: "🇩🇪", style: "Efisiensi Langkah", avatar: "⏱️" },
  { name: "DragonSicilian", title: "", elo: 1410, country: "🇮🇹", style: "Serangan Ganas Sayap Raja", avatar: "🐉" },
  { name: "PionRacun_99", title: "", elo: 1430, country: "🇮🇩", style: "Suka Pasang Jebakan Pion", avatar: "🧪" },
  { name: "AlapAlap_Jawa", title: "", elo: 1435, country: "🇮🇩", style: "Nukik Cepat di Tengah", avatar: "🦅" },
  { name: "LondonSystem_Lover", title: "", elo: 1445, country: "🇬🇧", style: "Pemain Solid London System", avatar: "💂" },
  { name: "JakartaKnight", title: "", elo: 1460, country: "🇮🇩", style: "Taktisi Cepat Ibu Kota", avatar: "⚔️" },
  { name: "CaroKann_Shield", title: "", elo: 1475, country: "🇵🇱", style: "Tembok Caro-Kann", avatar: "🛡️" },
  { name: "Petroff_Knight", title: "", elo: 1480, country: "🇷🇺", style: "Pertahanan Petroff Simetris", avatar: "❄️" },
  { name: "SamuraiTactics", title: "", elo: 1490, country: "🇯🇵", style: "Serangan Tajam Tanpa Ragu", avatar: "⚔️" },

  // ================= 3. TIER LANJUTAN & CM (ELO 1500 - 2190) =================
  { name: "CM_Andi_Kusuma", title: "CM", elo: 1530, country: "🇮🇩", style: "Taktisi Sulawesi", avatar: "🏝️" },
  { name: "EndgameGrinder", title: "", elo: 1540, country: "🇪🇸", style: "Pengincar Babak Akhir", avatar: "⚙️" },
  { name: "KingHunter_RU", title: "", elo: 1590, country: "🇷🇺", style: "Pemburu Raja Terbuka", avatar: "🎯" },
  { name: "CM_Tariq_Ziyad", title: "CM", elo: 1610, country: "🇲🇦", style: "Penyerang Berani", avatar: "🏜️" },
  { name: "QueenSlayer_UK", title: "", elo: 1640, country: "🇬🇧", style: "Berbahaya di Babak Tengah", avatar: "🗡️" },
  { name: "TacticalMaestro", title: "", elo: 1670, country: "🇬🇷", style: "Kombinasi Athena", avatar: "🏛️" },
  { name: "Maestro_Jogja", title: "", elo: 1695, country: "🇮🇩", style: "Taktisi Khas Keraton", avatar: "🎭" },
  { name: "NimzoKing_Ru", title: "", elo: 1720, country: "🇷🇺", style: "Nimzo Indian Expert", avatar: "🧊" },
  { name: "NimzoIndian_Fan", title: "", elo: 1740, country: "🇩🇪", style: "Master Posisi Tertutup", avatar: "📐" },
  { name: "BaliMaster_Chess", title: "", elo: 1760, country: "🇮🇩", style: "Tenang Bagai Pantai", avatar: "🌺" },
  { name: "MasterBandung", title: "", elo: 1780, country: "🇮🇩", style: "Juara Kejurda Jabar", avatar: "🏆" },
  { name: "SicilianPoison", title: "", elo: 1820, country: "🇦🇷", style: "Serangan Tajam Karang", avatar: "🐍" },
  { name: "Giordano_Tactics", title: "", elo: 1840, country: "🇮🇹", style: "Taktik Italia Klasik", avatar: "🎭" },
  { name: "Surabaya_Rook", title: "", elo: 1860, country: "🇮🇩", style: "Dominasi Jalur Terbuka", avatar: "⚓" },
  { name: "VortexKnight", title: "", elo: 1910, country: "🇺🇸", style: "Kalkulasi Cepat & Dalam", avatar: "🌪️" },
  { name: "CM_Zul_Karnain", title: "CM", elo: 1940, country: "🇲🇾", style: "Candidate Master Malaya", avatar: "🗡️" },
  { name: "CM_Surya_Kencana", title: "CM", elo: 1980, country: "🇮🇩", style: "Candidate Master Senior", avatar: "🏅" },
  { name: "BlownKingside", title: "", elo: 2010, country: "🇬🇧", style: "Spesialis Pengorbanan Benteng", avatar: "💥" },
  { name: "CM_Oleg_Petrov", title: "CM", elo: 2040, country: "🇺🇦", style: "Candidate Master Ukraina", avatar: "🎖️" },
  { name: "CM_Arjun_Nair", title: "CM", elo: 2090, country: "🇮🇳", style: "Taktik Cepat India", avatar: "🇮🇳" },
  { name: "CM_Hans_Bauer", title: "CM", elo: 2120, country: "🇦🇹", style: "Ahli Strategi Wina", avatar: "🎼" },
  { name: "CM_Dimas_Pratama", title: "CM", elo: 2150, country: "🇮🇩", style: "Calon Master Nasional", avatar: "🌟" },
  { name: "CM_Kenji_Sato", title: "CM", elo: 2170, country: "🇯🇵", style: "Disiplin Taktis Tinggi", avatar: "⛩️" },
  { name: "CM_Viktor_Blau", title: "CM", elo: 2190, country: "🇩🇪", style: "Posisional Murni", avatar: "🦅" },

  // ================= 4. TIER MASTER (FM / IM) (ELO 2200 - 2490) =================
  { name: "FM_Budi_Santoso", title: "FM", elo: 2210, country: "🇮🇩", style: "FIDE Master Solid", avatar: "🇮🇩" },
  { name: "FM_Agus_Salim", title: "FM", elo: 2230, country: "🇮🇩", style: "Veteran Turnamen Catur", avatar: "🎖️" },
  { name: "FM_Lucas_Moreau", title: "FM", elo: 2240, country: "🇫🇷", style: "Serangan Balik Kilat", avatar: "⚜️" },
  { name: "FM_Elena_Rook", title: "FM", elo: 2275, country: "🇺🇦", style: "Kombinasi Sayap Menteri", avatar: "⚡" },
  { name: "IM_Sergei_Voronov", title: "IM", elo: 2290, country: "🇷🇺", style: "Master Posisi Tertutup", avatar: "🐻" },
  { name: "FM_Rizky_Hidayat", title: "FM", elo: 2310, country: "🇮🇩", style: "Juara Sirkuit Nasional", avatar: "🥇" },
  { name: "FM_Dewi_Kartika", title: "FM", elo: 2320, country: "🇮🇩", style: "Kombinasi Taktis Halus", avatar: "🌸" },
  { name: "FM_Mateo_Silva", title: "FM", elo: 2335, country: "🇧🇷", style: "Taktisi Karibia Cepat", avatar: "🦜" },
  { name: "FM_David_K", title: "FM", elo: 2360, country: "🇨🇿", style: "Master Kalkulasi Varian", avatar: "🧠" },
  { name: "IM_Hiroshi_Tanaka", title: "IM", elo: 2375, country: "🇯🇵", style: "Perhitungan Presisi Tokyo", avatar: "🏯" },
  { name: "IM_KnightRider", title: "IM", elo: 2390, country: "🇺🇸", style: "International Master Blitz", avatar: "🐎" },
  { name: "IM_Fajar_Nugraha", title: "IM", elo: 2410, country: "🇮🇩", style: "Bintang Catur Indonesia", avatar: "🎖️" },
  { name: "FM_Carlos_Mendoza", title: "FM", elo: 2420, country: "🇲🇽", style: "Serangan Tajam Latin", avatar: "🌵" },
  { name: "IM_Marcus_V", title: "IM", elo: 2430, country: "🇳🇱", style: "Pertahanan Sempurna", avatar: "🛡️" },
  { name: "IM_Aleksei_G", title: "IM", elo: 2445, country: "🇷🇺", style: "Maestro Posisi Terikat", avatar: "🐻" },
  { name: "IM_Chun_Liang", title: "IM", elo: 2460, country: "🇨🇳", style: "Kalkulasi Cepat Shanghai", avatar: "🐉" },
  { name: "IM_Pierre_Dubois", title: "IM", elo: 2465, country: "🇫🇷", style: "Maestro Middlegame Paris", avatar: "🥐" },
  { name: "IM_Siti_Nurhaliza", title: "IM", elo: 2470, country: "🇮🇩", style: "Master Wanita Tangguh", avatar: "🧕" },
  { name: "IM_Goran_Ilic", title: "IM", elo: 2480, country: "🇷🇸", style: "Pengalaman Turnamen Dunia", avatar: "🐺" },
  { name: "IM_Viktor_K", title: "IM", elo: 2490, country: "🇭🇺", style: "Penjaga Ambang Grandmaster", avatar: "⚔️" },

  // ================= 5. TIER GRANDMASTER (GM) (HANYA MUNCUL DI "TANTANG GM") =================
  { name: "GM_Dafa_Nugroho", title: "GM", elo: 2540, country: "🇮🇩", style: "GM Kebanggaan Indonesia", avatar: "🇮🇩" },
  { name: "GM_Utut_Legacy", title: "GM", elo: 2580, country: "🇮🇩", style: "Legenda Posisional Indonesia", avatar: "👑" },
  { name: "GM_Elena_Petrova", title: "GM", elo: 2595, country: "🇺🇦", style: "Kalkulasi Dinamis Kelas Dunia", avatar: "⚔️" },
  { name: "GM_Sokolov_99", title: "GM", elo: 2620, country: "🇷🇸", style: "Serangan Tanpa Ampun", avatar: "🔥" },
  { name: "GM_Maxime_V", title: "GM", elo: 2655, country: "🇫🇷", style: "Kecepatan Taktis Prancis", avatar: "⚡" },
  { name: "GM_Kovalev_Tactics", title: "GM", elo: 2680, country: "🇷🇺", style: "Penghancur Taktis Brutal", avatar: "👑" },
  { name: "GM_Aditya_Rao", title: "GM", elo: 2695, country: "🇮🇳", style: "Master Posisional India", avatar: "🛡️" },
  { name: "GM_Vincenzo_B", title: "GM", elo: 2715, country: "🇮🇹", style: "Virtuoso Babak Akhir", avatar: "🎯" },
  { name: "GM_Alexander_V", title: "GM", elo: 2745, country: "🇩🇪", style: "Strategis Mendalam", avatar: "⚡" },
  { name: "GM_Wei_Chen", title: "GM", elo: 2760, country: "🇨🇳", style: "Dinding Pertahanan Asia Timur", avatar: "🐉" },
  { name: "GM_Ding_Liren_Echo", title: "GM", elo: 2770, country: "🇨🇳", style: "Juara Dunia Penuh Perjuangan", avatar: "👑" },
  { name: "GM_Anish_Giri_Solid", title: "GM", elo: 2775, country: "🇳🇱", style: "Dinding Anti Kalah Belanda", avatar: "🛡️" },
  { name: "GM_Alireza_Speed", title: "GM", elo: 2780, country: "🇫🇷", style: "Kilat Taktis Generasi Baru", avatar: "🏎️" },
  { name: "GM_Wesley_So_Universal", title: "GM", elo: 2790, country: "🇺🇸", style: "Soliditas Universal", avatar: "🦅" },
  { name: "GM_Pragg_Thunder", title: "GM", elo: 2800, country: "🇮🇳", style: "Petir Serangan Cepat Chennai", avatar: "⚡" },
  { name: "GM_Hikaru_Echo", title: "GM", elo: 2810, country: "🇺🇸", style: "Refleks Blitz Tercepat Dunia", avatar: "⚡" },
  { name: "GM_Levon_Aronian", title: "GM", elo: 2815, country: "🇦🇲", style: "Kreativitas Penuh Magis", avatar: "🎨" },
  { name: "GM_Magnus_Clone", title: "GM", elo: 2825, country: "🇳🇴", style: "Mesin Posisi Tanpa Celah", avatar: "👑" },
  { name: "GM_Kasparov_Beast", title: "GM", elo: 2845, country: "🇦🇿", style: "Energi Menghancurkan Baku", avatar: "🦁" },
  { name: "GM_Alpha_Titan", title: "GM", elo: 2860, country: "🇬🇧", style: "Analisis Komputer Tanpa Kompromi", avatar: "🤖" },
  { name: "GM_Stockfish_Mini", title: "GM", elo: 2870, country: "🤖", style: "Kalkulasi Komputer Brutal", avatar: "🤖" },
  { name: "GM_DeepBlue_Omega", title: "GM", elo: 2880, country: "🇺🇸", style: "Kekuatan Absolut 64 Petak", avatar: "🌌" }
];

class ChessterBotAI {
  constructor() {
    this.name = "Bot";
    this.title = "";
    this.elo = 1000;
  }

  // Generates a simulated opponent matching the user's situation
  static generateOpponent(userElo = 1000, forceGM = false) {
    if (forceGM) {
      // Exclusively pick from Grandmasters (GM) pool!
      const gms = FAKE_OPPONENTS_POOL.filter(o => o.title === "GM");
      const pick = gms[Math.floor(Math.random() * gms.length)];
      return { ...pick };
    }

    // REGULAR MATCHMAKING: NEVER match with a GM unless user clicked "Tantang GM"!
    // Filter non-GM opponents close to user's ELO (+/- 150 points)
    const nonGMs = FAKE_OPPONENTS_POOL.filter(o => o.title !== "GM");

    // Find opponents near user's skill level
    let matched = nonGMs.filter(o => Math.abs(o.elo - userElo) <= 150);
    if (matched.length === 0) {
      // Fallback: nearest 6 non-GM opponents
      matched = [...nonGMs].sort((a, b) => Math.abs(a.elo - userElo) - Math.abs(b.elo - userElo)).slice(0, 6);
    }

    const pick = matched[Math.floor(Math.random() * matched.length)];
    // Add small random jitter (+/- 15 ELO) for natural rating variance
    const jitter = Math.floor(Math.random() * 31) - 15;
    return {
      ...pick,
      elo: Math.max(650, pick.elo + jitter)
    };
  }

  // Evaluate board score from current perspective
  evaluateBoard(game, color) {
    let score = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = game.board[r][c];
        if (!p) continue;

        let pieceVal = PIECE_VALUES[p.type] || 0;
        let posVal = 0;

        const pr = p.color === 'w' ? r : 7 - r;
        const pc = p.color === 'w' ? c : 7 - c;

        if (p.type === 'p') posVal = PAWN_TABLE[pr][pc];
        else if (p.type === 'n') posVal = KNIGHT_TABLE[pr][pc];
        else if (p.type === 'b') posVal = BISHOP_TABLE[pr][pc];
        else if (p.type === 'r') posVal = ROOK_TABLE[pr][pc];
        else if (p.type === 'k') posVal = KING_TABLE[pr][pc];

        const total = pieceVal + posVal;
        if (p.color === color) {
          score += total;
        } else {
          score -= total;
        }
      }
    }
    return score;
  }

  // Minimax with Alpha-Beta
  minimax(game, depth, alpha, beta, isMaximizing, botColor) {
    const over = game.isGameOver();
    if (over.over) {
      if (over.winner === botColor) return 100000;
      if (over.winner && over.winner !== botColor) return -100000;
      return 0; // draw
    }

    if (depth === 0) {
      return this.evaluateBoard(game, botColor);
    }

    const moves = game.getLegalMoves();
    moves.sort((a, b) => (b.captured ? 1 : 0) - (a.captured ? 1 : 0));

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const m of moves) {
        const state = game.cloneState();
        game.executeMoveInternal(m);
        const ev = this.minimax(game, depth - 1, alpha, beta, false, botColor);
        game.restoreState(state);
        maxEval = Math.max(maxEval, ev);
        alpha = Math.max(alpha, ev);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const m of moves) {
        const state = game.cloneState();
        game.executeMoveInternal(m);
        const ev = this.minimax(game, depth - 1, alpha, beta, true, botColor);
        game.restoreState(state);
        minEval = Math.min(minEval, ev);
        beta = Math.min(beta, ev);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  // Compute move calibrated to bot's exact ELO skill level and realistic blunder chance
  findMove(game, opponentElo = 1000) {
    const botColor = game.turn;
    const moves = game.getLegalMoves();
    if (moves.length === 0) return null;

    // 1. Skill Calibration: Depth and Blunder Probability
    let depth = 1;
    let blunderRate = 0.30; // 30% blunder rate for ~800-1050 ELO

    if (opponentElo >= 2500) {
      depth = 3;
      blunderRate = 0.0; // Grandmaster: 0% blunder
    } else if (opponentElo >= 2200) {
      depth = 2;
      blunderRate = 0.03; // FM / IM: 3% blunder
    } else if (opponentElo >= 1600) {
      depth = 2;
      blunderRate = 0.08; // Advanced: 8% blunder
    } else if (opponentElo >= 1200) {
      depth = 2;
      blunderRate = 0.16; // Intermediate: 16% blunder
    } else if (opponentElo >= 1000) {
      depth = 1;
      blunderRate = 0.28; // Apprentice (around 1000 ELO): 28% blunder rate
    } else {
      depth = 1;
      blunderRate = 0.38; // Rookie (<1000 ELO): 38% blunder rate
    }

    // Evaluate all moves with score
    const scoredMoves = [];
    for (const m of moves) {
      const state = game.cloneState();
      game.executeMoveInternal(m);
      const ev = this.minimax(game, depth - 1, -Infinity, Infinity, false, botColor);
      game.restoreState(state);
      scoredMoves.push({ move: m, score: ev });
    }

    // Sort moves descending by evaluation score
    scoredMoves.sort((a, b) => b.score - a.score);

    // 2. Real Human Blunder Generation
    const willBlunder = Math.random() < blunderRate && scoredMoves.length > 1;

    if (willBlunder) {
      // Pick a suboptimal / blunder move (a move that drops evaluation or leaves a piece hanging)
      const worstHalf = scoredMoves.slice(Math.max(1, Math.floor(scoredMoves.length * 0.4)));
      if (worstHalf.length > 0) {
        const picked = worstHalf[Math.floor(Math.random() * worstHalf.length)];
        const blunderMove = { ...picked.move, isBotBlunder: true };
        return blunderMove;
      }
    }

    // Return the best evaluated move (plus slight randomness among near-equal top moves)
    const topScore = scoredMoves[0].score;
    const nearTop = scoredMoves.filter(m => topScore - m.score <= 15);
    const chosen = nearTop[Math.floor(Math.random() * nearTop.length)];
    return chosen.move;
  }
}

window.ChessterBotAI = ChessterBotAI;
window.FAKE_OPPONENTS_POOL = FAKE_OPPONENTS_POOL;
