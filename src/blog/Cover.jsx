import { FoldMark } from "../components/Icons.jsx";
import { formatDate } from "./posts.js";

// a stable number from the slug, so each post gets its own smoke without storing an image
function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** A generated cover: ribbon mark, cover title, date and tag over a per-post wash of smoke. */
export default function Cover({ post, large = false }) {
  const h = hash(post.slug);
  const style = {
    "--sx": `${18 + (h % 60)}%`,
    "--sy": `${10 + ((h >> 6) % 50)}%`,
    "--tx": `${55 + ((h >> 12) % 40)}%`,
    "--ty": `${50 + ((h >> 18) % 45)}%`,
  };
  return (
    <div className={`cover${large ? " cover-lg" : ""}`} style={style} aria-hidden="true">
      <span className="cover-smoke" />
      <FoldMark className="cover-mark" />
      <div className="cover-text">
        <p className="cover-title">{post.cover}</p>
        {post.coverSub && <p className="cover-sub">{post.coverSub}</p>}
      </div>
      <p className="cover-meta">
        <span>{formatDate(post.date)}</span>
        {post.tags[0] && <span>#{post.tags[0]}</span>}
      </p>
    </div>
  );
}
