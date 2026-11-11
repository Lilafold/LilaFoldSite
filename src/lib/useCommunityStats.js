import { useEffect, useState } from "react";

// The counts are fetched at build time by scripts/fetch-stats.mjs and served from
// our own domain, so loading the page never contacts GitHub or Hugging Face.
const URL = `${import.meta.env.BASE_URL}stats.json`;

/** Hugging Face downloads (all-time, summed across models) and GitHub stars (summed across public repos). */
export function useCommunityStats() {
  const [stats, setStats] = useState({ hf: 0, gh: 0 });

  useEffect(() => {
    let cancelled = false;
    fetch(URL)
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => {
        if (!cancelled && s) setStats({ hf: s.hf || 0, gh: s.gh || 0 });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return stats;
}

export const formatCount = (n) =>
  n < 1000 ? String(n)
  : n < 1e6 ? (n / 1e3).toFixed(n < 1e4 ? 1 : 0).replace(/\.0$/, "") + "K"
  : (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
