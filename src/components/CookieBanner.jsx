import { useEffect, useRef, useState } from "react";

const KEY = "lf-consent"; // "granted" | "denied" (analytics), read by the loader in index.html
export const OPEN_EVENT = "lf:cookie-settings";

const read = () => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
};
const save = (v) => {
  try {
    localStorage.setItem(KEY, v);
  } catch {
    /* private mode: the choice lasts for this visit only */
  }
};

/** Opens the banner straight on its settings view, for the "Cookie settings" link in the footer. */
export const openCookieSettings = () => window.dispatchEvent(new Event(OPEN_EVENT));

// Only list what the site actually sets. Add a category here if a new kind of cookie is introduced.
const CATEGORIES = [
  {
    id: "necessary",
    title: "Strictly necessary",
    body: "Remembers your cookie choice. The site needs this to work, so it is always on.",
    locked: true,
  },
  {
    id: "analytics",
    title: "Analytics",
    body: "Google Analytics, through Google Tag Manager. Counts visits and which pages are read so we can improve the site. No advertising.",
  },
];

function Switch({ checked, onChange, disabled, labelledBy, describedBy }) {
  return (
    <button
      type="button"
      role="switch"
      className="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      disabled={disabled}
      onClick={() => onChange(!checked)}
    >
      <span className="switch-thumb" />
    </button>
  );
}

/**
 * Analytics consent. Nothing is tracked until the visitor accepts: the Google
 * tag in index.html only loads after `window.lfLoadAnalytics()` is called.
 */
export default function CookieBanner() {
  const [open, setOpen] = useState(() => !read());
  const [view, setView] = useState("ask"); // ask | settings
  const [analytics, setAnalytics] = useState(() => read() === "granted");
  const panelRef = useRef(null);
  const focusOnOpen = useRef(false);

  useEffect(() => {
    const show = () => {
      setAnalytics(read() === "granted");
      setView("settings");
      setOpen(true);
      focusOnOpen.current = true;
    };
    window.addEventListener(OPEN_EVENT, show);
    return () => window.removeEventListener(OPEN_EVENT, show);
  }, []);

  // move focus into the panel when it is opened on purpose or switches view
  useEffect(() => {
    if (!open || !focusOnOpen.current) return;
    panelRef.current?.querySelector("button:not([disabled])")?.focus();
  }, [open, view]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape" && view === "settings" && read()) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, view]);

  const apply = (granted) => {
    const was = read();
    save(granted ? "granted" : "denied");
    setAnalytics(granted);
    setOpen(false);
    if (granted) {
      window.lfLoadAnalytics?.();
    } else {
      window.gtag?.("consent", "update", { analytics_storage: "denied" });
      // analytics already running from an earlier "accept": reload so it stops for good
      if (was === "granted" && window.lfGtmLoaded) window.location.reload();
    }
  };

  if (!open) return null;

  const toSettings = () => {
    focusOnOpen.current = true;
    setView("settings");
  };

  return (
    <section
      ref={panelRef}
      className={`cookie${view === "settings" ? " cookie-settings" : ""}`}
      role="region"
      aria-labelledby="cookie-title"
    >
      <h2 id="cookie-title">{view === "settings" ? "Cookie settings" : "Cookies"}</h2>

      {view === "ask" ? (
        <>
          <p>
            We&rsquo;d like to use analytics cookies to see how people use the site, so we can improve it. Nothing
            is tracked unless you accept.
          </p>
          <div className="cookie-actions">
            <button type="button" className="link-button cookie-settings-link" onClick={toSettings}>
              Settings
            </button>
            <button type="button" className="btn-ghost" onClick={() => apply(false)}>Decline</button>
            <button type="button" className="btn-light" onClick={() => apply(true)}>Accept</button>
          </div>
        </>
      ) : (
        <>
          <p>Choose which cookies we can use. You can change this any time from the footer.</p>
          <ul className="cookie-list">
            {CATEGORIES.map((c) => {
              const on = c.locked ? true : analytics;
              return (
                <li key={c.id}>
                  <div>
                    <h3 id={`ck-${c.id}`}>
                      {c.title}
                      {c.locked && <span className="cookie-always">Always on</span>}
                    </h3>
                    <p id={`ck-${c.id}-d`}>{c.body}</p>
                  </div>
                  <Switch
                    checked={on}
                    disabled={c.locked}
                    onChange={setAnalytics}
                    labelledBy={`ck-${c.id}`}
                    describedBy={`ck-${c.id}-d`}
                  />
                </li>
              );
            })}
          </ul>
          <div className="cookie-actions">
            <button type="button" className="btn-ghost" onClick={() => apply(false)}>Reject all</button>
            <button type="button" className="btn-ghost" onClick={() => apply(analytics)}>Save choices</button>
            <button type="button" className="btn-light" onClick={() => apply(true)}>Accept all</button>
          </div>
        </>
      )}
    </section>
  );
}
