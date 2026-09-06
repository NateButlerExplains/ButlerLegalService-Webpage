// Capture README screenshots of the live site.
// Usage: npm run shots            (writes .github/readme/desktop.jpg and mobile.jpg)
//        node scripts/shots.js <outdir> [baseUrl]
const { chromium } = require('@playwright/test');
(async () => {
  const out = process.argv[2] || '.github/readme';
  const base = process.argv[3] || 'https://butlerlegalservice.com';
  const browser = await chromium.launch();
  const shots = [
    { name: 'desktop', viewport: { width: 1440, height: 900 }, scale: 1 },
    { name: 'mobile', viewport: { width: 390, height: 844 }, scale: 2, mobile: true },
  ];
  for (const s of shots) {
    const ctx = await browser.newContext({ viewport: s.viewport, deviceScaleFactor: s.scale, isMobile: !!s.mobile, hasTouch: !!s.mobile });
    const page = await ctx.newPage();
    await page.goto(base + '/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${out}/${s.name}.jpg`, fullPage: false, type: 'jpeg', quality: 82 });
    await ctx.close();
    console.log('saved', `${out}/${s.name}.jpg`);
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
