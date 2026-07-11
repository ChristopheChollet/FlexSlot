import { defineConfig } from "@playwright/test";

/**
 * E2E « approfondi » FlexSlot : le vrai flow métier reco → création de slot GreenOps,
 * de façon déterministe.
 *
 * Les services externes (GridPulse, GreenOps) sont appelés côté serveur par FlexSlot,
 * donc non mockables depuis le navigateur. On les remplace par un stub HTTP local
 * (`e2e/stub-server.mjs`) vers lequel on pointe FlexSlot via variables d'env.
 * Supabase est laissé vide → l'historique est un no-op (pas de base requise).
 */
const STUB_PORT = process.env.STUB_PORT || "4599";
const STUB_URL = `http://localhost:${STUB_PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3002",
    trace: "on-first-retry",
  },
  webServer: [
    {
      command: "node e2e/stub-server.mjs",
      env: { PORT: STUB_PORT },
      url: `${STUB_URL}/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
    {
      command: "npm run dev",
      url: "http://localhost:3002",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        // FlexSlot appelle le stub au lieu des vrais services.
        GRIDPULSE_API_URL: STUB_URL,
        GREENOPS_API_URL: STUB_URL,
        GREENOPS_SERVICE_KEY: "e2e-test-key",
        GREENOPS_DEMO_ORG_ID: "e2e-org-0001",
        // Supabase désactivé → historique no-op, aucun accès base.
        SUPABASE_URL: "",
        SUPABASE_SERVICE_ROLE_KEY: "",
      },
    },
  ],
});
