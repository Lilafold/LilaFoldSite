import { useEffect, useState } from "react";

const GITHUB_OWNER = "Lilafold";
const HF_AUTHOR = "LilaFold";
const CACHE_KEY = "lf-stats-v1";
const CACHE_MS = 30 * 60 * 1000;

const readCache = () => {
  try {
    const c = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
    return c && Date.now() - c.t < CACHE_MS ? c : null;
  } catch {
    return null;
  }
};

/** Live Hugging Face downloads (all-time, summed across models) and GitHub stars (summed across public repos). */
export function useCommunityStats() {
  const [stats, setStats] = useState(() => readCache() ?? { hf: 0, gh: 0 });

  useEffect(() => {
    if (readCache()) return;
    let cancelled = false;

    const hf = fetch(`https://huggingface.co/api/models?author=${HF_AUTHOR}&limit=1000&expand[]=downloadsAllTime&expand[]=downloads`)
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => list.reduce((sum, m) => sum + (m.downloadsAllTime ?? m.downloads ?? 0), 0))
      .catch(() => 0);

    const gh = fetch(`https://api.github.com/users/${GITHUB_OWNER}/repos?per_page=100&type=owner`, {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => list.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0))
      .catch(() => 0);

    Promise.all([hf, gh]).then(([hfCount, ghCount]) => {
      if (cancelled) return;
      setStats({ hf: hfCount, gh: ghCount });
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), hf: hfCount, gh: ghCount }));
      } catch {
        /* storage unavailable: fine */
      }
    });

    return () => { cancelled = true; };
  }, []);

  return stats;
}

export const formatCount = (n) =>
  n < 1000 ? String(n)
  : n < 1e6 ? (n / 1e3).toFixed(n < 1e4 ? 1 : 0).replace(/\.0$/, "") + "K"
  : (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
