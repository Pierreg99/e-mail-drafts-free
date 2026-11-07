// Executed in the browser-smoke CI job after installing pinned Playwright + Chromium.
// Screenshots are created by a REAL browser and uploaded as workflow artifacts.
import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const baseURL = process.env.BASE_URL || "http://127.0.0.1:8000";
const browser = await chromium.launch({ headless: true });
mkdirSync("artifacts", { recursive: true });
try {
  for (const [name, viewport] of [
    ["desktop-library", { width: 1440, height: 900 }],
    ["mobile-editor", { width: 390, height: 844 }],
    ["mobile-small", { width: 360, height: 800 }],
  ]) {
    const context = await browser.newContext({ viewport, locale: "de-DE" });
    const page = await context.newPage();
    const pageErrors = [];
    page.on("pageerror", err => pageErrors.push(err.message));
    const response = await page.goto(baseURL, { waitUntil: "networkidle" });
    assert.equal(response?.status(), 200, name + ": HTTP status");
    await page.waitForFunction(() => document.querySelector("#total-count")?.textContent === "36");
    assert.equal((await page.locator(".draft-item").count()), 36);
    assert.equal(await page.locator("#batch-count").textContent(), "12");
    assert.equal(await page.locator("#editor-content").isVisible(), true);
    assert.equal(await page.locator("#copy-ready").isDisabled(), true);
    const size = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, inner: window.innerWidth }));
    assert.ok(size.scroll <= size.inner + 2, name + ": horizontal overflow: " + JSON.stringify(size));

    // Open filtered, editable draft.
    await page.locator("#lang").selectOption("en");
    assert.equal(await page.locator(".draft-item").count(), 12);
    await page.locator("#q").fill("not-a-real-term-q4321");
    assert.equal(await page.locator(".draft-item").count(), 0);
    await page.locator("#clear-filters").click();
    assert.equal(await page.locator(".draft-item").count(), 36);
    await page.locator("#subject").fill("Example subject");
    await page.locator("#body").fill("Example body without placeholders");
    assert.equal(await page.locator("#copy-ready").isEnabled(), true);
    assert.equal(await page.locator("#review-label").textContent(), "Keine offenen Platzhalter");
    await page.locator("#reset-draft").click();
    assert.equal(await page.locator("#copy-ready").isDisabled(), true);
    await page.locator("#copy-template").click();
    await page.waitForFunction(() => Boolean(document.querySelector("#copy-status")?.textContent));
    const status = await page.locator("#copy-status").textContent();
    assert.ok(status.includes("Vorlage kopiert") || status.includes("Kopieren nicht möglich"), name + ": copy feedback missing");

    // A screenshot of the actual running site, never generated illustration.
    await page.screenshot({ path: "artifacts/" + name + ".png", fullPage: true });
    assert.deepEqual(pageErrors, [], name + ": browser console errors");
    await context.close();
    console.log("PASS browser", name, viewport.width + "x" + viewport.height);
  }
} finally {
  await browser.close();
}
