# Design system

This page covers the visual language of arts-link.com: color tokens, theming, type, motion, and the module catalogue. It also explains how the code relates to the Claude Design project the system was designed in.

**Source of truth:** `assets/css/main.css` (tokens, fonts, utilities), `tailwind.config.js`, `layouts/partials/modules/`, `static/fonts/`, `static/brand/`.

The code is the source of truth for what ships. The Claude Design project is where the system is explored and documented visually. Its written guidance is imported into `docs/design-system/source/` (see [Claude Design source](#claude-design-source)). Where the two disagree, the [drift table](#drift-design-vs-code) records it.

## Color tokens

Colors are CSS custom properties holding **space-separated RGB triplets**. Tailwind wraps each one as `rgb(var(--color-…) / <alpha-value>)`, so opacity modifiers like `text-cream/50` work.

| Token | Tailwind | Dark (default, `:root`) | Light (`html.light`) | Role |
|---|---|---|---|---|
| `--color-ink` | `ink` | `20 18 16` (#141210) | `247 243 236` (#F7F3EC) | page background |
| `--color-ink-light` | `ink-light` | `30 27 24` (#1E1B18) | `237 231 220` (#EDE7DC) | raised surfaces, cards |
| `--color-cream` | `cream` | `245 240 232` (#F5F0E8) | `26 23 20` (#1A1714) | text, rules (`cream/10` borders) |
| `--color-ember` | `ember` | `196 80 42` (#C4502A) | same | accent: eyebrows, links, selection, the card's bottom bar |
| `--color-ember-light` | `ember-light` | `212 98 46` (#D4622E) | same | accent hover |

The names describe their role in the **dark** theme. In light mode `ink` is the pale paper and `cream` the dark text, so read them as "background" and "foreground", not as literal colors.

Text opacity steps used across templates: `cream` (headings), `cream/60` (body), `cream/50` (secondary), `cream/40`–`/35` (meta). Social cards never go below `cream/65`; see [`social-cards.md`](social-cards.md).

## Theming

- **Dark is the default**, defined on `:root`. **Light is opt-in**, defined on `html.light`.
- An inline script at the top of `baseof.html` adds `light` before first paint from `localStorage.theme`. The Alpine toggle in `layouts/partials/footer.html` flips it and briefly adds `html.theme-transitioning` for a 0.35s color crossfade.
- **Never write `dark:` utilities.** `darkMode: 'class'` is vestigial and nothing adds `.dark`, so they silently never apply. There are none in the codebase.
- The archive worksheet is pinned to the light palette, because it is meant to read like a paper document.

### Adding a color

1. Add `--color-<name>` to **both** the `:root` and `html.light` blocks in `assets/css/main.css`.
2. Register it in `tailwind.config.js` as `'rgb(var(--color-<name>) / <alpha-value>)'`.
3. Check it in both themes and on a social card.

Anything built from the existing `ink` / `cream` / `ember` tokens adapts to both themes with no extra work, so prefer those.

## Type

| Role | Family | Tailwind | Weights shipped | Usage |
|---|---|---|---|---|
| Display | **Fraunces** (variable, normal + italic) | `font-display` | 300–700 | `h1`–`h4`, usually `font-light`; italic for emphasis |
| Body | **DM Sans** (variable) | `font-body` (also the `body` default) | 300–500 | everything else |

- The fonts are self-hosted woff2 in `static/fonts/`, subset to `latin` and `latin-ext`, with one variable file per subset. The source TTFs are in `static/fonts/DM_Sans/` and `static/fonts/Fraunces/`.
- The three `latin` files are `<link rel="preload">`ed in `baseof.html`. Fraunces `latin` uses `font-display: optional`, so it never causes layout shift; everything else uses `swap`.
- Eyebrows are `text-ember text-xs tracking-[0.3em] uppercase`.
- Headings run large and light: `font-display text-5xl md:text-7xl font-light` is the CTA and thanks pattern.
- `@tailwindcss/typography` (`prose`) styles long-form content.

## Layout and motion

- Content width is `max-w-6xl mx-auto px-6`. Sections are separated by `border-t border-cream/10` and spaced with `py-24`/`py-32`.
- Breakpoints are Tailwind defaults plus `xs: 475px`.
- `.grain` is a fixed SVG film-grain overlay at 4% opacity on every page.
- `.animate-hero` with `.delay-100` … `.delay-700` gives a staggered fade-up on the hero.
- `.card-hover` gives the project card its lift.

## Modules

These live in `layouts/partials/modules/`. Check here before writing new markup.

| Module | Used on | Notes |
|---|---|---|
| `hero.html` | Home | Eyebrow, headline, sub, and a CTA (`CTA Click`, `location: hero`). |
| `project-card.html` | Home, Work | Screenshot, name, type badge (rescue / open source), `client_type`, live link, and "Read story" when `case_study`. Accepts a page or `dict "page" . "sizes" "…"`. |
| `service-block.html` | Home, Services | "What I build": New Site and Site Rescue. |
| `pricing-section.html` | Services | "What it costs": Artist Site and Band/Musician Site, from $1,000. |
| `latest-post.html` | Home | Studio notes callout for the newest post. Hides itself when there are no posts. |
| `cta-block.html` | Home, Work (list + entries), Services, Blog (list + posts) | The "Ready to talk?" strip. Always `location: cta-block`; segment by page URL in PostHog. |
| `contact-form.html` | Contact | Formspree with name, email and project, plus `data-track-form="Contact Form Submit"`. |

Utility layout: `layouts/thanks/list.html`, an eyebrow, heading, body and one link, reused through `type = "thanks"`.

## Brand assets

- `static/brand/arts-link-cream.png` and `static/brand/arts-link-ink.png` are the wordmark for dark and light grounds.
- `static/images/logo/` holds the color logo. `layouts/partials/logo.html` is the inline header logo.
- `static/favicon.svg` and `static/favicon.ico`.
- `static/images/og-default.jpg` is the fallback social card.

## Claude Design source

The system is also maintained as a Claude Design project. Only its **written guidance** belongs in this repository, under `docs/design-system/source/`: the handoff `readme.md` / `SKILL.md`, covering voice, visual foundations, the component list, and the American English / US-dollar conventions. `MANIFEST.md` there records what was left out.

**Generated files stay out**: `_ds_bundle.js`, token CSS, prototype HTML. Committing them would put a second copy of the palette next to `assets/css/main.css` and `tailwind.config.js`, and the two would drift.

Rules:
- **Don't link to the Claude Design project** from the site, from client material, or from anywhere a reader would follow it. It's a tool's working surface, so it's private to its owner and can be revoked (see the copywriting rules in `AGENTS.md`). The imported guidance in this repo is the shareable record.
- When the design project changes, re-export the guidance and update the drift table below in the same PR.
- Token changes go into `assets/css/main.css` and `tailwind.config.js`, never into `source/`. The build never reads that folder.

## Drift: design vs code

Record any place where the Claude Design project and the shipped CSS disagree, along with which one should move.

| Item | Design project | Code | Resolution |
|---|---|---|---|
| _none recorded yet_ | | | |
