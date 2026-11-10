import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const page = (p) => fileURLToPath(new URL(p, import.meta.url));

// The site is served from the root of lilafold.io. The deploy workflow sets VITE_BASE
// (repo variable SITE_BASE, default "/"); use "/LilaFoldSite/" without a custom domain.
// Two pages: the landing page and the blog (/blog/, posts at /blog/?post=slug).
export default defineConfig({
  base: process.env.VITE_BASE || "/",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: page("./index.html"),
        blog: page("./blog/index.html"),
      },
    },
  },
});
