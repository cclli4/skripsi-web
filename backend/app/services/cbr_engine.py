"""Case Based Reasoning sederhana berbasis data kasus_cbr.csv."""

from __future__ import annotations

import csv
from pathlib import Path
from typing import Dict, List, Tuple

from app.fuzzy.membership_functions import RISK_NUMERIC, canonicalize_features, similarity_vector

APP_DIR = Path(__file__).resolve().parents[1]
CSV_PATH = APP_DIR / "data" / "kasus_cbr.csv"

CSV_TO_FEATURE = {
    "benjolan_pada_payudara": "benjolan_payudara",
    "sifat_benjolan": "sifat_benjolan",
    "letak_benjolan": "letak_benjolan",
    "benjolan_permukaan_kulit": "kondisi_kulit_benjolan",
    "rasa_nyeri": "rasa_nyeri",
    "kulit_payudara_berubah": "kulit_payudara_berubah",
    "puting_masuk_ke_dalam": "puting_masuk_dalam",
    "keluar_cairan_dari_puting": "keluar_cairan_puting",
    "luka_pada_puting_atau_sekitar_payudara": "luka_di_puting",
    "terlihat_pembuluh_darah_menonjol": "pembuluh_darah_permukaan",
    "gatal_atau_iritasi_di_payudara": "gatal_atau_iritasi",
    "perubahan_ukuran_payudara": "perubahan_ukuran",
    "benjolan_di_ketiak": "benjolan_di_ketiak",
    "usia": "usia",
    "riwayat_keluarga": "riwayat_keluarga",
    "pernah_menyusui": "pernah_menyusui",
    "siklus_menstruasi": "siklus_menstruasi",
    "kecepatan_munculnya_gejala": "kecepatan_gejala",
    "pola_makan_dan_gaya_hidup": "pola_makan_gaya_hidup",
    "penurunan_berat_badan_tanpa_sebab": "penurunan_berat_badan",
    "kelelahan_berkepanjangan": "kelelahan_berkepanjangan",
}

_CACHE: List[Dict] = []


def _load_cases() -> List[Dict]:
    global _CACHE
    if _CACHE:
        return _CACHE

    if not CSV_PATH.exists():
        return []

    # Some rows may contain non-UTF8 characters from spreadsheet exports; be lenient.
    with CSV_PATH.open(newline="", encoding="utf-8", errors="ignore") as fh:
        reader = csv.DictReader(fh)
        for idx, row in enumerate(reader, start=1):
            normalized = {}
            for csv_key, feature_key in CSV_TO_FEATURE.items():
                if csv_key in row:
                    normalized[feature_key] = row[csv_key]

            _CACHE.append(
                {
                    "id": idx,
                    "risk_category": row.get("label_risiko", "Rendah"),
                    "risk_value": RISK_NUMERIC.get(row.get("label_risiko", ""), 50.0),
                    "features": canonicalize_features(normalized),
                }
            )
    return _CACHE


def _case_similarity(user_features: Dict[str, object], case_features: Dict[str, object]) -> float:
    sims = similarity_vector(user_features, case_features)
    if not sims:
        return 0.0
    return sum(sims) / len(sims)


def find_similar_cases(features: Dict[str, object]) -> List[Dict]:
    """Ambil 3 kasus paling mirip dari dataset CBR."""
    cases = _load_cases()
    if not cases:
        return []

    normalized_user = canonicalize_features(features)
    scored: List[Tuple[float, Dict]] = []
    for case in cases:
        similarity = _case_similarity(normalized_user, case["features"])
        scored.append((similarity, case))

    scored.sort(key=lambda item: item[0], reverse=True)

    top_cases = []
    for similarity, case in scored[:3]:
        top_cases.append(
            {
                "id": case["id"],
                "risk_value": float(case["risk_value"]),
                "risk_category": case["risk_category"],
            }
        )
    return top_cases
