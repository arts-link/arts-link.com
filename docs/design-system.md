# Design system

This page covers the visual language of arts-link.com: color tokens, theming, type, motion, and the module catalogue. It also explains how the code relates to the Claude Design project the system was designed in.

**Source of truth:** `assets/css/main.css` (tokens, fonts, utilities), `tailwind.config.js`, `layouts/partials/modules/`, `static/fonts/`, `static/brand/`. **Design intent:** [`design-system/source/readme.md`](design-system/source/readme.md). Read it before designing anything new, because it is the long-form version of this page.

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

**Hierarchy comes from opacity on cream, not from new colors.** The design's ladder is:

| Step | Use |
|---|---|
| `cream` (100%) | headings, strong text |
| `cream/55` | body copy |
| `cream/35` | muted: meta, captions |
| `cream/25` | faint |
| `cream/10` | borders, section rules |
| `cream/5` | hairlines (e.g. under the sticky header) |

Use these steps in new work. The templates also contain older in-between values (see [drift](#drift-design-vs-code)). Social cards never go below `cream/65`; see [`social-cards.md`](social-cards.md).

There are **no success, warning or error colors**, because the site has no such states.

A decorative **paint palette** appears only in the painted logo artwork and README badges: green `#65D64F`, orange `#FF5A36`, yellow `#F7E65B`, pink `#F1A7D1`. Never use it for text, borders or UI chrome.

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
| Display | **Fraunces** (variable, normal + italic) | `font-display` | 300–700 | every heading, **always `font-light` (300)**; italic for emphasis and the wordmark. The one exception is social cards (500), for legibility at small sizes. |
| Body | **DM Sans** (variable) | `font-body` (also the `body` default) | 300–500 | everything else |

- The fonts are self-hosted woff2 in `static/fonts/`, subset to `latin` and `latin-ext`, with one variable file per subset. The six woff2 files are Google Fonts' own `latin` and `latin-ext` subsets of the variable fonts (the `unicode-range` values in `main.css` are Google's), saved from the Google Fonts CSS API. They are the only font files the site ships; the OFL texts beside them are the licenses. If a weight or subset is ever needed, fetch it the same way rather than committing the full TTF downloads.
- The three `latin` files are `<link rel="preload">`ed in `baseof.html`. Fraunces `latin` uses `font-display: optional`, so it never causes layout shift; everything else uses `swap`.
- **The signature move** is a wide-tracked uppercase eyebrow (`text-ember text-xs tracking-[0.3em] uppercase`) above a very large light serif heading.
- The hero runs `text-[clamp(3.5rem,9vw,8.5rem)] leading-[0.9]`. The CTA and thanks pattern is `font-display text-5xl md:text-7xl font-light`.
- Body copy is 16–18px at about 1.65 line height.
- **Sentence case** for headings and prose. UPPERCASE is only for tracked micro-labels: eyebrows, nav, badges, buttons.
- There's no third family and no monospace face in the design.
- `@tailwindcss/typography` (`prose`) styles long-form content.

## Layout and surfaces

- Content width is `max-w-6xl mx-auto px-6` (72rem). Long-form reading narrows to 48rem.
- Sections are separated by a full-width `border-t border-cream/10` hairline, which is the page's skeleton. Spacing is coarse and generous: `py-24` between sections and `py-32` around hero and CTA blocks.
- Breakpoints are Tailwind defaults plus `xs: 475px`.
- **Corners are square.** The radius is 0 everywhere except the theme-toggle pill and inline `<code>`. Don't round cards, buttons, inputs or images.
- **Borders do the work shadows usually do.** There are three hairline weights (`cream/5`, `/10`, `/20`) plus ember. Buttons and badges are border-only boxes.
- **Cards come in two shapes, and neither has a shadow at rest:**
  - *Project card*: filled `ink-light`, no border, a 16:9 image well on top and the meta below.
  - *Service or pricing block*: transparent, a 1px `cream/10` border, 40px padding, opened by a **32×2px ember bar**. Use that bar wherever a lesser design would put an icon.
- **Backgrounds are flat: no gradients, ever.** `.grain` adds a fixed SVG film-grain overlay at 4% opacity (`z-index: 9999`). Imagery is limited to real client screenshots and Ben's portrait, with no stock images or illustrations. Captions sit outside images, never on top of them.
- **Fixed elements:** only the 64px sticky header (`bg-ink/95 backdrop-blur-sm`) and the grain. There are no sticky CTAs, floating buttons or cookie bars.

## Motion and states

- **One easing curve:** `cubic-bezier(0.16, 1, 0.3, 1)`.
- The hero fades up 1.5rem over 900ms on a 100 / 250 / 400 / 700ms stagger (`.animate-hero` + `.delay-*`).
- Durations: hover color 200ms, card lift 300ms, image zoom 500ms, theme crossfade 350ms. Nothing bounces, springs or loops.
- **Hovers are color floods, not opacity tricks:**
  - The primary button fills ember.
  - The secondary border turns ember.
  - Links go from `cream/60` to `cream`.
  - A service block's border goes from `cream/10` to `ember/40`.
  - The project card (`.card-hover`) lifts 5px, tilts 0.3° and gains its one heavy shadow, while the screenshot scales to 1.05.
- **There are no press states.** Focus is a 1px ember outline or ring. Disabled is 35% opacity.
- Selection is ember with cream text.

## Iconography and logo

- **There is no icon set; typed glyphs do that job** inside label text:

  | Glyph | Meaning |
  |---|---|
  | `→` | forward or internal action |
  | `↗` | external link |
  | `←` | back |
  | `·` | separator |

- Only three inline SVGs exist: the hamburger and the sun/moon in the theme toggle. If a new icon is unavoidable, use Heroicons (outline at stroke 1.5, solid for tiny marks) in `currentColor`.
- **No emoji, anywhere.**
- **In the product, the mark is type, not an image:** lowercase italic Fraunces `arts-link`, `text-xl` in the header and `text-2xl` in the footer, warming to ember on hover.
- The painted **ARTS-LINK** image wordmark (`static/images/logo/`) is for off-product use: social, README, print. Never recolor, crop or redraw it.

## Modules

These live in `layouts/partials/modules/`. Check here before writing new markup. The design project names the same building blocks as components. Those names are useful vocabulary, but here they are Hugo partials or repeated inline markup, not a component library.

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

| Design component | Where it lives here |
|---|---|
| `Hero`, `ProjectCard`, `ServiceBlock`, `PricingCard`, `CtaBlock`, `ContactForm` | the modules above |
| `SiteHeader`, `SiteFooter`, `ThemeToggle` | `layouts/partials/header.html`, `layouts/partials/footer.html` (the toggle is Alpine, in the footer) |
| `PostListItem` | `layouts/blog/list.html` |
| `PageHeader` | the eyebrow and heading pair that opens Work, Services, Blog and 404, as inline markup |
| `Eyebrow`, `AccentRule` (32×2 ember bar), `Badge` (site-type) | inline markup, repeated |
| `Grain` | `<div class="grain">` in `baseof.html` |

## Brand assets

- `static/brand/arts-link-cream.png` and `static/brand/arts-link-ink.png` are the wordmark for dark and light grounds.
- `static/images/logo/` holds the painted color wordmark, for off-product use. The header and footer marks are typed (see above). `layouts/partials/logo.html` is an unused leftover; see [`known-debt.md`](known-debt.md).
- `static/favicon.svg` and `static/favicon.ico`.
- `static/images/og-default.jpg` is the fallback social card.

## Claude Design source

The system is also maintained as a Claude Design project. Only its **written guidance** belongs in this repository, under `docs/design-system/source/` (imported October 2, 2026):

| File | What it is |
|---|---|
| [`readme.md`](design-system/source/readme.md) | the design guide: voice, visual foundations, components, iconography, logo, gaps |
| [`project-rules.md`](design-system/source/project-rules.md) | standing rules: American English, US dollars, US dates, where proposal contact info goes |
| [`SKILL.md`](design-system/source/SKILL.md) | the agent-skill wrapper, kept as a document and **not** installed under `.claude/skills/` |
| [`MANIFEST.md`](design-system/source/MANIFEST.md) | what was left out and why |

The snapshot's own index refers to `tokens/`, `components/` and `ui_kits/`, and to paths like `assets/logo/favicon.svg`. Those exist only in the design project, so use the repo paths on this page instead.

**Generated files stay out**: `_ds_bundle.js`, token CSS, prototype HTML. Committing them would put a second copy of the palette next to `assets/css/main.css` and `tailwind.config.js`, and the two would drift.

Rules:
- **Don't link to the Claude Design project** from the site, from client material, or from anywhere a reader would follow it. It's a tool's working surface, so it's private to its owner and can be revoked (see the copywriting rules in `AGENTS.md`). The imported guidance in this repo is the shareable record.
- When the design project changes, re-export the guidance and update the drift table below in the same PR.
- Token changes go into `assets/css/main.css` and `tailwind.config.js`, never into `source/`. The build never reads that folder.

## Drift: design vs code

Record any place where the Claude Design project and the shipped CSS disagree, along with which one should move.

| Item | Design project | Code | Resolution |
|---|---|---|---|
| Text opacity | A six-step ladder: 100 / 55 / 35 / 25 / 10 / 5 | About 15 steps in templates (`/50`, `/60`, `/70`, `/45`, `/30`, `/40`, `/20`, `/15`, …) | Design wins for new work. Fold stragglers into the ladder when you touch a template. |
| Image well | `#252220` as a named surface | Hardcoded `bg-[#252220]` in `project-card.html`, so it doesn't adapt to light mode | Code should move: add `--color-well` to both theme blocks. |
| Corners | Radius 0 except the toggle and `<code>` | Blog images `prose-img:rounded-xl` (`layouts/blog/single.html`); the card screenshot `rounded-md` (`og-card.html`) | Square the blog images. Social cards can stay a documented exception. |
| Paint-drip texture | "Present but unused" | Used as a muted backdrop in `og-card.html` | The design doc is wrong; code stands. |
| Price wording | "Starting at $1,000" | "Starting from" / "from $1,000" | Code stands: write "from $1,000". |
| Template prices | Placeholder $3,000 in the design templates | Not imported; real pricing is "from $1,000" in `pricing-section.html` | No action. Never copy template prices into copy. |
