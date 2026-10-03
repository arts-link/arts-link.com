# CI and testing

This page covers what runs on every push, what each test asserts, and how to reproduce failures locally.

**Source of truth:** `.github/workflows/`, `tests/`, `vitest.config.js`, `scripts/og-images.mjs`.

## Workflows

| Workflow | Trigger | Does |
|---|---|---|
| `test.yml` (**`test`** check) | push to `main`, every PR | `npm ci` → `npm run build` → `npm run og:check` → `npm test`, on the Hugo in `.hugo-version` (via `scripts/hugo.sh`; no workflow installs its own). Skips the Playwright browser download. |
| `og-cards.yml` | manual | Builds the site, renders stale social cards with Chromium, and commits `static/og/` + `data/og/` to the branch it runs on. For when you have no local Chromium. |
| `posthog-deploy-annotation.yml` | `check_run` completed (runs from `main`'s copy) | When `Workers Builds: arts-link-com` succeeds on a commit on `main`, it creates a deduplicated PostHog deploy annotation. Skips every other check, including previews, and can't fail a deploy. See [`runbooks/posthog-deploy-tracking.md`](runbooks/posthog-deploy-tracking.md). |
| `hugo.yml` | manual | Legacy GitHub Pages deploy. Not production. |
| *Workers Builds* (**`Workers Builds: arts-link-com`** check) | every push, run by Cloudflare rather than GitHub Actions | Builds and deploys. See [`deployment.md`](deployment.md). |

A healthy PR shows **three** checks. Two means the Cloudflare deploy isn't connected.

## Running tests

```bash
npm run build && npm test
```

**Build first.** `tests/smoke.test.js` reads `public/` and **skips itself silently** when the folder is missing, so a "passing" run with no build has tested nothing. Rebuild after changing content or templates too, or the tests read a stale `public/`.

## What each test file asserts

**`tests/smoke.test.js`** checks the built site:
- The homepage exists, its title has the site name, it loads `analytics.js`, and the nav links every top-level page.
- Work, Services and Contact exist with the right titles. The contact form carries `data-track-form`.
- SEO: exactly one `<h1>`, one canonical, and a meta description on each indexable page. **Every description is unique.**
- Every indexable page has **its own** `og:image` card, and `twitter:image` matches `og:image`.
- JSON-LD is present.
- `llms.txt` has a top heading plus Work (at least one project), Services, Blog and Contact sections.
- **Every internal `href` resolves** to a file in `public/`.

**`tests/cloudflare.test.js`** checks the Workers config and the preview model:
- `wrangler.jsonc` has the right name, no `main`, `./public`, `404-page`, `auto-trailing-slash` and `"preview_urls": true`.
- A preview build has no canonical, no `og:url`, no PostHog, has `noindex`, and robots.txt disallows everything with no sitemap.
- A production build keeps canonical and `og:url`, has no `noindex`, allows crawling, lists the sitemap, declares the `Content-Signal`, and still loads PostHog.

**`tests/site-system.test.js`** checks that `docs/site-system.yaml` parses with no errors or warnings (duplicate keys included) and has every top-level section.

**`tests/hugo-version.test.js`** checks that no workflow pins or installs its own Hugo, and that `public/` was built by the version in `.hugo-version`.

**`tests/posthog-deploy.test.js`** checks the deploy-annotation workflow and the CI key:
- It triggers only on a completed check run, and only for a successful `Workers Builds: arts-link-com` on a commit on `main`.
- The PostHog step is `continue-on-error`, has a failure warning, is pinned to a commit SHA, and dedupes on `arts-link.com production deploy @ <SHA>`.
- `POSTHOG_CI_API_KEY` is read only from `secrets`. Neither that name nor a `phx_` Personal API Key appears in `layouts/`, `static/`, `assets/`, `config/`, `content/`, `data/`, `scripts/` or the built `public/`.

**`tests/analytics.test.js`** (jsdom) checks `static/js/analytics.js`:
- A click on `[data-track-event]` captures the right name, and valid JSON props are passed through.
- Invalid JSON props send empty props. A missing `posthog` doesn't throw.
- Several tracked elements work independently. Form submits capture the right event.
- The pre-paint theme script survives `localStorage` being unavailable.

**`npm run og:check`** isn't a vitest test, but it runs in CI. It fails if any page's card is missing or stale against `data/og/manifest.json`. Fix it with `npm run build && npm run og` and commit the result.

## Common failures

| Failure | Usually means |
|---|---|
| Duplicate description | A new page has no `description` and derived the same text as another. Write one. |
| Missing or stale card | A page was added or retitled without `npm run og`. |
| Internal link doesn't resolve | A link points at a cut section (`_build` render never) or is missing its trailing slash. |
| Build stops with a Hugo version error | You ran a bare `hugo` that doesn't match `.hugo-version`. Use `npm run dev` / `npm run build`. |
| Stale card on pages nobody touched | `public/` was built by a different Hugo version. Rebuild with `npm run build`. |
| All smoke tests "pass" in a second | `public/` doesn't exist, so the suite skipped. Build first. |
