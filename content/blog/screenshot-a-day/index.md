+++
title = "A Picture of a Website, Every Day"
date = 2026-09-07
description = "Screenshot-a-Day is a daily, cross-browser visual history for websites — free software we built rather than rented. What it does, and who gets one."
draft = false
+++

We spent part of this year building a small piece of software called **Screenshot-a-Day**. Version 0.1.0 went out on Saturday, 0.1.1 followed two days later, and both are free and open source. You can [see a gallery it produced](https://screenshots.arts-link.com/) or [read the source](https://github.com/arts-link/screenshot-a-day).

It photographs a website once a day and keeps every picture.

That's the whole idea. The rest of this is why it turns out to be worth doing.

---

## The Failure It's For

Most website monitoring answers one question: is the site up? That's a useful question, and it's not the one that usually bites.

What actually happens is quieter. A plugin updates and the hero image stops loading — but only in Safari. A host changes a default and the typography shifts. A form quietly stops sending. The site is up the entire time. Nobody notices for weeks, and when someone finally does, there's no way to say when it started or what it looked like before.

An uptime monitor catches none of that, because nothing is down. A person looking at the site every morning would catch it — but nobody has that morning, and human attention isn't reproducible anyway. You'd want the same browser, the same window size, the same scroll position, every day, indefinitely.

That's a machine's job.

---

## What It Does

A project in Screenshot-a-Day is a URL plus a set of named capture profiles. Each profile pins a browser — Chromium, Firefox, or WebKit, the engine behind Safari — along with a viewport and rendering preferences. A scheduled run fires every enabled profile as one batch, so the browsers stay in step with each other, and one of them failing doesn't take the others down with it.

Three browsers, because sites break in one and not the others more often than you'd think.

Then it keeps the pictures. Not the latest one — all of them. What that buys you, from here forward:

- **Any two days can be put side by side.** There are four ways to look at the pair: side by side, a split slider, an overlay, and a heatmap that lights up the pixels that moved. The heatmap is the one that finds things you weren't looking for.
- **A run of days becomes an animation.** GIF or WebM, generated from the captures. A site's slow drift is much easier to see at speed than as a list of dates.
- **When something breaks, the archive says when.** Not approximately — the day, and which browser noticed first.
- **The galleries can live somewhere else.** Screenshot-a-Day renders a complete static site and deploys it to a Vercel project, a Netlify site, or an SFTP directory, so the machine holding the archive never needs a public door into it. It makes outbound connections only.

There are also signed webhooks for wiring it into other tools, and an experimental MCP endpoint so an agent can inspect the capture history or queue a run. Those matter to about four people, and if you're one of them, the [documentation](https://arts-link.github.io/screenshot-a-day/) is thorough.

The self-hosted application collects no telemetry. It doesn't phone us.

---

## The Archive Is Two Days Old

That's the awkward, unavoidable thing about a record like this: it only runs forward.

There is no version of this tool that shows you what your site looked like last spring, because nobody took the picture. The earliest day you can ever have is the day you start. Everything above describes what accumulates from here — it isn't a library we're sitting on.

Worth saying plainly, because *visual history* is the kind of phrase that sounds like it arrives with a history included.

---

## Who Gets One

We run it on our own sites, and on a handful of client sites where the client asked for it.

It isn't automatic, and it isn't part of what you're already paying for. We don't photograph a site we weren't asked to photograph — a visual record of someone's work is theirs to want or not want, and the project's own documentation puts the question of permission squarely on whoever runs it.

Where a gallery does exist, its visibility is a setting rather than a default. A project can be public and indexed; or unlisted, at a share-token URL that carries `noindex` and appears on no index page; or private, in which case nothing is published anywhere and the captures stay on the machine that took them.

If you're a client and you'd like a gallery for your site, say so and we'll set one up. If you'd rather we didn't, that's already the case.

---

## Why We Built It Instead of Buying It

There are services that do a version of this. We looked at them carefully, and two things stopped us.

The first is cost that scales the wrong way. They charge per site watched and per day of history kept, monthly, forever — so the bill grows in exactly the dimension the tool is supposed to be good at. Something that gets more useful the longer it runs shouldn't get more expensive the longer it runs.

The second matters more. Using one of those services would mean the visual record of a site lives in a company's account, under their retention policy, on their terms. If they change their pricing, or their storage limits, or go away, the record goes with them. That's the same failure we spend most of our time rescuing people *from*. It would have been strange to solve it by signing up for another one.

So Screenshot-a-Day runs on hardware we own, and the archive sits on a disk we can walk over to. Nothing about it depends on a subscription staying paid.

---

## It's Yours Too, If You Want It

We released it under the AGPL, a license chosen specifically to keep it that way — anyone who runs it and offers it to others has to share their improvements back. It can't quietly become a closed product later, including by us.

Practically, that means two things. If you're technical, or you know someone who is, you can [run your own copy](https://github.com/arts-link/screenshot-a-day#quick-start): two containers, one volume, on a Docker host you probably already have. It costs nothing but electricity.

And if there's a gallery of yours on our machine, the files are files. If you ever leave, you take them with you. That isn't a promise about our good intentions; it's just what a folder of images is.

---

## Where It's Going

Version 0.1 is deliberately small, and we're honest about the edges: SQLite, a single API replica, forward-only migrations, and TLS, backups and retention left to whoever runs it.

What comes next isn't settled. The candidates written down are S3-compatible storage, Postgres, remote worker pools, notification adapters, and possibly a hosted version for people who'd rather not run anything. None of them is committed — the project's rule is that nothing gets built until an issue and an architecture decision record make the case for it, including the case against.

What would help most right now is use. If you self-host it and something about the setup is confusing, [open an issue](https://github.com/arts-link/screenshot-a-day/issues); the deployment path is the part most likely to be wrong, because we've mostly deployed it in one place. And if you're a client with an opinion about what you'd want to see in a gallery of your own site, tell us. That's the more useful kind of feedback at this stage.

*If you want the engineering side of this — the architecture, the decisions, and the dependency we deleted three days before release — Ben wrote that up separately: [Building Screenshot-a-Day v0.1.0](https://www.benstrawbridge.com/posts/building-screenshot-a-day-v0-1-0/).*
