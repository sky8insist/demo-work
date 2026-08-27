import unittest

from backend.app.schemas.closure import DayClosureResult
from backend.app.services.closure_engine import analyze_closure


class ClosureEngineTests(unittest.TestCase):
    def test_v2_groups_and_aliases(self) -> None:
        result = analyze_closure("今天首页已经写完了\n登录还有问题\n在等产品给最终文案\n老师邮件还没回\n明早交周报\n今天感觉效率有点低")
        payload = result.model_dump(by_alias=True)
        self.assertEqual([len(payload[key]) for key in ("completed", "tomorrow", "waiting", "released", "needsChoice")], [1, 2, 1, 1, 1])
        self.assertIn("nextAction", payload["tomorrow"][0])
        self.assertIn("closureMessage", payload)
        self.assertNotIn("carry_forward", payload)

    def test_limits_choice_and_tomorrow_items(self) -> None:
        result = analyze_closure("\n".join([f"普通任务{i}" for i in range(6)] + [f"可能任务{i}" for i in range(4)]))
        self.assertLessEqual(len(result.tomorrow), 4)
        self.assertLessEqual(len(result.needs_choice), 2)

    def test_result_round_trips_through_schema(self) -> None:
        payload = analyze_closure("明早交周报").model_dump(by_alias=True)
        self.assertEqual(DayClosureResult.model_validate(payload).tomorrow[0].resolution, "tomorrow")


if __name__ == "__main__":
    unittest.main()
