# LilaFoldSite

Coming-soon page for LilaFold. React + Vite, hosted on GitHub Pages. Email signups go to
EmailOctopus through a small Cloudflare Worker, so the API key never reaches the browser.

## Develop

```bash
npm install
npm run dev          # site on http://localhost:5173
npm run worker:dev   # subscribe API on http://localhost:8787 (needs worker/.dev.vars)
```

`worker/.dev.vars` (git-ignored) holds the key for local runs:

```
EMAILOCTOPUS_API_KEY=...
```

## Deploy

**Site:** every push to `main` builds and publishes to GitHub Pages
(`.github/workflows/deploy.yml`).

**Subscribe API (one-time setup):**

```bash
npx wrangler login
npm run worker:deploy
npx wrangler secret put EMAILOCTOPUS_API_KEY --config worker/wrangler.toml
```

Then set the Worker URL as the repo variable `SUBSCRIBE_ENDPOINT`
(Settings → Secrets and variables → Actions → Variables) and re-run the deploy workflow.

Allowed origins and the EmailOctopus list ID live in `worker/wrangler.toml`.
