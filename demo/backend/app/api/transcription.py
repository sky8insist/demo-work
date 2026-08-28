from fastapi import APIRouter, Request

from ..schemas.transcription import TranscriptionResult

router = APIRouter(prefix="/api", tags=["transcription"])


@router.post("/transcribe", response_model=TranscriptionResult)
async def transcribe(request: Request) -> TranscriptionResult:
    body = await request.body()
    mode = "emotion" if b"emotion" in body else "closure"
    transcript = ("今天首页已经写完了\n登录还有问题\n在等产品给最终文案\n老师邮件还没回\n明早交周报" if mode == "closure"
                  else "项目推进得不太顺，和同学沟通也有点累。明天的事情都挤在一起，我一直在想时间够不够。")
    return TranscriptionResult(transcript=transcript, mode=mode)
