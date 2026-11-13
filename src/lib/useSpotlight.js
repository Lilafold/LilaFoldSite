import { useEffect } from "react";

/**
 * Cursor spotlight: any `.glow` element gets --mx / --my (pointer position in
 * its own box) while the pointer is over it; CSS draws the light.
 */
export function useSpotlight() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    let raf = 0;
    let last = null;
    const apply = () => {
      raf = 0;
      if (!last) return;
      const el = last.target.closest?.(".glow");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${(last.clientX - r.left).toFixed(0)}px`);
      el.style.setProperty("--my", `${(last.clientY - r.top).toFixed(0)}px`);
    };
    const onMove = (e) => {
      last = e;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
}
