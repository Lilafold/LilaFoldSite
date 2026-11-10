import { useCallback, useEffect, useMemo, useState } from "react";
import SilkBackground from "../components/SilkBackground.jsx";
import Nav from "../components/Nav.jsx";
import Footer from "../components/Footer.jsx";
import SubscribeForm from "../components/SubscribeForm.jsx";
import { ArrowRight } from "../components/Icons.jsx";
import { useSpotlight } from "../lib/useSpotlight.js";
import Cover from "./Cover.jsx";
import { posts, formatDate } from "./posts.js";
import { renderMarkdown } from "./markdown.js";

const BLOG = `${import.meta.env.BASE_URL}blog/`;
const postHref = (slug) => `${BLOG}?post=${encodeURIComponent(slug)}`;

function Byline({ post }) {
  return (
    <span className="byline">
      <img src={`${import.meta.env.BASE_URL}logo.png`} alt="" width="20" height="20" />
      <span>{post.author}</span>
      <span aria-hidden="true">&middot;</span>
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      {post.tags.map((t) => (
        <span key={t} className="byline-tag">#{t}</span>
      ))}
    </span>
  );
}

function Card({ post }) {
  return (
    <a className="post-card glow" href={postHref(post.slug)}>
      <Cover post={post} />
      <div className="post-card-body">
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <Byline post={post} />
      </div>
    </a>
  );
}

function Index() {
  const [tag, setTag] = useState("");
  const tags = useMemo(() => [...new Set(posts.flatMap((p) => p.tags))], []);
  const featured = posts.find((p) => p.featured) || posts[0];
  const showFeatured = Boolean(featured) && (!tag || featured.tags.includes(tag));
  const rest = posts.filter((p) => p !== featured && (!tag || p.tags.includes(tag)));

  return (
    <>
      <header className="blog-head reveal" style={{ "--i": 1 }}>
        <h1>Blog</h1>
        <p>Research notes and news from the LilaFold team.</p>
      </header>

      {tags.length > 1 && (
        <div className="tag-filter reveal" style={{ "--i": 2 }} role="group" aria-label="Filter posts by topic">
          <button type="button" aria-pressed={!tag} onClick={() => setTag("")}>All</button>
          {tags.map((t) => (
            <button key={t} type="button" aria-pressed={tag === t} onClick={() => setTag(t === tag ? "" : t)}>
              #{t}
            </button>
          ))}
        </div>
      )}

      {showFeatured && (
        <a className="featured glow beam reveal" style={{ "--i": 3 }} href={postHref(featured.slug)}>
          <Cover post={featured} large />
          <div className="featured-body">
            <p className="featured-label">Featured</p>
            <h2>{featured.title}</h2>
            <Byline post={featured} />
            <p className="featured-excerpt">{featured.excerpt}</p>
            <span className="read-link">Read the post <ArrowRight /></span>
          </div>
        </a>
      )}

      {rest.length > 0 && (
        <div className="post-grid">
          {rest.map((p, i) => (
            <div key={p.slug} className="reveal" style={{ "--i": 4 + i }}>
              <Card post={p} />
            </div>
          ))}
        </div>
      )}

      {!showFeatured && rest.length === 0 && <p className="empty">No posts with that topic yet.</p>}
    </>
  );
}

function Post({ post }) {
  const html = useMemo(() => renderMarkdown(post.body), [post]);
  const more = posts.filter((p) => p !== post).slice(0, 3);

  return (
    <>
      <article className="post">
        <a className="back-link reveal" style={{ "--i": 1 }} href={BLOG}>
          <ArrowRight className="back-arrow" /> All posts
        </a>
        <header className="post-head reveal" style={{ "--i": 2 }}>
          <h1>{post.title}</h1>
          <p className="post-dek">{post.excerpt}</p>
          <p className="post-meta">
            <Byline post={post} />
            <span className="read-time">{post.minutes} min read</span>
          </p>
        </header>
        <div className="post-cover reveal" style={{ "--i": 3 }}>
          <Cover post={post} large />
        </div>
        {/* our own Markdown, rendered by a small escaper-first renderer (markdown.js) */}
        <div className="prose reveal" style={{ "--i": 4 }} dangerouslySetInnerHTML={{ __html: html }} />
      </article>

      <section className="post-join glow" aria-labelledby="post-join-title">
        <h2 id="post-join-title">Get the next post and early access</h2>
        <p>We&rsquo;ll email you when the cloud opens, with new research notes and a discount on your first use.</p>
        <SubscribeForm />
      </section>

      {more.length > 0 && (
        <section className="more-posts" aria-labelledby="more-title">
          <h2 id="more-title">More from the blog</h2>
          <div className="post-grid">
            {more.map((p) => (
              <Card key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default function BlogApp() {
  const [noGl, setNoGl] = useState(false);
  const handleNoGl = useCallback(() => setNoGl(true), []);
  useSpotlight();

  const slug = new URLSearchParams(window.location.search).get("post");
  const post = slug ? posts.find((p) => p.slug === slug) : null;

  useEffect(() => {
    document.title = post ? `${post.title} | LilaFold` : slug ? "Post not found | LilaFold" : "Blog | LilaFold";
  }, [post, slug]);

  return (
    <div className={`site blog-site${noGl ? " no-gl" : ""}`}>
      <div className="backdrop" aria-hidden="true">
        <SilkBackground onUnsupported={handleNoGl} />
        <div className="backdrop-dim" />
      </div>
      <Nav home={false} />
      <main className="blog-main">
        {slug && !post ? (
          <div className="empty">
            <h1>Post not found</h1>
            <p>
              It may have moved. <a href={BLOG}>See all posts</a>.
            </p>
          </div>
        ) : post ? (
          <Post post={post} />
        ) : (
          <Index />
        )}
      </main>
      <Footer home={false} />
    </div>
  );
}
