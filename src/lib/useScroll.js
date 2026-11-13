import { useEffect } from "react";
import { prefersReducedMotion } from "./motion.js";

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOut = (p) => 1 - (1 - p) ** 3;

// Two strengths of the same effect:
//  - `.sr`: everyday content. A light lift and a short soft focus, sharp by the
//    time it is ~18% into the screen, so reading is never taxed.
//  - `.condense`: the three staged moments (hero, hardware stack, join card).
//    These genuinely condense out of the gas: heavy blur, scale and rise over a
//    long stretch of scroll.
const STYLES = {
  sr: { start: 1.0, span: 0.18, rise: 24, blur: 5, scale: 0 },
  condense: { start: 1.05, span: 0.5, rise: 80, blur: 22, scale: 0.08 },
};

/**
 * Scroll-linked mist effects driven from one rAF. Also publishes --scroll
 * (0 to 1 over the first screen) and --end (0 to 1 over the last screen) on
 * <html> so CSS can thin the mist and bring the smoke back for the finale.
 */
export function useMistScroll() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = prefersReducedMotion();
    const items = [...document.querySelectorAll(".sr, .condense")].map((el) => {
      const kind = el.classList.contains("condense") ? "condense" : "sr";
      return {
        el,
        s: STYLES[kind],
        // small print and forms are never blurred, only lifted
        noBlur: el.matches(".fine, .subscribe, .mid-signup-row"),
        stagger: (Number(el.style.getPropertyValue("--d")) || 0) * 0.025,
      };
    });
    const hero = document.querySelector(".hero-inner");

    if (reduce) {
      items.forEach(({ el }) => { el.style.opacity = 1; });
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const y = window.scrollY;
      const max = Math.max(1, root.scrollHeight - vh);

      root.style.setProperty("--scroll", clamp01(y / (vh * 0.9)).toFixed(3));
      root.style.setProperty("--end", clamp01((y - (max - vh)) / vh).toFixed(3));

      // moment one: the hero dissolves back into the gas as you leave it
      if (hero) {
        const s = clamp01(y / (vh * 0.85));
        hero.style.transform = s ? `translate3d(0, ${(y * 0.35).toFixed(1)}px, 0) scale(${(1 - s * 0.06).toFixed(3)})` : "";
        hero.style.filter = s > 0.01 ? `blur(${(s * 14).toFixed(1)}px)` : "";
        const op = Math.max(0, 1 - s * 1.15);
        hero.style.opacity = op.toFixed(3);
        hero.style.visibility = op <= 0.005 ? "hidden" : "visible";
        hero.style.pointerEvents = op <= 0.005 ? "none" : "";
      }
      for (const { el, s, noBlur, stagger } of items) {
        const r = el.getBoundingClientRect();
        if (r.top > vh + 40) {
          el.style.opacity = 0;
          el.style.filter = "";
          continue;
        }
        if (r.bottom < -40) {
          el.style.opacity = 1;
          el.style.transform = "";
          el.style.filter = "";
          continue;
        }
        const p = easeOut(clamp01((vh * (s.start - stagger) - r.top) / (vh * s.span)));
        if (p >= 0.995) {
          el.style.opacity = 1;
          el.style.transform = "";
          el.style.filter = "";
          continue;
        }
        const k = 1 - p;
        el.style.opacity = p.toFixed(3);
        el.style.transform = `translate3d(0, ${(k * s.rise).toFixed(1)}px, 0)${s.scale ? ` scale(${(1 - k * s.scale).toFixed(3)})` : ""}`;
        el.style.filter = noBlur || k < 0.01 ? "" : `blur(${(k * s.blur).toFixed(1)}px)`;
      }
    };

    const cleanupFocus = [];
    items.forEach(({ el }) => {
      const onFocus = () => {
        el.style.opacity = "1";
        el.style.transform = "";
        el.style.filter = "";
      };
      el.addEventListener("focusin", onFocus);
      cleanupFocus.push(() => el.removeEventListener("focusin", onFocus));
    });

    const request = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      cleanupFocus.forEach((fn) => fn());
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      cancelAnimationFrame(raf);
    };
  }, []);
}
