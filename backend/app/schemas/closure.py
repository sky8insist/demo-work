from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator


class ApiModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True)


class CompletedItem(ApiModel):
    id: str
    summary: str = Field(min_length=1, max_length=240)


class OpenLoop(ApiModel):
    id: str
    original_text: str = Field(alias="originalText", min_length=1, max_length=240)
    normalized_text: str = Field(alias="normalizedText", min_length=1, max_length=240)
    type: Literal["actionable", "waiting", "deferred", "thought", "unclear"]
    resolution: Literal["archive", "tomorrow", "waiting", "release", "needs_choice"]
    next_action: str | None = Field(default=None, alias="nextAction", max_length=240)
    confidence: float = Field(ge=0, le=1)


class DayClosureResult(ApiModel):
    completed: list[CompletedItem] = Field(default_factory=list)
    tomorrow: list[OpenLoop] = Field(default_factory=list)
    waiting: list[OpenLoop] = Field(default_factory=list)
    released: list[OpenLoop] = Field(default_factory=list)
    needs_choice: list[OpenLoop] = Field(default_factory=list, alias="needsChoice")
    closure_message: str = Field(alias="closureMessage", min_length=1, max_length=80)

    @field_validator("tomorrow")
    @classmethod
    def limit_tomorrow(cls, value: list[OpenLoop]) -> list[OpenLoop]:
        return value[:4]

    @field_validator("needs_choice")
    @classmethod
    def limit_choices(cls, value: list[OpenLoop]) -> list[OpenLoop]:
        return value[:2]


class ClosureAnalyzeRequest(ApiModel):
    text: str = Field(min_length=1, max_length=1200)
