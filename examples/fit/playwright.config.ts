import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "e2e",
  webServer: {
    command: "pnpm dev",
    port: 4501,
    reuseExistingServer: true,
  },
  use: {
    baseURL: "http://localhost:4501",
  },
})
