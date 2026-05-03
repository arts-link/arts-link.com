+++
title = "Why I Build With Open Source"
date = 2026-05-03
description = "Open source is part of how Arts-Link builds sites people can own. Ryder is the Hugo theme we created to give something back."
draft = false
+++

The websites I build for artists and bands start from a simple belief: you should be able to own the thing that represents you.

Not rent it forever. Not keep paying a platform because your archive, your images, your show history, or your press kit are trapped behind someone else's dashboard. Not rebuild from zero every time a company changes its pricing, removes a feature, or decides your site should look more like everyone else's.

You should be able to move it. Inspect it. Back it up. Hand it to another developer if you need to. Keep it online without turning a simple portfolio into a monthly infrastructure bill.

That belief is one of the reasons Arts-Link builds with open source software.

---

## What Open Source Means Here

Open source software is software whose source code is available under a license that lets people use it, study it, modify it, and share it. The [Open Source Initiative](https://opensource.org/faq/) has the formal definition, but the practical version is easier to feel:

Someone built a useful thing, made the work visible, and gave other people permission to learn from it and build with it.

That matters for client work because a website is not only what you see in the browser. It is also the stack underneath it: the tools that generate the pages, process the images, compile the styles, create metadata, and keep the whole thing maintainable.

When those tools are open, the site is easier to understand. When the site is easier to understand, it is easier to preserve.

For Arts-Link, that foundation is [Hugo](https://gohugo.io/), an open source static site generator. Hugo takes content, templates, images, and configuration, then builds a finished website out of plain files. No database is required for the public site. No subscription platform has to be running for a visitor to load your homepage. The result can be hosted almost anywhere.

That is not just a technical preference. It is a practical stance about ownership.

---

## Why It Matters For Artists And Bands

Most artists do not need a complicated web application. They need a beautiful, durable place for their work.

A painter needs images that load quickly and look good on a phone. A photographer needs galleries that do not crush the originals or make every page feel heavy. A band needs dates, music, video, press, and contact details without being boxed into a template built for restaurants, coaches, or generic small businesses.

Open source tools help make that possible without surrendering control.

With Hugo, the finished site can be a folder of static files. That means fewer moving parts, fewer security headaches, and fewer things that can break at 2 a.m. because a plugin updated badly. It also means the source files can live in a normal repository, where the history of the site is visible and recoverable.

That is the opposite of lock-in. It is a quieter kind of independence.

Clients do not need to care about every command or template. That is my job. But they should benefit from the architecture: fast pages, portable files, transparent structure, and a site that can keep working without an expensive machine humming behind it.

---

## Ryder Is How Arts-Link Gives Back

Open source is not a one-way street. Arts-Link benefits from a public ecosystem of tools, documentation, examples, forum answers, and shared patterns. So we should contribute something back to that ecosystem too.

That is why I created [Ryder](https://github.com/arts-link/ryder), a free Hugo theme by Arts-Link.

Ryder is [MIT licensed](https://github.com/arts-link/ryder/blob/main/LICENSE), which means people can use it, modify it, learn from it, and build on top of it with very few restrictions. It is maintained publicly, documented publicly, and built for the kinds of sites Arts-Link cares about: blogs, portfolios, small creative businesses, and independent publishers.

The point of Ryder is not to make every Arts-Link site look the same. In fact, serious client work usually needs its own design system, its own layout decisions, and its own tone. Ryder exists because the reusable parts of that work are worth sharing.

Every site needs sensible metadata. Every site needs responsive navigation. Many sites need galleries, dark mode, accessible defaults, social previews, analytics hooks, and a way to override templates without forking everything. Those are not trade secrets. They are the boring, useful foundations that make better projects easier to start.

So Ryder packages those foundations and gives them away.

---

## What Paid Work Teaches The Free Tool

The useful thing about maintaining an open source theme while also building client sites is that the work keeps each side honest.

Client projects reveal what actually matters. Not what sounds impressive in a feature list, but what makes a real site easier to launch, easier to edit, and easier to keep alive. The lessons are often practical: a gallery needs to be simple; metadata should be automatic where possible; analytics should be optional and privacy-conscious; a theme should be extendable without forcing someone to edit the original files.

Ryder turns those lessons into public software.

It supports fast static sites, accessible defaults, responsive navigation, image galleries, search and AI metadata, privacy-friendly analytics integrations, and template overrides. It also credits the open source projects and communities it learns from, including the [Hugo community](https://discourse.gohugo.io/), [PaperMod](https://github.com/adityatelange/hugo-PaperMod), and [hugo-theme-gallery](https://github.com/nicokaiser/hugo-theme-gallery).

That is what supporting open source looks like for Arts-Link right now: maintaining the theme, improving the documentation, releasing the code publicly, crediting the work that influenced it, and turning project experience into something other people can use.

It is not charity. It is participation.

---

## Ownership Is The Through Line

I do not use open source because it is fashionable. I use it because it aligns with the kind of websites I want to build.

A good portfolio site should make an artist feel more independent, not more dependent. It should give them a stable home for their work. It should be understandable enough that another competent person could take it over. It should not hide the foundation behind a platform that only works as long as the monthly payment clears.

Hugo helps with that. Ryder is one way Arts-Link contributes back to the Hugo world that makes it possible.

The web is better when the tools are shared, inspectable, and improvable. Artists are better served when their sites are built on foundations they can actually own.

That is the kind of web Arts-Link is here to build.

---

If you want a portfolio site that is beautiful, fast, and yours to keep, [get in touch](/contact/).
