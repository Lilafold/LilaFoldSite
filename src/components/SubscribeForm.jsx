import { useId, useRef, useState } from "react";
import { ArrowRight } from "./Icons.jsx";

// The subscribe API is a Cloudflare Worker (worker/src/index.js).
// Production: set at build time from the SUBSCRIBE_ENDPOINT repo variable.
// Local: `npm run worker:dev` serves it on port 8787.
// A production build without the variable must never post to localhost.
const ENDPOINT =
  import.meta.env.VITE_SUBSCRIBE_ENDPOINT || (import.meta.env.DEV ? "http://localhost:8787" : "");
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

export default function SubscribeForm({ className = "", style, label = "Join early access", compact = false }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | done
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  async function onSubmit(e) {
    e.preventDefault();
    const value = email.trim();
    if (!value) {
      setError("Enter your email address to join.");
      inputRef.current?.focus();
      return;
    }
    if (!isEmail(value)) {
      setError("That email address looks incomplete. Check it and try again.");
      inputRef.current?.focus();
      return;
    }
    if (!ENDPOINT) {
      setError("Sign-ups are not connected on this build yet. Please try again later.");
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
          : "We couldn't add you just now. Your email is still here, so try again in a moment."
      );
    }
  }

  const inputId = `email-${id}`;
  const errorId = `email-error-${id}`;

  return (
    <form
      className={`subscribe${compact ? " compact" : ""}${status === "done" ? " done" : ""} ${className}`}
      style={style}
      onSubmit={onSubmit}
      noValidate
    >
      <label htmlFor={inputId} className="sr-only">Email address</label>
      <div className="field">
        <svg className="mail" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="3" />
          <path d="m4 7 8 6 8-6" />
        </svg>
        <input
          ref={inputRef}
          id={inputId}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@company.com"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? errorId : undefined}
        />
        <button type="submit" className="btn-light" disabled={status === "sending"}>
          {status === "sending" ? "Joining" : label}
          <span className="key" aria-hidden="true"><ArrowRight /></span>
        </button>
      </div>
      <p className="note" id={errorId} role="status" aria-live="polite">{error}</p>
      <div className="success" role="status" aria-live="polite">
        {status === "done" && (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <span>You&rsquo;re on the list. We&rsquo;ll email you when early access opens, with your first-use discount.</span>
          </>
        )}
      </div>
    </form>
  );
}
