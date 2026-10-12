# Metrics and stats

This page covers what the site is measured against, how each measure maps to tracked events, and how often to look. For the event plumbing, see [`analytics.md`](analytics.md).

**Source of truth:** `docs/site-system.yaml` → `keystone_metrics`, `page_inventory[].metric`, `conversion_flow`, `analytics`.

No numbers are stored in this repository. It's public, and figures go stale the day they're written. The live data is in PostHog (project at `us.posthog.com`, ingested through `g.arts-link.com`), Formspree, and Cloudflare Workers analytics.

## Keystone metrics

| | Metric | Where it's measured |
|---|---|---|
| **Primary** | New clients onboarded | Outside the site: Ben's records. The site's job is to feed it. |
| **Secondary** | Revenue | Outside the site. |
| **Site proxy** | Contact form submissions | `Contact Form Submit` in PostHog, cross-checked against Formspree received count |

Every page has to move someone toward a contact submission or justify itself some other way. That's the [Web Systems Adventure Mode](web-systems-adventure-mode.md) discipline.

## Page metrics → events

| Page (type) | Metric from `site-system.yaml` | Measure it with |
|---|---|---|
| Home (Collector/Converter) | CTA click-through to Contact | `CTA Click` on `/` broken down by `location` (hero, header, cta-block, footer) |
| Work (Collector) | Contact visits from Work | Paths: `/work/*` → `/contact/` |
| Services (Collector) | Contact visits from Services | Paths: `/services/` → `/contact/` |
| Contact (Converter) | Form completions | `Contact Form Submit` ÷ `$pageview` on `/contact/` |
| Blog (Collector) | Organic traffic; % routed to Contact | `$pageview` on `/blog/*` by referring domain; `CTA Click` on `/blog/*` |
| Archive worksheet (Converter) | Worksheet completions | `Archive Worksheet Submit` |
| Home → Studio notes | Secondary path uptake | `Blog Callout Click` (`location: home`) |

## Funnels

These come from `site-system.yaml` → `analytics.funnel_definition`. Build them as session-based funnels in PostHog:

1. **Core:** Home → Work or Services → Contact → `Contact Form Submit`
2. **Studio notes:** Home → `Blog Callout Click` → blog post → Contact → `Contact Form Submit`
3. **Organic blog:** blog post (entry from search) → `CTA Click` → `Contact Form Submit`

Dashboard recipes are in [`analytics.md`](analytics.md#recommended-posthog-dashboards).

## Caveats when reading the numbers

- **Preview deployments report into production PostHog** until [arts-link/arts-link.com#59](https://github.com/arts-link/arts-link.com/issues/59) is fixed. Exclude `$host` matching `*.workers.dev`.
- **Ben's own visits** count unless they're filtered out. Use PostHog's internal/test user filtering.
- A **`Contact Form Submit` event is an attempt**, not a delivered message. Formspree is the record of what arrived.
- Volume is low: a boutique studio, a handful of conversions a month. Read trends over quarters, not days, and treat single-digit swings as noise.

## Cadence

| When | Look at |
|---|---|
| Monthly | Contact submissions vs Formspree; top pages; CTA location breakdown |
| Quarterly | The three funnels; blog organic growth; whether each page still earns its place (`page_inventory`) |
| After a launch or redesign | The before/after funnel for the affected page, split at the deploy annotation PostHog draws for that commit; social card unfurls in iMessage, Slack and X |

Take decisions that come out of a review (cutting a page, moving a CTA) back into `site-system.yaml`.
