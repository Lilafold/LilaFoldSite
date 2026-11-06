/**
 * LilaFold subscribe API (Cloudflare Worker)
 *
 * POST /  { "email": "you@example.com" }  ->  adds the email to the EmailOctopus list.
 *
 * The site itself is static (GitHub Pages), so the EmailOctopus API key lives here,
 * as a Worker secret, and never reaches the browser.
 *
 * Config (worker/wrangler.toml + secrets):
 *   EMAILOCTOPUS_API_KEY  secret   `npx wrangler secret put EMAILOCTOPUS_API_KEY --config worker/wrangler.toml`
 *   EMAILOCTOPUS_LIST_ID  var      the list subscribers join
 *   ALLOWED_ORIGINS       var      comma-separated origins allowed to call this API
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = (env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
  const headers = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
  if (allowed.includes(origin)) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}

function json(body, status, cors) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...cors },
  });
}

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request, env);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return json({ error: "Method not allowed." }, 405, { ...cors, Allow: "POST, OPTIONS" });
    if (!cors["Access-Control-Allow-Origin"]) return json({ error: "Origin not allowed." }, 403, cors);

    let email = "";
    try {
      ({ email = "" } = await request.json());
    } catch {
      return json({ error: "Invalid request." }, 400, cors);
    }

    email = String(email).trim().toLowerCase();
    if (email.length > 254 || !EMAIL_RE.test(email)) {
      return json({ error: "That email doesn't look right. Check it and try again." }, 400, cors);
    }

    if (!env.EMAILOCTOPUS_API_KEY || !env.EMAILOCTOPUS_LIST_ID) {
      console.error("subscribe: EMAILOCTOPUS_API_KEY or EMAILOCTOPUS_LIST_ID is not set");
      return json({ error: "Subscriptions aren't open yet. Please try again soon." }, 503, cors);
    }

    // PUT is EmailOctopus's create-or-update endpoint, so signing up twice is not an error.
    const res = await fetch(
      `https://api.emailoctopus.com/lists/${encodeURIComponent(env.EMAILOCTOPUS_LIST_ID)}/contacts`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${env.EMAILOCTOPUS_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email_address: email, status: "subscribed" }),
      }
    );

    if (res.ok) return json({ ok: true }, 200, cors);

    if (res.status === 422) {
      return json({ error: "That email doesn't look right. Check it and try again." }, 400, cors);
    }

    console.error("subscribe: EmailOctopus responded", res.status, await res.text());
    return json({ error: "We couldn't subscribe you just now. Please try again in a moment." }, 502, cors);
  },
};
