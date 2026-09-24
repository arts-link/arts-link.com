# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Arts-link.com is a boutique web studio site for Ben Strawbridge, offering bespoke portfolio sites for artists and bands. The studio isn't tied to one stack — client work spans Hugo, Astro, and other static builds, chosen per project.

This particular site is built with Hugo, Tailwind CSS, and Alpine.js. It has **no theme** — every template lives in the root `layouts/` directory. ("Ryder" is the open source Hugo theme Arts-Link maintains at [github.com/arts-link/ryder](https://github.com/arts-link/ryder); it is a separate repository and is *not* used to build this site.)

## Site Strategy

The authoritative strategy document is `docs/site-system.yaml`. It defines the keystone metrics, page inventory, services, nav, conversion flow, and analytics plan for the site. **Keep it up to date** — when pages are added, removed, or repurposed, update the `page_inventory` and `pages_cut` sections. When services, positioning, or the conversion flow change, update those sections accordingly. The strategy doc is the source of truth for *why* the site is structured the way it is; the code reflects it.

The site strategy follows the framework in `docs/web-systems-adventure-mode.md`. Refer to it when making structural decisions about pages, modules, or navigation.

## Development Commands

```bash
# Start local dev server
hugo server

# Build for production
hugo --minify

# Install dependencies (after cloning)
npm ci

# Run tests (vitest) — requires a build first, see below
hugo --minify && npm test

# Regenerate social share cards — requires a build first (see Social Cards)
hugo --minify && npm run og

# Cloudflare Workers (see Deployment) — build, serve on the real Workers
# runtime, deploy. cf:dev is the only way to check routing behaviour that
# `hugo server` cannot show you: trailing-slash redirects and the 404 status.
npm run cf:build
npm run cf:dev
npm run cf:deploy
```

The test suite reads from the generated `public/` directory. Without it, `tests/smoke.test.js` skips itself silently, so always build before running tests.

## Architecture

**Templates**: There is no theme. Every template lives in root `layouts/`, with `layouts/_default/baseof.html` as the page shell and section directories (`layouts/work/`, `layouts/blog/`, …) providing `list.html` / `single.html`. Reusable blocks live in `layouts/partials/modules/` — check there before writing new markup.

**CSS Pipeline**: Tailwind CSS is processed through PostCSS (`postcss-import` → `tailwindcss` → `autoprefixer`). Tailwind finds class names two ways, both configured in `tailwind.config.js`: it scans `layouts/**/*.html` directly, and it reads `hugo_stats.json`, which Hugo emits because `[build] writeStats = true` is set in `config/_default/hugo.toml`. The compiled CSS is inlined into a `<style>` tag in `baseof.html` rather than linked, to avoid render-blocking and FOUC.

**Interactivity**: Alpine.js handles UI interactivity (theme toggle, image galleries, mobile nav). No bundler — `static/js/alpine.min.js` is copied from `node_modules` by the `postinstall` script and loaded directly.

**Environment configs**: `config/_default/` applies everywhere; `config/production/` sets the production `title` and adds PostHog analytics (`posthog_key`, `posthog_host`). The PostHog snippet in `baseof.html` is gated on `hugo.Environment` being production. `static/js/analytics.js` loads in every environment.

**Content model**: `content/work/` holds portfolio entries as page bundles — an `index.md` plus a `screenshot.*` image resource picked up by `.Resources.GetMatch`. Front matter:
```toml
title = "Verdèzul"
date = 2026-07-24
client_type = "band"          # lowercase — the card/page applies a capitalize transform
                              # visual artist | band | photographer | family archive
                              # | travel archive | open source theme | other
site_type = "new"             # new | rescue | open-source — drives the card/page badge
live_url = "https://..."      # the hosted site (or demo, for open-source entries)
repo_url = "https://..."      # optional; public source repo, renders next to live_url
case_study = true             # enables the "Read story" link to the full page
weight = 1                    # ascending sort on /work/; lowest 3 also feature on the homepage
```
`docs/site-system.yaml` (`content_model.work_entries`) is the authority on these fields — update it when they change.

**Page descriptions**: `layouts/partials/page-description.html` returns the text used
for `meta description`, `og:description`, `twitter:description` and the social card,
so those can't drift apart. It prefers front matter `description`, then the page
`.Summary`, then — for a work entry with no body to summarize — a line composed from
its own front matter, and only falls back to `.Site.Params.description` if all of those
are empty. Authored `description` copy passes through untouched; derived text is
plainified and trimmed to 160 characters. Write a `description` whenever the derived
one is weak; a smoke test fails if any two indexable pages end up sharing one.

**Social cards**: Every page gets its own 1200×630 Open Graph image. The `ogcard`
output format renders each page a second time as a card at `<page>/og.html`
(`layouts/_default/baseof.ogcard.html` + `layouts/partials/og-card.html`), styled with
the site's own CSS so it uses the real `ink`/`cream`/`ember` tokens and self-hosted
fonts. `scripts/og-images.mjs` screenshots those with Playwright into `static/og/`.

The images are **committed** — nothing renders at deploy time. After adding or
retitling a page, run `hugo --minify && npm run og` and commit `static/og/` along with
`data/og/manifest.json`; only cards whose source changed are re-rendered, so it's
usually a no-op. CI runs `npm run og:check` and fails if a card is missing or stale.
`baseof.html` falls back to `og-default.jpg` for pages not yet in the manifest.

To redesign the card, edit `layouts/partials/og-card.html` and preview it live at
`localhost:1313/work/rt2026/og.html` during `hugo server`. Note that
`baseof.ogcard.html` deliberately has no `{{ block "main" }}` — see the comment in that
file.

**The card is designed to be read small.** Link unfurls render it at roughly 300px
(iMessage), 360px (Slack) or 500px (X) wide, a 2–4× downsample, so the type has a floor
of ~27px, the display face is `font-medium` rather than the site's usual `font-light`
(thin strokes vanish when scaled down), and text stays at `cream/65` or above. Always
check a redesign at those widths rather than at 1200px — everything looks fine at full
size.

**Deployment.** Cloudflare Workers is the sole deployment target for this site. The
Vercel cutover is done — `vercel.json` and `scripts/vercel-build.sh` are gone, and the
Vercel `arts-link-com` project has been deleted. (Vercel is not retired from Arts-Link
generally — `screenshots.arts-link.com`, a separate tool with its own repository, still
runs there. This section is about this site only.)

**Nothing in `.github/workflows/` deploys to Cloudflare.** Workers Builds is
Cloudflare's own CI — it connects through the Cloudflare GitHub App, runs on
Cloudflare's infrastructure, and has its own history under **Workers & Pages →
`arts-link-com` → Deployments**.

When it is working it posts a check run called **`Workers Builds:
arts-link-com`** alongside `test`, so a PR shows three checks rather than two.

**That check's absence is the thing to watch for.** If the repository is missing
from the Cloudflare GitHub App's access list, or the Git account authorization
lapses, no build runs and no check appears — and an absent check looks like
nothing at all, whereas a failing one would be obvious. `main` moves forward,
production does not, and the PR still goes green on the checks that did run.

This has already happened. The app had access to `clients.arts-link.com` but
not to this repository, so the hub deployed on every push while the marketing
site sat ten hours behind `main` serving a stale `robots.txt`. It was found by
fetching the file and reading it, not by anything reporting an error.

So: **three checks on a PR, not two.** Two means the deploy is not wired up.

**Settings → Builds** shows a banner reading "This project is disconnected from
your Git account" while still listing the repository, which is confusing and
means exactly one thing: the repository is configured, the account link is not.
**Manage** repairs it; **Disconnect** discards the configuration.

So after a merge that matters, confirm the deploy rather than assuming it —
the Deployments tab should show a new version carrying the commit message and a
branch badge. A version labelled "Manually deployed" with no branch came from
the dashboard, not from git.

**Cloudflare (the target)**: `wrangler.jsonc` → `scripts/cf-build.sh`. An **assets-only
Worker** — there is no `main`, so nothing executes per request and `public/` is served
straight from the edge. (The client hub is the opposite: it sets `run_worker_first` so
its auth check runs before any asset. This site has nothing to gate.)

The preview problem is solved differently here, and the difference is the interesting
part. Vercel hands a build its own hostname; **Workers Builds does not** — it injects
`WORKERS_CI`, `WORKERS_CI_BRANCH`, `WORKERS_CI_COMMIT_SHA` and `WORKERS_CI_BUILD_UUID`,
and no URL, because a preview's alias is assigned during `versions upload`, after the
build has finished. The hostname does not exist yet while you are building for it.

So instead of naming the preview, a preview declines to make any claim: non-production
builds set `HUGO_PARAMS_PREVIEW`, and `baseof.html` then emits `noindex, nofollow` and
omits both `canonical` and `og:url`, while `robots.txt` becomes a blanket disallow. This
matters because **Workers preview URLs are public and crawlable**. Set `PREVIEW_BASE_URL`
if you do know the hostname; the noindex still applies. `tests/cloudflare.test.js` builds
both ways into temp directories and asserts each.

**The apex → `www` 301 is not in this repo.** Route 53's ALIAS record has no Cloudflare
equivalent, and `_redirects` matches paths rather than hostnames, so it belongs in a
Cloudflare **Redirect Rule** — which also avoids invoking anything per request.

Nothing in `layouts/` hardcodes the domain; keep it that way — Hugo resolves every
absolute URL (`og:image`, `og:url`, `canonical`, the JSON-LD `@id`s, the sitemap line in
`robots.txt`) against `baseURL`.

Also still deployable to GitHub Pages via `.github/workflows/hugo.yml` (manual trigger, Hugo v0.138.0 extended), which passes the URL Pages gives it for the same reason. CI runs separately in `.github/workflows/test.yml` on every push and PR: `npm ci` → `hugo --minify` → `npm test`.

## Tailwind & Styling

Custom additions in `tailwind.config.js`:
- Colors: `ink` / `ink-light` (backgrounds), `cream` (text), `ember` / `ember-light` (accent) — all defined as `rgb(var(--color-…) / <alpha-value>)`, so opacity modifiers like `text-cream/50` work
- Fonts: `font-display` → Fraunces (headings), `font-body` → DM Sans — self-hosted variable woff2 in `static/fonts/`, preloaded in `baseof.html`
- Breakpoint: `xs: 475px`

The `@tailwindcss/typography` plugin is active for prose content.

### Theming (read before adding colors)

**Do not write `dark:` utilities — they will silently never apply.** There are none in the codebase, and `darkMode: 'class'` in `tailwind.config.js` is vestigial: nothing ever adds a `.dark` class.

Theming is done entirely with CSS custom properties in `assets/css/main.css`:
- **Dark is the default**, defined on `:root`
- **Light is opt-in**, defined on `html.light`
- The `light` class is set pre-paint by an inline script at the top of `baseof.html` (reading `localStorage.theme`), and toggled by the Alpine component in `layouts/partials/footer.html`

**The client hub (`clients.arts-link.com`) inverts this** — light by default, dark opt-in, the reverse of the public site — but it is a separate repository now (`arts-link/clients.arts-link.com`) with its own `CLAUDE.md` and its own readability contract. Nothing about its theming lives here any more.

So a new color means adding a `--color-*` variable to **both** the `:root` and `html.light` blocks, then registering it in `tailwind.config.js` using the same `rgb(var(…) / <alpha-value>)` form. Anything built from the existing `ink` / `cream` / `ember` tokens adapts to both themes for free.

## Copywriting Rules

**Don't let technology define the offering.** Arts-Link is a web studio, not a Hugo shop — projects get built in whatever fits, and the portfolio already spans Hugo, Astro, and other static builds. On positioning surfaces — hero copy, taglines, service descriptions, page descriptions, meta and OG text — sell the outcome (fast, beautiful, accessible, yours to own), never a stack. A visitor deciding whether to hire Ben does not care what generates the HTML, and naming one tool there implies it's the only thing on offer.

**Naming the stack is fine when it's the subject.** Case studies, work entries, and blog posts describe specific projects, and being concrete about what a given site was actually built with is honest and useful. Say Hugo when the project is Hugo, Astro when it's Astro. What to avoid is implying every Arts-Link site is built the same way.

Rule of thumb: technology in the *body* of a project story, yes; technology in the *pitch*, no.

**Never link to the working surface of a tool we used.** No `claude.ai` artifact, no shared
chat, no scratch document or notebook — not in a work entry, not in a blog post, not in
anything emailed to a client or prospect. Three reasons, and the first one has already bitten
us on a client hub: such links are usually private to whoever made them, so the reader meets a
login wall for an account they do not have; they can be revoked or expire, and nothing in this
repository would notice; and they tell someone buying the result how the work was made.

If the thing is worth showing, bring it into the repository and serve it from our own domain.
The client hub repo has the same rule with a test enforcing it — see "Never link a client to a
tool we used" in its `CLAUDE.md`.
