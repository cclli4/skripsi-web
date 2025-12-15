from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.models.diagnosis import Diagnosis
from app.models.case import Case
from app.schemas.admin import OverviewStats
from app.services.auth import require_roles


router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/overview", response_model=OverviewStats)
def admin_overview(db: Session = Depends(get_db), _user=Depends(require_roles("admin"))):
    user_counts = (
        db.query(User.role, func.count(User.id))
        .group_by(User.role)
        .all()
    )
    counts = {role: count for role, count in user_counts}
    total_users = sum(counts.values())

    total_diag = db.query(func.count(Diagnosis.id)).scalar() or 0
    total_cases = db.query(func.count(Case.id)).scalar() or 0

    return OverviewStats(
        total_users=total_users,
        patients=counts.get("patient", 0),
        experts=counts.get("expert", 0),
        admins=counts.get("admin", 0),
        total_diagnosis=total_diag,
        total_cases=total_cases,
    )
