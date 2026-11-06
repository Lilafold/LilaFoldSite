import { useEffect, useRef } from "react";
import { VERT, FRAG } from "../lib/silkShader.js";
import { prefersReducedMotion, smoothstep } from "../lib/motion.js";

/** Smooth pink-magenta silk smoke, rendered with WebGL behind the page. */
export default function SilkBackground({ onUnsupported }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas.parentElement;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: true });
    if (!gl) {
      onUnsupported?.();
      return;
    }

    const compile = (type, src) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh));
      return sh;
    };

    let prog, buf;
    try {
      prog = gl.createProgram();
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    } catch (err) {
      console.warn("Silk background disabled:", err);
      onUnsupported?.();
      return;
    }
    gl.useProgram(prog);
    buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const U = (n) => gl.getUniformLocation(prog, n);
    const uRes = U("uRes"), uDpr = U("uDpr"), uTime = U("uTime"), uOpen = U("uOpen"), uMouse = U("uMouse"), uMouseOn = U("uMouseOn");

    const reduce = prefersReducedMotion();
    let W = 0, H = 0, dpr = 1;
    const resize = () => {
      // the image is soft, so rendering below native resolution keeps it smooth everywhere
      dpr = Math.min(window.devicePixelRatio || 1, 1) * 0.75;
      W = host.clientWidth;
      H = host.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    const mouse = { x: -9999, y: -9999, sx: 0, sy: 0, on: 0, target: 0 };
    const onMove = (e) => {
      const r = host.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = H - (e.clientY - r.top);
      if (mouse.on < 0.01) { mouse.sx = mouse.x; mouse.sy = mouse.y; }
      mouse.target = 1;
    };
    const onLeave = () => { mouse.target = 0; };
    if (!reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
    }

    const start = performance.now();
    const draw = (now) => {
      const t = (now - start) / 1000;
      const open = reduce ? 1 : smoothstep(0.1, 3.3, t);
      mouse.sx += (mouse.x - mouse.sx) * 0.05;
      mouse.sy += (mouse.y - mouse.sy) * 0.05;
      mouse.on += (mouse.target - mouse.on) * 0.03;
      gl.uniform2f(uRes, W, H);
      gl.uniform1f(uDpr, dpr);
      gl.uniform1f(uTime, reduce ? 12 : t);
      gl.uniform1f(uOpen, open);
      gl.uniform2f(uMouse, mouse.sx, mouse.sy);
      gl.uniform1f(uMouseOn, mouse.on);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    let raf = 0;
    const ro = new ResizeObserver(() => { resize(); if (reduce) draw(start + 5000); });
    ro.observe(host);

    if (reduce) {
      draw(start + 5000);
    } else {
      const loop = (now) => {
        raf = requestAnimationFrame(loop);
        if (!document.hidden) draw(now);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
  }, [onUnsupported]);

  return <canvas ref={canvasRef} className="silk" aria-hidden="true" />;
}
