# Analytics — arts-link.com

This page covers how events get from the page to PostHog, what is tracked, and how to add more. For what the numbers *mean*, and which ones matter, see [`metrics-and-stats.md`](metrics-and-stats.md).

**Source of truth:** `static/js/analytics.js`, the PostHog block in `layouts/_default/baseof.html`, `config/production/hugo.toml`, `tests/analytics.test.js`.

## Architecture

Two-tier setup:

1. **PostHog SDK** — handles pageviews, session replay, autocapture, and receives custom events. Loaded production-only via inline `<script>` in `baseof.html`. Traffic routed through a reverse proxy at `g.arts-link.com` (avoids ad-blocker interference).

2. **Custom event layer** — `static/js/analytics.js` listens for `data-track-event` and `data-track-form` HTML attributes and calls `posthog.capture()`. Swapping analytics platforms requires changing only the `sendEvent()` function in that file.

**Config:**
- API key + proxy host: `config/production/hugo.toml` → `[params]`
- PostHog project: `https://us.posthog.com`
- `person_profiles: 'identified_only'` — no anonymous profiles created
- `preconnect` + `dns-prefetch` hints for `posthog_host` added early in `<head>` (see below)
- Both the snippet and the hints are gated on `hugo.Environment == "production"` **and** `not $preview`. Workers Builds previews build in the production environment too, so the environment check alone would send every PR click-through into the live dataset ([#59](https://github.com/arts-link/arts-link.com/issues/59)). `tests/cloudflare.test.js` asserts a preview build has no PostHog and a production build does. Data captured from previews before the fix can be excluded by host (`$host` ending in `workers.dev`).
- `npm run dev` runs in the development environment, so local browsing sends nothing.

### Deploy annotations

Every successful production deploy leaves an annotation on the project's charts, `arts-link.com production deploy @ <SHA> · <commit subject> · <commit link>`, so a change in traffic or conversions can be lined up against what shipped. It comes from `.github/workflows/posthog-deploy-annotation.yml` and uses a CI-only Personal API Key (`POSTHOG_CI_API_KEY`). That key is a different thing from the public `posthog_key` above and must never reach the build. PostHog releases were evaluated and not enabled, because the site has no Error Tracking or source maps to attach them to. Setup, verification and rotation are in [`runbooks/posthog-deploy-tracking.md`](runbooks/posthog-deploy-tracking.md).

### Adding a new third-party origin

For any external origin that loads resources (scripts, fonts, APIs), add a connection hint pair early in `baseof.html`, before the font preloads:

```html
<link rel="preconnect" href="https://third-party-origin.com">
<link rel="dns-prefetch" href="https://third-party-origin.com">
```

`preconnect` opens DNS + TCP + TLS upfront so the connection is warm when the resource is actually requested. `dns-prefetch` is the lighter fallback for browsers that don't support `preconnect`. Both together is the standard pattern. Order matters — place these before CSS and font preloads so they resolve in parallel with critical resources.

---

## Custom Events Inventory

These are the events fired by the `data-track-*` attribute system. They appear in PostHog under "Custom events" (distinct from autocaptured `$click` events).

| Event name | Source file | Props |
|---|---|---|
| `CTA Click` | `layouts/partials/header.html` (desktop) | `{location: "header"}` |
| `CTA Click` | `layouts/partials/header.html` (mobile) | `{location: "header-mobile"}` |
| `CTA Click` | `layouts/partials/modules/hero.html` | `{location: "hero"}` |
| `CTA Click` | `layouts/partials/modules/cta-block.html` | `{location: "cta-block"}` |
| `CTA Click` | `layouts/partials/footer.html` | `{location: "footer"}` |
| `Blog Callout Click` | `layouts/partials/modules/latest-post.html` (title, description and "Read" links) | `{location: "home"}` |
| `Contact Form Submit` | `layouts/partials/modules/contact-form.html` | _(none)_ |
| `Archive Worksheet Submit` | `layouts/archive-worksheet/list.html` | _(none)_ |

PostHog also captures `$pageview` automatically on every page load.

`cta-block.html` is rendered on Home, Work, Services and every Blog page, and always reports `location: "cta-block"`. To tell a blog-post CTA from a homepage one, break down by `$pathname` (or filter `$current_url` contains `/blog/`). Don't expect a `blog-post` location value; none is emitted.

A form `submit` event fires when the browser submits, before Formspree validates anything. Treat it as an attempted submission. Formspree's own dashboard is the record of what was actually received.

---

## Verifying Events Are Firing

1. Go to **Activity** in PostHog (`us.posthog.com/project/.../activity`)
2. In the filter bar, type `CTA Click` — this filters the feed to custom events only (ignores autocapture noise)
3. On the live site, click any "Let's talk" or "Get in touch" button
4. The event should appear in the feed within 2–5 seconds with a `location` property

If you see autocapture events ("clicked button", "$click") but not "CTA Click", the PostHog stub isn't initializing before the click — check that the `<script>` block in `baseof.html` is running synchronously (no idle callback wrapper).

---

## Recommended PostHog Dashboards

### 1. Conversion Funnel

**Insights → Funnels**

Steps (session-based):
1. `$pageview` — any page (entry)
2. `CTA Click` — any location
3. `Contact Form Submit`

This shows the core conversion path. Look at drop-off between step 2 and step 3 — that gap is the contact form doing or failing its job.

---

### 2. CTA Breakdown by Location

**Insights → Trends**

- Event: `CTA Click`
- Breakdown by: `location` property
- Chart type: Bar

Shows which CTA placement drives the most clicks — hero vs. footer vs. cta-block vs. header. Use this to decide where to invest design effort.

---

### 3. Blog Funnel (Blog → Contact)

**Insights → Funnels**

Steps (session-based):
1. `$pageview` where `$current_url` contains `/blog/`
2. `CTA Click`
3. `Contact Form Submit`

Measures whether the Blog section is actually routing people into the conversion funnel. This is the primary metric for the blog Collector layer.

---

### 4. Top Pages

**Insights → Trends**

- Event: `$pageview`
- Breakdown by: `$current_url`
- Chart type: Table

Quick view of which pages get the most traffic. Filter date range to last 30 days for a useful baseline.

---

### 5. Blog Section Traffic

**Insights → Trends**

- Event: `$pageview`
- Filter: `$current_url` contains `/blog/`
- Chart type: Line (weekly)

Tracks whether the Blog section is growing organic traffic over time. Should increase as more posts are published and indexed.

---

## Adding a New Event

Add `data-track-event="Event Name"` to any HTML element. On click, the event fires to PostHog. To include properties, add `data-track-props='{"key":"value"}'` (valid JSON, single-quoted attribute):

```html
<a
  href="/contact/"
  data-track-event="CTA Click"
  data-track-props='{"location":"services-inline"}'
>
  Get in touch
</a>
```

For form submissions, use `data-track-form` on the `<form>` element:

```html
<form action="..." data-track-form="Contact Form Submit">
```

No JavaScript changes needed — `analytics.js` picks up any element with these attributes automatically.

Then, in the same PR:
1. Add a row to the **Custom Events Inventory** above.
2. If the event feeds a funnel or keystone metric, update [`metrics-and-stats.md`](metrics-and-stats.md) and `analytics` in `docs/site-system.yaml`.
3. Reuse existing event names and vary `location`, rather than inventing a new name for every placement. `CTA Click` is one event with many locations.
