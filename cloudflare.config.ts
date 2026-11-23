import { defineConfig } from "cf/config";

// Static Astro site: `npm run build` writes ./dist, `cf deploy ./dist` uploads it as an assets-only Worker.
export default defineConfig({
  worker: {
    name: "frank-site",
    compatibilityDate: "2026-11-01",
    assets: { htmlHandling: "auto-trailing-slash", notFoundHandling: "404-page" },
  },
});
