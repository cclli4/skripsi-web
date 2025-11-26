"""
Fungsi utilitas untuk:
- Normalisasi nilai input (label -> bentuk kanonik).
- Konversi nilai input menjadi crisp (0-1 atau angka usia).
- Perhitungan derajat keanggotaan (segitiga/trapesium) untuk seluruh variabel.
- Fuzzifikasi & fungsi keanggotaan output risiko (Rendah/Sedang/Tinggi).
"""

from __future__ import annotations

from typing import Dict, Iterable, List, Optional, Tuple

# Domain output 0..100 untuk evaluasi risiko.
OUTPUT_DOMAIN = list(range(0, 101))

# Parameter fungsi keanggotaan (a,b,c,d) per feature per himpunan.
# Jika panjang 3 -> segitiga, panjang 4 -> trapesium.
FEATURE_MFS: Dict[str, Dict[str, Tuple[float, ...]]] = {
    "benjolan_payudara": {
        "Tidak ada": (0.0, 0.0, 0.3, 0.5),
        "Ada": (0.4, 0.6, 1.0, 1.0),
    },
    "sifat_benjolan": {
        "Bisa digerakkan": (0.0, 0.0, 0.5),
        "Agak kaku": (0.2, 0.5, 0.8),
        "Tidak bisa digerakkan": (0.5, 1.0, 1.0),
    },
    "letak_benjolan": {
        "Tidak terlihat": (0.0, 0.0, 0.3, 0.5),
        "Menonjol pada permukaan kulit": (0.4, 0.6, 1.0, 1.0),
    },
    "kondisi_kulit_benjolan": {
        "Kemerahan": (0.0, 0.0, 0.5),
        "Sewarna Kulit": (0.2, 0.5, 0.8),
        "Mengkilat": (0.5, 1.0, 1.0),
    },
    "rasa_nyeri": {
        "Tidak nyeri": (0.0, 0.0, 0.5),
        "Nyeri ringan": (0.2, 0.5, 0.8),
        "Nyeri berat": (0.5, 1.0, 1.0),
    },
    "kulit_payudara_berubah": {
        "Tidak ada": (0.0, 0.0, 0.3, 0.5),
        "Ada": (0.4, 0.6, 1.0, 1.0),
    },
    "puting_masuk_dalam": {
        "Tidak": (0.0, 0.0, 0.3, 0.5),
        "Ya": (0.4, 0.6, 1.0, 1.0),
    },
    "keluar_cairan_puting": {
        "Tidak": (0.0, 0.0, 0.10, 0.20),
        "Jernih": (0.15, 0.30, 0.45),
        "Putih keruh seperti susu": (0.40, 0.55, 0.70),
        "Hitam": (0.65, 0.80, 0.90),
        "Darah": (0.85, 0.95, 1.00, 1.00),
    },
    "luka_di_puting": {
        "Tidak": (0.0, 0.0, 0.3, 0.5),
        "Ada": (0.4, 0.6, 1.0, 1.0),
    },
    "pembuluh_darah_permukaan": {
        "Tidak": (0.0, 0.0, 0.3, 0.5),
        "Ya": (0.4, 0.6, 1.0, 1.0),
    },
    "gatal_atau_iritasi": {
        "Tidak": (0.0, 0.0, 0.5),
        "Kadang": (0.2, 0.5, 0.8),
        "Sering": (0.5, 1.0, 1.0),
    },
    "perubahan_ukuran": {
        "Tidak": (0.0, 0.0, 0.3, 0.5),
        "Ya": (0.4, 0.6, 1.0, 1.0),
    },
    "benjolan_di_ketiak": {
        "Tidak": (0.0, 0.0, 0.3, 0.5),
        "Ya": (0.4, 0.6, 1.0, 1.0),
    },
    "usia": {
        "Muda": (18, 18, 30, 35),
        "Menengah": (30, 40, 50, 60),
        "Tua": (45, 60, 80, 80),
    },
    "riwayat_keluarga": {
        "Tidak": (0.0, 0.0, 0.3, 0.5),
        "Ya": (0.4, 0.6, 1.0, 1.0),
    },
    "pernah_menyusui": {
        "Tidak": (0.0, 0.0, 0.3, 0.5),
        "Ya": (0.4, 0.6, 1.0, 1.0),
    },
    "siklus_menstruasi": {
        "Masih menstruasi": (0.0, 0.0, 0.3, 0.5),
        "Sudah berhenti": (0.4, 0.6, 1.0, 1.0),
    },
    "kecepatan_gejala": {
        "< 1 minggu": (0.0, 0.0, 0.2, 0.3),
        "1-4 bulan": (0.2, 0.4, 0.6),
        "5-12 bulan": (0.4, 0.6, 0.8),
        "> 12 bulan": (0.7, 0.8, 1.0, 1.0),
    },
    "pola_makan_gaya_hidup": {
        "Jarang": (0.0, 0.0, 0.5),
        "Kadang": (0.2, 0.5, 0.8),
        "Sering": (0.5, 1.0, 1.0),
    },
    "penurunan_berat_badan": {
        "Tidak": (0.0, 0.0, 0.3, 0.5),
        "Ya": (0.4, 0.6, 1.0, 1.0),
    },
    "kelelahan_berkepanjangan": {
        "Tidak": (0.0, 0.0, 0.5),
        "Kadang": (0.2, 0.5, 0.8),
        "Sering": (0.5, 1.0, 1.0),
    },
}

