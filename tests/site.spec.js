// @ts-check
const { test, expect } = require("@playwright/test");

/** All static pages that should exist and be reachable. */
const SITE_PAGES = [
  "index.html",
  "privacy.html",
  "terms.html",
  "disclaimer.html",
  "accident-claims.html",
  "estate-planning.html",
  "business-legal-support.html",
  "contract-review.html",
];

/** The four dedicated service pages, keyed by expected homepage card title. */
const SERVICE_CARDS = [
  { title: "Accident Claims & Injury Guidance", href: "accident-claims.html" },
  { title: "Estate & Legacy Planning", href: "estate-planning.html" },
  { title: "Small Business Legal Support", href: "business-legal-support.html" },
  { title: "Contract Review & Negotiation", href: "contract-review.html" },
];

test.describe("Homepage", () => {
  test("loads successfully", async ({ page }) => {
    const response = await page.goto("/index.html");
    expect(response && response.ok()).toBeTruthy();
    await expect(page).toHaveTitle(/Butler Legal Service/);
    await expect(page.locator("h1")).toHaveText("Butler Legal Service");
  });

  test("service cards link to the four dedicated service pages", async ({ page }) => {
    await page.goto("/index.html");
    for (const card of SERVICE_CARDS) {
      const link = page.locator(`.service-card[href="${card.href}"]`);
      await expect(link).toHaveCount(1);
      await expect(link.locator("h3")).toHaveText(card.title);
    }
  });

  test("mobile navigation opens and closes", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/index.html");

    const toggle = page.locator("[data-nav-toggle]");
    const nav = page.locator("[data-nav]");

    await expect(nav).not.toHaveClass(/open/);
    await toggle.click();
    await expect(nav).toHaveClass(/open/);
    await expect(toggle).toHaveAttribute("aria-expanded", "true");

    // Clicking a nav link should close the mobile menu again.
    await nav.locator('a[href="#contact"]').click();
    await expect(nav).not.toHaveClass(/open/);
  });
});

test.describe("Dedicated service pages", () => {
  for (const card of SERVICE_CARDS) {
    test(`${card.href} loads successfully with a clear title and CTA`, async ({ page }) => {
      const response = await page.goto(`/${card.href}`);
      expect(response && response.ok()).toBeTruthy();
      await expect(page.locator("h1")).toHaveText(card.title);
      // Every service page must offer a clear contact/CTA path.
      await expect(page.locator('.cta-actions a[href^="tel:"]')).toHaveCount(1);
    });
  }
});

test.describe("Legal pages", () => {
  test("Disclaimer page loads successfully", async ({ page }) => {
    const response = await page.goto("/disclaimer.html");
    expect(response && response.ok()).toBeTruthy();
    await expect(page.locator("h1")).toHaveText("Disclaimer");
    await expect(page.getByText("licensed to practice law only in Missouri and North Carolina")).toBeVisible();
  });

  test("Privacy Policy loads successfully", async ({ page }) => {
    const response = await page.goto("/privacy.html");
    expect(response && response.ok()).toBeTruthy();
    await expect(page.locator("h1")).toHaveText("Privacy Policy");
  });

  test("Terms of Use loads successfully", async ({ page }) => {
    const response = await page.goto("/terms.html");
    expect(response && response.ok()).toBeTruthy();
    await expect(page.locator("h1")).toHaveText("Terms of Use");
    await expect(page.getByText("licensed to practice law only in Missouri and North Carolina")).toBeVisible();
  });
});

test.describe("Footer navigation", () => {
  for (const pageFile of SITE_PAGES) {
    test(`footer links resolve correctly from ${pageFile}`, async ({ page, request }) => {
      await page.goto(`/${pageFile}`);
      const footerLinks = page.locator(".site-footer nav a");
      await expect(footerLinks).toHaveCount(3);

      const hrefs = await footerLinks.evaluateAll((links) => links.map((a) => a.getAttribute("href")));
      expect(hrefs.sort()).toEqual(["disclaimer.html", "privacy.html", "terms.html"]);

      for (const href of hrefs) {
        const res = await request.get(`/${href}`);
        expect(res.ok(), `${href} should resolve`).toBeTruthy();
      }
    });
  }
});

test.describe("Link integrity", () => {
  for (const pageFile of SITE_PAGES) {
    test(`internal links on ${pageFile} are not obviously broken`, async ({ page, request, baseURL }) => {
      await page.goto(`/${pageFile}`);
      const hrefs = await page.locator("a[href]").evaluateAll((links) =>
        links.map((a) => a.getAttribute("href")).filter(Boolean)
      );

      const internalPageLinks = hrefs
        .filter((href) => /** @type {string} */ (href))
        .filter((href) => !href.startsWith("http") && !href.startsWith("mailto:") && !href.startsWith("tel:"))
        .map((href) => href.split("#")[0])
        .filter((href) => href.length > 0);

      for (const href of new Set(internalPageLinks)) {
        const res = await request.get(new URL(href, baseURL || "").toString());
        expect(res.ok(), `${href} linked from ${pageFile} should resolve`).toBeTruthy();
      }
    });
  }
});
