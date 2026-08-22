import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite-plus";

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      // A tracker is useless if it only works online, so the service worker runs
      // in dev too — offline behaviour gets tested continuously, not at the end.
      devOptions: { enabled: true },
      includeAssets: ["favicon.svg", "apple-touch-icon.png"],
      manifest: {
        id: "/",
        name: "veggr — plant variety tracker",
        short_name: "veggr",
        description: "Track how many different plants you eat each day, and each week.",
        lang: "en",
        theme_color: "#131914",
        background_color: "#0b100c",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        categories: ["health", "food", "lifestyle"],
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "pwa-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  // `vp lint`'s tsc pass cannot resolve `.vue` imports, so type truth comes from
  // `vue-tsc --noEmit` in the build script instead. Type-aware oxlint stays on.
  lint: { options: { typeAware: true, typeCheck: false } },
});
