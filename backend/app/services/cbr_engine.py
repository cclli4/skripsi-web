"""Case Based Reasoning berbasis basis kasus dari database (tabel `case`).

- Upload CSV pakar akan di-import ke DB.
- Kasus baru dari diagnosis pengguna dapat ikut disimpan ke DB dan dipakai ulang.
"""

from __future__ import annotations

import csv
import json
from pathlib import Path
from typing import Dict, List, Tuple

from sqlalchemy.orm import Session

from app.fuzzy.membership_functions import (
    RISK_NUMERIC,
    canonicalize_features,
    similarity_vector,
)
from app.models.case import Case

APP_DIR = Path(__file__).resolve().parents[1]
CSV_PATH = APP_DIR / "data" / "DATA_CBR.csv"

CSV_TO_FEATURE = {
    "benjolan_pada_payudara": "benjolan_payudara",
    "sifat_benjolan": "sifat_benjolan",
    "letak_benjolan": "letak_benjolan",
    "benjolan_permukaan_kulit": "kondisi_kulit_benjolan",
    "rasa_nyeri": "rasa_nyeri",
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


def _case_similarity(user_features: Dict[str, object], case_features: Dict[str, object]) -> float:
    sims = similarity_vector(user_features, case_features)
    if not sims:
        return 0.0
    return sum(sims) / len(sims)


def _parse_features_json(raw: str) -> Dict[str, object]:
    try:
        data = json.loads(raw or "{}")
        return data if isinstance(data, dict) else {}
    except Exception:
        return {}


def _seed_cases_from_csv(db: Session) -> int:
    """Import CSV awal ke tabel case bila kosong. Return jumlah baris diinsert."""
    if not CSV_PATH.exists():
        return 0

    with CSV_PATH.open(newline="", encoding="utf-8", errors="ignore") as fh:
        reader = csv.DictReader(fh)
        rows = list(reader)

    if not rows:
        return 0

    db.query(Case).delete()
    db.flush()

    to_insert: List[Case] = []
    for row in rows:
        label = row.get("label_risiko", "Rendah")
        normalized = {feature_key: row.get(csv_key, "") for csv_key, feature_key in CSV_TO_FEATURE.items()}
        features_json = json.dumps(normalized, ensure_ascii=False)
        to_insert.append(
            Case(
                features_json=features_json,
                risk_value=RISK_NUMERIC.get(label, 50.0),
                risk_category=label,
                recommendation=row.get("rekomendasi"),
            )
        )

    db.bulk_save_objects(to_insert)
    db.commit()
    return len(to_insert)


def _load_cases_from_db(db: Session) -> List[Case]:
    rows = (
        db.query(Case)
        .order_by(Case.created_at.desc())
        .limit(500)
        .all()
    )
    if rows:
        return rows

    # Seed sekali dari CSV jika DB kosong.
    inserted = _seed_cases_from_csv(db)
    if inserted:
        return (
            db.query(Case)
            .order_by(Case.created_at.desc())
            .limit(500)
            .all()
        )
    return []


def find_similar_cases(features: Dict[str, object], db: Session) -> List[Dict]:
    """Ambil 3 kasus paling mirip dari basis kasus (DB, fallback seed CSV)."""
    cases = _load_cases_from_db(db)
    if not cases:
        return []

    normalized_user = canonicalize_features(features)
    scored: List[Tuple[float, Dict]] = []
    for case in cases:
        case_features = canonicalize_features(_parse_features_json(case.features_json))
        similarity = _case_similarity(normalized_user, case_features)
        scored.append((similarity, case))

    scored.sort(key=lambda item: item[0], reverse=True)

    top_cases = []
    for similarity, case in scored[:3]:
        top_cases.append(
            {
                "id": case.id,
                "risk_value": float(case.risk_value),
                "risk_category": case.risk_category,
                "rule_origin": None,
                "similarity": float(similarity),
            }
        )
    return top_cases
