from fastapi import APIRouter

from ..schemas.closure import ClosureAnalyzeRequest, DayClosureResult
from ..services.closure_engine import analyze_closure

router = APIRouter(prefix="/api/closure", tags=["closure"])


@router.post("/analyze", response_model=DayClosureResult, response_model_by_alias=True)
def analyze(body: ClosureAnalyzeRequest) -> DayClosureResult:
    return analyze_closure(body.text)


@router.post("", response_model=DayClosureResult, response_model_by_alias=True, deprecated=True)
def analyze_legacy_path(body: ClosureAnalyzeRequest) -> DayClosureResult:
    return analyze_closure(body.text)
