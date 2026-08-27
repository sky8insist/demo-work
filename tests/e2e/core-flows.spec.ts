import { expect, test } from "@playwright/test";

let runtimeErrors: string[];
test.beforeEach(async ({ page }) => {
  runtimeErrors = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") runtimeErrors.push(message.text()); });
  await page.goto(".");
  await page.evaluate(async () => {
    localStorage.clear();
    await new Promise<void>((resolve) => { const request = indexedDB.deleteDatabase("last30_v2"); request.onsuccess = request.onerror = request.onblocked = () => resolve(); });
  });
  await page.reload();
});
test.afterEach(() => expect(runtimeErrors, "browser runtime errors").toEqual([]));

test("Day Closure can analyze, resolve uncertainty, persist, and hand off", async ({ page }) => {
  await page.getByRole("button", { name: "收尾今天的事情" }).click();
  await page.getByRole("button", { name: "填入演示内容" }).click();
  await page.getByRole("button", { name: "整理今天" }).click();
  await expect(page.getByRole("heading", { name: /今天，已经/ })).toBeVisible();
  await expect(page.getByText("真正留给明天")).toBeVisible();
  await expect(page.getByText("正在等待")).toBeVisible();
  await expect(page.getByText("今晚可以放下")).toBeVisible();
  await page.getByRole("button", { name: "等待后续" }).click();
  await page.getByRole("button", { name: "一键结束今天" }).click();
  await expect(page.getByText(/明早 08:00 查看交接/)).toBeVisible();
  const record = await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => { const request = indexedDB.open("last30_v2", 1); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
    return await new Promise<Record<string, unknown>>((resolve, reject) => { const request = db.transaction("records").objectStore("records").getAll(); request.onsuccess = () => resolve(request.result.find((item) => item.kind === "closure")); request.onerror = () => reject(request.error); });
  });
  expect(record.status).toBe("scheduled"); expect(record.scheduledFor).toBeTruthy(); expect(record.timezone).toBeTruthy();
  await page.getByRole("button", { name: "进入安静时间" }).click();
  await page.getByRole("button", { name: "演示：结束倒计时" }).click();
  await page.getByRole("button", { name: "演示第二天早晨" }).click();
  await expect(page.getByText("演示时间已推进到明早，数据来自 IndexedDB。")).toBeVisible();
  await expect(page.getByText("昨晚留给今天")).toBeVisible();
});

test("Emotion Bottle processes a sealed reflection through IndexedDB", async ({ page }) => {
  await page.getByRole("button", { name: "打开情绪宣泄瓶" }).click();
  await page.getByRole("button", { name: "打开情绪瓶" }).click();
  await page.getByRole("button", { name: "填入演示内容" }).click();
  await page.getByRole("button", { name: "说完了" }).click();
  await page.getByRole("button", { name: /明天让我看看/ }).click();
  await expect(page.getByText("想说的话已经留在这里")).toBeVisible();
  await page.getByRole("button", { name: "演示：结束倒计时" }).click();
  await page.getByRole("button", { name: "演示第二天早晨" }).click();
  await page.getByRole("button", { name: /昨晚的情绪瓶/ }).click();
  await expect(page.getByRole("heading", { name: /这是你昨晚/ })).toBeVisible();
  await expect(page.getByText("项目与工作进度", { exact: true })).toBeVisible();
});

test("Mock voice path works without microphone permission on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "收尾今天的事情" }).click();
  await page.getByRole("button", { name: "语音" }).click();
  await page.getByRole("button", { name: "模拟一段语音" }).click();
  await expect(page.getByRole("textbox")).toContainText("今天首页已经写完了");
  await expect(page.getByRole("button", { name: "整理今天" })).toBeEnabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
});
