// A deliberately small Markdown renderer for our own posts: headings, paragraphs,
// lists, quotes, tables, bar charts, code blocks, images, links, bold, italic and inline code.
// A ```plots block draws scatter charts as tabs (see plots() below).
// A ```chart block (one `label | value | note` per line, values 0 to 1) renders as bars.
// All text is HTML-escaped first, so only these constructs produce markup.

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const safeUrl = (u) => (/^(https?:|mailto:|\/|#|\.\.?\/)/i.test(u) ? u : "#");

function inline(text) {
  const codes = [];
  let s = esc(text).replace(/`([^`]+)`/g, (_, c) => `\u0000${codes.push(c) - 1}\u0000`);
  s = s
    .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, alt, u) => `<img src="${safeUrl(u)}" alt="${alt}" loading="lazy">`)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => {
      const url = safeUrl(u);
      const ext = /^https?:/i.test(url) ? ' target="_blank" rel="noopener"' : "";
      return `<a href="${url}"${ext}>${t}</a>`;
    })
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${codes[i]}</code>`);
}


// ```plots blocks: one or more scatter charts (separated by a line of ---) shown as tabs.
//   title: Accuracy vs. time
//   x: label | log or linear | min | max | value=tick label, ...
//   y: label | min | max | value=tick label, ...
//   note: text under the chart
//   Point label | x | y | flags (lead, left, above, below)
let plotCount = 0;
function plots(src) {
  const id = `plots${++plotCount}`;
  const charts = src.join("\n").split(/^---\s*$/m).map((blk) => {
    const c = { title: "", note: "", pts: [], lines: [] };
    for (const raw of blk.split("\n")) {
      const l = raw.trim();
      if (!l) continue;
      const kv = l.match(/^(title|note|x|y|line):\s*(.*)$/);
      if (!kv) {
        const [label, x, y, flags = ""] = l.split("|").map((t) => t.trim());
        const fl = flags.split(/\s+/);
        c.pts.push({ label, x: parseFloat(x), y: parseFloat(y), flags: fl, color: fl.find((t) => t[0] === "#") || "#8f83a6" });
        continue;
      }
      if (kv[1] === "title" || kv[1] === "note") { c[kv[1]] = kv[2]; continue; }
      if (kv[1] === "line") {
        const [names, color = "#888"] = kv[2].split("|").map((t) => t.trim());
        c.lines.push({ names: names.split(",").map((n) => n.trim()), color });
        continue;
      }
      const [label, a, b, d, e] = kv[2].split("|").map((t) => t.trim());
      const ticks = (t) =>
        (t || "").split(",").map((q) => q.trim()).filter(Boolean).map((q) => {
          const [v, ...r] = q.split("=");
          return { v: parseFloat(v), t: r.join("=") || v };
        });
      c[kv[1]] =
        kv[1] === "x"
          ? { label, log: a === "log", min: parseFloat(b), max: parseFloat(d), ticks: ticks(e) }
          : { label, min: parseFloat(a), max: parseFloat(b), ticks: ticks(d) };
    }
    return c;
  });

  const W = 760, H = 470, L = 58, R = 28, T = 20, B = 62;
  const svg = (c) => {
    const fx = (v) => {
      const f = c.x.log
        ? (Math.log(v) - Math.log(c.x.min)) / (Math.log(c.x.max) - Math.log(c.x.min))
        : (v - c.x.min) / (c.x.max - c.x.min);
      return L + f * (W - L - R);
    };
    const fy = (v) => T + (1 - (v - c.y.min) / (c.y.max - c.y.min)) * (H - T - B);
    const g = [];
    for (const t of c.y.ticks) g.push(`<line class="pg" x1="${L}" x2="${W - R}" y1="${fy(t.v)}" y2="${fy(t.v)}"/><text class="pt" x="${L - 10}" y="${fy(t.v) + 4}" text-anchor="end">${esc(t.t)}</text>`);
    for (const t of c.x.ticks) g.push(`<line class="pg v" x1="${fx(t.v)}" x2="${fx(t.v)}" y1="${T}" y2="${H - B}"/><text class="pt" x="${fx(t.v)}" y="${H - B + 20}" text-anchor="middle">${esc(t.t)}</text>`);
    g.push(`<line class="pa" x1="${L}" x2="${L}" y1="${T}" y2="${H - B}"/><line class="pa" x1="${L}" x2="${W - R}" y1="${H - B}" y2="${H - B}"/>`);
    g.push(`<text class="pl" x="${(L + W - R) / 2}" y="${H - 12}" text-anchor="middle">${esc(c.x.label)}</text>`);
    g.push(`<text class="pl" transform="translate(16 ${(T + H - B) / 2}) rotate(-90)" text-anchor="middle">${esc(c.y.label)}</text>`);
    for (const ln of c.lines) {
      const ps = ln.names.map((n) => c.pts.find((q) => q.label === n)).filter(Boolean);
      if (ps.length > 1) g.push(`<polyline class="pline" stroke="${esc(ln.color)}" points="${ps.map((q) => `${fx(q.x).toFixed(1)},${fy(q.y).toFixed(1)}`).join(" ")}"/>`);
    }
    const dots = [...c.pts].sort((a, b) => (a.flags.includes("lead") ? 1 : 0) - (b.flags.includes("lead") ? 1 : 0));
    for (const q of dots) {
      const x = fx(q.x), y = fy(q.y), lead = q.flags.includes("lead");
      g.push(`<circle class="pd${lead ? " lead" : ""}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${lead ? 10 : 8}" fill="${esc(q.color)}"><title>${esc(q.label)}</title></circle>`);
      if (q.flags.includes("tag")) {
        const above = q.flags.includes("above");
        g.push(`<text class="ps lead" x="${(above ? x : x + 15).toFixed(1)}" y="${(above ? y - 18 : y + 5).toFixed(1)}" text-anchor="${above ? "middle" : "start"}">${esc(q.label)}</text>`);
      }
    }
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(c.title)}">${g.join("")}</svg>`;
  };

  const inputs = charts.map((c, k) => `<input type="radio" name="${id}" id="${id}-${k}" aria-label="${esc(c.title)}"${k === 0 ? " checked" : ""}>`).join("");
  const tabs = charts.map((c, k) => `<label for="${id}-${k}">${esc(c.title)}</label>`).join("");
  const panels = charts
    .map((c) => `<div class="plot-panel"><div class="plot-title">${esc(c.title)}</div><div class="plot-legend">${c.pts.map((q) => `<span><i style="background:${esc(q.color)}"></i>${esc(q.label)}</span>`).join("")}</div>${svg(c)}${c.note ? `<p class="plot-note">${inline(c.note)}</p>` : ""}</div>`)
    .join("");
  return `<figure class="plots">${inputs}<div class="plot-tabs">${tabs}</div><div class="plot-panels">${panels}</div></figure>`;
}

