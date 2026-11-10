import { useEffect, useRef, useState } from "react";
import SectionHead from "./SectionHead.jsx";
import { FoldMark } from "../components/Icons.jsx";
import { prefersReducedMotion } from "../lib/motion.js";

const MAX = 4;
// scroll progress windows in which modules 2, 3 and 4 drop onto the stack
const DROPS = [0.08, 0.36, 0.64];
const DROP_LEN = 0.24;

const points = [
  { title: "Start small", body: "One module runs a compact model on your desk or in your rack." },
  { title: "Grow one module at a time", body: "Stack another to run more models at once. Splitting one large model across modules is part of our research." },
  { title: "NPU first", body: "NPUs (neural processing units) are chips built only for AI. We are researching them as a lower-power, lower-cost alternative to GPUs." },
];

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOut = (p) => 1 - (1 - p) ** 3;

const IMG = `${import.meta.env.BASE_URL}hardware/`;

/**
 * One aluminium module: an AI-generated product photo cut out of its black
 * background, in two frames: idle with a white status LED, and "connected"
 * with a lilac LED, which fades in once another module is seated on top.
 */
function Module({ index, refFn }) {
  return (
    <div className="mini" style={{ "--i": index }} ref={refFn}>
      <img className="mini-img" src={`${IMG}module.webp`} alt="" width="928" height="441" decoding="async" />
      <img className="mini-img mini-active" src={`${IMG}module-active.webp`} alt="" width="928" height="441" decoding="async" />
    </div>
  );
}

export default function Hardware() {
  const trackRef = useRef(null);
  const modRefs = useRef([]);
  const [count, setCount] = useState(1);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    const mods = modRefs.current;
    if (prefersReducedMotion()) {
      setCount(MAX);
      setStep(2);
      return;
    }

    let raf = 0;
    let lastCount = -1;
    let lastStep = -1;
    const update = () => {
      raf = 0;
      const r = track.getBoundingClientRect();
      const panel = track.firstElementChild;
      const pinTop = parseFloat(getComputedStyle(panel).top) || 0;
      // 0 when the panel first pins under the nav, 1 when it is about to scroll away
      const p = clamp01((pinTop - r.top) / Math.max(1, r.height - panel.offsetHeight));

      let seated = 1;
      DROPS.forEach((start, k) => {
        const el = mods[k + 1];
        if (!el) return;
        const d = clamp01((p - start) / DROP_LEN);
        const e = easeOut(d);
        // falls out of the smoke above: blurred and faint, sharpening as it lands
        el.style.opacity = d <= 0 ? "0" : Math.min(1, d * 2.2).toFixed(3);
        el.style.transform = `translate3d(0, ${(-(1 - e) * 46).toFixed(2)}vh, 0)`;
        el.style.filter = d > 0 && d < 0.98 ? `blur(${((1 - e) * 10).toFixed(1)}px)` : "";
        if (d >= 1) seated += 1;
      });
      // the connector of every module with another seated on it lights up
      mods.forEach((el, k) => el && el.classList.toggle("lit", k < seated - 1));

      const s = Math.min(points.length - 1, Math.floor(p * points.length));
      if (seated !== lastCount) { lastCount = seated; setCount(seated); }
      if (s !== lastStep) { lastStep = s; setStep(s); }
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
    <section className="section hw" id="hardware">
      <SectionHead title="AI compute that grows with you">
        Buying a GPU server is a big, fixed bet. Our modules are designed so you can start with one and stack
        more when you need them. Keep scrolling to add a module.
      </SectionHead>

      <div className="hw-track" ref={trackRef}>
        <div className="hw-sticky">
          <ul className="hw-points">
            {points.map((p, i) => (
              <li key={p.title} className={`hw-point${i === step ? " active" : ""}`}>
                <FoldMark />
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="hw-stage">
            <div className="mini-stack" aria-hidden="true">
              {Array.from({ length: MAX }, (_, i) => (
                <Module key={i} index={i} refFn={(el) => { modRefs.current[i] = el; }} />
              ))}
            </div>
            <p className="stack-count">
              <b>{count}</b> {count === 1 ? "module" : "modules"}
            </p>
            <p className="fine">
              Illustration of the concept, not a final design. No hardware is for sale yet. We will run pilots
              with early partners first.
            </p>
            <div className="hw-cta">
              <a href="#join" className="hw-pilot-link">
                Interested in early hardware pilots? <span>Register your interest &rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
