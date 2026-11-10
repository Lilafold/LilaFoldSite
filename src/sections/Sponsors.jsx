import { FoldMark } from "../components/Icons.jsx";

// Add real sponsors here: { name, logo: "sponsors/acme.svg" (a file in public/, optional), href (optional) }.
// Without a logo the name is set in the display type. Only list organisations that have agreed to be shown.
const sponsors = [];

// Technical specs highlighted in the marquee band until sponsors or design partners are announced.
const specs = [
  { name: "100M–500M Parameters", tag: "Compact" },
  { name: "Local NPU First", tag: "Hardware" },
  { name: "Zero Data Egress", tag: "Private" },
  { name: "Sub-10ms Inference", tag: "Speed" },
  { name: "Modular Workloads", tag: "Architecture" },
  { name: "Cybersecurity First", tag: "Domain" },
];

const list = sponsors.length ? sponsors : specs;

// repeat a short list so one row is always wider than the screen and the loop never shows a gap
const MIN_ITEMS = 8;
const row = list.length ? Array.from({ length: Math.ceil(MIN_ITEMS / list.length) }, () => list).flat() : [];

function Item({ s }) {
  if (s.logo) {
    const inner = <img src={`${import.meta.env.BASE_URL}${s.logo}`} alt={s.name} loading="lazy" />;
    return s.href ? <a href={s.href} target="_blank" rel="noopener">{inner}</a> : inner;
  }
  return (
    <span className="sponsor-spec">
      <span>{s.name}</span>
      {s.tag && <span className="sponsor-spec-tag">{s.tag}</span>}
    </span>
  );
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