export function renderMarkdown(src) {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let i = 0;
  const isBlockStart = (l) => /^(#{1,4}\s|```|>\s?|[-*]\s|\d+\.\s|\|)/.test(l);
  const cells = (l) => l.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    if (line.startsWith("```")) {
      const kind = line.slice(3).trim();
      const buf = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) buf.push(lines[i++]);
      i++;
      if (kind === "plots") { out.push(plots(buf)); continue; }
      if (kind === "chart") {
        const rows = buf.filter((l) => l.trim()).map((l) => l.split("|").map((c) => c.trim()));
        const title = rows[0] && rows[0].length === 1 ? rows.shift()[0] : "";
        const bars = rows.map(([label, value, note], k) => {
          const v = Math.max(0, Math.min(1, parseFloat(value) || 0));
          return `<div class="cbar${k === 0 ? " lead" : ""}"><span class="cbar-label">${inline(label)}</span><span class="cbar-track"><span class="cbar-fill" style="width:${(v * 100).toFixed(1)}%"></span></span><span class="cbar-value">${esc(value)}</span>${note ? `<span class="cbar-note">${inline(note)}</span>` : ""}</div>`;
        });
        out.push(`<figure class="chart">${title ? `<figcaption>${inline(title)}</figcaption>` : ""}${bars.join("")}</figure>`);
        continue;
      }
      out.push(`<pre><code>${esc(buf.join("\n"))}</code></pre>`);
      continue;
    }
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const level = Math.min(4, Math.max(2, h[1].length)); // # and ## are h2: the page owns the h1
      const id = h[2].toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      out.push(`<h${level} id="${id}">${inline(h[2])}</h${level}>`);
      i++;
      continue;
    }
    if (/^>\s?/.test(line)) {
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ""));
      out.push(`<blockquote><p>${inline(buf.join(" "))}</p></blockquote>`);
      continue;
    }
    if (line.startsWith("|") && /^\|?\s*:?-{2,}/.test((lines[i + 1] || "").replace(/^\|/, ""))) {
      const head = cells(line);
      i += 2;
      const body = [];
      while (i < lines.length && lines[i].startsWith("|")) body.push(cells(lines[i++]));
      out.push(
        `<div class="table-wrap"><table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>${body
          .map((r, k) => `<tr${k === 0 ? ' class="lead"' : ""}>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`)
          .join("")}</tbody></table></div>`
      );
      continue;
    }
    const ul = /^[-*]\s+/, ol = /^\d+\.\s+/;
    if (ul.test(line) || ol.test(line)) {
      const re = ul.test(line) ? ul : ol;
      const tag = re === ul ? "ul" : "ol";
      const items = [];
      while (i < lines.length && re.test(lines[i])) items.push(`<li>${inline(lines[i++].replace(re, ""))}</li>`);
      out.push(`<${tag}>${items.join("")}</${tag}>`);
      continue;
    }
    const buf = [];
    while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i])) buf.push(lines[i++]);
    out.push(`<p>${inline(buf.join(" "))}</p>`);
  }
  return out.join("\n");
}
