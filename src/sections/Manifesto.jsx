import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/motion.js";

const TEXT =
  "Most AI today is rented by the token from someone else's data centre. We think the useful kind should be *small enough to own:* trained for one job, cheap to run and private by default.";

// words between asterisks are the accent phrase
const words = [];
let accent = false;
for (const raw of TEXT.split(" ")) {
  let w = raw;
  if (w.startsWith("*")) { accent = true; w = w.slice(1); }
  const end = w.endsWith("*");
  if (end) w = w.slice(0, -1);
  words.push({ w, accent });
  if (end) accent = false;
}

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** A statement that lights up word by word as it crosses the screen. */
export default function Manifesto() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const spans = [...el.querySelectorAll("span")];
    if (prefersReducedMotion()) {
      spans.forEach((s) => { s.style.opacity = 1; });
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the block enters the lower part of the screen, 1 as it reaches the upper third
      const p = clamp01((vh * 0.88 - r.top) / (vh * 0.55 + r.height * 0.5));
      const lit = p * (spans.length + 3);
      spans.forEach((s, i) => { s.style.opacity = (0.16 + 0.84 * clamp01(lit - i)).toFixed(3); });
    };
    const request = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="section manifesto" aria-label="Why LilaFold exists">
      <p ref={ref}>
        {words.map(({ w, accent: a }, i) => (
          <span key={i} className={a ? "accent" : undefined}>{w} </span>
        ))}
      </p>
    </section>
  );
}
