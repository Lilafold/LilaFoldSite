import { useRef, useState } from "react";

// The subscribe API is a Cloudflare Worker (worker/src/index.js).
// Production: set at build time from the SUBSCRIBE_ENDPOINT repo variable.
// Local: `npm run worker:dev` serves it on port 8787.
const ENDPOINT = import.meta.env.VITE_SUBSCRIBE_ENDPOINT || "http://localhost:8787";
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

export default function SubscribeForm({ className = "", style }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | done
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  async function onSubmit(e) {
    e.preventDefault();
    const value = email.trim();
    if (!isEmail(value)) {
      setError("That email doesn't look right. Check it and try again.");
      inputRef.current?.focus();
      return;
    }
    setError("");
    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: value }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Request failed");
      setStatus("done");
    } catch (err) {
      setStatus("idle");
      setError(
        err.message && err.message !== "Request failed" && !err.message.startsWith("Failed to fetch")
          ? err.message
          : "We couldn't subscribe you just now. Please try again in a moment."
      );
    }
  }

  return (
    <form
      className={`subscribe${status === "done" ? " done" : ""} ${className}`}
      style={style}
      onSubmit={onSubmit}
      noValidate
    >
      <label htmlFor="email" className="sr-only">Email address</label>
      <div className="field">
        <svg className="mail" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="3" />
          <path d="m4 7 8 6 8-6" />
        </svg>
        <input
          ref={inputRef}
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@company.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? "subscribe-error" : undefined}
        />
        <button type="submit" className="btn-light" disabled={status === "sending"}>
          {status === "sending" ? "Subscribing" : "Subscribe"}
          <span className="key" aria-hidden="true">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </span>
        </button>
      </div>
      <p className="note" id="subscribe-error" role="status" aria-live="polite">{error}</p>
      <div className="success" role="status" aria-live="polite">
        {status === "done" && (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <span>You&rsquo;re subscribed. Watch your inbox for events and your first-use discount.</span>
          </>
        )}
      </div>
    </form>
  );
}
