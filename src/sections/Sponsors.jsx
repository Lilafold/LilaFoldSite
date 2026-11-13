import { FoldMark } from "../components/Icons.jsx";

// Companies that trust LilaFold. Add one entry per company:
//   { name: "Acme", tag: "Design partner", logo: "companies/acme.svg", href: "https://acme.com" }
// `tag` (the small chip), `logo` (a file in public/) and `href` are optional.
// Only list companies that have agreed to be named on the site.
const companies = [];

// Until real companies are added, "Your logo here" slots scroll in their place.
const placeholders = Array.from({ length: 4 }, () => ({ name: "Your logo here", placeholder: true, href: "#join" }));
const list = companies.length ? companies : placeholders;

// repeat a short list so one row is always wider than the screen and the loop never shows a gap
const MIN_ITEMS = 8;
const row = list.length ? Array.from({ length: Math.ceil(MIN_ITEMS / list.length) }, () => list).flat() : [];

function Item({ c }) {
  const inner = c.logo ? (
    <img src={`${import.meta.env.BASE_URL}${c.logo}`} alt={c.name} loading="lazy" />
  ) : (
    <span className={`sponsor-spec${c.placeholder ? " sponsor-placeholder" : ""}`}>
      <span>{c.name}</span>
      {c.tag && <span className="sponsor-spec-tag">{c.tag}</span>}
    </span>
  );
  if (!c.href) return inner;
  const external = /^https?:/.test(c.href);
  return <a href={c.href} {...(external ? { target: "_blank", rel: "noopener" } : {})}>{inner}</a>;
}

function Row({ hidden }) {
  return (
    <ul className="marquee-row" aria-hidden={hidden || undefined}>
      {row.map((c, i) => (
        <li key={i}>
          <FoldMark />
          <Item c={c} />
        </li>
      ))}
    </ul>
  );
}

/** "Trusted by": a slow scrolling band of companies; the second row is a visual duplicate for the loop. */
export default function Sponsors() {
  if (!row.length) return null;
  return (
    <section className="marquee trusted" aria-labelledby="trusted-title">
      <p className="trusted-label" id="trusted-title">Trusted by</p>
      <div className="marquee-viewport">
        <div className="marquee-track">
          <Row />
          <Row hidden />
        </div>
      </div>
    </section>
  );
}
