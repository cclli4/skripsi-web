# Backend – FastAPI

Backend ini adalah kerangka awal untuk Sistem Diagnosis Awal Risiko Kanker Payudara.

## Prasyarat
- Python 3.10+ terpasang
- Pip dapat digunakan (`python -m pip --version`)

## Instalasi
1. (Opsional) Buat dan aktifkan virtual environment.
   - Windows (PowerShell):
     ```powershell
     python -m venv .venv
     .venv\\Scripts\\Activate.ps1
     ```
2. Install dependensi:
   ```powershell
   python -m pip install -r requirements.txt
   ```

## Menjalankan Development Server
Jalankan dari folder `backend/`:

```powershell
uvicorn app.main:app --reload
```

Akses endpoint kesehatan:

- `GET /ping` → `{ "status": "ok" }`

## Struktur Proyek
```
backend/
  app/
    __init__.py
    main.py
    routers/
      __init__.py
    models/
      __init__.py
    schemas/
      __init__.py
    config.py
  requirements.txt
  .env
  README.md
```

## Catatan
- Variabel lingkungan dimuat dari file `.env` menggunakan `python-dotenv`.
- Struktur ini mengikuti best practices FastAPI dan sejalan dengan spesifikasi awal.