// Posts are Markdown files in src/content/blog/. Each starts with a frontmatter
// block between --- lines:
//
//   ---
//   title: Post title
//   cover: Short cover title      (optional, defaults to the title)
//   coverSub: Cover subtitle      (optional)
//   excerpt: One or two sentences for the card
//   date: 2026-11-10
//   author: LilaFold team
//   tags: research, models
//   featured: true                (optional, one post)
//   ---
//
// The file name (without .md) is the post's address: /blog/file-name/

const files = import.meta.glob("../content/blog/*.md", { query: "?raw", import: "default", eager: true });

function parse(path, raw) {
  const slug = path.split("/").pop().replace(/\.md$/, "");
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  const meta = {};
  if (m) {
    for (const line of m[1].split(/\r?\n/)) {
      const i = line.indexOf(":");
      if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
  }
  const body = m ? m[2] : raw;
  const words = body.split(/\s+/).filter(Boolean).length;
  return {
    slug,
    title: meta.title || slug,
    cover: meta.cover || meta.title || slug,
    coverSub: meta.coverSub || "",
    excerpt: meta.excerpt || "",
    date: meta.date || "",
    author: meta.author || "LilaFold team",
    tags: (meta.tags || "").split(",").map((t) => t.trim()).filter(Boolean),
    featured: meta.featured === "true",
    minutes: Math.max(1, Math.round(words / 220)),
    body,
  };
}

export const posts = Object.entries(files)
  .map(([p, raw]) => parse(p, raw))
  .sort((a, b) => (b.date || "").localeCompare(a.date || "") || a.title.localeCompare(b.title));

export const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(`${iso}T12:00:00`);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};
