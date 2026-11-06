const socials = [
  {
    label: "X",
    href: "https://x.com/lilafold",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77L17.75 3Zm-1.08 16.18h1.7L7.4 4.73H5.58l11.09 14.45Z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/lilafold/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/lilafold",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.83v1.54h.05c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.66 4.8 6.13V21h-4v-4.98c0-1.19-.02-2.72-1.66-2.72-1.66 0-1.91 1.3-1.91 2.63V21h-4V9.75Z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="reveal" style={{ "--i": 4 }}>
      <span>&copy; {new Date().getFullYear()} LilaFold Labs</span>
      <nav className="socials" aria-label="LilaFold on social media">
        {socials.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener" aria-label={s.label}>
            {s.icon}
          </a>
        ))}
      </nav>
    </footer>
  );
}
