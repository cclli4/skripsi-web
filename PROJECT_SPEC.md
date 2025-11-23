# Project Spec – Sistem Diagnosis Awal Risiko Kanker Payudara

## Tujuan
Membangun aplikasi web untuk diagnosis awal risiko kanker payudara.  
Pengguna menginput gejala, sistem melakukan perhitungan Fuzzy Mamdani dan Case-Based Reasoning (CBR) untuk menghasilkan:
- nilai risiko (crisp value)
- kategori risiko: Rendah / Sedang / Tinggi
- rekomendasi singkat dan informasi kasus serupa (CBR)

## Tech Stack
- Backend: FastAPI (Python)
- Library: NumPy, SciPy
- Database: MySQL
- Frontend: Next.js
- Komunikasi: REST API dengan Fetch API dari frontend ke backend

## Struktur Folder yang Diinginkan

root/
  backend/
    main.py
    routers/
      diagnosis.py   # endpoint diagnosis fuzzy + CBR
      history.py     # endpoint riwayat diagnosis
    db/
      mysql.py       # helper koneksi MySQL
    models/
      user.py        # opsional
      case.py        # data kasus CBR
      diagnosis.py   # riwayat diagnosis
    services/
      fuzzy_engine.py  # Fuzzy Mamdani
      cbr_engine.py    # Case-Based Reasoning
    .env.example
    .env              # (local, tidak di-commit)

  frontend/
    app/
      page.jsx                  # halaman utama
      input-gejala/page.jsx     # form input gejala
      hasil/page.jsx            # tampilan hasil diagnosis
      riwayat/page.jsx          # riwayat diagnosis
    lib/api.js                  # helper Fetch API ke backend

## Endpoint Backend yang Dibutuhkan

### GET /ping
Cek apakah server hidup.

**Response:**
```json
{ "status": "ok" }
