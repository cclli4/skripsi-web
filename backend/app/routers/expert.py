import csv
import json

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.case import Case
from app.models.diagnosis import Diagnosis
from app.schemas.admin import CaseItem, CaseList, DiagnosisItem, DiagnosisList
from app.services.auth import require_roles
from app.services.cbr_engine import CSV_TO_FEATURE
from app.fuzzy.membership_functions import RISK_NUMERIC


router = APIRouter(prefix="/expert", tags=["expert"])


@router.get("/cases", response_model=CaseList)
def list_cases(db: Session = Depends(get_db), _user=Depends(require_roles("expert", "admin"))):
    rows = (
        db.query(Case)
        .order_by(Case.created_at.desc())
        .limit(100)
        .all()
    )
    items = [
        CaseItem(
            id=r.id,
            risk_value=r.risk_value,
            risk_category=r.risk_category,
            created_at=r.created_at,
            recommendation=r.recommendation,
        )
        for r in rows
    ]
    return CaseList(items=items)


@router.get("/diagnosis", response_model=DiagnosisList)
def list_diagnosis(db: Session = Depends(get_db), _user=Depends(require_roles("expert", "admin"))):
    def parse_features(raw: str) -> dict:
        try:
            data = json.loads(raw or "{}")
            return data if isinstance(data, dict) else {}
        except Exception:
            return {}

    rows = (
        db.query(Diagnosis)
        .order_by(Diagnosis.created_at.desc())
        .limit(100)
        .all()
    )
    items = [
        DiagnosisItem(
            id=r.id,
            risk_value=r.risk_value,
            risk_category=r.risk_category,
            created_at=r.created_at,
            features=parse_features(r.input_features_json),
        )
        for r in rows
    ]
    return DiagnosisList(items=items)


@router.post("/cases/upload")
async def upload_cases_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _user=Depends(require_roles("expert", "admin")),
):
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File harus CSV")

    # Baca dulu ke memori untuk validasi ringan
    content = await file.read()
    text = content.decode("utf-8", errors="ignore").splitlines()
    reader = csv.DictReader(text)
    headers = set(reader.fieldnames or [])
    required_cols = set(CSV_TO_FEATURE.keys()) | {"label_risiko"}
    missing = required_cols - headers
    if missing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Kolom hilang: {', '.join(sorted(missing))}",
        )

    # Hapus kasus lama, import baru ke DB
    db.query(Case).delete()
    db.flush()

    count = 0
    to_insert = []
    for row in reader:
        label = row.get("label_risiko", "Rendah")
        normalized = {feature_key: row.get(csv_key, "") for csv_key, feature_key in CSV_TO_FEATURE.items()}
        try:
            risk_val = float(row.get("risk_value") or row.get("nilai_risiko") or RISK_NUMERIC.get(label, 50.0))
        except Exception:
            risk_val = RISK_NUMERIC.get(label, 50.0)

        to_insert.append(
            Case(
                features_json=json.dumps(normalized, ensure_ascii=False),
                risk_value=risk_val,
                risk_category=label,
                recommendation=row.get("rekomendasi"),
            )
        )
        count += 1

    if to_insert:
        db.bulk_save_objects(to_insert)
    db.commit()

    return {"status": "ok", "message": "Dataset CBR diperbarui", "rows": count}
