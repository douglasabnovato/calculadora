/*
 * playwright.config.js · teste de ponta a ponta no Chromium, sobre o build de produção.
 * Rode `npm run build` antes. Porta própria (4317) para não colidir com outros servidores.
 */
const { defineConfig, devices } = require("@playwright/test");

const PORT = Number(process.env.E2E_PORT) || 4317;

module.exports = defineConfig({
  testDir: "./e2e",
  testMatch: /.*\.e2e\.js$/,
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "retain-on-failure",
    reducedMotion: "reduce",
    locale: "pt-BR",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } } }],
  webServer: {
    command: "node scripts/servir-build.js",
    url: `http://127.0.0.1:${PORT}`,
    env: { PORT: String(PORT) },
    reuseExistingServer: false,
    timeout: 30000,
  },
});
