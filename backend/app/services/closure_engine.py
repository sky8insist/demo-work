import re
from uuid import uuid4

from ..schemas.closure import CompletedItem, DayClosureResult, OpenLoop


def _clean(text: str) -> list[str]:
    return list(dict.fromkeys(part.strip() for part in re.split(r"[\n。；]+", text) if part.strip()))


def _loop(text: str, kind: str, resolution: str, confidence: float, next_action: str | None = None) -> OpenLoop:
    normalized = re.sub(r"^(今天|明天|明早)", "", text).strip() or text
    return OpenLoop(id=str(uuid4()), originalText=text, normalizedText=normalized, type=kind,
                    resolution=resolution, nextAction=next_action, confidence=confidence)


def _next_action(text: str) -> str:
    if re.search(r"登录|bug|问题", text, re.IGNORECASE):
        return "复现一次问题，并记下失败步骤"
    if re.search(r"周报|报告", text):
        return "打开最终版本，检查后提交"
    if re.search(r"邮件|回复", text):
        return "打开对话，确认是否需要回复"
    if "简历" in text:
        return "打开简历，先修改项目经历第一条"
    if re.search(r"买|采购", text):
        return "把物品加入明天的出门清单"
    return "打开相关内容，先完成最小的一步"


def analyze_closure(text: str) -> DayClosureResult:
    """Conservative deterministic engine used until a live LLM is configured."""
    completed, tomorrow, waiting, released, needs_choice = [], [], [], [], []
    for line in _clean(text):
        if re.search(r"写完|做完|完成|已经", line) and not re.search(r"没完成|没做完", line):
            completed.append(CompletedItem(id=str(uuid4()), summary=re.sub(r"^(今天|已经)", "", line).strip() or line))
        elif re.search(r"在等|等待|等.*文案|对方处理", line):
            waiting.append(_loop(line, "waiting", "waiting", 0.91))
        elif re.search(r"感觉|担心|焦虑|效率|一直想着", line):
            released.append(_loop(line, "thought", "release", 0.92))
        elif re.search(r"还没回|要不要|不确定|可能", line):
            needs_choice.append(_loop(line, "unclear", "needs_choice", 0.43))
        else:
            confidence = 0.93 if re.search(r"明天|明早|要交", line) else 0.72
            tomorrow.append(_loop(line, "actionable", "tomorrow", confidence, _next_action(line)))
    return DayClosureResult(completed=completed, tomorrow=tomorrow, waiting=waiting, released=released,
                            needsChoice=needs_choice, closureMessage="完成的已经归档，未完的已经有了去处。")