# Output risk sets (z in 0-100).
RISK_OUTPUT_MFS: Dict[str, Tuple[float, ...]] = {
    "Rendah": (0.0, 0.0, 20.0, 35.0),
    "Sedang": (30.0, 50.0, 70.0),
    "Tinggi": (60.0, 80.0, 100.0, 100.0),
}

# Canonical scales to map label -> skor crisp (0-1) untuk input non-usia.
FEATURE_SCALES: Dict[str, List[Dict[str, object]]] = {
    "benjolan_payudara": [
        {"label": "Tidak ada", "score": 0.0, "aliases": ["tidak ada", "tidak"]},
        {"label": "Ada", "score": 1.0, "aliases": ["ada", "ya"]},
    ],
    "sifat_benjolan": [
        {"label": "Bisa digerakkan", "score": 0.0, "aliases": ["bisa digerakkan"]},
        {"label": "Agak kaku", "score": 0.5, "aliases": ["agak kaku"]},
        {
            "label": "Tidak bisa digerakkan",
            "score": 1.0,
            "aliases": ["tidak bisa digerakkan", "tidak bisa di gerakkan"],
        },
    ],
    "letak_benjolan": [
        {"label": "Tidak terlihat", "score": 0.0, "aliases": ["tidak terlihat"]},
        {
            "label": "Menonjol pada permukaan kulit",
            "score": 0.7,
            "aliases": ["menonjol pada permukaan kulit", "menonjol"],
        },
        {
            "label": "Permukaan kulit tampak benjolan",
            "score": 1.0,
            "aliases": [
                "permukaan kulit tampak benjolan",
                "benjolan permukaan",
                "menonjol",
            ],
        },
    ],
    "kondisi_kulit_benjolan": [
        {"label": "Kemerahan", "score": 0.0, "aliases": ["kemerahan"]},
        {"label": "Sewarna Kulit", "score": 0.5, "aliases": ["sewarna kulit"]},
        {"label": "Mengkilat", "score": 1.0, "aliases": ["mengkilat"]},
    ],
    "rasa_nyeri": [
        {"label": "Tidak nyeri", "score": 0.0, "aliases": ["tidak nyeri"]},
        {"label": "Nyeri ringan", "score": 0.5, "aliases": ["nyeri ringan"]},
        {"label": "Nyeri berat", "score": 1.0, "aliases": ["nyeri berat"]},
    ],
    "kulit_payudara_berubah": [
        {"label": "Tidak ada", "score": 0.0, "aliases": ["tidak ada", "tidak"]},
        {"label": "Ada", "score": 1.0, "aliases": ["ada", "ya"]},
    ],
    "puting_masuk_dalam": [
        {"label": "Tidak", "score": 0.0, "aliases": ["tidak"]},
        {"label": "Ya", "score": 1.0, "aliases": ["ya", "ada"]},
    ],
    "keluar_cairan_puting": [
        {"label": "Tidak", "score": 0.0, "aliases": ["tidak"]},
        {"label": "Jernih", "score": 0.25, "aliases": ["jernih"]},
        {
            "label": "Putih keruh seperti susu",
            "score": 0.5,
            "aliases": ["putih keruh seperti susu", "putih keruh"],
        },
        {"label": "Hitam", "score": 0.75, "aliases": ["hitam"]},
        {"label": "Darah", "score": 1.0, "aliases": ["darah"]},
    ],
    "luka_di_puting": [
        {"label": "Tidak", "score": 0.0, "aliases": ["tidak"]},
        {"label": "Ada", "score": 1.0, "aliases": ["ada", "ya"]},
    ],
    "pembuluh_darah_permukaan": [
        {"label": "Tidak", "score": 0.0, "aliases": ["tidak"]},
        {"label": "Ya", "score": 1.0, "aliases": ["ya", "ada"]},
    ],
    "gatal_atau_iritasi": [
        {"label": "Tidak", "score": 0.0, "aliases": ["tidak"]},
        {"label": "Kadang", "score": 0.5, "aliases": ["kadang"]},
        {"label": "Sering", "score": 1.0, "aliases": ["sering"]},
    ],
    "perubahan_ukuran": [
        {"label": "Tidak", "score": 0.0, "aliases": ["tidak"]},
        {"label": "Ya", "score": 1.0, "aliases": ["ya", "ada"]},
    ],
    "benjolan_di_ketiak": [
        {"label": "Tidak", "score": 0.0, "aliases": ["tidak"]},
        {"label": "Ya", "score": 1.0, "aliases": ["ya", "ada"]},
    ],
    "usia": [
        {"label": "Muda", "score": 0.2, "aliases": ["muda"]},
        {"label": "Menengah", "score": 0.6, "aliases": ["menengah"]},
        {"label": "Tua", "score": 1.0, "aliases": ["tua"]},
    ],
    "riwayat_keluarga": [
        {"label": "Tidak", "score": 0.0, "aliases": ["tidak"]},
        {"label": "Ya", "score": 1.0, "aliases": ["ya", "ada"]},
    ],
    "pernah_menyusui": [
        {"label": "Tidak", "score": 0.0, "aliases": ["tidak"]},
        {"label": "Ya", "score": 1.0, "aliases": ["ya", "ada"]},
    ],
    "siklus_menstruasi": [
        {"label": "Masih menstruasi", "score": 0.0, "aliases": ["masih", "masih menstruasi"]},
        {"label": "Sudah berhenti", "score": 1.0, "aliases": ["sudah berhenti", "berhenti"]},
    ],
    "kecepatan_gejala": [
        {"label": "< 1 minggu", "score": 0.0, "aliases": ["< 1 minggu", "<1 minggu"]},
        {"label": "1-4 bulan", "score": 0.35, "aliases": ["1-4 bulan", "1-4", "1–4 bulan"]},
        {"label": "5-12 bulan", "score": 0.65, "aliases": ["5-12 bulan", "5-12", "5–12 bulan"]},
        {"label": "> 12 bulan", "score": 1.0, "aliases": ["> 12 bulan", ">12 bulan", "> 12", ">12"]},
    ],
    "pola_makan_gaya_hidup": [
        {"label": "Jarang", "score": 0.0, "aliases": ["jarang"]},
        {"label": "Kadang", "score": 0.5, "aliases": ["kadang"]},
        {"label": "Sering", "score": 1.0, "aliases": ["sering"]},
    ],
    "penurunan_berat_badan": [
        {"label": "Tidak", "score": 0.0, "aliases": ["tidak"]},
        {"label": "Ya", "score": 1.0, "aliases": ["ya", "ada"]},
    ],
    "kelelahan_berkepanjangan": [
        {"label": "Tidak", "score": 0.0, "aliases": ["tidak"]},
        {"label": "Kadang", "score": 0.5, "aliases": ["kadang"]},
        {"label": "Sering", "score": 1.0, "aliases": ["sering"]},
    ],
}


