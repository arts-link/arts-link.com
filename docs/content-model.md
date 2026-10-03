# Content model

This page covers what lives in `content/`, the front matter each kind of page uses, and how page descriptions are derived.

**Source of truth:** `docs/site-system.yaml` (`page_inventory`, `pages_cut`, `content_model`), `content/`, `archetypes/`, `layouts/partials/page-description.html`.

## Sections

| Path | Rendered? | Layout | Notes |
|---|---|---|---|
| `content/_index.md` | ✅ `/` | `layouts/index.html` | Module order is set in `site-system.yaml` → Home. |
| `content/work/` | ✅ | `layouts/work/` | Page bundles, one per project (see below). |
| `content/blog/` | ✅ | `layouts/blog/` | Posts, either single files or bundles with images. Each ends in a CTA block. |
| `content/services/_index.md` | ✅ | `layouts/services/list.html` | New Site, Site Rescue, and "What it costs". |
| `content/contact/_index.md` | ✅ | `layouts/contact/list.html` | Converter page. One job, minimal form. |
| `content/thanks/` | ✅ | `layouts/thanks/list.html` | The Formspree landing page. |
| `content/archive-worksheet/` | ✅ (not in nav) | own `baseof` | Family archive intake. Soft launch, linked only from the family archive post. |
| `content/client-hub/_index.md` | ✅ (not in nav) | `type = "thanks"` | Where Cloudflare Access sends people it refuses. Deliberately does **not** link to the hub; see its comments. |
| `content/about/`, `features/`, `resources/`, `draft-proposals/` | ❌ | — | `_build` cascade with `render = "never"`. Listed under `pages_cut`. |
| `content/domain-names/` | ❌ | — | `draft = true`. The footer links to the external domain store instead. |

To retire a section, add the same `[cascade._build] render = "never", list = "never"` block to its `_index.md` and move it to `pages_cut` in `site-system.yaml`. Don't leave pages half-public.

## Work entries

Each work entry is a page bundle: `content/work/<slug>/index.md` plus one `screenshot.*` image. `.Resources.GetMatch` picks the screenshot up for the card, the entry page and the social card.

```toml
title = "Verdèzul"
date = 2026-07-24
client_type = "band"          # lowercase, free text, printed verbatim (CSS capitalizes it on card/page, llms.txt doesn't)
site_type = "new"             # new | rescue | open-source → drives the badge and the derived description
live_url = "https://..."      # the hosted site (or demo, for open-source entries)
repo_url = "https://..."      # optional; renders next to live_url
live_label = "..."            # optional; overrides "Visit the live site ↗" / "View the live demo ↗"
designer = "..."              # optional; adds a prose credit under the screenshot
designer_url = "https://..."  # optional; links the designer's name
description = "..."           # strongly recommended; see below
case_study = true             # enables the "Read story" link to the full page
weight = 1                    # ascending sort on /work/; the lowest 3 also feature on the homepage
```

`client_type` vocabulary in use: visual artist, band, photographer, family archive, travel archive, open source theme, open source tool, tutoring / education, other. It is a convention, not a constraint. `site-system.yaml` (`content_model.work_entries`) is the authority on these fields, so update it when they change.

Open-source projects (Ryder, Screenshot-a-Day) use `site_type = "open-source"`. They are badged so they read as contributions to the ecosystem, not as client work.

### Adding a work entry

1. Create `content/work/<slug>/index.md` with the fields above, and add `screenshot.png` (or `.jpg`/`.webp`) next to it.
2. Write a `description` in the house voice (see [`writing-style.md`](writing-style.md)).
3. Pick a `weight`. Entries 1–3 are on the homepage, so only take one of those slots on purpose.
4. Run `npm run build && npm run og`, then commit the new card in `static/og/work/<slug>.jpg` and `data/og/manifest.json`.
5. Run `npm test`.
6. If it changes the portfolio story, update `page_inventory` → Work in `site-system.yaml`.

## Blog posts

`hugo new blog/<slug>.md` uses `archetypes/blog.md`, which gives you a title, date, `draft = true` and an empty `description`. Use a bundle (`content/blog/<slug>/index.md` plus images) when the post has figures, and the built-in `{{< figure >}}` shortcode with real alt text.

Every post:
- has its own `description`
- ends with a route to Contact (the CTA block is in `layouts/blog/single.html`)
- gets an entry in `site-system.yaml` → `page_inventory` → Blog notes, explaining why it exists
- gets its social card committed

The homepage "Studio notes" callout (`layouts/partials/modules/latest-post.html`) automatically shows the newest post.

## Page descriptions

`layouts/partials/page-description.html` returns one string, which is used for `meta description`, `og:description`, `twitter:description` and the social card. In order of preference:

1. front matter `description`, passed through untouched with no truncation
2. the page `.Summary`, plainified and trimmed to 160 characters
3. for a work entry with no body, a line built from its front matter, e.g. "A site rescue for X, rebuilt and migrated by Arts-Link — live at x.com."
4. `.Site.Params.description`

`tests/smoke.test.js` **fails if any two indexable pages share a description**. Write a `description` whenever the derived one is weak.
