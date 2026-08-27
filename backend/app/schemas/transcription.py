from pydantic import BaseModel, Field


class TranscriptionResult(BaseModel):
    transcript: str = Field(min_length=1, max_length=4000)
    mode: str
    source: str = "mock"
