# Arts-Link Design System

Design system for **[arts-link.com](https://arts-link.com)** — a boutique web studio run by
Ben Strawbridge that builds bespoke portfolio sites for artists, bands, and photographers.

Everything here was derived from the studio's own source, not from memory. See **Sources** below.

---

## The company in one paragraph

Arts-Link makes one-of-a-kind portfolio sites for creative people who want to own their
online home. Three offerings: **New Site** (a custom portfolio), **Site Rescue** (migration
off a dying or expensive CMS), and **Ongoing Management** (à la carte hosting/domain/content
help, existing clients only). Projects start at **$1,000**. No platform lock-in, no mandatory
monthly plan. The pitch is a real person on the other end of the conversation — Ben's name,
face, and city are on the site on purpose.

The studio also maintains **Ryder**, a free MIT-licensed Hugo theme, as its contribution back
to the open-source ecosystem it builds on.

### Products / surfaces

| Surface | What it is | Recreated in |
| --- | --- | --- |
| arts-link.com | The marketing site: Home, Work, Services, Blog, Contact | `ui_kits/website/` |
| domains.arts-link.com | External domain-reseller store (linked out, not designed here) | — |
| Ryder theme demo | Separate open-source repo, not part of this system | — |

The site's own strategy doc (`docs/site-system.yaml` upstream) names the page inventory,
conversion flow, and module set — that document is why this system's component list looks the
way it does.

---

## Sources

- **GitHub — [github.com/arts-link/arts-link.com](https://github.com/arts-link/arts-link.com)**
  (branch `main`). The primary and only source. Read in depth:
  `assets/css/main.css` (tokens, fonts, grain, animations), `tailwind.config.js` (color/font
  registration), `docs/site-system.yaml` (strategy, module inventory, content model),
  `CLAUDE.md` (theming + copywriting rules), all of `layouts/` including
  `layouts/partials/modules/`, and the `content/` tree for voice and copy.
- **Related repo — [github.com/arts-link/ryder](https://github.com/arts-link/ryder)** — the
  studio's open-source Hugo theme. *Not read for this system;* worth exploring if you need the
  theme's own conventions.

If you have access, read those repos directly — especially `layouts/partials/modules/` and
`docs/site-system.yaml`. They are short, and they will make any design you build here sharper.

---

## Index

| Path | What it is |
| --- | --- |
| `styles.css` | Entry point — `@import`s only. Link this one file. |
| `tokens/` | `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `effects.css`, `base.css` |
| `components/core/<Name>/` | `Button`, `Badge`, `Eyebrow`, `AccentRule`, `Grain` |
| `components/layout/<Name>/` | `SiteHeader`, `SiteFooter`, `ThemeToggle`, `PageHeader` |
| `components/modules/<Name>/` | `Hero`, `ProjectCard`, `ServiceBlock`, `PricingCard`, `CtaBlock`, `ContactForm`, `PostListItem` |
| `ui_kits/website/` | Click-through recreation of arts-link.com (5 screens + a post page) |
| `guidelines/` | 19 foundation specimen cards (Colors, Type, Spacing, Brand) |
| `assets/` | `logo/`, `images/`, `fonts/` |
| `SKILL.md` | Agent-skill wrapper, for use in Claude Code |
| `github.md` | Upstream source association + screen map |

### Components

`AccentRule` · `Badge` · `Button` · `ContactForm` · `CtaBlock` · `Eyebrow` · `Grain` ·
`Hero` · `PageHeader` · `PostListItem` · `PricingCard` · `ProjectCard` · `ServiceBlock` ·
`SiteFooter` · `SiteHeader` · `ThemeToggle`

Each component lives in its own folder with a sibling `.d.ts` (props), `.prompt.md`
(what/when + usage), and its own `*.card.html` specimen — so every component has a distinct
thumbnail showing its real variants and states.

**Component inventory rationale.** The upstream site has no React component library, so the
inventory is taken from its real building blocks: the six modules named in
`site_system.modules.workhorse` (Hero, Project card, Service block, CTA block, Contact form,
plus the pricing card that exists as `modules/pricing-section.html`), the page chrome
(`partials/header.html`, `partials/footer.html`), and the small repeated pieces those are made
of. Nothing here is a generic design-system addition — there is no Toast, Avatar, Tabs, Modal,
Select, or Switch, because the site has none.

**Intentional additions:**
- `Eyebrow`, `AccentRule`, `Badge` — extracted from repeated inline markup (the uppercase
  micro-label, the 32×2 ember bar, the site-type badge). They appear dozens of times upstream
  and needed names.
- `PageHeader` — the eyebrow + display-title pair that opens Work, Services, Blog, and 404.
- `PostListItem` — the blog index row, from `layouts/blog/list.html`.
- `Grain` — the fixed noise overlay from `baseof.html`.
- `ThemeToggle` — the Alpine switch in `partials/footer.html`, as React.

---

## Content fundamentals

**Voice: first-person singular, always.** "I'm Ben Strawbridge, a web builder for artists and
bands." "I'll get back to you personally." Never "we" on positioning surfaces — the whole
proposition is that a person, not an agency, answers. (Older content pages and the README use
"we"/"Arts-Link"; the current site voice is "I". Follow "I".)

**Address the reader as "you", and make ownership the subject.** "Your site, your files, your
domain." "Yours to keep." "You own everything." The single most repeated idea in the copy is
that the client owns the thing.

**Sell the outcome, never the stack.** This is an explicit house rule from the repo's
`CLAUDE.md`: technology in the *body* of a project story, yes; technology in the *pitch*, no.
Hero copy, taglines, service blurbs, and meta descriptions say fast / beautiful / accessible /
yours. Case studies and blog posts name Hugo, Astro, Leaflet, D3 freely, because there the
tech *is* the subject.

**Name the competitors plainly.** "WordPress, Squarespace, GoDaddy — I do the opposite." The
copy is comfortable being specific about what it is not.

**Sentence case for prose; UPPERCASE only for micro-labels.** Headings are sentence case
("What I build", "Who I work with", "Ready to talk?"). Uppercase is reserved for 12–14px
tracked labels, nav items, badges, and buttons — never for a heading or a sentence.

**Headings are short and plain.** One or two words where possible: Work. Services. Blog.
Ready to talk? What it costs. How it works. Who I work with. No cleverness, no colons, no
"Unlock your…".

**Em dashes and the arrow do the punctuation work.** "fast, personal, and yours to keep." /
"— cutting your costs and giving you a site you actually own." CTA labels end in an arrow:
`Work with me →`, `Get in touch →`, `Visit site ↗`, `← All work`.

**Numbers are concrete when they exist.** "Starting at $1,000." "9-day, 3,753-mile drive."
"loads in under a second." No invented statistics, no "10x", no percentages.

**Placeholder copy is written in the client's voice**, which is a nice detail worth keeping:
`I'm a painter based in Philadelphia looking for a new portfolio site...`

**No emoji. Anywhere.** Not in copy, not in headings, not in UI. The repo contains none.

**Vibe:** quiet confidence, gallery-wall calm. Warm and direct, never salesy or breathless.
It reads like a careful person explaining how they work.

---

## Visual foundations

**Palette.** Three colors carry the entire UI: near-black **ink** (`#141210`), warm off-white
**cream** (`#F5F0E8`), and a single burnt-orange accent, **ember** (`#C4502A`, hover
`#D4622E`). One raised surface (`#1E1B18`) and one image well (`#252220`). That's it — there
are no success/warning/error colors, because the site has no such states.

Hierarchy comes from **opacity on cream, not new colors**: 100% for strong text, 55% for body,
35% muted, 25% faint, 10% for borders, 5% for hairlines. Learn this ladder and you can write
correct Arts-Link CSS without looking anything up.

A separate **paint palette** — green `#65D64F`, orange `#FF5A36`, yellow `#F7E65B`, pink
`#F1A7D1` — lives in the painted logo artwork and the README badges. It is decorative only:
never text, never borders, never UI chrome.

**Themes.** Dark is the default and the design's real home. Light mode inverts ink and cream
(`#F7F3EC` page, `#1A1714` text) and keeps ember unchanged; it's opt-in via a `.light` class on
`<html>`, set pre-paint from `localStorage.theme`. Anything built from ink/cream/ember tokens
adapts for free. Never write theme-specific colors.

**Type.** Two families. **Fraunces** (variable serif) for every heading, always at weight
**300** — the light-weight serif at huge sizes is the single strongest brand signal. Italic
Fraunces is used for emphasis: the lowercase `arts-link` wordmark, and the second line of the
hero (`artists.` in ember italic). **DM Sans** for body, labels, and UI. Nothing else — no mono
face in the design, no third family.

The recurring typographic move is a **wide-tracked uppercase 12px eyebrow (0.3em) above a very
large light serif heading**. Hero runs `clamp(3.5rem, 9vw, 8.5rem)` at `line-height: 0.9`.
Body copy sits at 16–18px with `line-height: 1.65`.

**Spacing & layout.** A 72rem (`max-w-6xl`) centered container with 24px gutters for everything
except long-form reading, which drops to 48rem. Vertical rhythm is coarse and generous: 96px
between sections, 128px around hero and CTA blocks, 40px padding inside bordered cards. Sections
are separated by a full-width `cream/10` hairline — that rule, repeated, is the page's skeleton.

**Corners are square.** Radius is `0` everywhere. The only exceptions in the entire codebase are
the theme-toggle pill and inline `<code>`. Do not round cards, buttons, inputs, or images.

**Cards** come in two shapes, and neither uses a shadow at rest:
- *Project card* — filled `#1E1B18`, no border, 16:9 image well on top, meta block below.
- *Service / pricing block* — transparent, 1px `cream/10` border, 40px padding, opened by a
  32×2px ember bar where a lesser design would put an icon.

**Borders do the work shadows usually do.** Three hairline weights (`cream/5`, `/10`, `/20`) plus
ember. Buttons and badges are border-only boxes. The one heavy shadow in the system is the card
hover lift (`0 24px 64px rgba(0,0,0,.5)`), and the one decorative shadow is a solid 4px ember
frame around the portrait (`box-shadow: 0 0 0 4px #C4502A`).

**Backgrounds.** Flat near-black — no gradients anywhere, ever. What keeps it from feeling dead
is a **fixed film-grain overlay**: 4%-opacity SVG fractal noise (`baseFrequency 0.85`,
4 octaves) pinned above the whole page. Photography appears only as real client screenshots and
Ben's portrait; there are no stock images, no illustrations, and no repeating patterns. Imagery
skews warm and natural (artists' work, in situ), never cool-blue or duotoned.

**Motion.** One easing curve for everything: `cubic-bezier(0.16, 1, 0.3, 1)` — a soft expo-out.
Hero elements fade up 1.5rem over 900ms on a **100 / 250 / 400 / 700ms stagger**. Hover color
transitions are 200ms, card lifts 300ms, image zoom 500ms, theme cross-fade 350ms. Nothing
bounces, nothing springs, nothing loops.

**Hover states** are color floods, not opacity tricks:
- Primary button: transparent → **fills ember**.
- Secondary button: cream border → ember border.
- Nav link / footer link: cream 60% → 100%.
- Blog row: title warms to ember, and the "Read →" gap grows 8px → 12px so the arrow slides.
- Service block: border `cream/10` → `ember/40`.
- Project card: lifts 5px, **tilts 0.3°**, gains the heavy shadow; the screenshot inside scales
  1.05. That tiny rotation is deliberate — it makes the card feel hand-placed.

**Press states: there are none.** No scale-down, no darker active fill. Focus is a 1px ember
outline at 2px offset. Disabled is 35% opacity.

**Transparency & blur** are used exactly twice: the sticky header sits on `ink/95` with a 4px
backdrop blur, and text/borders use alpha-composited cream. No frosted panels, no glass cards,
no protection gradients over imagery — captions sit outside images, not on them.

**Fixed elements:** the 64px sticky header, and the grain overlay at `z-index: 9999`. Nothing
else is pinned; no floating action buttons, no sticky CTAs, no cookie bar.

**Selection** is ember background with cream text — a small thing the site bothers to set.

---

## Iconography

**Arts-Link has no icon set, and that is the rule to follow.** Its iconography is typed
characters:

| Glyph | Meaning |
| --- | --- |
| `→` | forward / internal action — ends most CTA labels, and bullets pricing lists |
| `↗` | external link — "Visit site ↗", "Browse domains ↗", "Domain Names ↗" |
| `←` | back — "← All work", "← Blog" |
| `·` | separator in meta lines and eyebrows |

These live **inside the label text**, not as separate elements. `Button` deliberately has no
`icon` prop.

Exactly **three real SVG icons** exist in the whole codebase, all inline in
`layouts/partials/`: a hamburger (2px-ish stroke, `stroke-width: 1.5`, rounded caps — Heroicons
outline `bars-3`), and a sun and moon in the theme toggle (Heroicons **solid**, 24×24 viewBox,
rendered at 12px). `ThemeToggle` reproduces the sun/moon paths verbatim. If you need an icon the
site doesn't have, take it from **[Heroicons](https://heroicons.com)** — outline at
`stroke-width: 1.5` for controls, solid for tiny 12px marks — and keep it `currentColor`. That
is a documented substitution, not something the repo states.

Where a lesser design would place a decorative icon, Arts-Link places the **32×2px ember bar**
(`AccentRule`). Use it.

**Emoji are never used.** No icon font is loaded (some legacy front matter carries a
`fa-solid fa-palette` value, but Font Awesome is not in the build and nothing renders it).

### Logo

`assets/logo/arts-link-colors.webp` (and `.jpg`) — the wordmark **ARTS-LINK** hand-drawn in a
chalk/marker face over a blurred rainbow paint wash. Use it for social, README, and off-product
contexts. Never recolor, crop, redraw, or place it over busy artwork.

**In-product, the mark is type, not the image:** lowercase italic Fraunces `arts-link`, 20px in
the header and 24px in the footer, tracking `-0.02em`, warming to ember on hover.

`assets/logo/favicon.svg` / `.ico` and `assets/images/og-default.jpg` are the shipped
favicon and social card. `assets/images/bg-paint-drip.webp` is a paint-drip texture present in
the repo but not referenced by any current template — available, unused.

---

## Substitutions & gaps

- **Fonts: none.** Both webfonts (Fraunces and DM Sans, variable, subsetted woff2) were copied
  from the repo and are wired up in `tokens/fonts.css`. Nothing is faked.
- **Icons:** Heroicons is a documented *inference* from the three inline SVG paths, not
  something the repo declares. Confirm before relying on it.
- **Imagery:** only one work screenshot (Verdèzul) was copied; the others are 2–5MB PNGs. The UI
  kit shows the upstream no-image fallback for those entries rather than substituting stock art.
- **Not recreated:** the mobile hamburger drawer, the 404 page, and `static/flyer.html`.
