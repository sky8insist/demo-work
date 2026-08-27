from pydantic import BaseModel, ConfigDict, Field


class EmotionProcessRequest(BaseModel):
    transcript: str = Field(min_length=1, max_length=4000)


class EmotionSummary(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    concise_summary: str = Field(alias="conciseSummary", max_length=240)
    topics: list[str] = Field(max_length=5)
    key_events: list[str] = Field(alias="keyEvents", max_length=5)
    repeated_concerns: list[str] = Field(alias="repeatedConcerns", max_length=3)
