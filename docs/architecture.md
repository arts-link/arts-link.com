# Architecture

This page covers how the site is put together: templates, styling, scripts, configuration, and the extra output formats Hugo emits.

**Source of truth:** `layouts/`, `assets/css/main.css`, `tailwind.config.js`, `postcss.config.js`, `config/`, `package.json`.

## Stack

| Layer | Choice | Notes |
|---|---|---|
| Generator | Hugo (CI pins 0.138.0 extended; config requires ≥ 0.116.0) | **No theme.** Every template is in root `layouts/`. |
| CSS | Tailwind 3 via PostCSS | Compiled CSS is inlined into every page. |
| JS | Alpine.js 3, no bundler | Copied from `node_modules` by `postinstall`. |
| Forms | Formspree | IDs in `config/_default/params.toml`. |
| Analytics | PostHog, production only | See [`analytics.md`](analytics.md). |
| Hosting | Cloudflare Workers, assets only | See [`deployment.md`](deployment.md). |

"Ryder" is Arts-Link's open-source Hugo theme, in a separate repository. It is **not** used here. Older docs that mention `themes/ryder` or `ryder-dev` are out of date.

## Templates

```
layouts/
├── _default/
│   ├── baseof.html          page shell: head, meta, OG, JSON-LD, inlined CSS, scripts
│   ├── baseof.ogcard.html   shell for the 1200×630 social card output (no "main" block — see its comment)
│   ├── list.html / single.html
├── index.html               homepage (module order is set in site-system.yaml → Home)
├── index.llmstxt.txt        /llms.txt — plain-text site summary for LLM agents
├── robots.txt               production vs preview robots (see deployment.md)
├── 404.html                 served with a real 404 status by Workers
├── work/                    list.html (card grid, ascending weight) + single.html (entry/case study)
├── blog/                    list.html + single.html
├── services/ contact/ thanks/   list.html each
├── archive-worksheet/       its own baseof + baseof.ogcard: no site chrome, light palette, print-friendly
├── partials/
│   ├── header.html footer.html logo.html
│   ├── page-description.html   one description for meta, OG, Twitter and the card
│   ├── og-card.html og-card-shell.html
│   ├── head/json-ld.html       WebSite + LocalBusiness on home, BreadcrumbList on inner pages
│   └── modules/                reusable blocks: check here before writing markup
└── shortcodes/              cta-button.html, picture.html (both currently empty; see known-debt.md)
```

`layouts/thanks/list.html` is a small **data-driven utility layout**: eyebrow, heading, body, and one link onward. Other pages reuse it by setting `type = "thanks"`; `content/client-hub/_index.md` is one of them. Reuse it before writing a one-off page.

Modules are listed in [`design-system.md`](design-system.md#modules).

## CSS pipeline

`postcss.config.js` runs `postcss-import` → `tailwindcss` → `autoprefixer`. Tailwind finds class names in two places, both configured in `tailwind.config.js`:

1. It scans `layouts/**/*.html` directly.
2. It reads `hugo_stats.json`, which Hugo writes because `[build] writeStats = true` is set in `config/_default/hugo.toml`. This file is gitignored.

`baseof.html` runs `resources.Get "css/main.css" | postCSS | minify` and inlines the result into a `<style>` tag. That means no render-blocking stylesheet and no flash of unstyled content. The tradeoff is that every page carries the whole bundle, so keep it small.

Theming is done with CSS custom properties, not `dark:` utilities. See [`design-system.md`](design-system.md#theming).

## JavaScript

- `static/js/alpine.min.js` is copied there by `npm ci`. Never edit it.
- Alpine components are inline `x-data` blocks in templates. The theme toggle in `layouts/partials/footer.html` is the main one; the mobile nav and image galleries are others.
- An inline script at the top of `<head>` reads `localStorage.theme` and adds `html.light` **before first paint**. It is wrapped in `try` so that blocked storage cannot break the page, and `tests/analytics.test.js` asserts this.
- `static/js/analytics.js` is the event layer. See [`analytics.md`](analytics.md).

## Configuration

| File | Applies | Holds |
|---|---|---|
| `config/_default/hugo.toml` | everywhere | `baseURL` (`https://www.arts-link.com/`), dev title, output formats, `writeStats` |
| `config/_default/params.toml` | everywhere | site `description`, Formspree IDs, author |
| `config/production/hugo.toml` | `hugo` / `hugo --minify` (production is Hugo's default environment for builds) | production `title`, `posthog_key`, `posthog_host` |

The PostHog key is a public project key, the kind that is meant to ship in client-side HTML. It is not a secret.

`HUGO_PARAMS_PREVIEW=true` turns on preview mode: noindex, no canonical, no `og:url`, and a disallow-all robots.txt. Only `scripts/cf-build.sh` sets it, for non-production branches.

## Output formats

Set in `config/_default/hugo.toml`:

| Output | Kinds | File | Purpose |
|---|---|---|---|
| HTML | all | `index.html` | the site |
| RSS | home | `index.xml` | feed |
| `llmstxt` | home | `llms.txt` | plain-text summary for LLM agents; the smoke test checks its sections |
| `ogcard` | home, page, section | `og.html` | the page rendered as a social card; see [`social-cards.md`](social-cards.md) |

Taxonomies are disabled (`disableKinds = ["taxonomy", "term"]`).

## Absolute URLs

Nothing in `layouts/` hardcodes the domain. `og:image`, `og:url`, `canonical`, the JSON-LD `@id`s and the robots.txt sitemap line all resolve against `baseURL`. The GitHub Pages workflow and `PREVIEW_BASE_URL` both depend on this, so keep it that way.
