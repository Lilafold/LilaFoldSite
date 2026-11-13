import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, pathToFileURL } from "node:url";
import { readdirSync, readFileSync } from "node:fs";

const page = (p) => fileURLToPath(new URL(p, import.meta.url));
const ORIGIN = "https://lilafold.io";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Blog posts live at /blog/<post-name>/. GitHub Pages only serves files, so at build
 * time this writes one real page per post (blog/<slug>/index.html) from the built
 * blog page, with that post's title, description, canonical link, share-card tags,
 * structured data and text already in the HTML. Link-preview bots and search engines
 * therefore get per-post details without running any JavaScript; the React app then
 * takes over in the browser. It also writes sitemap.xml from the posts, and in dev it
 * serves /blog/<slug>/ with the blog page.
 */
function blogPages() {
  const dir = page("./src/content/blog/");
  let base = "/";

  const load = () =>
    readdirSync(dir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => {
        const raw = readFileSync(dir + f, "utf8");
        const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
        const meta = {};
        for (const line of m ? m[1].split(/\r?\n/) : []) {
          const i = line.indexOf(":");
          if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
        }
        return {
          slug: f.replace(/\.md$/, ""),
          title: meta.title || f,
          excerpt: meta.excerpt || "",
          date: meta.date || "",
          author: meta.author || "LilaFold team",
          tags: (meta.tags || "").split(",").map((t) => t.trim()).filter(Boolean),
          body: m ? m[2] : raw,
        };
      });

  return {
    name: "lilafold-blog-pages",
    // after Vite's own HTML plugin, so the built blog page exists in the bundle
    enforce: "post",
    configResolved(c) {
      base = c.base;
    },
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const m = (req.url || "").match(/^\/blog\/([a-z0-9-]+)\/?(\?.*)?$/);
        // re-read the folder so posts added while the dev server runs work too
        if (m && load().some((p) => p.slug === m[1])) req.url = "/blog/index.html";
        next();
      });
    },
    async generateBundle(_, bundle) {
      const posts = load();
      const { renderMarkdown } = await import(pathToFileURL(page("./src/blog/markdown.js")).href);

      const blog = bundle["blog/index.html"];
      if (blog && typeof blog.source === "string") {
        for (const p of posts) {
          const url = `${ORIGIN}${base}blog/${p.slug}/`;
          const set = (html, re, to) => {
            if (!re.test(html)) throw new Error(`blog page: pattern not found: ${re}`);
            return html.replace(re, () => to);
          };
          let html = blog.source;
          html = set(html, /<title>[^<]*<\/title>/, `<title>${esc(p.title)} | LilaFold</title>`);
          html = set(html, /<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(p.excerpt)}">`);
          html = set(html, /<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`);
          html = set(html, /<meta property="og:type" content="[^"]*">/, `<meta property="og:type" content="article">`);
          html = set(html, /<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`);
          html = set(html, /<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(p.title)}">`);
          html = set(html, /<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(p.excerpt)}">`);
          html = set(html, /<meta name="twitter:url" content="[^"]*">/, `<meta name="twitter:url" content="${url}">`);
          html = set(html, /<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${esc(p.title)}">`);
          html = set(html, /<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${esc(p.excerpt)}">`);

          // structured data: keep the Blog and organisation nodes and add this post
          html = html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/, (_m, json) => {
            const data = JSON.parse(json);
            data["@graph"].push({
              "@type": "BlogPosting",
              "@id": `${url}#post`,
              headline: p.title,
              description: p.excerpt,
              url,
              mainEntityOfPage: url,
              datePublished: p.date,
              dateModified: p.date,
              inLanguage: "en",
              keywords: p.tags.join(", "),
              author: { "@type": "Organization", name: p.author, url: `${ORIGIN}/` },
              publisher: { "@id": `${ORIGIN}/#organization` },
              image: `${ORIGIN}/og-blog.png`,
              isPartOf: { "@id": `${ORIGIN}${base}blog/#blog` },
            });
            return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n</script>`;
          });

          // the post's text, for crawlers; React replaces it on load
          html = set(
            html,
            /<div id="root"><\/div>/,
            `<div id="root"><article style="display:none"><h1>${esc(p.title)}</h1><p>${esc(p.excerpt)}</p>${renderMarkdown(p.body)}</article></div>`
          );
          this.emitFile({ type: "asset", fileName: `blog/${p.slug}/index.html`, source: html });
        }
      }

      const today = new Date().toISOString().slice(0, 10);
      const latest = posts.map((p) => p.date).filter(Boolean).sort().pop() || today;
      const entry = (loc, lastmod, freq, prio) =>
        `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${prio}</priority>\n  </url>`;
      const sitemap = [
        `<?xml version="1.0" encoding="UTF-8"?>`,
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
        entry(`${ORIGIN}${base}`, today, "weekly", "1.0"),
        entry(`${ORIGIN}${base}blog/`, latest, "weekly", "0.8"),
        ...posts.map((p) => entry(`${ORIGIN}${base}blog/${p.slug}/`, p.date || today, "monthly", "0.6")),
        `</urlset>`,
        ``,
      ].join("\n");
      this.emitFile({ type: "asset", fileName: "sitemap.xml", source: sitemap });
    },
  };
}

// The site is served from the root of lilafold.io. The deploy workflow sets VITE_BASE
// (repo variable SITE_BASE, default "/"); use "/LilaFoldSite/" without a custom domain.
// Two pages: the landing page and the blog (/blog/, posts at /blog/<post-name>/).
export default defineConfig({
  base: process.env.VITE_BASE || "/",
  plugins: [react(), blogPages()],
  build: {
    rollupOptions: {
      input: {
        main: page("./index.html"),
        blog: page("./blog/index.html"),
      },
    },
  },
});
