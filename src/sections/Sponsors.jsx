import { FoldMark } from "../components/Icons.jsx";

// Add real sponsors here: { name, logo: "sponsors/acme.svg" (a file in public/, optional), href (optional) }.
// Without a logo the name is set in the display type. Only list organisations that have agreed to be shown.
const sponsors = [];

// Until there are real sponsors, placeholder names scroll in local development
// only, so the band can be judged. A production build hides the whole band.
const placeholders = Array.from({ length: 4 }, () => ({ name: "Your sponsor here", placeholder: true }));
const list = sponsors.length ? sponsors : import.meta.env.DEV ? placeholders : [];

// repeat a short list so one row is always wider than the screen and the loop never shows a gap
const MIN_ITEMS = 8;
const row = list.length ? Array.from({ length: Math.ceil(MIN_ITEMS / list.length) }, () => list).flat() : [];

function Item({ s }) {
  const inner = s.logo
    ? <img src={`${import.meta.env.BASE_URL}${s.logo}`} alt={s.name} loading="lazy" />
    : <span className={s.placeholder ? "sponsor-placeholder" : undefined}>{s.name}</span>;
  return s.href ? <a href={s.href} target="_blank" rel="noopener">{inner}</a> : inner;
}

function Row({ hidden }) {
  return (
    <ul className="marquee-row" aria-hidden={hidden || undefined}>
      {row.map((s, i) => (
        <li key={i}>
          <FoldMark />
          <Item s={s} />
        </li>
      ))}
    </ul>
  );
}

/** A slow scrolling band of sponsors; the second row is a visual duplicate for the loop. */
export default function Sponsors() {
  if (!row.length) return null;
  return (
    <section className="marquee" aria-label="Sponsors">
      <div className="marquee-track">
        <Row />
        <Row hidden />
      </div>
    </section>
  );
}