def _trapezoid(x: float, a: float, b: float, c: float, d: float) -> float:
    # Up-slope
    if a != b and a < x < b:
        return (x - a) / (b - a)
    if x == b and b == a:
        return 1.0
    # Top
    if b <= x <= c:
        return 1.0
    # Down-slope
    if c != d and c < x < d:
        return (d - x) / (d - c)
    if x == c and c == d:
        return 1.0
    # Outside
    return 0.0


def _triangle(x: float, a: float, b: float, c: float) -> float:
    # Degenerate left-shoulder (a == b): 1 up to a, then down to 0 at c.
    if a == b:
        if x <= a:
            return 1.0
        if a < x < c:
            return (c - x) / (c - a) if c != a else 0.0
        return 0.0
    # Degenerate right-shoulder (b == c): 0 up to a, then up to 1 from a..b, then 1 beyond.
    if b == c:
        if x <= a:
            return 0.0
        if a < x < b:
            return (x - a) / (b - a) if b != a else 0.0
        return 1.0

    if x <= a or x >= c:
        return 0.0
    if a < x < b:
        return (x - a) / (b - a)
    if b < x < c:
        return (c - x) / (c - b)
    return 1.0  # x == b


def eval_mf(params: Tuple[float, ...], x: float) -> float:
    """Evaluasi segitiga/trapesium berdasarkan panjang params."""
    if len(params) == 3:
        a, b, c = params
        return _triangle(x, a, b, c)
    if len(params) == 4:
        a, b, c, d = params
        return _trapezoid(x, a, b, c, d)
    return 0.0


