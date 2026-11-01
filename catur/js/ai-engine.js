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

// Expanded pool of 150+ simulated online opponents across all skill tiers
const FAKE_OPPONENTS_POOL = [
  // ================= 1. TIER PEMULA / ROOKIE (ELO 650 - 1050) =================
  { name: "BocilKuda_ID", title: "", elo: 680, country: "🇮🇩", style: "Main Asal Lompat", avatar: "🐴" },
  { name: "RajaCaturCilik", title: "", elo: 695, country: "🇮🇩", style: "Penyuka Langkah Kuda", avatar: "👦" },
  { name: "PecaturKampung", title: "", elo: 710, country: "🇮🇩", style: "Gaya Spontan Cepat", avatar: "🌾" },
  { name: "KucingCatur_ID", title: "", elo: 720, country: "🇮🇩", style: "Pemula Ceria", avatar: "🐱" },
  { name: "BocilTactics", title: "", elo: 735, country: "🇮🇩", style: "Serang Terus Pantang Mundur", avatar: "🎮" },
  { name: "PionMajuTerus", title: "", elo: 740, country: "🇮🇩", style: "Gak Mau Mundur", avatar: "🚶" },
  { name: "Siswa_SD_Catur", title: "", elo: 750, country: "🇮🇩", style: "Baru Belajar Langkah Kuda", avatar: "🎒" },
  { name: "ChessNewbie_SG", title: "", elo: 760, country: "🇸🇬", style: "Pelajar Singapura", avatar: "🦁" },
  { name: "BlunderBoy_00", title: "", elo: 780, country: "🇬🇧", style: "Sering Lupa Bidak Terancam", avatar: "🤪" },
  { name: "NoobQueen_77", title: "", elo: 790, country: "🇬🇧", style: "Menteri Sering Keluar Awal", avatar: "👑" },
  { name: "KudaTerbang_Solo", title: "", elo: 805, country: "🇮🇩", style: "Manuver Kuda Bengawan Solo", avatar: "🐎" },
  { name: "PawnPusher_Max", title: "", elo: 810, country: "🇺🇸", style: "Dorong Semua Pion Depan", avatar: "♟️" },
  { name: "SultanCatur_Warkop", title: "", elo: 830, country: "🇮🇩", style: "Gaya Main Santai", avatar: "☕" },
  { name: "PionBaja_Sby", title: "", elo: 840, country: "🇮🇩", style: "Pertahanan Lambat Tapi Rapat", avatar: "🛡️" },
  { name: "BlunderKing99", title: "", elo: 850, country: "🇬🇧", style: "Serang Tanpa Rencana", avatar: "🎲" },
  { name: "KucingPutih_MY", title: "", elo: 860, country: "🇲🇾", style: "Main Santai Menara KL", avatar: "🐈" },
  { name: "PemulaNgantuk", title: "", elo: 870, country: "🇮🇩", style: "Langkah Kurang Fokus", avatar: "🥱" },
  { name: "BintangKecil_Chess", title: "", elo: 885, country: "🇮🇩", style: "Langkah Penuh Kehati-hatian", avatar: "⭐" },
  { name: "PawnStormer_ID", title: "", elo: 890, country: "🇮🇩", style: "Penyuka Dorong Pion", avatar: "🇮🇩" },
  { name: "KudaBengkok", title: "", elo: 910, country: "🇮🇩", style: "Bingung Huruf L", avatar: "🐎" },
  { name: "CoffeeBlitz_Bandung", title: "", elo: 920, country: "🇮🇩", style: "Ngopi Dago Sambil Main", avatar: "☕" },
  { name: "Budi_Pemula", title: "", elo: 930, country: "🇮🇩", style: "Belajar Pembukaan Dasar", avatar: "🧑‍🎓" },
  { name: "GajahBuntung", title: "", elo: 940, country: "🇮🇩", style: "Diagonal Terjepit", avatar: "🐘" },
  { name: "PecaturPantai_Bali", title: "", elo: 955, country: "🇮🇩", style: "Santai Kuta Tapi Serius", avatar: "🏄" },
  { name: "DarkKnight_88", title: "", elo: 960, country: "🇨🇦", style: "Kuda Liar", avatar: "🌙" },
  { name: "RookieStriker", title: "", elo: 975, country: "🇦🇺", style: "Spam Skak Awal", avatar: "⚡" },
  { name: "MedanKnight_Horas", title: "", elo: 980, country: "🇮🇩", style: "Serang Tanpa Ragu Horas", avatar: "⚔️" },
  { name: "CoffeeChess_88", title: "", elo: 985, country: "🇺🇸", style: "Main Santai Sambil Ngopi", avatar: "☕" },
  { name: "RookieRook", title: "", elo: 995, country: "🇦🇺", style: "Benteng Keluar Awal", avatar: "🗿" },
  { name: "Pecatur_Posronda", title: "", elo: 1005, country: "🇮🇩", style: "Jagoan Warung Kopi", avatar: "🧋" },
  { name: "AnakWarnet_Chess", title: "", elo: 1010, country: "🇮🇩", style: "Taktik Spontan Cepat", avatar: "🕹️" },
  { name: "ChessValkyrie_21", title: "", elo: 1015, country: "🇸🇪", style: "Pelajar Tekun", avatar: "✨" },
  { name: "SigmaPawn_007", title: "", elo: 1025, country: "🇯🇵", style: "Gerakan Tak Terduga", avatar: "🎲" },
  { name: "RatuPetir_Jogja", title: "", elo: 1030, country: "🇮🇩", style: "Suka Majukan Menteri", avatar: "⚡" },
  { name: "Garuda_Sakti", title: "", elo: 1035, country: "🇮🇩", style: "Petarung Lokal", avatar: "🦅" },
  { name: "GarudaMuda_Chess", title: "", elo: 1045, country: "🇮🇩", style: "Disiplin Dasar Kuat", avatar: "🇮🇩" },
  { name: "GajahTerbang_ID", title: "", elo: 1050, country: "🇮🇩", style: "Bishop Sniper Pemula", avatar: "🐘" },

  // ================= 2. TIER MENENGAH / CLUB (ELO 1060 - 1490) =================
  { name: "TacticalFox", title: "", elo: 1080, country: "🇫🇷", style: "Suka Taktik Garpu Kuda", avatar: "🦊" },
  { name: "SemarangPawn_King", title: "", elo: 1085, country: "🇮🇩", style: "Pion Rantai Kokoh", avatar: "🏛️" },
  { name: "KingSideRaid", title: "", elo: 1090, country: "🇺🇸", style: "Serangan Sayap Raja", avatar: "🦅" },
  { name: "Si_Paling_Gambit", title: "", elo: 1110, country: "🇮🇩", style: "Korban Pion Demi Serangan", avatar: "🔥" },
  { name: "MalangKnight_Hero", title: "", elo: 1115, country: "🇮🇩", style: "Kuda Gesit Arema", avatar: "🦁" },
  { name: "SiciliaMania", title: "", elo: 1130, country: "🇮🇹", style: "Fanatik Sisilia", avatar: "🍕" },
  { name: "SingaBorneo_Chess", title: "", elo: 1140, country: "🇮🇩", style: "Tangguh Hutan Kalimantan", avatar: "🌴" },
  { name: "BlunderProof", title: "", elo: 1150, country: "🇧🇷", style: "Pemain Bertahan Hati-hati", avatar: "🧱" },
  { name: "KsatriaMataram", title: "", elo: 1165, country: "🇮🇩", style: "Filosofi Catur Sabar", avatar: "🏯" },
  { name: "KsatriaPasundan", title: "", elo: 1170, country: "🇮🇩", style: "Petarung Tatar Pasundan", avatar: "🐅" },
  { name: "BangkaRook_Lead", title: "", elo: 1185, country: "🇮🇩", style: "Benteng Timah Kuat", avatar: "⚓" },
  { name: "Kuda_Lumping_Chess", title: "", elo: 1190, country: "🇮🇩", style: "Manuver Kuda Lincah", avatar: "🐎" },
  { name: "MakassarStriker", title: "", elo: 1210, country: "🇮🇩", style: "Serangan Maritim Phinisi", avatar: "⛵" },
  { name: "ScandiQueen", title: "", elo: 1220, country: "🇳🇴", style: "Spesialis Scandinavian", avatar: "👸" },
  { name: "SlavDefense_King", title: "", elo: 1235, country: "🇷🇺", style: "Koleksi Pembukaan Slav", avatar: "🛡️" },
  { name: "JayapuraEagle", title: "", elo: 1240, country: "🇮🇩", style: "Cenderawasih Sayap Cepat", avatar: "🦅" },
  { name: "Neo_Morpheus", title: "", elo: 1250, country: "🇺🇸", style: "Gaya Modern Dinamis", avatar: "🕶️" },
  { name: "PadangTactics", title: "", elo: 1260, country: "🇮🇩", style: "Strategi Pedas Padang", avatar: "🌶️" },
  { name: "WarkopMaster", title: "", elo: 1285, country: "🇮🇩", style: "Senior Pos Ronda", avatar: "☕" },
  { name: "BatamBlitz_Fast", title: "", elo: 1290, country: "🇮🇩", style: "Refleks Cepat Selat Malaka", avatar: "⚡" },
  { name: "SemarangTactics", title: "", elo: 1300, country: "🇮🇩", style: "Taktik Lawang Sewu", avatar: "🏛️" },
  { name: "ManadoKing_Storm", title: "", elo: 1315, country: "🇮🇩", style: "Badai Bunaken Sayap Raja", avatar: "🌊" },
  { name: "FrenchDefenseGuy", title: "", elo: 1320, country: "🇫🇷", style: "Pembukaan French Kokoh", avatar: "🥖" },
  { name: "AcehRencong_Chess", title: "", elo: 1340, country: "🇮🇩", style: "Serangan Menusuk Rencong", avatar: "🗡️" },
  { name: "BerlinWall_Fan", title: "", elo: 1350, country: "🇩🇪", style: "Dinding Pertahanan Berlin", avatar: "🏰" },
  { name: "PalembangMusi", title: "", elo: 1370, country: "🇮🇩", style: "Arus Tenang Menghanyutkan", avatar: "🌉" },
  { name: "Benteng_Kraton", title: "", elo: 1375, country: "🇮🇩", style: "Pertahanan Kuat Nusantara", avatar: "🏯" },
  { name: "TempoMaster_99", title: "", elo: 1390, country: "🇩🇪", style: "Efisiensi Langkah", avatar: "⏱️" },
  { name: "BangkokElephant", title: "", elo: 1395, country: "🇹🇭", style: "Gajah Silang Tajam", avatar: "🐘" },
  { name: "DragonSicilian", title: "", elo: 1410, country: "🇮🇹", style: "Serangan Ganas Sayap Raja", avatar: "🐉" },
  { name: "ManilaKnight_PH", title: "", elo: 1415, country: "🇵🇭", style: "Kecepatan Tangan Cepat", avatar: "🇵🇭" },
  { name: "PionRacun_99", title: "", elo: 1430, country: "🇮🇩", style: "Suka Pasang Jebakan Pion", avatar: "🧪" },
  { name: "AlapAlap_Jawa", title: "", elo: 1435, country: "🇮🇩", style: "Nukik Cepat di Tengah", avatar: "🦅" },
  { name: "HanoiDragon_VN", title: "", elo: 1440, country: "🇻🇳", style: "Formasi Rapat Disiplin", avatar: "🐉" },
  { name: "LondonSystem_Lover", title: "", elo: 1445, country: "🇬🇧", style: "Pemain Solid London System", avatar: "💂" },
  { name: "JakartaKnight", title: "", elo: 1460, country: "🇮🇩", style: "Taktisi Cepat Ibu Kota", avatar: "⚔️" },
  { name: "KualaLumpur_Tower", title: "", elo: 1465, country: "🇲🇾", style: "Dua Benteng Menara Kembar", avatar: "🗼" },
  { name: "CaroKann_Shield", title: "", elo: 1475, country: "🇵🇱", style: "Tembok Caro-Kann", avatar: "🛡️" },
  { name: "Petroff_Knight", title: "", elo: 1480, country: "🇷🇺", style: "Pertahanan Petroff Simetris", avatar: "❄️" },
  { name: "SingaporeMerlion", title: "", elo: 1485, country: "🇸🇬", style: "Pertahanan Presisi Tinggi", avatar: "🦁" },
  { name: "SamuraiTactics", title: "", elo: 1490, country: "🇯🇵", style: "Serangan Tajam Tanpa Ragu", avatar: "⚔️" },

  // ================= 3. TIER LANJUTAN & CM (ELO 1500 - 2190) =================
  { name: "CM_Andi_Kusuma", title: "CM", elo: 1530, country: "🇮🇩", style: "Taktisi Sulawesi", avatar: "🏝️" },
  { name: "EndgameGrinder", title: "", elo: 1540, country: "🇪🇸", style: "Pengincar Babak Akhir", avatar: "⚙️" },
  { name: "CM_Siti_Fatimah", title: "CM", elo: 1560, country: "🇮🇩", style: "Candidate Master Taktis", avatar: "🧕" },
  { name: "KingHunter_RU", title: "", elo: 1590, country: "🇷🇺", style: "Pemburu Raja Terbuka", avatar: "🎯" },
  { name: "CM_Tariq_Ziyad", title: "CM", elo: 1610, country: "🇲🇦", style: "Penyerang Berani", avatar: "🏜️" },
  { name: "CM_Ahmad_Dahlan", title: "CM", elo: 1625, country: "🇮🇩", style: "Strategis Senior Posisi", avatar: "🎖️" },
  { name: "QueenSlayer_UK", title: "", elo: 1640, country: "🇬🇧", style: "Berbahaya di Babak Tengah", avatar: "🗡️" },
  { name: "CM_Rian_Ardianto", title: "CM", elo: 1660, country: "🇮🇩", style: "Pemain Serang Kilat", avatar: "⚡" },
  { name: "TacticalMaestro", title: "", elo: 1670, country: "🇬🇷", style: "Kombinasi Athena", avatar: "🏛️" },
  { name: "Maestro_Jogja", title: "", elo: 1695, country: "🇮🇩", style: "Taktisi Khas Keraton", avatar: "🎭" },
  { name: "CM_Ratna_Dewi", title: "CM", elo: 1710, country: "🇮🇩", style: "Kombinasi Gajah Sayap", avatar: "🌺" },
  { name: "NimzoKing_Ru", title: "", elo: 1720, country: "🇷🇺", style: "Nimzo Indian Expert", avatar: "🧊" },
  { name: "NimzoIndian_Fan", title: "", elo: 1740, country: "🇩🇪", style: "Master Posisi Tertutup", avatar: "📐" },
  { name: "CM_Taufik_Hidayat", title: "CM", elo: 1750, country: "🇮🇩", style: "Smes Taktis Mematikan", avatar: "🏸" },
  { name: "BaliMaster_Chess", title: "", elo: 1760, country: "🇮🇩", style: "Tenang Bagai Pantai", avatar: "🌺" },
  { name: "MasterBandung", title: "", elo: 1780, country: "🇮🇩", style: "Juara Kejurda Jabar", avatar: "🏆" },
  { name: "CM_Alvaro_Santos", title: "CM", elo: 1810, country: "🇵🇭", style: "Ahli Taktik Kepulauan", avatar: "🇵🇭" },
  { name: "SicilianPoison", title: "", elo: 1820, country: "🇦🇷", style: "Serangan Tajam Karang", avatar: "🐍" },
  { name: "Giordano_Tactics", title: "", elo: 1840, country: "🇮🇹", style: "Taktik Italia Klasik", avatar: "🎭" },
  { name: "Surabaya_Rook", title: "", elo: 1860, country: "🇮🇩", style: "Dominasi Jalur Terbuka", avatar: "⚓" },
  { name: "VortexKnight", title: "", elo: 1910, country: "🇺🇸", style: "Kalkulasi Cepat & Dalam", avatar: "🌪️" },
  { name: "CM_Nguyen_Van_Minh", title: "CM", elo: 1925, country: "🇻🇳", style: "Soliditas Hanoi Catur", avatar: "🇻🇳" },
  { name: "CM_Zul_Karnain", title: "CM", elo: 1940, country: "🇲🇾", style: "Candidate Master Malaya", avatar: "🗡️" },
  { name: "CM_Somchai_P", title: "CM", elo: 1970, country: "🇹🇭", style: "Gaya Siam Penuh Jebakan", avatar: "🇹🇭" },
  { name: "CM_Surya_Kencana", title: "CM", elo: 1980, country: "🇮🇩", style: "Candidate Master Senior", avatar: "🏅" },
  { name: "BlownKingside", title: "", elo: 2010, country: "🇬🇧", style: "Spesialis Pengorbanan Benteng", avatar: "💥" },
  { name: "CM_Oleg_Petrov", title: "CM", elo: 2040, country: "🇺🇦", style: "Candidate Master Ukraina", avatar: "🎖️" },
  { name: "CM_Farhan_Aziz", title: "CM", elo: 2060, country: "🇲🇾", style: "Master Posisi Teratur", avatar: "🕌" },
  { name: "CM_Arjun_Nair", title: "CM", elo: 2090, country: "🇮🇳", style: "Taktik Cepat India", avatar: "🇮🇳" },
  { name: "CM_Lee_Kuan_Chess", title: "CM", elo: 2110, country: "🇸🇬", style: "Kalkulasi Presisi Marina", avatar: "🦁" },
  { name: "CM_Hans_Bauer", title: "CM", elo: 2120, country: "🇦🇹", style: "Ahli Strategi Wina", avatar: "🎼" },
  { name: "CM_Dimas_Pratama", title: "CM", elo: 2150, country: "🇮🇩", style: "Calon Master Nasional", avatar: "🌟" },
  { name: "CM_Kenji_Sato", title: "CM", elo: 2170, country: "🇯🇵", style: "Disiplin Taktis Tinggi", avatar: "⛩️" },
  { name: "CM_Viktor_Blau", title: "CM", elo: 2190, country: "🇩🇪", style: "Posisional Murni", avatar: "🦅" },

  // ================= 4. TIER MASTER (FM / IM) (ELO 2200 - 2490) =================
  { name: "FM_Budi_Santoso", title: "FM", elo: 2210, country: "🇮🇩", style: "FIDE Master Solid", avatar: "🇮🇩" },
  { name: "FM_Gusti_Ngurah", title: "FM", elo: 2225, country: "🇮🇩", style: "Master Bali Taktis", avatar: "🌺" },
  { name: "FM_Agus_Salim", title: "FM", elo: 2230, country: "🇮🇩", style: "Veteran Turnamen Catur", avatar: "🎖️" },
  { name: "FM_Lucas_Moreau", title: "FM", elo: 2240, country: "🇫🇷", style: "Serangan Balik Kilat", avatar: "⚜️" },
  { name: "FM_Hasanuddin_King", title: "FM", elo: 2270, country: "🇮🇩", style: "Ayam Jantan Dari Timur", avatar: "🐓" },
  { name: "FM_Elena_Rook", title: "FM", elo: 2275, country: "🇺🇦", style: "Kombinasi Sayap Menteri", avatar: "⚡" },
  { name: "IM_Sergei_Voronov", title: "IM", elo: 2290, country: "🇷🇺", style: "Master Posisi Tertutup", avatar: "🐻" },
  { name: "FM_Rizky_Hidayat", title: "FM", elo: 2310, country: "🇮🇩", style: "Juara Sirkuit Nasional", avatar: "🥇" },
  { name: "FM_Dewi_Kartika", title: "FM", elo: 2320, country: "🇮🇩", style: "Kombinasi Taktis Halus", avatar: "🌸" },
  { name: "FM_Pattimura_Rook", title: "FM", elo: 2330, country: "🇮🇩", style: "Benteng Kuat Maluku", avatar: "⚓" },
  { name: "FM_Mateo_Silva", title: "FM", elo: 2335, country: "🇧🇷", style: "Taktisi Karibia Cepat", avatar: "🦜" },
  { name: "FM_David_K", title: "FM", elo: 2360, country: "🇨🇿", style: "Master Kalkulasi Varian", avatar: "🧠" },
  { name: "IM_Hiroshi_Tanaka", title: "IM", elo: 2375, country: "🇯🇵", style: "Perhitungan Presisi Tokyo", avatar: "🏯" },
  { name: "IM_KnightRider", title: "IM", elo: 2390, country: "🇺🇸", style: "International Master Blitz", avatar: "🐎" },
  { name: "IM_Fajar_Nugraha", title: "IM", elo: 2410, country: "🇮🇩", style: "Bintang Catur Indonesia", avatar: "🎖️" },
  { name: "IM_Irene_Karisma_Echo", title: "IM", elo: 2420, country: "🇮🇩", style: "Grandmaster Wanita Indonesia", avatar: "👑" },
  { name: "FM_Carlos_Mendoza", title: "FM", elo: 2425, country: "🇲🇽", style: "Serangan Tajam Latin", avatar: "🌵" },
  { name: "IM_Marcus_V", title: "IM", elo: 2430, country: "🇳🇱", style: "Pertahanan Sempurna", avatar: "🛡️" },
  { name: "IM_Medina_Warda_Echo", title: "IM", elo: 2440, country: "🇮🇩", style: "Taktisi Cepat Putri Nasional", avatar: "🌸" },
  { name: "IM_Aleksei_G", title: "IM", elo: 2445, country: "🇷🇺", style: "Maestro Posisi Terikat", avatar: "🐻" },
  { name: "IM_Chun_Liang", title: "IM", elo: 2460, country: "🇨🇳", style: "Kalkulasi Cepat Shanghai", avatar: "🐉" },
  { name: "IM_Pierre_Dubois", title: "IM", elo: 2465, country: "🇫🇷", style: "Maestro Middlegame Paris", avatar: "🥐" },
  { name: "IM_Novendra_P", title: "IM", elo: 2475, country: "🇮🇩", style: "Calon Kuat GM Indonesia", avatar: "🇮🇩" },
  { name: "IM_Goran_Ilic", title: "IM", elo: 2480, country: "🇷🇸", style: "Pengalaman Turnamen Dunia", avatar: "🐺" },
  { name: "IM_Viktor_K", title: "IM", elo: 2490, country: "🇭🇺", style: "Penjaga Ambang Grandmaster", avatar: "⚔️" },

  // ================= 5. TIER GRANDMASTER (GM) (MUNCUL DI "TANTANG GM") =================
  { name: "GM_Dafa_Nugroho", title: "GM", elo: 2540, country: "🇮🇩", style: "GM Kebanggaan Indonesia", avatar: "🇮🇩" },
  { name: "GM_Susanto_Megaranto", title: "GM", elo: 2575, country: "🇮🇩", style: "GM Juara Nasional 4x", avatar: "👑" },
  { name: "GM_Utut_Legacy", title: "GM", elo: 2585, country: "🇮🇩", style: "Legenda Posisional Indonesia", avatar: "👑" },
  { name: "GM_Elena_Petrova", title: "GM", elo: 2595, country: "🇺🇦", style: "Kalkulasi Dinamis Kelas Dunia", avatar: "⚔️" },
  { name: "GM_Sokolov_99", title: "GM", elo: 2620, country: "🇷🇸", style: "Serangan Tanpa Ampun", avatar: "🔥" },
  { name: "GM_Vincent_Keymer", title: "GM", elo: 2650, country: "🇩🇪", style: "Bintang Muda Jerman", avatar: "⚡" },
  { name: "GM_Maxime_V", title: "GM", elo: 2655, country: "🇫🇷", style: "Kecepatan Taktis Prancis", avatar: "⚡" },
  { name: "GM_Kovalev_Tactics", title: "GM", elo: 2680, country: "🇷🇺", style: "Penghancur Taktis Brutal", avatar: "👑" },
  { name: "GM_Aditya_Rao", title: "GM", elo: 2695, country: "🇮🇳", style: "Master Posisional India", avatar: "🛡️" },
  { name: "GM_Vincenzo_B", title: "GM", elo: 2715, country: "🇮🇹", style: "Virtuoso Babak Akhir", avatar: "🎯" },
  { name: "GM_Nodirbek_A", title: "GM", elo: 2740, country: "🇺🇿", style: "Juara Dunia Rapid Uzbekistan", avatar: "⚡" },
  { name: "GM_Alexander_V", title: "GM", elo: 2745, country: "🇩🇪", style: "Strategis Mendalam", avatar: "⚡" },
  { name: "GM_Wei_Chen", title: "GM", elo: 2760, country: "🇨🇳", style: "Dinding Pertahanan Asia Timur", avatar: "🐉" },
  { name: "GM_Ding_Liren_Echo", title: "GM", elo: 2770, country: "🇨🇳", style: "Juara Dunia Penuh Perjuangan", avatar: "👑" },
  { name: "GM_Anish_Giri_Solid", title: "GM", elo: 2775, country: "🇳🇱", style: "Dinding Anti Kalah Belanda", avatar: "🛡️" },
  { name: "GM_Alireza_Speed", title: "GM", elo: 2780, country: "🇫🇷", style: "Kilat Taktis Generasi Baru", avatar: "🏎️" },
  { name: "GM_Ian_Nepo", title: "GM", elo: 2785, country: "🇷🇺", style: "Serangan Badai Rusia", avatar: "🐻" },
  { name: "GM_Wesley_So_Universal", title: "GM", elo: 2790, country: "🇺🇸", style: "Soliditas Universal", avatar: "🦅" },
  { name: "GM_Gukesh_D_Prodigy", title: "GM", elo: 2795, country: "🇮🇳", style: "Pemenang Kandidat Termuda Dunia", avatar: "🇮🇳" },
  { name: "GM_Pragg_Thunder", title: "GM", elo: 2800, country: "🇮🇳", style: "Petir Serangan Cepat Chennai", avatar: "⚡" },
  { name: "GM_Fabiano_Caruana", title: "GM", elo: 2805, country: "🇺🇸", style: "Mesin Kalkulasi 2800+ ELO", avatar: "🧠" },
  { name: "GM_Hikaru_Echo", title: "GM", elo: 2810, country: "🇺🇸", style: "Refleks Blitz Tercepat Dunia", avatar: "⚡" },
  { name: "GM_Arjun_Erigaisi", title: "GM", elo: 2815, country: "🇮🇳", style: "Dinamisme Super Agresif", avatar: "🔥" },
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
    // Permintaan user: kurangi blunder secara signifikan, bot bermain solid!
    // Hanya bot ELO paling lemah (<800) yang blunder nyata secara terukur.
    let depth = 1;
    let blunderRate = 0.04;

    if (opponentElo >= 2400) {
      depth = 3;
      blunderRate = 0.0; // Grandmaster: 0% blunder, kalkulasi dewa
    } else if (opponentElo >= 2100) {
      depth = 2;
      blunderRate = 0.005; // Master: 0.5% (hampir tidak pernah salah)
    } else if (opponentElo >= 1600) {
      depth = 2;
      blunderRate = 0.015; // Lanjutan: 1.5%
    } else if (opponentElo >= 1200) {
      depth = 2;
      blunderRate = 0.03; // Menengah: 3%
    } else if (opponentElo >= 900) {
      depth = 1;
      blunderRate = 0.05; // Pemula wajar (900-1100): hanya 5%
    } else {
      depth = 1;
      blunderRate = 0.16; // ELO paling lemah (<900): 16% kemungkinan kekeliruan
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

    // 2. Human Inaccuracy & Blunder Simulation
    const willBlunder = Math.random() < blunderRate && scoredMoves.length > 1;

    if (willBlunder) {
      // Jika level paling lemah (<850), pilih langkah suboptimal wajar (inaccuracy)
      if (opponentElo < 850) {
        const midStart = Math.min(1, scoredMoves.length - 1);
        const midEnd = Math.min(scoredMoves.length, Math.max(2, Math.floor(scoredMoves.length * 0.55)));
        const candidateSlice = scoredMoves.slice(midStart, midEnd);
        if (candidateSlice.length > 0) {
          const picked = candidateSlice[Math.floor(Math.random() * candidateSlice.length)];
          return { ...picked.move, isBotBlunder: true };
        }
      } else {
        // Untuk ELO lainnya, kesalahan hanya berupa langkah ke-2 atau ke-3 terbaik (sedikit kurang tajam)
        const suboptimal = scoredMoves.slice(1, Math.min(3, scoredMoves.length));
        if (suboptimal.length > 0) {
          const picked = suboptimal[Math.floor(Math.random() * suboptimal.length)];
          return picked.move;
        }
      }
    }

    // Return the best evaluated move (plus slight natural variation among top moves)
    const topScore = scoredMoves[0].score;
    const nearTop = scoredMoves.filter(m => topScore - m.score <= 10);
    const chosen = nearTop[Math.floor(Math.random() * nearTop.length)];
    return chosen.move;
  }
}

window.ChessterBotAI = ChessterBotAI;
window.FAKE_OPPONENTS_POOL = FAKE_OPPONENTS_POOL;
