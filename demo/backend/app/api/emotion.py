from fastapi import APIRouter

from ..schemas.emotion import EmotionProcessRequest, EmotionSummary
from ..services.emotion_processor import process_emotion

router = APIRouter(prefix="/api/emotion", tags=["emotion"])


@router.post("/process", response_model=EmotionSummary, response_model_by_alias=True)
def process(body: EmotionProcessRequest) -> EmotionSummary:
    return process_emotion(body.transcript)
