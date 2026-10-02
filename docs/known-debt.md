# Known debt

These are stale code, copy and config that were found but not fixed yet. Each item should be small enough to clear in its own PR. Delete the row when it's done, and add a row when you notice something you aren't fixing now.

_Last surveyed: October 2026, while building this knowledge base._

## Privacy and boundary

| Item | Why it matters | Suggested fix |
|---|---|---|
| `content/draft-proposals/philly-historical-markers/index.md` | `_build` keeps it out of the site, but the **source is public** in this repo and includes a personal phone number. Proposals belong outside a public repo; see [`client-hub-boundary.md`](client-hub-boundary.md). | Move to the hub repo or a private store, then delete the section and its `pages_cut` note. |

## Stale from the Ryder-theme era

| Item | Suggested fix |
|---|---|
| `assets/jsconfig.json` points at `../themes/ryder/assets/*` | Delete it, or repoint it to `assets/`. |
| `assets/css/extended/custom.css` (Chalkduster) is not imported anywhere | Delete it. |
| `static/fonts/Chalkduster.ttf` is unreferenced, but still copied into every build | Delete it. |
| `assets/common-partials/opengraph/` is unreferenced | Delete it. |
| `.gitignore` theme lines (`/themes/*/exampleSite/`, `/themes/ryder-dev/`, `# /themes/benstraw/`) and `/assets/plausible-export/` | Prune them. |
| `.gitmodules` is empty, yet the workflows check out `submodules: recursive` | Delete `.gitmodules` and drop the option. |
| `layouts/shortcodes/cta-button.html` and `picture.html` are **0-byte files**, and `content/domain-names/` (a draft) calls `cta-button` | Implement them or delete them. |
| Unused dependencies: `@fortawesome/*`, `leaflet`, `@alpinejs/focus` | Remove them from `package.json` after confirming nothing loads them. |
| `package.json` `name` is `benstrawbridge.com`, and `description` is `"## inital setup"` | Rename it to `arts-link.com`. |
| `content/_index.md` carries `homeFeatureIcon` and `ogTitleText`, which no template reads | Remove them. |

## Copy and content

| Item | Suggested fix |
|---|---|
| `content/about/mission/index.md` says "we partner with … Plausible" (the site uses PostHog). The section isn't rendered, but it's still wrong. | Fix it, or delete the cut section. |
| `content/resources/fonts-icons/index.md` lists Chalkduster | Same. |
| `content/services/index.md` (YAML, older copy) sits next to `content/services/_index.md` | Check what Hugo builds from it, then delete one. |
| `content/contact.md` (`draft = true`) duplicates `content/contact/_index.md` | Delete it. |
| `docs/site-system.yaml` → `services[New Site].description` says "Custom Hugo portfolio", which breaks the positioning rule | Reword it as an outcome. |
| `docs/site-system.yaml` → `analytics.primary_events` mentions `location: blog-post`, but blog posts use the shared CTA block (`location: cta-block`) | Fix the doc, or pass a location into `cta-block.html`. |
| `content/work/jill-bonovitz/index.md` says the site is "hosted for free on GitHub Pages" | Confirm it's still true for that client. |

## Process and ops

| Item | Suggested fix |
|---|---|
| `TODO.md` has Plausible tasks and launch-checklist items (redirect checks, Search Console) that may be done | Re-audit it; move durable items into [`deployment.md`](deployment.md) and [`metrics-and-stats.md`](metrics-and-stats.md). |
| PostHog loads on preview deployments: [arts-link/arts-link.com#59](https://github.com/arts-link/arts-link.com/issues/59) | Gate the snippet on `not $preview` in `baseof.html`. |
| `.github/workflows/hugo.yml` (GitHub Pages) is kept "still deployable" but is unused | Decide whether to keep it; if it goes, update [`deployment.md`](deployment.md). |
