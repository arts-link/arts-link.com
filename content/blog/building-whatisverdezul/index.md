+++
title = "Building Verdèzul's Website"
date = 2026-07-24
description = "Verdèzul's new site is live at whatisverdezul.com. Here's how it came together — a structured onboarding checklist, a docs-first build, and a git-based CMS the band runs themselves."
draft = false
+++

[Verdèzul's new website](https://whatisverdezul.com) is live.

It's fast, it's theirs, and the band updates it themselves — shows, releases, merch, press — without touching code, without a database, without a platform subscription that decides what their site is allowed to be.

This post is about how it got built. Not a tutorial — a look at how Arts-Link actually works.

{{< figure src="whatisverdezul-home.webp" alt="Verdèzul homepage: a tiled wall of the band's globe logo behind a glowing neon-green box that asks 'What is Verdèzul?'" caption="The homepage: tiled logos, one question." class="max-w-sm mx-auto" >}}

---

## It Started With a Checklist, Not a Mockup

Before any design work, the band filled out a 12-section onboarding checklist: band basics, brand direction, photography, brand assets, music links, shows, press, merch, socials, contact, domain, and SEO extras.

That checklist did two jobs at once.

First, it forced the design conversation early. The band supplied visual reference sites, a palette — green, blue, black, white, with occasional red and brown — and a guiding line for the whole brand: *"We're in the world, not of the world, but we reflect the world around us."* By the time I opened an editor, the visual direction was already settled.

{{< figure src="whatisverdezul-about.webp" alt="Verdèzul's About page: the band's guiding line set over a photograph of a mountain reflected in still water" caption="The guiding line from the onboarding doc, on the About page." class="max-w-sm mx-auto" >}}

Second — and this is the part I didn't fully expect — the checklist's answers mapped almost one-to-one onto the site's data model. Shows, releases, press quotes, merch, social links: each section became a structured data file the site reads at build time. The intake document *was* the content architecture.

The band's own priority ranking from that doc — booking shows, growing fans, promoting music, selling merch, press credibility — became the site's priorities. Nobody had to guess what the site was for.

---

## Write the Docs Before the Code

Phase one of the build produced zero code. It produced a knowledge base: an operating brief, a task routing table, strategy docs covering the band's context and visual direction, engineering docs covering architecture, content model, routes, and analytics, and finish-line checklists.

Every work session since — whether I'm driving or an AI agent is — starts by reading the same docs. Decisions get encoded once and enforced everywhere. The band's name is always *Verdèzul*, accent on the è. That rule lives in one place, and no session has ever gotten it wrong.

This has become the distinctive Arts-Link method: the docs are the durable asset. The site is the output. When we come back in six months to add a tour page, nothing has to be re-explained.

---

## Owning the Theme Changes the Math

The site is built with [Hugo](https://gohugo.io/) on top of [Ryder](https://github.com/arts-link/ryder), the open source theme Arts-Link created and maintains. I've written before about [why we build with open source](/blog/open-source-and-ryder/) — this project is what that looks like in practice.

Owning the theme changes the economics of custom work. Every convention in Ryder is one we wrote, so heavily customizing it is faster than starting from scratch somewhere else. And band sites fit Hugo's shape exactly: content-heavy, layout-stable, driven by structured data, rebuilt in milliseconds.

The rule for the whole project was **override, never fork**. Ryder ships a variant-partial system — set a couple of parameters and the theme loads the site's own header, footer, and nav in place of its defaults. On top of that, the site overrides the homepage with a fully custom hero (the tiled-logo wall you saw up top), adds per-section layouts for About, Music, Shows, Press, Shop, and Contact, and layers all of its styling in one site-specific CSS file.

{{< figure src="whatisverdezul-music.webp" alt="Verdèzul's Music page with Albums and Streaming tabs and the cover of the EP Earthtones & Shades of Blue and Green" caption="The Music page — one of the per-section layouts built over Ryder's base." class="max-w-sm mx-auto" >}}

The theme itself — included as a git submodule — was never edited. Not once, the entire project. Which means every improvement made to Ryder upstream can flow into Verdèzul's site cleanly, and every lesson from this build can flow back into the free theme.

---

## The Toolchain

Open source end to end, with pragmatic hosted glue where a service honestly beats self-rolling:

- **Hugo** builds the site from plain files.
- **TailwindCSS** handles styling, compiled through the theme's own build pipeline.
- **Alpine.js** (the CSP build) handles interactivity under a strict Content-Security-Policy. That build disallows inline arrow functions and `fetch()` in expressions, so every interactive piece is a proper registered component — a real constraint that made the code better organized, not worse.
- **Decap CMS** gives the band an admin UI.
- **PostHog** tracks what actually works: ticket clicks, merch clicks, play clicks, social follows, form submissions.
- **Vercel** hosts the site and runs exactly two tiny serverless functions — about thirty lines each — that proxy the CMS login so no secret ever reaches the browser.
- **Formspree** handles the contact form and email signup with no server code on our side at all.

That last one is an honest iteration note. Email signup started life as a serverless function proxying a newsletter API. We threw it out. Formspree posts straight from the browser, signups collect into a spreadsheet, and choosing a newsletter platform is deliberately deferred until the band has a real list and can own their own account. The contact form made the same move. The site's serverless footprint *shrank* as it approached launch — which is usually a sign you're doing it right.

{{< figure src="whatisverdezul-contact.webp" alt="Verdèzul's contact page: a simple three-field form inside a glowing blue border" caption="The contact form posts straight to Formspree — no server code on our side." class="max-w-sm mx-auto" >}}

---

## The Band Runs the Site Now

Here's the part that matters most after launch day.

Every piece of client-editable content — shows, releases, merch, press — lives in structured data files in the site's repository. Decap CMS sits behind a private login and turns those files into friendly forms. A band member logs in, adds a show, hits save.

{{< figure src="whatisverdezul-admin.webp" alt="The site's private CMS showing collections for Site Config, Shows, Releases, Press Quotes, Shop / Merch, and Page Content" caption="The band's view: friendly forms for shows, releases, press, and merch." class="max-w-sm mx-auto" >}}

That save is a git commit. Vercel sees the commit and redeploys the site in about a minute.

No database. No server to maintain. A full edit history of every change ever made, and any mistake is one revert away. The band gets the ease of a website builder with the ownership of a plain folder of files.

One favorite detail: sections with no content remove themselves. There's no Press link in the nav until the press data has at least one item — the site never shows scaffolding while the band collects clippings. The site grows as the band does.

{{< figure src="whatisverdezul-shows.webp" alt="Verdèzul's Shows page: 'No shows scheduled. Check back soon.' above the full list of past shows" caption="The Shows page is honest when nothing's booked — and every past show stays on the record." class="max-w-sm mx-auto" >}}

---

## What Launch Actually Looked Like

The commit history from the final stretch is full of tiny commits: hero tile size, statement-box padding, background color tuning. That's not indecision — that's a feedback loop. Change, deploy, band reacts, adjust. No big-bang reveal, no three-week silence before an unveiling nobody asked for.

That loop — structured intake, docs before code, an owned theme, boring reliable tools, and a client who can edit their own site — is the system. [Verdèzul's site](https://whatisverdezul.com) is what it produces.

---

If your band needs a website that's fast, beautiful, and actually yours, [get in touch](/contact/).
