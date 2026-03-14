# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Arts-link.com is a boutique web studio site for Ben Strawbridge, offering bespoke Hugo portfolio sites for artists and bands. It uses a custom theme called "Ryder" (maintained as a git submodule) with Tailwind CSS and Alpine.js.

## Site Strategy

The authoritative strategy document is `docs/site-system.yaml`. It defines the keystone metrics, page inventory, services, nav, conversion flow, and analytics plan for the site. **Keep it up to date** — when pages are added, removed, or repurposed, update the `page_inventory` and `pages_cut` sections. When services, positioning, or the conversion flow change, update those sections accordingly. The strategy doc is the source of truth for *why* the site is structured the way it is; the code reflects it.

The site strategy follows the framework in `docs/web-systems-adventure-mode.md`. Refer to it when making structural decisions about pages, modules, or navigation.

## Development Commands

```bash
# Start local dev server (uses ryder-dev theme symlink)
hugo server

# Build for production
hugo --minify

# Install dependencies (after cloning)
git submodule update --init --recursive
npm ci
```

The `ryder-dev` theme in `themes/ryder-dev/` is a symlink to `themes/ryder/` for local development. Production uses `themes/ryder/`.

## Architecture

**Hugo + Ryder Theme**: Most layout/template logic lives in `themes/ryder/`. The root `layouts/` directory contains only a few overrides (logo partial, font loading).

**CSS Pipeline**: Tailwind CSS is processed through PostCSS (`postcss-import` → `tailwindcss` → `autoprefixer`). Tailwind scans `hugo_stats.json` (generated at build time) for class names used in templates — this is the mechanism Hugo uses to integrate with Tailwind's content detection.

**Interactivity**: Alpine.js handles UI interactivity (dark mode toggle, image galleries, mobile nav). No bundler — all JS is loaded directly.

**Environment configs**: `config/_default/` applies everywhere; `config/production/` adds Plausible Analytics and sets the final title/theme. The production theme is `ryder`; dev uses `ryder-dev`.

**Content model**: Content in `content/artists/` represents individual portfolio showcases. Key front matter fields for artists:
```toml
siteUrl = 'https://portfolio-url.com'   # links to the artist's hosted portfolio
homeFeature = true                       # shows on homepage
homeFeatureTitle = "..."
homeFeatureIcon = "fa-solid fa-..."      # Font Awesome icon class
```

**Deployment**: GitHub Pages via `.github/workflows/hugo.yml` (manual trigger). Hugo v0.138.0 extended (Dart Sass support).

## Theme Submodule

The `themes/ryder/` directory is a git submodule. When making theme changes, you're editing a separate git repo. Run `git submodule update --init --recursive` after cloning.

## Tailwind & Styling

Dark mode uses the `class` strategy. Custom additions in `tailwind.config.js`:
- Font: `font-chalk` → Chalkduster (used for headers)
- Breakpoint: `xs: 475px`
- Custom bg images: `hidden-home`, `paint-drip`

The `@tailwindcss/typography` plugin is active for prose content.
