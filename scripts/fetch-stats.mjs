// Fetches the Hugging Face download and GitHub star counts at build time and
// writes them to public/stats.json, so visitors' browsers never contact
// huggingface.co or api.github.com (no visitor IP addresses go to third parties).
// Runs automatically before `npm run build` (the "prebuild" script). Never fails
// the build: if a request fails, that count is written as 0 and its chip stays hidden.
import { writeFileSync, mkdirSync } from "node:fs";

const GITHUB_OWNER = "Lilafold";
const HF_AUTHOR = "LilaFold";

const get = async (url, headers = {}) => {
  try {
    const r = await fetch(url, { headers: { "User-Agent": "lilafold-site-build", ...headers } });
    return r.ok ? await r.json() : [];
  } catch {
    return [];
  }
};

const [hfList, ghList] = await Promise.all([
  get(`https://huggingface.co/api/models?author=${HF_AUTHOR}&limit=1000&expand[]=downloadsAllTime&expand[]=downloads`),
  get(`https://api.github.com/users/${GITHUB_OWNER}/repos?per_page=100&type=owner`, {
    Accept: "application/vnd.github+json",
  }),
]);

const sum = (list, f) => (Array.isArray(list) ? list.reduce((s, x) => s + (f(x) || 0), 0) : 0);
const stats = {
  hf: sum(hfList, (m) => m.downloadsAllTime ?? m.downloads),
  gh: sum(ghList, (r) => r.stargazers_count),
  updated: new Date().toISOString(),
};

mkdirSync("public", { recursive: true });
writeFileSync("public/stats.json", JSON.stringify(stats) + "\n");
console.log("stats.json", stats);
