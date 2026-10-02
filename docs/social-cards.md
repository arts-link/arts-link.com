# Social cards

This page covers how every page gets its own 1200×630 Open Graph image, and how to change the design without making it unreadable where people actually see it.

**Source of truth:** `layouts/partials/og-card.html` (the design, and the only file to edit for a redesign), `layouts/partials/og-card-shell.html`, `layouts/_default/baseof.ogcard.html`, `scripts/og-images.mjs`, `data/og/manifest.json`, `static/og/`, and `site-system.yaml` → `social_cards`.

## Pipeline

1. The `ogcard` output format (`config/_default/hugo.toml`) renders every home, section and page a second time, at `<page>/og.html`.
2. That page uses the site's own CSS, so the card gets the real `ink`/`cream`/`ember` tokens and the self-hosted fonts.
3. `scripts/og-images.mjs` screenshots each `og.html` with Playwright Chromium into `static/og/<page-path>.jpg` (home is `static/og/home.jpg`).
4. `baseof.html` points `og:image` and `twitter:image` at the card when its key is in `data/og/manifest.json`, and otherwise falls back to `static/images/og-default.jpg`. A missing card is never a broken preview.

`baseof.ogcard.html` deliberately has no `{{ block "main" }}`; read the comment in that file before you "fix" it. `layouts/archive-worksheet/` has its own `baseof.ogcard.html`.

## Committed, not built at deploy time

Cards are **committed**, and nothing renders at deploy.

```bash
hugo --minify && npm run og      # renders only cards whose source changed
git add static/og data/og/manifest.json
```

The manifest stores, per page, a hash of the card markup (with inlined `<style>` stripped) plus a hash of the global styling inputs. Only real changes re-render: title, description, section, screenshot, template, palette or fonts. On most PRs `npm run og` does nothing.

CI runs `npm run og:check`, which fails on a missing or stale card without launching a browser. If you have no local Chromium, run the **Regenerate social cards** workflow (`og-cards.yml`) on your branch from the Actions tab.

## What's on a card

- the Arts-Link wordmark, top left
- a section eyebrow in ember (Work, Studio Notes, …), with `client_type` appended on work entries; section listings get none
- a site-type badge, top right, on rescue and open-source entries
- the title in Fraunces, sized down in tiers as it gets longer
- the description, only on cards without a screenshot
- the project screenshot on work entries, bled off the right edge
- a footer with `arts-link.com`, plus the tagline when there's no screenshot
- a solid ember bar along the bottom

## Designed to be read small

Link unfurls show the card at about **300px** (iMessage), **360px** (Slack) or **500px** (X) wide, a 2–4× downsample. So:

- no type below **~27px** at 1200px
- the display face at **`font-medium`** (500), not the site's usual `font-light`, because thin strokes vanish when scaled down
- text at **`cream/65` or above**
- restrained letter-spacing on small caps
- the ember bar carries the brand when no type survives at all

**Judge a redesign at 300–500px wide, never at 1200px**, where everything looks fine. Preview it live during `hugo server` at `localhost:1313/work/rt2026/og.html`, then shrink the window or zoom out.
