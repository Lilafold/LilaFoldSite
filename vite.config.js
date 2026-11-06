import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages serves this repo at /LilaFoldSite/; the deploy workflow sets VITE_BASE.
// Switch it to "/" if you add a custom domain.
export default defineConfig({
  base: process.env.VITE_BASE || "/",
  plugins: [react()],
});
