import { test, expect } from "@playwright/test";

test.describe("Portfolio Production System E2E Suite", () => {
  test("home renders headline and live request trace waterfall", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Jagannath Mukherjee/);

    // Verify trace waterfall component is rendered
    const trace = page.locator("text=LIVE_REQUEST_TRACE");
    await expect(trace).toBeVisible();

    // Verify system identity
    await expect(page.locator("h1")).toContainText("Jagannath Mukherjee");
  });

  test("recruiter mode (TL;DR) toggle collapses to 30-second single screen", async ({ page }) => {
    await page.goto("/");

    // Click recruiter mode toggle
    const toggle = page.locator("button:has-text('Recruiter Mode'), button:has-text('TL;DR')");
    await toggle.click();

    // Verify recruiter view is rendered
    await expect(page.locator("text=RECRUITER_OVERVIEW // 30-SECOND_SCAN")).toBeVisible();
    await expect(page.locator("text=TOP 3 PRODUCTION DELIVERIES")).toBeVisible();
    await expect(page.locator("text=Download Résumé (PDF)")).toBeVisible();
  });

  test("command palette opens on Cmd+K and navigates to section", async ({ page }) => {
    await page.goto("/");

    // Trigger keyboard shortcut Cmd+K / Ctrl+K
    await page.keyboard.press("Control+k");

    // Palette modal dialog visible
    const paletteInput = page.locator("input[placeholder*='Type a command']");
    await expect(paletteInput).toBeVisible();

    // Type navigation command
    await paletteInput.fill("Services");
    const serviceOption = page.locator("button:has-text('Jump to Services')");
    await expect(serviceOption).toBeVisible();
  });

  test("contact ticket form enforces required fields and honeypot validation", async ({ page }) => {
    await page.goto("/#contact");

    const reporterInput = page.locator("input[placeholder='e.g. Jane Doe']");
    await expect(reporterInput).toBeVisible();

    // Fill contact ticket
    await reporterInput.fill("Automated E2E Agent");
    await page.locator("input[placeholder='e.g. jane@acme.corp']").fill("e2e@acme.corp");
    await page.locator("input[placeholder*='Distributed Consensus']").fill("Playwright E2E Ticket Test");
    await page.locator("textarea[placeholder*='Provide details']").fill("Testing zero-downtime submission dispatch pipeline.");

    // Wait 2.2 seconds to pass the time-to-submit bot trap (< 2s)
    await page.waitForTimeout(2200);

    await page.locator("button:has-text('Dispatch ticket')").click();
    await expect(page.locator("text=Ticket Filed Successfully")).toBeVisible({ timeout: 10000 });
  });

  test("admin dashboard gate requires authentication", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.locator("text=Admin Console Authentication")).toBeVisible();

    // Attempting unauthorized handle
    await page.locator("input[placeholder='e.g. jagannath-m']").fill("unauthorized_hacker");
    await page.locator("input[placeholder*='passkey']").fill("wrong-pass");
    await page.locator("button:has-text('Verify Credentials')").click();

    await expect(page.locator("text=Authorization denied")).toBeVisible();
  });

  test("curl user-agent receives ANSI formatted text resume", async ({ request }) => {
    const response = await request.get("/", {
      headers: { "user-agent": "curl/7.88.1" },
    });
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("CAREER GIT LOG");
    expect(body).toContain("PRODUCTION SERVICES");
  });
});
