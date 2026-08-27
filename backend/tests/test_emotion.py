import unittest

from backend.app.services.emotion_processor import process_emotion


class EmotionProcessorTests(unittest.TestCase):
    def test_factual_bounded_summary(self) -> None:
        result = process_emotion("项目推进得不顺。和同学沟通有点累。明天时间很紧。")
        payload = result.model_dump(by_alias=True)
        self.assertIn("项目与工作进度", payload["topics"])
        self.assertIn("沟通与关系", payload["topics"])
        self.assertNotIn("建议", payload["conciseSummary"])


if __name__ == "__main__":
    unittest.main()
