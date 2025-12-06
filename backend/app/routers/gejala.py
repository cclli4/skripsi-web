from fastapi import APIRouter

from app.fuzzy.membership_functions import FEATURE_SCALES
from app.schemas.gejala import GejalaList, GejalaField, GejalaOption

router = APIRouter(prefix="/gejala", tags=["gejala"])


_FIELD_LABELS = {
    "benjolan_payudara": "Benjolan pada Payudara",
    "sifat_benjolan": "Sifat Benjolan",
    "letak_benjolan": "Letak Benjolan",
    "kondisi_kulit_benjolan": "Kondisi Kulit di Sekitar Benjolan",
    "rasa_nyeri": "Rasa Nyeri",
    "puting_masuk_dalam": "Puting Masuk ke Dalam",
    "keluar_cairan_puting": "Keluar Cairan dari Puting",
    "luka_di_puting": "Luka di Puting atau Sekitar",
    "pembuluh_darah_permukaan": "Tampak Pembuluh Darah di Permukaan",
    "gatal_atau_iritasi": "Gatal atau Iritasi di Payudara",
    "perubahan_ukuran": "Perubahan Ukuran Payudara",
    "benjolan_di_ketiak": "Benjolan di Ketiak",
    "usia": "Usia",
    "riwayat_keluarga": "Riwayat Keluarga",
    "pernah_menyusui": "Pernah Menyusui",
    "siklus_menstruasi": "Siklus Menstruasi",
    "kecepatan_gejala": "Kecepatan Munculnya Gejala",
    "pola_makan_gaya_hidup": "Pola Makan & Gaya Hidup",
    "penurunan_berat_badan": "Penurunan Berat Badan Tanpa Sebab",
    "kelelahan_berkepanjangan": "Kelelahan Berkepanjangan",
}


@router.get("", response_model=GejalaList)
def list_gejala():
    items = []
    for key, options in FEATURE_SCALES.items():
        items.append(
            GejalaField(
                key=key,
                label=_FIELD_LABELS.get(key, key),
                helper=None,
                options=[GejalaOption(**opt) for opt in options],
            )
        )
    return GejalaList(items=items)
