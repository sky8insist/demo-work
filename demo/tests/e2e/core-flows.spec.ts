import { expect, test } from "@playwright/test";

let runtimeErrors: string[];
test.beforeEach(async ({ page }) => {
  runtimeErrors = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") runtimeErrors.push(message.text()); });
  await page.goto(".");
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  await page.reload();
});
test.afterEach(() => expect(runtimeErrors, "browser runtime errors").toEqual([]));

test("Adaptive Day Closure resolves one loop at a time into the Closure Map", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: ".impeccable/review/desktop.png", fullPage: true });
  await page.getByRole("button", { name: "收尾今天" }).click();
  await expect(page.locator(".ambient-record")).toHaveClass(/is-playing/);
  await page.getByRole("button", { name: /填入演示案例/ }).click();
  await page.getByRole("button", { name: "开始逐项收尾" }).click();
  await expect(page.getByText("为什么这件事现在还挂在脑子里？")).toBeVisible();
  for (let i = 0; i < 6; i += 1) {
    await page.getByRole("button", { name: /怕明天忘记/ }).click();
    await page.getByRole("button", { name: "08:00", exact: true }).click();
    if (i === 0) await expect(page.locator(".closure-transfer-ghost")).toBeVisible();
    if (i === 1) {
      await expect(page.locator(".map-tomorrow .map-item")).toHaveCount(2);
      await page.reload();
      await expect(page.getByText("为什么这件事现在还挂在脑子里？")).toBeVisible();
      await expect(page.locator(".map-tomorrow .map-item")).toHaveCount(2);
    }
  }
  await expect(page.locator("h1")).toContainText("今天已经");
  await expect(page.locator(".receipt-ledger")).toContainText("完成");
  await expect(page.locator(".receipt-ledger")).toContainText("明天");
  await page.getByRole("button", { name: "结束今天" }).click();
  await expect(page.getByText("明天的事情已经交给明天")).toBeVisible();
});

test("Emotion Bottle opens, pours, seals, locks, and reveals next morning", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: ".impeccable/review/mobile.png", fullPage: true });
  await page.getByRole("button", { name: /打开情绪瓶/ }).click();
  await page.getByRole("button", { name: /打开情绪瓶/ }).click();
  await expect(page.getByPlaceholder("把想说的话留在这里。不用整理。")).toBeVisible();
  await page.getByRole("button", { name: "填入演示内容" }).click();
  await page.getByRole("button", { name: "说完了" }).click();
  await expect(page.getByText("明早 08:00 解锁")).toBeVisible();
  await page.getByRole("button", { name: "进入安静时间" }).click();
  await page.getByRole("button", { name: "演示：结束倒计时" }).click();
  await page.getByRole("button", { name: "演示明天早晨" }).click();
  await page.getByRole("button", { name: /昨晚的情绪瓶/ }).click();
  await expect(page.getByRole("heading", { name: /昨晚留下的/ })).toBeVisible();
  await expect(page.getByText("项目推进", { exact: true })).toBeVisible();
  await expect(page.getByText("今天不需要扛住全部。先完成一件最小的事，生活会重新出现缝隙。", { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
});

test("High-distress language shows the safety boundary without sealing", async ({ page }) => {
  await page.getByRole("button", { name: /打开情绪瓶/ }).click();
  await page.getByRole("button", { name: /打开情绪瓶/ }).click();
  const input = page.getByPlaceholder("把想说的话留在这里。不用整理。");
  await input.fill("我现在想伤害自己");
  await expect(page.getByRole("alert")).toContainText("请先联系当地紧急服务");
  await page.getByRole("button", { name: "说完了" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.getByText("明早 08:00 解锁")).toHaveCount(0);
});

test("Ambient player can be dragged, nudged, and restores its position", async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 760 });
  const player = page.locator(".ambient-record");
  const handle = page.getByRole("button", { name: /拖动音乐播放器/ });
  const before = await player.boundingBox();
  const grip = await handle.boundingBox();
  expect(before).toBeTruthy(); expect(grip).toBeTruthy();
  await page.mouse.move(grip!.x + grip!.width / 2, grip!.y + grip!.height / 2);
  await page.mouse.down();
  await page.mouse.move(240, 250, { steps: 8 });
  await page.mouse.up();
  const moved = await player.boundingBox();
  expect(Math.abs(moved!.x - before!.x)).toBeGreaterThan(80);
  expect(Math.abs(moved!.y - before!.y)).toBeGreaterThan(80);
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("last30_music_position_v2") || "null"));
  expect(stored).toBeTruthy();
  await page.reload();
  await expect(player).toBeVisible();
  const restored = await player.boundingBox();
  expect(Math.abs(restored!.x - moved!.x)).toBeLessThan(3);
  expect(Math.abs(restored!.y - moved!.y)).toBeLessThan(3);
  await handle.focus();
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(260);
  const nudged = await player.boundingBox();
  expect(nudged!.x).toBeGreaterThan(restored!.x + 7);
  expect(nudged!.x + nudged!.width).toBeLessThanOrEqual(1000);
});
