import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The site is served from the root of lilafold.io. The deploy workflow sets VITE_BASE
// (repo variable SITE_BASE, default "/"); use "/LilaFoldSite/" without a custom domain.
export default defineConfig({
  base: process.env.VITE_BASE || "/",
  plugins: [react()],
});
