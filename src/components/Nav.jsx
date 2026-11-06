import Logo from "./Logo.jsx";
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

export default function Nav() {
  const { hf, gh } = useCommunityStats();

  return (
    <header className="nav reveal" style={{ "--i": 0 }}>
      <div className="nav-bar">
        <a className="brand" href="/" aria-label="LilaFold home">
          <Logo />
          <span className="word">LilaFold</span>
        </a>
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
        </div>
      </div>
    </header>
  );
}
