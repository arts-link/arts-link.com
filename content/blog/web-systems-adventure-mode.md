+++
title = "Web Systems Adventure Mode"
date = 2026-03-24
description = "The framework I use to plan every site I build — one metric, clear page missions, zero ambiguity."
draft = false
+++

Every website I build starts the same way: with a single question that most people skip.

*What is this site actually for?*

Not "to show my work" or "to get more clients." Those are directions. I mean: what is the one action a visitor should take — the thing that, if they do it, means the site did its job?

Until that's settled, everything else is guesswork.

---

## Where This Comes From

The framework I use is adapted from the [Fictive Kin Web Systems Handbook](https://fictivekin.com/websystems) — a rigorous, no-nonsense approach to thinking about websites as systems rather than collections of pages. I've applied it across the sites I build, adjusted it through the actual experience of building, and made it my own. What follows is how I think about it.

---

## Keystone Metrics

Every site needs a primary keystone metric. Something concrete: form completions, email signups, purchases, demo bookings. If you can't name it, the site doesn't have a job.

A secondary metric is reasonable — often useful. But once you're tracking three things with equal weight, you're not tracking anything. The discipline is keeping the primary metric primary.

For arts-link.com, the primary metric is new clients onboarded. Secondary is revenue. Those two things are related enough to be coherent, distinct enough to be useful. Every page on this site exists to move someone toward that first one, or it needs to justify its existence by some other measure.

---

## Every Page Has Exactly One Job

Once you know the metric, you classify every page by its function. There are four types:

**Converters** are where the action happens — contact forms, checkout, booking. One job. One CTA. The Fictive Kin framework is clear here and I agree: minimize steps, reduce nav distractions, make the path as short as possible from arrival to completion.

**Collectors** capture organic traffic and route it toward Converters. Portfolio pages, blog posts, guides. They need a clear summary up top and a path to a Converter at the end. Measure them by traffic volume and how many visitors they route onward.

**Attractors** handle paid or social traffic — campaign-specific, often short-lived.

**Informers** are administrative pages. Privacy policy, about, terms. Accurate, updated, but not metric-driven.

Here's what it looks like when the classification is working:

The Services page here is a Collector. Its job: explain what's available, establish enough trust to remove doubt, then route someone to Contact. The metric is how many Services visitors click through to get in touch. The CTA at the bottom is a single prompt — no pricing debate, no form on the page, just a clear next step.

The Contact page is a Converter. Its job: turn a visitor into a qualified inquiry, nothing else. The metric is form completions. One form, three fields, the navigation quiets down once you're in it. Nothing else to do here except submit.


---

## Pages Are Made of Modules

Every page is composed of reusable modules: hero, card grid, CTA block, contact form. The Fictive Kin framework distinguishes between workhorse modules (core, reusable, build these first), showstopper modules (high-impact and expensive — use sparingly), and high-touch modules (things like pricing tables that need iteration to get right).

The practical upshot: build the boring stuff well before you build anything fancy. A site with a solid hero, clean cards, and a trustworthy contact form will outperform a site with one flashy showstopper and a form that looks like an afterthought.

---

## What Changes When You Actually Build With This

The framework is tidy on paper. In practice, a few things become clear fast.

### The strategy document has to be executable

A narrative brief goes stale. The document that defines your site — its pages, their types, their target actions, their metrics — works better as structured data than as prose. A YAML file you update every time a page is added, removed, or repurposed.

When the docs and the code drift, the site starts losing coherence. You add a page because it seemed like a good idea. You forget what it was for. Six months later you have seven pages and no clear answer about which ones are doing anything.

Keeping a machine-readable system definition — even a simple one — makes it much easier to stay honest.

### Collectors are not all the same

A portfolio grid and a long-form article are both Collectors, but they work differently. A hub collector (portfolio, category page) is routing: cards, links, nothing else. Adding prose to it tends to hurt it.

An article collector like this post needs a summary up top, a body, and a direct CTA at the end. Adding a card grid to it would be noise.

Treating them identically because they share a page type is a subtle mistake that's easy to make.

### Analytics should mirror your page taxonomy

Track events that correspond to page-type actions: CTA clicks from Collectors, form submissions from Converters. If your events don't map to your page structure, the data won't tell you where the funnel is losing people.

"Visitors dropped off" isn't actionable. "Visitors reached the Collector but didn't route to the Converter" is.

### Performance is architecture, not a checklist

Fast sites are mostly the result of early decisions: self-host your fonts and preload them, inline your compiled CSS so there's no render-blocking request, serve everything from a CDN edge. These aren't things you add later — they're the baseline.

Running a speed test and patching the results is a different thing from building fast from the start.

### Early decisions compound

The small structural choices — how sections are named, whether tracking and compliance rules live in components or in guidelines, whether the system definition stays current — determine how easy the site is to maintain and improve later.

The framework doesn't make those decisions for you. It just makes sure you're making them deliberately.

---

## Why I Use This

Not because I'm attached to the system, but because it keeps me honest. Every page I cut, every nav link I don't add, every form I simplify — that's friction removed from the path between a visitor and the thing you want them to do.

The result is a site that knows what it's for, loads quickly, and gets out of its own way.

---

Send me a link to your site. I'll tell you what it's actually optimized for — and what's getting in the way. [Get in touch →](/contact/)
