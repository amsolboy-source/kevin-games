# Kevin Games — kevingames.sinteniki.com

Etalase game karya Kevin. Situs statis murni (HTML/CSS), dilayani Caddy dari
VPS sintenai (`/opt/sintenai/kevingames-www/`).

## Alur pembaruan (disepakati 31 Okt 2026)

1. Kevin mengedit/membuat game di **Antigravity** (folder repo ini).
2. **Commit & Push** ke GitHub (repo `kevin-games`, sumber kebenaran tunggal).
3. Kabari Ijah → Ijah **pull + sinkronkan + verifikasi** ke VPS. Selesai.

## Struktur

- `index.html` — halaman utama (daftar game).
- `404.html` — halaman tidak ditemukan.
- Satu folder per game, nama folder = alamat game:
  - `catur/` → kevingames.sinteniki.com/catur/ (game catur Kevin;
    sementara berisi halaman penampung, diganti berkas game aslinya)
  - game berikutnya: buat folder baru, mis. `balapan/`, lalu tambahkan
    satu kartu baru di `index.html` meniru kartu Catur.

## Aturan main menambah game

- Setiap game harus bisa dibuka dari `index.html` di foldernya sendiri
  (statis: HTML/CSS/JS; aset memakai jalur relatif di dalam folder game).
- Jangan taruh berkas besar (video/mp3 raksasa) tanpa kabari dulu.
- Sesudah push, selalu kabari Ijah untuk deploy + verifikasi tampilan
  desktop dan HP.
