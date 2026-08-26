import re
from uuid import uuid4
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

app = FastAPI(title="Last30 Closure API")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"], allow_methods=["*"], allow_headers=["*"])

class ClosureItem(BaseModel):
    id: str
    text: str = Field(min_length=1, max_length=120)

class ClosureResult(BaseModel):
    carry_forward: list[ClosureItem]
    can_pause: list[ClosureItem]
    needs_choice: list[ClosureItem]
    closure_message: str = Field(max_length=40)

    @field_validator("carry_forward")
    @classmethod
    def max_three(cls, value):
        return value[:3]

class ClosureRequest(BaseModel):
    text: str = Field(min_length=1, max_length=800)

def item(text: str) -> ClosureItem:
    return ClosureItem(id=str(uuid4()), text=text)

@app.get("/health")
def health():
    return {"status": "ok", "mode": "demo"}

@app.post("/api/closure", response_model=ClosureResult)
def closure(body: ClosureRequest):
    # Deterministic demo fallback: the UI stays usable without an API key.
    lines = list(dict.fromkeys(x.strip() for x in re.split(r"[\n。；]+", body.text) if x.strip()))
    uncertain = [x for x in lines if re.search(r"回复|回消息|重要|今晚必须", x)][:2]
    tomorrow = [x for x in lines if x not in uncertain and re.search(r"明天|上午|下午|要交|要买|记得", x)][:3]
    paused = [x for x in lines if x not in uncertain and x not in tomorrow][:4]
    return ClosureResult(carry_forward=list(map(item, tomorrow)), can_pause=list(map(item, paused)), needs_choice=list(map(item, uncertain)), closure_message="重要的事已经留下，今晚可以到这里了。")
