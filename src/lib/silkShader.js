export const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

// Smooth pink-magenta silk smoke. Output is premultiplied alpha:
// dark areas are transparent so the page background shows through.
export const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uDpr, uTime, uOpen, uMouseOn;
uniform float uScroll; // page scroll in screen heights, smoothed
uniform vec2 uMouse;
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float h2(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(mix(h2(i), h2(i + vec2(1.0, 0.0)), u.x),
             mix(h2(i + vec2(0.0, 1.0)), h2(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}
void main(){
  vec2 frag = gl_FragCoord.xy / uDpr;
  vec2 uv = (frag - 0.5 * uRes) / uRes.y;
  // scrolling stirs the gas a little and drifts it up slower than the page (parallax)
  float t = uTime + uScroll * 9.0;
  vec2 wv = uv + vec2(0.0, -uScroll * 0.4);

  // the sheet settles from slightly closer in as it unfolds
  vec2 p = mat2(0.8, -0.6, 0.6, 0.8) * wv * 1.6 * mix(1.3, 1.0, uOpen) + vec2(3.1, 7.4);
  vec2 q = vec2(fbm(p + vec2(0.0, t * 0.035)), fbm(p + vec2(5.2, 1.3) - vec2(t * 0.03, 0.0)));
  vec2 r = vec2(fbm(p + 1.8 * q + vec2(1.7, 9.2) + t * 0.022), fbm(p + 1.8 * q + vec2(8.3, 2.8) - t * 0.018));
  float f = fbm(p + 2.0 * r);

  // silk: long soft folds running diagonally, bent by the warp
  float fold = sin((wv.x * 0.9 - wv.y * 1.1) * 3.0 + f * 5.5 + t * 0.1);
  float sheen = pow(0.5 + 0.5 * fold, 6.0);
  float body = smoothstep(0.35, 0.95, f);

  vec2 m = (uMouse - 0.5 * uRes) / uRes.y;
  float ml = uMouseOn * exp(-dot(uv - m, uv - m) * 5.0);

  float b = (body * 0.45 + sheen * (0.45 + 0.55 * body) + ml * 0.18) * 0.82 * uOpen;

  vec3 c1 = vec3(0.24, 0.05, 0.30);
  vec3 c2 = vec3(0.80, 0.30, 0.82);
  vec3 c3 = vec3(1.0, 0.84, 0.96);
  vec3 col = mix(c1, c2, smoothstep(0.3, 0.95, b));
  col = mix(col, c3, smoothstep(0.95, 1.4, b));

  // smoke is translucent: it fades out where it is dark
  float a = smoothstep(0.0, 0.6, b) * 0.88;
  a *= mix(0.4, 1.0, smoothstep(0.1, 0.6, length(uv * vec2(0.9, 1.3))));
  a *= 1.0 - 0.6 * smoothstep(0.7, 1.3, length(uv * vec2(0.7, 1.0)));
  col += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  gl_FragColor = vec4(col * a, a);
}`;
