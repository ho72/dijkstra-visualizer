import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { offlinePlugin } from "./src/build/offlinePlugin";

export default defineConfig({
  plugins: [react(), offlinePlugin()],
  build: {
    rollupOptions: {
      output: {
        onlyExplicitManualChunks: true,
        manualChunks(id) {
          if (!id.includes("/node_modules/")) return;
          if (/\/(react|react-dom|scheduler)\//.test(id)) return "react";
          if (/\/(framer-motion|motion-dom|motion-utils)\//.test(id))
            return "motion";
          if (id.includes("/three/") || id.includes("/@react-three/fiber/"))
            return "three";
        },
      },
    },
  },
});
