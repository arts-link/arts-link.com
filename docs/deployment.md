# Deployment

This page covers how the site reaches the internet, how previews avoid pretending to be production, and how to confirm that a deploy actually happened.

**Source of truth:** `wrangler.jsonc`, `scripts/cf-build.sh`, `layouts/robots.txt`, `layouts/_default/baseof.html` (preview block), `tests/cloudflare.test.js`. The comment blocks in the first three files are the long-form reasoning, so read them before changing anything.

## Target

**Cloudflare Workers is the only deployment target for this site.** The Vercel cutover is done: `vercel.json` and `scripts/vercel-build.sh` are gone, and the Vercel `arts-link-com` project has been deleted. The move was about licensing, not features. Vercel Hobby is non-commercial only, and this site sells services.

Vercel is still used elsewhere at Arts-Link. `screenshots.arts-link.com` is a separate tool in its own repository and still runs there. This page is about this site only.

## How it's built and served

- **An assets-only Worker** (`wrangler.jsonc`, name `arts-link-com`). It has no `main`, so no code runs per request and `public/` is served straight from the edge.
  - `html_handling: auto-trailing-slash` serves Hugo's `/about/index.html` at `/about/`.
  - `not_found_handling: 404-page` serves `public/404.html` with a real 404 status.
  - `_redirects` and `_headers` would still be honoured, but none exist today.
- **Workers Builds** is Cloudflare's own CI. It connects through the Cloudflare GitHub App, runs `scripts/cf-build.sh` on Cloudflare's infrastructure, and keeps its own history under **Workers & Pages → `arts-link-com` → Deployments**. **Nothing in `.github/workflows/` deploys to Cloudflare.**
- `npm run cf:deploy` deploys by hand from a laptop. Those versions show as "Manually deployed" with no branch.

## The three-checks rule

When Workers Builds is wired up, it posts a check run called **`Workers Builds: arts-link-com`** next to `test`. A PR should show **three checks, not two**.

**The thing to watch for is that check going missing.** If the repository drops off the Cloudflare GitHub App's access list, or the Git account authorization lapses, no build runs and no check appears. An absent check looks like nothing at all; a failing one would be obvious. Then `main` moves forward, production doesn't, and PRs still go green.

This has already happened. The app had access to `clients.arts-link.com` but not to this repository, so the hub deployed on every push while the marketing site sat ten hours behind `main`, serving a stale `robots.txt`. It was found by fetching the file and reading it, not by any error report.

**Settings → Builds** can show the banner "This project is disconnected from your Git account" while still listing the repository. It means the repository is configured but the account link is not. **Manage** repairs it; **Disconnect** discards the configuration.

### After a merge that matters

1. Check that the PR showed three checks.
2. In **Deployments**, find a new version carrying the commit message and a branch badge.
3. Fetch a page or file you changed from `https://www.arts-link.com/` and read it. `curl -s https://www.arts-link.com/robots.txt` is a quick freshness probe.

## Previews

Workers Builds builds every non-production branch as a preview. **Preview URLs are public and crawlable.**

Hugo bakes `baseURL` into every absolute URL, and Workers Builds can't tell the build its own hostname, because the preview alias is assigned during `versions upload`, after the build finishes. It only injects `WORKERS_CI`, `WORKERS_CI_BRANCH`, `WORKERS_CI_COMMIT_SHA` and `WORKERS_CI_BUILD_UUID`. So instead of guessing the hostname, a preview **claims nothing**:

- `scripts/cf-build.sh` sets `HUGO_PARAMS_PREVIEW=true` when `WORKERS_CI` is set and the branch isn't `PRODUCTION_BRANCH` (default `main`).
- `baseof.html` then emits `noindex, nofollow` and omits `canonical` and `og:url`.
- `layouts/robots.txt` becomes `Disallow: /` with no sitemap.
- If you know the hostname, set `PREVIEW_BASE_URL`. The noindex still applies.

Previews currently **do** load PostHog; see [`analytics.md`](analytics.md) and [arts-link/arts-link.com#59](https://github.com/arts-link/arts-link.com/issues/59).

`tests/cloudflare.test.js` builds both modes into temp directories and asserts each one.

## Domain and DNS

- The canonical host is **`https://www.arts-link.com/`** (`baseURL` in `config/_default/hugo.toml`).
- **apex → `www` is a Cloudflare Redirect Rule**, not repository config. Route 53's ALIAS record has no Cloudflare equivalent, and `_redirects` matches paths, not hostnames. A Redirect Rule also avoids running anything per request.
- Nothing in `layouts/` hardcodes the domain. Keep it that way.

## robots.txt and AI crawlers

`layouts/robots.txt` (production):

- allows search: `Content-Signal: search=yes,ai-train=no,use=reference`
- disallows the well-known **training** crawlers (GPTBot, ClaudeBot, Google-Extended, CCBot, …)
- deliberately **allows** agent crawlers that fetch a page to answer someone's question now, and search engines such as Baiduspider and PetalBot
- Cloudflare enforces the same preference at the edge: **Security → Settings → Bot traffic → AI bot policies**, Training = Block

**Keep Cloudflare's "Bot Preference Sync" off.** It prepends Cloudflare's managed robots.txt zone-wide, and once replaced the client hub's blanket Disallow with `Allow: /`. This template should be the only robots.txt either site serves.

## Local checks

| Command | Use it to |
|---|---|
| `hugo server` | design and write; doesn't show trailing-slash redirects or 404 status |
| `npm run cf:build` | reproduce the Workers Builds build (production mode outside CI) |
| `npm run cf:dev` | serve `public/` on the real Workers runtime: routing, redirects, 404s |
| `WORKERS_CI=1 WORKERS_CI_BRANCH=test npm run cf:build` | reproduce a preview build locally |

## Legacy: GitHub Pages

`.github/workflows/hugo.yml` can still deploy to GitHub Pages (manual trigger, Hugo 0.138.0 extended). It passes the URL Pages gives it as `--baseURL`, which only works because nothing hardcodes the domain. It is not the production path. Whether to keep it is listed in [`known-debt.md`](known-debt.md).
