# Analytics — arts-link.com

## Architecture

Two-tier setup:

1. **PostHog SDK** — handles pageviews, session replay, autocapture, and receives custom events. Loaded production-only via inline `<script>` in `baseof.html`. Traffic routed through a reverse proxy at `g.arts-link.com` (avoids ad-blocker interference).

2. **Custom event layer** — `static/js/analytics.js` listens for `data-track-event` and `data-track-form` HTML attributes and calls `posthog.capture()`. Swapping analytics platforms requires changing only the `sendEvent()` function in that file.

**Config:**
- API key + proxy host: `config/production/hugo.toml` → `[params]`
- PostHog project: `https://us.posthog.com`
- `person_profiles: 'identified_only'` — no anonymous profiles created
- Vercel preview deployments are filtered via `before_send` (no noise from CI)
- `preconnect` + `dns-prefetch` hints for `posthog_host` added early in `<head>` (see below)

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
| `Contact Form Submit` | `layouts/partials/modules/contact-form.html` | _(none)_ |

PostHog also captures `$pageview` automatically on every page load.

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

### 3. Blog Funnel (Writing → Contact)

**Insights → Funnels**

Steps (session-based):
1. `$pageview` where `$current_url` contains `/blog/`
2. `CTA Click`
3. `Contact Form Submit`

Measures whether the Writing section is actually routing people into the conversion funnel. This is the primary metric for the blog Collector layer.

---

### 4. Top Pages

**Insights → Trends**

- Event: `$pageview`
- Breakdown by: `$current_url`
- Chart type: Table

Quick view of which pages get the most traffic. Filter date range to last 30 days for a useful baseline.

---

### 5. Writing Section Traffic

**Insights → Trends**

- Event: `$pageview`
- Filter: `$current_url` contains `/blog/`
- Chart type: Line (weekly)

Tracks whether the Writing section is growing organic traffic over time. Should increase as more posts are published and indexed.

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
