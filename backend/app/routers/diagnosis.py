from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import json
from datetime import datetime
from zoneinfo import ZoneInfo

from app.db.session import get_db
from app.schemas.diagnosis import DiagnosisRequest, DiagnosisResult, SimilarCase
from app.services.fuzzy_engine import compute_risk
from app.services.cbr_engine import find_similar_cases
from app.fuzzy.membership_functions import risk_category_from_value  # ⬅️ TAMBAHKAN INI
from app.models.diagnosis import Diagnosis


router = APIRouter(prefix="/diagnosis", tags=["diagnosis"])

ALPHA = 0.7  # bobot fuzzy dalam hybrid (70% fuzzy, 30% CBR)


@router.post("", response_model=DiagnosisResult)
def diagnose(payload: DiagnosisRequest, db: Session = Depends(get_db)):
    # 1. Hitung Fuzzy Mamdani
    fuzzy_value, fuzzy_category = compute_risk(payload.features)

    # 2. Cari kasus serupa (CBR)
    sims = find_similar_cases(payload.features)
    similar_cases = [SimilarCase(**s) for s in sims]

    # 3. Ambil nilai CBR (kalau ada), kalau tidak ada fallback ke fuzzy
    if similar_cases:
        cbr_value = similar_cases[0].risk_value
        cbr_category = similar_cases[0].risk_category
        similar_case_id = similar_cases[0].id
    else:
        cbr_value = fuzzy_value
        cbr_category = fuzzy_category
        similar_case_id = None

    # 4. HYBRID: gabungkan Fuzzy + CBR dengan bobot α
    final_value = ALPHA * fuzzy_value + (1 - ALPHA) * cbr_value
    final_category = risk_category_from_value(final_value)
    hybrid_computation = f"{ALPHA:.2f}*{fuzzy_value:.2f} + {(1 - ALPHA):.2f}*{cbr_value:.2f} = {final_value:.2f}"

    rec = "Konsultasikan dengan tenaga medis bila gejala berlanjut."

    # 5. Simpan ke database (nilai HYBRID sebagai hasil utama)
    diag = Diagnosis(
        input_features_json=json.dumps(payload.features, ensure_ascii=False),
        risk_value=final_value,
        risk_category=final_category,
        recommendation=rec,
        similar_case_id=similar_case_id,
        created_at=datetime.now(ZoneInfo("Asia/Jakarta")),
    )
    db.add(diag)
    db.commit()
    db.refresh(diag)

    # 6. Response ke frontend: kirim hasil hybrid + info fuzzy + similar cases
    return DiagnosisResult(
        id=diag.id,
        created_at=diag.created_at,
        risk_value=final_value,              # HYBRID
        risk_category=final_category,        # HYBRID
        fuzzy_risk_value=fuzzy_value,        # murni Fuzzy
        fuzzy_risk_category=fuzzy_category,  # murni Fuzzy
        cbr_risk_value=cbr_value,            # murni CBR
        cbr_risk_category=cbr_category,      # murni CBR
        hybrid_fuzzy_weight=ALPHA,
        hybrid_cbr_weight=1 - ALPHA,
        hybrid_computation=hybrid_computation,
        recommendation=rec,
        similar_cases=similar_cases,
    )


@router.post("/fuzzy-only", response_model=DiagnosisResult, include_in_schema=False)
def diagnose_fuzzy_only(payload: DiagnosisRequest):
    """
    Endpoint internal untuk pengujian: hanya Fuzzy Mamdani, tanpa CBR/hybrid.
    Tidak menyimpan ke database dan tidak ditampilkan di OpenAPI schema.
    """
    fuzzy_value, fuzzy_category = compute_risk(payload.features)
    rec = "Konsultasikan dengan tenaga medis bila gejala berlanjut."

    return DiagnosisResult(
        risk_value=fuzzy_value,
        risk_category=fuzzy_category,
        fuzzy_risk_value=fuzzy_value,
        fuzzy_risk_category=fuzzy_category,
        cbr_risk_value=None,
        cbr_risk_category=None,
        hybrid_fuzzy_weight=None,
        hybrid_cbr_weight=None,
        hybrid_computation=None,
        recommendation=rec,
        similar_cases=[],
    )
