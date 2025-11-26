"""
Implementasi Fuzzy Mamdani berbasis rule R1-R16.
Langkah:
- Fuzzifikasi input (menggunakan MF segitiga/trapesium yang diberikan).
- Evaluasi rule dengan AND=min (OR pada pilihan nilai per kondisi = max).
- Clipping output set sesuai firing strength, agregasi dengan max.
- Defuzzifikasi menggunakan centroid pada domain 0-100.
"""

from __future__ import annotations

from typing import Dict, List, Tuple

from app.fuzzy.membership_functions import (
    RISK_OUTPUT_MFS,
    canonicalize_features,
    eval_mf,
    fuzzify_feature,
    risk_category_from_value,
)
from app.fuzzy.rules_pakar import EXPERT_RULES, ExpertRule

OUTPUT_DOMAIN = list(range(0, 101))  # 0..100


def _rule_firing(rule: ExpertRule, fuzzified: Dict[str, Dict[str, float]]) -> float:
    """Hitung firing strength rule menggunakan min(μ kondisi)."""
    mus: List[float] = []
    for key, expected in rule.conditions.items():
        if key not in fuzzified:
            return 0.0
        options = expected if isinstance(expected, list) else [expected]
        mu_feature = fuzzified[key]
        best_mu = max(mu_feature.get(opt, 0.0) for opt in options)
        mus.append(best_mu)

    if not mus:
        return 0.0
    return min(mus)


def _aggregate_outputs(fired_rules: List[Tuple[float, str]]) -> List[float]:
    """
    Agregasi output Mamdani: clip setiap himpunan risiko dengan firing strength,
    lalu ambil max pada setiap z di domain.
    """
    aggregated = [0.0 for _ in OUTPUT_DOMAIN]
    for strength, risk_label in fired_rules:
        params = RISK_OUTPUT_MFS[risk_label]
        for idx, z in enumerate(OUTPUT_DOMAIN):
            clipped = min(strength, eval_mf(params, z))
            if clipped > aggregated[idx]:
                aggregated[idx] = clipped
    return aggregated


def _centroid(aggregated: List[float]) -> float:
    numerator = 0.0
    denominator = 0.0
    for z, mu in zip(OUTPUT_DOMAIN, aggregated):
        numerator += z * mu
        denominator += mu
    if denominator == 0:
        return 0.0
    return numerator / denominator


def compute_risk(features: Dict[str, object]) -> Tuple[float, str]:
    """Kembalikan (nilai_risiko_0_100, kategori)."""
    normalized = canonicalize_features(features)
    fuzzified: Dict[str, Dict[str, float]] = {}
    for key, value in normalized.items():
        mus = fuzzify_feature(key, value)
        if mus:
            fuzzified[key] = mus

    fired_rules: List[Tuple[float, str]] = []
    for rule in EXPERT_RULES:
        firing = _rule_firing(rule, fuzzified)
        if firing > 0:
            fired_rules.append((firing, rule.risk))

    if not fired_rules:
        return 0.0, "Rendah"

    aggregated = _aggregate_outputs(fired_rules)
    risk_value = _centroid(aggregated)
    risk_category = risk_category_from_value(risk_value)
    return risk_value, risk_category