def _mf_centroid(params: Tuple[float, ...]) -> float:
    """Centroid numerik pada domain output 0-100 untuk satu himpunan fuzzy."""
    numerator = 0.0
    denominator = 0.0
    for z in OUTPUT_DOMAIN:
        mu = eval_mf(params, z)
        numerator += z * mu
        denominator += mu
    return numerator / denominator if denominator else 0.0


def canonicalize_value(feature: str, raw_value: object) -> Optional[str]:
    """Normalisasi label: alias -> label kanonik; usia -> tetap angka apa adanya."""
    if raw_value is None:
        return None

    if feature == "usia":
        return str(raw_value).strip()

    raw_text = str(raw_value).strip()
    if raw_text == "":
        return None

    entries = FEATURE_SCALES.get(feature)
    if not entries:
        return raw_text

    lowered = raw_text.lower()
    for entry in entries:
        if lowered == str(entry["label"]).lower():
            return str(entry["label"])
        for alias in entry.get("aliases", []):
            if lowered == str(alias).lower():
                return str(entry["label"])

    return raw_text


def value_score(feature: str, value: object) -> Optional[float]:
    """Skor crisp 0-1 dari label (bukan derajat keanggotaan MF)."""
    if value is None:
        return None
    if feature == "usia":
        try:
            return float(value)
        except (TypeError, ValueError):
            return None
    canonical = canonicalize_value(feature, value)
    entries = FEATURE_SCALES.get(feature)
    if not entries:
        return None
    for entry in entries:
        if canonical == entry["label"]:
            return float(entry["score"])
    return None


def fuzzify_feature(feature: str, value: object) -> Dict[str, float]:
    """Hitung μ untuk setiap himpunan di feature tertentu berdasarkan crisp input."""
    params_map = FEATURE_MFS.get(feature)
    if not params_map:
        return {}

    crisp = value_score(feature, value)
    if crisp is None:
        return {}

    memberships: Dict[str, float] = {}
    for label, params in params_map.items():
        memberships[label] = eval_mf(params, crisp)
    return memberships


def canonicalize_features(raw: Dict[str, object]) -> Dict[str, object]:
    return {k: canonicalize_value(k, v) for k, v in raw.items()}


def risk_memberships(value: float) -> Dict[str, float]:
    return {label: eval_mf(params, value) for label, params in RISK_OUTPUT_MFS.items()}


RISK_NUMERIC: Dict[str, float] = {label: _mf_centroid(params) for label, params in RISK_OUTPUT_MFS.items()}


def value_similarity(feature: str, a: object, b: object) -> float:
    """Similarity 0-1 berdasarkan skor crisp; fallback exact match label."""
    score_a = value_score(feature, a)
    score_b = value_score(feature, b)
    if score_a is not None and score_b is not None:
        # Untuk usia gunakan jarak relatif ke domain (0-100 agar stabil).
        if feature == "usia":
            diff = abs(score_a - score_b) / 100.0
            return max(0.0, 1.0 - diff)
        return max(0.0, 1.0 - abs(score_a - score_b))
    if canonicalize_value(feature, a) == canonicalize_value(feature, b):
        return 1.0
    return 0.0


def similarity_vector(
    source: Dict[str, object], target: Dict[str, object], keys: Optional[Iterable[str]] = None
) -> List[float]:
    keys_to_use: Iterable[str] = keys if keys is not None else source.keys()
    sims: List[float] = []
    for key in keys_to_use:
        if key not in source or key not in target:
            continue
        sims.append(value_similarity(key, source[key], target[key]))
    return sims


def risk_category_from_value(value: float) -> str:
    mems = risk_memberships(value)
    best_label, best_mu = max(mems.items(), key=lambda item: item[1])
    if best_mu == 0:
        if value <= 30:
            return "Rendah"
        if value >= 70:
            return "Tinggi"
        return "Sedang"
    return best_label
