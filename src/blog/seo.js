// Per-page head tags for the blog. The static tags in blog/index.html describe the
// blog index; when a post is open, these functions point the canonical link, the
// description and the share-card text at that post instead. In production each post
// also has its own pre-built page (see vite.config.js) with these tags already in the
// HTML; these functions keep them correct when navigating between posts in the browser.

const ORIGIN = "https://lilafold.io";
const BASE = import.meta.env.BASE_URL;

const upsert = (selector, make) => {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = make();
    document.head.appendChild(el);
  }
  return el;
};

const meta = (attr, name, content) => {
  upsert(`meta[${attr}="${name}"]`, () => {
    const m = document.createElement("meta");
    m.setAttribute(attr, name);
    return m;
  }).setAttribute("content", content);
};

const link = (rel, href) => {
  upsert(`link[rel="${rel}"]`, () => {
    const l = document.createElement("link");
    l.setAttribute("rel", rel);
    return l;
  }).setAttribute("href", href);
};

const jsonLd = (id, data) => {
  const el = upsert(`script#${id}`, () => {
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.id = id;
    return s;
  });
  el.textContent = data ? JSON.stringify(data) : "";
  if (!data) el.remove();
};

/** The address a post has on the live site, e.g. https://lilafold.io/blog/npus-not-gpus/ */
export const postUrl = (slug) => `${ORIGIN}${BASE}blog/${encodeURIComponent(slug)}/`;
export const blogUrl = `${ORIGIN}${BASE}blog/`;

export function applyIndexSeo() {
  document.title = "Blog | LilaFold";
  meta("name", "robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
  link("canonical", blogUrl);
  meta("name", "description", "Research notes and news from the LilaFold team: small specialised models, private AI and modular NPU hardware.");
  meta("property", "og:type", "website");
  meta("property", "og:url", blogUrl);
  meta("property", "og:title", "LilaFold Blog: research notes and news");
  meta("property", "og:description", "Research notes and news from the LilaFold team: small specialised models, private AI and modular NPU hardware.");
  meta("name", "twitter:url", blogUrl);
  meta("name", "twitter:title", "LilaFold Blog: research notes and news");
  meta("name", "twitter:description", "Research notes and news from the LilaFold team: small specialised models, private AI and modular NPU hardware.");
  jsonLd("post-jsonld", null);
}

export function applyPostSeo(post) {
  const url = postUrl(post.slug);
  const title = `${post.title} | LilaFold`;
  document.title = title;
  meta("name", "robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
  link("canonical", url);
  meta("name", "description", post.excerpt);
  meta("property", "og:type", "article");
  meta("property", "og:url", url);
  meta("property", "og:title", post.title);
  meta("property", "og:description", post.excerpt);
  meta("name", "twitter:url", url);
  meta("name", "twitter:title", post.title);
  meta("name", "twitter:description", post.excerpt);
  jsonLd("post-jsonld", {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#post`,
    headline: post.title,
    description: post.excerpt,
    url,
    mainEntityOfPage: url,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "en",
    keywords: post.tags.join(", "),
    author: { "@type": "Organization", name: post.author, url: `${ORIGIN}/` },
    publisher: { "@id": `${ORIGIN}/#organization` },
    image: `${ORIGIN}/og-blog.png`,
    isPartOf: { "@id": `${ORIGIN}${BASE}blog/#blog` },
  });
}

/** An unknown post address is not a page: keep it out of the index. */
export function applyNotFoundSeo() {
  document.title = "Post not found | LilaFold";
  meta("name", "robots", "noindex, follow");
  link("canonical", blogUrl);
  jsonLd("post-jsonld", null);
}
