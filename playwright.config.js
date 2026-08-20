// @ts-check
const { defineConfig, devices } = require("@playwright/test");

const port = process.env.PLAYWRIGHT_PORT || "4173";
const baseURL = `http://127.0.0.1:${port}`;

module.exports = defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: {
    command: `python -m http.server ${port}`,
    url: `${baseURL}/index.html`,
    reuseExistingServer: !process.env.CI,
    timeout: 30 * 1000,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
});
