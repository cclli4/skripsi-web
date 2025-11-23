import os
from dotenv import load_dotenv


class Settings:
    """Konfigurasi aplikasi sederhana menggunakan environment variables.

    Menggunakan python-dotenv untuk memuat variabel dari file .env.
    """

    def __init__(self) -> None:
        # Muat variabel dari .env bila ada
        load_dotenv()

        self.app_env: str = os.getenv("APP_ENV", "development")
        self.database_url: str = os.getenv("DATABASE_URL", "sqlite:///./app.db")


# Instance global yang dapat diimport
settings = Settings()