import re

from ..schemas.emotion import EmotionSummary


def process_emotion(text: str) -> EmotionSummary:
    lines = [part.strip() for part in re.split(r"[\n。；]+", text) if part.strip()]
    topics = []
    for pattern, topic in ((r"项目|工作|进度|任务", "项目与工作进度"), (r"同学|同事|老师|沟通|回复", "沟通与关系"), (r"明天|时间|来不及|任务", "明天的时间安排")):
        if re.search(pattern, text): topics.append(topic)
    topics = topics or ["昨晚想表达的内容"]
    return EmotionSummary(conciseSummary=f"昨晚的内容主要围绕{'和'.join(topics[:2])}。", topics=topics,
                          keyEvents=[line for line in lines if re.search(r"发生|收到|说了|没有|没回|完成", line)][:3],
                          repeatedConcerns=[topics[0]] if len(lines) > 2 else [])
