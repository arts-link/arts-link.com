# AGENTS.md

Guidance for coding agents (Claude Code, Codex, and anything else that reads this file) working in this repository. `CLAUDE.md` imports this file; this is the single copy. Long-form explanations live in [`docs/`](docs/README.md) — this file holds what you need on every task and points at the rest.

## Project Overview

Arts-link.com is the marketing site for Arts-Link, Ben Strawbridge's boutique web studio, which builds bespoke portfolio sites for artists and bands. The studio isn't tied to one stack — client work spans Hugo, Astro, and other static builds, chosen per project.

This site is built with Hugo, Tailwind CSS, and Alpine.js. It has **no theme** — every template lives in the root `layouts/` directory. ("Ryder" is the open source Hugo theme Arts-Link maintains at [github.com/arts-link/ryder](https://github.com/arts-link/ryder); it is a separate repository and is *not* used to build this site. It appears here only as a portfolio entry and a blog post.)

The private client hub (`clients.arts-link.com`) is a **separate private repository**, `arts-link/clients.arts-link.com`. None of it belongs here — see [`docs/client-hub-boundary.md`](docs/client-hub-boundary.md).

## Site Strategy

The authoritative strategy document is `docs/site-system.yaml`: keystone metrics, positioning, page inventory, services, nav, conversion flow, content model, and analytics plan. **Keep it up to date** — when pages are added, removed, or repurposed, update `page_inventory` and `pages_cut`; when services, positioning, or the conversion flow change, update those sections. It is the source of truth for *why* the site is structured the way it is; the code reflects it.

The strategy follows the framework in `docs/web-systems-adventure-mode.md`. Refer to it when making structural decisions about pages, modules, or navigation.

## Development Commands

```bash
npm ci                          # install (postinstall copies Alpine into static/js/)
hugo server                     # local dev server
hugo --minify                   # production build into public/
hugo --minify && npm test       # tests read public/ — build first or smoke tests skip silently
hugo --minify && npm run og     # regenerate social cards (commit static/og/ + data/og/manifest.json)
npm run og:check                # fail if any card is missing or stale (what CI runs)
npm run cf:build                # build the way Workers Builds does
npm run cf:dev                  # serve on the real Workers runtime — the only way to check
                                # trailing-slash redirects and the 404 status
npm run cf:deploy               # manual deploy (normally Workers Builds deploys on merge)
```

## Architecture in Brief

Detail: [`docs/architecture.md`](docs/architecture.md).

- **Templates** — no theme. `layouts/_default/baseof.html` is the page shell; section directories (`layouts/work/`, `layouts/blog/`, …) provide `list.html` / `single.html`. Reusable blocks live in `layouts/partials/modules/` — **check there before writing new markup**.
- **CSS** — Tailwind via PostCSS (`postcss-import` → `tailwindcss` → `autoprefixer`). Tailwind scans `layouts/**/*.html` and `hugo_stats.json` (emitted because `[build] writeStats = true`). The compiled CSS is **inlined** into a `<style>` tag in `baseof.html`.
- **JS** — Alpine.js, no bundler. `static/js/alpine.min.js` is copied from `node_modules` by `postinstall`. `static/js/analytics.js` is the event layer.
- **Config** — `config/_default/` everywhere; `config/production/` sets the production `title` and the PostHog `posthog_key` / `posthog_host`. The PostHog snippet is gated on `hugo.Environment == "production"`.
- **Content** — work entries are page bundles in `content/work/` (`index.md` + `screenshot.*`). Front-matter fields are defined in `docs/site-system.yaml` (`content_model.work_entries`) and explained in [`docs/content-model.md`](docs/content-model.md).
- **Descriptions** — `layouts/partials/page-description.html` feeds meta, OG, Twitter, and the social card. Authored `description` wins. A smoke test fails if two indexable pages share one.
- **Social cards** — every page gets a committed 1200×630 card rendered from the `ogcard` output format. See [`docs/social-cards.md`](docs/social-cards.md).
- **Deployment** — Cloudflare Workers (assets-only), deployed by Workers Builds. See [`docs/deployment.md`](docs/deployment.md).

## Rules That Bite

These are the things that have caused real problems or fail silently. Each links to the full reasoning.

1. **Never write `dark:` utilities.** They silently never apply — `darkMode: 'class'` is vestigial. Dark is the default on `:root`; light is opt-in on `html.light`. A new color needs a `--color-*` variable in **both** blocks of `assets/css/main.css` plus a `rgb(var(…) / <alpha-value>)` entry in `tailwind.config.js`. → [`docs/design-system.md`](docs/design-system.md)
2. **Never hardcode the domain** in `layouts/`. Every absolute URL resolves against `baseURL`; preview builds depend on it. → [`docs/deployment.md`](docs/deployment.md)
3. **Social cards are committed.** After adding or retitling a page, run `hugo --minify && npm run og` and commit `static/og/` + `data/og/manifest.json`. CI fails on a stale card. Judge card redesigns at 300–500px wide, not 1200px. → [`docs/social-cards.md`](docs/social-cards.md)
4. **A PR should show three checks, not two**: `test`, plus **`Workers Builds: arts-link-com`**. If the Workers check is absent, the deploy isn't wired up and `main` will move without production. After a merge that matters, confirm the new version in the Cloudflare dashboard. → [`docs/deployment.md`](docs/deployment.md)
5. **Write a `description`** whenever the derived one is weak; duplicates fail the smoke test. → [`docs/content-model.md`](docs/content-model.md)
6. **Nothing from the client hub comes into this repo** — no client data, pricing, proposals, or hub code. This repository is public. → [`docs/client-hub-boundary.md`](docs/client-hub-boundary.md)
7. **Analytics events are attributes, not code.** Add `data-track-event` / `data-track-form`; add the event to the inventory in `docs/analytics.md`. → [`docs/analytics.md`](docs/analytics.md)

## Copywriting Rules

Full guide: [`docs/writing-style.md`](docs/writing-style.md).

**Don't let technology define the offering.** Arts-Link is a web studio, not a Hugo shop. On positioning surfaces — hero copy, taglines, service descriptions, page descriptions, meta and OG text — sell the outcome (fast, beautiful, accessible, yours to own), never a stack.

**Naming the stack is fine when it's the subject.** Case studies, work entries, and blog posts describe specific projects; say Hugo when it's Hugo, Astro when it's Astro. Rule of thumb: technology in the *body* of a project story, yes; technology in the *pitch*, no.

**Never link to the working surface of a tool we used.** No `claude.ai` artifact, shared chat, scratch document or notebook — not in a work entry, blog post, or anything sent to a client. Such links are usually private to their maker, can expire silently, and show a buyer how the sausage is made. If it's worth showing, bring it into the repository and serve it from our own domain.

## Keeping Docs Current

When you change how something works, update the matching page in `docs/` — and `docs/site-system.yaml` if it touches strategy, pages, or the content model — **in the same PR**. Stale items noticed but not fixed go in [`docs/known-debt.md`](docs/known-debt.md).

## Docs Map

| Page | Covers |
|---|---|
| [`docs/README.md`](docs/README.md) | Index, which doc is authoritative for what, how to write docs here |
| [`docs/site-system.yaml`](docs/site-system.yaml) | Strategy: metrics, positioning, pages, nav, conversion, content model |
| [`docs/web-systems-adventure-mode.md`](docs/web-systems-adventure-mode.md) | The planning framework the strategy follows |
| [`docs/architecture.md`](docs/architecture.md) | Templates, CSS pipeline, JS, config, output formats |
| [`docs/content-model.md`](docs/content-model.md) | Sections, front matter, descriptions, adding work and posts |
| [`docs/design-system.md`](docs/design-system.md) | Tokens, theming, type, modules, Claude Design source |
| [`docs/writing-style.md`](docs/writing-style.md) | Voice, copy rules, descriptions, story structure |
| [`docs/social-cards.md`](docs/social-cards.md) | OG card pipeline and legibility rules |
| [`docs/deployment.md`](docs/deployment.md) | Cloudflare Workers, Workers Builds, previews, robots, DNS |
| [`docs/ci-and-testing.md`](docs/ci-and-testing.md) | Workflows and what each test asserts |
| [`docs/analytics.md`](docs/analytics.md) | PostHog setup, event inventory, dashboards |
| [`docs/metrics-and-stats.md`](docs/metrics-and-stats.md) | Keystone metrics, funnels, review cadence |
| [`docs/client-hub-boundary.md`](docs/client-hub-boundary.md) | What lives in the hub repo and must stay out of this one |
| [`docs/known-debt.md`](docs/known-debt.md) | Stale code and copy found but not yet fixed |
