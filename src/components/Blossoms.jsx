import { useEffect, useRef } from "react";
import { prefersReducedMotion, smoothstep } from "../lib/motion.js";

/** Pre-renders one four-petal lilac floret to an offscreen canvas. */
function makeSprite(r, blur, tint) {
  const pad = Math.ceil(blur * 3 + 2);
  const S = Math.ceil(r * 2 + pad * 2);
  const c = document.createElement("canvas");
  c.width = c.height = S * 2;
  const g = c.getContext("2d");
  g.scale(2, 2);
  g.translate(S / 2, S / 2);
  if (blur) g.filter = `blur(${blur}px)`;
  const grad = g.createRadialGradient(0, 0, 0, 0, 0, r);
  grad.addColorStop(0, tint[0]);
  grad.addColorStop(0.55, tint[1]);
  grad.addColorStop(1, tint[2]);
  g.fillStyle = grad;
  for (let k = 0; k < 4; k++) {
    g.save();
    g.rotate((k * Math.PI) / 2);
    g.beginPath();
    g.moveTo(0, -r * 0.06);
    g.bezierCurveTo(-r * 0.78, -r * 0.22, -r * 0.72, -r * 1.06, 0, -r * 0.9);
    g.bezierCurveTo(r * 0.72, -r * 1.06, r * 0.78, -r * 0.22, 0, -r * 0.06);
    g.fill();
    g.restore();
  }
  g.fillStyle = "rgba(255, 236, 250, 0.9)";
  g.beginPath();
  g.arc(0, 0, r * 0.11, 0, Math.PI * 2);
  g.fill();
  return { c, S };
}

/** Lilac blossoms drifting through the silk at three depths, thinner behind the headline. */
export default function Blossoms() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const cv = canvasRef.current;
    const host = cv.parentElement;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduce = prefersReducedMotion();

    const layers = [
      { spr: makeSprite(8, 1.4, ["#f7d9ff", "#d98cf0", "#a24fc4"]), alpha: 0.4, speed: 9, sway: 10, share: 0.5 },
      { spr: makeSprite(13, 0, ["#fff0fd", "#efa6f7", "#c45bd8"]), alpha: 0.8, speed: 16, sway: 16, share: 0.35 },
      { spr: makeSprite(26, 5, ["#ffe6fb", "#e98ff2", "#b44bc9"]), alpha: 0.5, speed: 26, sway: 24, share: 0.15 },
    ];

    let W = 0, H = 0, dpr = 1;
    const blooms = [];
    const rand = (a, b) => a + Math.random() * (b - a);
    const pickLayer = () => {
      const x = Math.random();
      return x < layers[0].share ? 0 : x < layers[0].share + layers[1].share ? 1 : 2;
    };
    const spawn = (b, top) => {
      b.l = pickLayer();
      b.x = rand(0, W);
      b.y = top ? rand(-60, -20) : rand(0, H);
      b.ph = rand(0, Math.PI * 2);
      b.rot = rand(0, Math.PI * 2);
      b.vr = rand(-0.25, 0.25);
      b.vs = rand(0.8, 1.2);
      return b;
    };
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = host.clientWidth;
      H = host.clientHeight;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      const want = Math.round(Math.min(34, Math.max(12, (W * H) / 50000)));
      while (blooms.length < want) blooms.push(spawn({}, false));
      blooms.length = want;
    };
    resize();

    const start = performance.now();
    let last = start;
    const draw = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = (now - start) / 1000;
      const fadeIn = reduce ? 1 : smoothstep(0.8, 3.6, t);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2;
      for (const b of blooms) {
        const L = layers[b.l];
        if (!reduce) {
          b.y += L.speed * b.vs * dt;
          b.rot += b.vr * dt;
          if (b.y > H + 40) spawn(b, true);
        }
        const x = b.x + Math.sin(t * 0.35 * b.vs + b.ph) * L.sway;
        const nx = (x - cx) / (W * 0.32), ny = (b.y - cy) / (H * 0.26);
        const calm = 0.15 + 0.85 * smoothstep(0.55, 1.15, Math.sqrt(nx * nx + ny * ny));
        ctx.globalAlpha = L.alpha * calm * fadeIn;
        ctx.save();
        ctx.translate(x, b.y);
        ctx.rotate(b.rot);
        ctx.drawImage(L.spr.c, -L.spr.S / 2, -L.spr.S / 2, L.spr.S, L.spr.S);
        ctx.restore();
      }
    };

    let raf = 0;
    const ro = new ResizeObserver(() => { resize(); if (reduce) draw(performance.now()); });
    ro.observe(host);

    if (reduce) {
      draw(start);
    } else {
      const loop = (now) => {
        raf = requestAnimationFrame(loop);
        if (document.hidden) last = now;
        else draw(now);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="blooms" aria-hidden="true" />;
}
