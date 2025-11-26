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
        self.secret_key: str = os.getenv("SECRET_KEY", "change-me-in-production")
        self.access_token_expires_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRES_MINUTES", "60"))


# Instance global yang dapat diimport
settings = Settings()
