import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "LANDGUARD AI",
        short_name: "LANDGUARD",
        description: "AI-based early warning and landslide risk monitoring for NER India",
        theme_color: "#0F3D3E",
        background_color: "#0B1F1F",
        display: "standalone",
        icons: [],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /\/api\/risk-zones/,
            handler: "NetworkFirst",
            options: { cacheName: "risk-zones-cache" },
          },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
      },
    },
  },
});
