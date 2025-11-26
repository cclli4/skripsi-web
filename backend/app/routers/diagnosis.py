from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import json
from datetime import datetime
from zoneinfo import ZoneInfo

from app.db.session import get_db
from app.schemas.diagnosis import DiagnosisRequest, DiagnosisResult, SimilarCase
from app.services.fuzzy_engine import compute_risk
from app.services.cbr_engine import find_similar_cases
from app.models.diagnosis import Diagnosis


router = APIRouter(prefix="/diagnosis", tags=["diagnosis"])


@router.post("", response_model=DiagnosisResult)
def diagnose(payload: DiagnosisRequest, db: Session = Depends(get_db)):
    risk_value, risk_category = compute_risk(payload.features)
    sims = find_similar_cases(payload.features)
    similar_cases = [SimilarCase(**s) for s in sims]

    rec = "Konsultasikan dengan tenaga medis bila gejala berlanjut."

    diag = Diagnosis(
        input_features_json=json.dumps(payload.features),
        risk_value=risk_value,
        risk_category=risk_category,
        recommendation=rec,
        created_at=datetime.now(ZoneInfo("Asia/Jakarta")),
    )
    db.add(diag)
    db.commit()
    db.refresh(diag)

    return DiagnosisResult(
        id=diag.id,
        created_at=diag.created_at,
        risk_value=risk_value,
        risk_category=risk_category,
        recommendation=rec,
        similar_cases=similar_cases,
    )
