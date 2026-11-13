import { useEffect, useState } from "react";
import Logo from "./Logo.jsx";
import { ArrowRight } from "./Icons.jsx";
import { useCommunityStats, formatCount } from "../lib/useCommunityStats.js";

const HuggingFaceIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="10" fill="#FFD21E" />
    <circle cx="8.6" cy="10" r="1.5" fill="#3a2a10" />
    <circle cx="15.4" cy="10" r="1.5" fill="#3a2a10" />
    <path d="M7.6 13.4c1 2.1 2.6 3.2 4.4 3.2s3.4-1.1 4.4-3.2" fill="#3a2a10" />
    <path d="M3.6 15.2c-.9.6-1.2 1.8-.6 2.6l1.6 2.1c.6.8 1.8.9 2.5.2l1.2-1.1M20.4 15.2c.9.6 1.2 1.8.6 2.6l-1.6 2.1c-.6.8-1.8.9-2.5.2l-1.2-1.1" fill="#FF9D0B" />
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.46-1.1-1.46-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
  </svg>
);

const DownIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 2v7.5M2.8 6.5 6 9.7l3.2-3.2" />
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
    <path d="M6 .9l1.5 3.2 3.5.4-2.6 2.4.7 3.5L6 8.7 2.9 10.4l.7-3.5L1 4.5l3.5-.4z" />
  </svg>
);

/** A link chip that shows a count only once it is above zero. */
function StatChip({ href, label, icon, statIcon, count, unit }) {
  return (
    <a className="chip" href={href} target="_blank" rel="noopener" aria-label={label}>
      {icon}
      {count > 0 && (
        <span className="chip-stat in">
          {statIcon}
          <b>{formatCount(count)}</b>
          <span className="sr-only"> {unit}</span>
        </span>
      )}
    </a>
  );
}

const BASE = import.meta.env.BASE_URL;
const sectionLinks = [
  { href: "#models", label: "Models" },
  { href: "#platform", label: "Platform" },
  { href: "#hardware", label: "Hardware" },
  { href: "#roadmap", label: "Roadmap" },
  { href: "#team", label: "Team" },
];
const blogLink = { href: `${BASE}blog/`, label: "Blog", blog: true };

// `home` is false on other pages (the blog): section links then lead back to the landing page
export default function Nav({ home = true }) {
  const links = [...sectionLinks.map((l) => (home ? l : { ...l, href: `${BASE}${l.href}` })), blogLink];
  const homeHref = home ? "#top" : BASE;
  const joinHref = home ? "#join" : `${BASE}#join`;
  const { hf, gh } = useCommunityStats();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // scrollspy: mark the section currently crossing the upper third of the screen
  useEffect(() => {
    const sections = sectionLinks.map((l) => document.querySelector(l.href)).filter(Boolean);
    if (!("IntersectionObserver" in window) || !sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = `#${e.target.id}`;
          if (e.isIntersecting) setActive(id);
          // leaving a section without entering another (FAQ, signup, footer) clears the highlight
          else setActive((cur) => (cur === id ? "" : cur));
        }
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const close = () => setOpen(false);
  const current = (l) => (l.blog ? (home ? undefined : "page") : active === l.href ? "location" : undefined);

  return (
    <header className={`nav reveal${open ? " open" : ""}${scrolled ? " scrolled" : ""}`} style={{ "--i": 0 }}>
      <div className="nav-bar">
        <a className="brand" href={homeHref} aria-label="LilaFold home" onClick={close}>
          <Logo />
          <span className="word">LilaFold</span>
        </a>
        <nav className="nav-links" aria-label="Sections">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={close} aria-current={current(l)}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav-right">
          <StatChip
            href="https://huggingface.co/LilaFold"
            label="LilaFold on Hugging Face"
            icon={<HuggingFaceIcon />}
            statIcon={<DownIcon />}
            count={hf}
            unit="downloads"
          />
          <StatChip
            href="https://github.com/Lilafold"
            label="LilaFold on GitHub"
            icon={<GitHubIcon />}
            statIcon={<StarIcon />}
            count={gh}
            unit="stars"
          />
          <a className="nav-cta" href={joinHref} onClick={close}>
            <span>
              Join<span className="cta-long"> early access</span>
            </span>
            <ArrowRight className="nav-cta-arrow" />
          </a>
          <button
            type="button"
            className="menu-btn"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span />
          </button>
        </div>
      </div>
      <nav id="mobile-menu" className="mobile-menu" aria-label="Sections" hidden={!open}>
        {links.map((l) => (
          <a key={l.href} href={l.href} onClick={close} aria-current={current(l)}>
            {l.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
