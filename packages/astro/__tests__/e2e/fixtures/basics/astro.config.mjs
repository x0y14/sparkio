import { defineConfig } from "astro/config"
import { blaskIntegration } from "@blask/astro"

export default defineConfig({
  integrations: [blaskIntegration()],
})
