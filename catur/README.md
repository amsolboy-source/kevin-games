# ♔ Chesster - Interactive Chess Platform

**Chesster** adalah platform permainan catur interaktif bertema elegan dengan integrasi sistem rating **ELO dinamis**, bimbingan **Coach Legendaris Dunia**, dan arena tanding melawan **Bot Simulator Berkedok AI / Lawan Online**.

---

## 🌟 Fitur Utama

### 1. 📈 Sistem Rating ELO Dinamis
- **Modal Awal**: Setiap akun baru secara otomatis memulai perjalanan catur dengan rating **1000 ELO**.
- **Informasi ELO Transparan**: Status ELO, gelar rank (Apprentice hingga Grandmaster), badge bintang, statistik menang/kalah/remis, dan riwayat pertandingan ditampilkan jelas di seluruh halaman.
- **Kalah Pertandingan**: ELO berkurang secara acak antara **-1 s/d -12 poin**.
- **Menang Pertandingan**: ELO bertambah secara acak antara **+1 s/d +12 poin**.
- **Remis (Draw)**: ELO netral (+0).
- **Animasi Perubahan ELO**: Pop-up hasil pertandingan menampilkan visual transisi ELO lama ke ELO baru berserta evaluasi dari coach.

---

### 2. 👤 Sistem Akun & Wajib Pilih Coach
Sebelum bermain, pengguna diarahkan untuk membuat akun dengan memasukkan:
- Nama Pengguna (Nickname)
- Pilihan Avatar Catur (Pion, Kuda, Gajah, Benteng, Menteri, Raja, Mahkota, Petir)

Setelah membuat akun, pengguna **wajib memilih 1 dari 9 Coach Legendaris**:
1. **Magnus Carlsen** (GM / 5x Juara Dunia, Peak 2882) - *The GOAT, Positional & Endgame Master*
2. **Hikaru Nakamura** (GM / 5x US Champion, Peak 2875) - *Speed Demon, Blitz & Counter-Tactics*
3. **Fabiano Caruana** (GM / World Challenger, Peak 2844) - *The Calculator, Opening Preparation*
4. **Gukesh D.** (GM / Candidates Winner 2024, Peak 2794) - *The Young Prodigy, Fearless Fighter*
5. **Garry Kasparov** (GM / 13th World Champion, Peak 2851) - *The Beast from Baku, Aggressive Dynamo*
6. **Bobby Fischer** (GM / 11th World Champion, Peak 2785) - *The Lone Genius, Classical Perfection*
7. **Anatoly Karpov** (GM / 12th World Champion, Peak 2780) - *The Positional Python, Suffocation Master*
8. **Nodirbek Abdusattorov** (GM / World Rapid Champion, Peak 2784) - *The Ice Prince, Lightning Speed*
9. **Mikhail Tal** (GM / 8th World Champion, Peak 2705) - *The Magician from Riga, Sacrificial Chaos*

*Pengguna dapat mengganti Coach kapan saja dari tombol navigasi maupun profil.*

---

### 3. 🎓 Mode "Berlatih dengan Coach"
- Akses langsung dari menu Beranda (**Berlatih dengan Coach**).
- Modul pelatihan taktik interaktif di atas papan catur yang disesuaikan dengan ciri khas masing-masing coach:
  - *Magnus*: The Endgame Squeeze
  - *Hikaru*: Smothered Mate Threat
  - *Caruana*: Precision Piece Placement
  - *Gukesh*: Breakthrough Attack
  - *Kasparov*: Intimidating Attack
  - *Fischer*: Classical Perfection
  - *Karpov*: Boa Constrictor Squeeze
  - *Nodirbek*: Fast Tactical Strike
  - *Mikhail Tal*: The Magician's Sacrifice
- Petunjuk taktik (hint) dan evaluasi responsif langsung dari coach.

---

### 4. ⚔️ Mode Bermain (Lawan Bot AI Simulator Online)
- Simulasi matchmaking online dengan radar pencarian lawan.
- Lawan memiliki profil palsu yang realistis:
  - Nama unik acak (e.g. `GM_Kovalev_Tactics`, `DarkKnight_88`, `TacticalFox`, `GM_Sokolov_99`, dll.)
  - Gelar resmi acak: **GM (Grandmaster)**, **IM**, **FM**, atau tanpa gelar.
  - ELO acak (dari 900 s/d 2750+ GM).
  - Bendera negara acak.
- **Bot AI Engine**:
  - Validasi aturan catur lengkap: Legal moves, Castling (O-O dan O-O-O), En-passant, Promosi Pion (Menteri, Benteng, Gajah, Kuda), Deteksi Skak, Skakmat, dan Remis.
  - Delay berpikir bot 1.2 hingga 2.8 detik agar terasa seperti bertanding online sungguhan melawan manusia.
  - Indikator status `Lawan sedang berpikir...`.
  - Heuristik Minimax dengan Piece-Square Tables (PST) yang disesuaikan dengan tingkat ELO lawan.
- **Coach Reaction Box**:
  - Coach aktif memantau jalannya pertandingan dan memberikan reaksi real-time ketika terjadi skak, langkah brilian, atau saat permainan selesai.
- **Audio Web Audio API**:
  - Efek suara langkah bidak, pemakanan bidak, skak, kemenangan, dan kekalahan yang renyah tanpa perlu aset eksternal.

---

## 🚀 Cara Menjalankan

Buka file [chesster/index.html](file:///Users/sinteniki/Projects/sinteniAI/chesster/index.html) langsung di browser (Chrome, Edge, Safari, Firefox), atau jalankan server lokal:

```bash
# Menggunakan Python
python3 -m http.server 8000
# Akses: http://localhost:8000/chesster/
```
