from typing import Dict, Tuple


def compute_risk(features: Dict[str, float]) -> Tuple[float, str]:
    # Placeholder sederhana: rata-rata nilai fitur sebagai risk_value
    if not features:
        return 0.0, "Rendah"
    values = list(features.values())
    avg = sum(values) / len(values)
    # Pemetaan kategori awal
    if avg < 0.33:
        category = "Rendah"
    elif avg < 0.66:
        category = "Sedang"
    else:
        category = "Tinggi"
    return avg, category