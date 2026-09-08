+++
title = "A Picture of a Website, Every Day"
date = 2026-09-07
description = "Screenshot-a-Day is a daily, cross-browser visual history for websites. It is free software we built, rather than bought. What it does, and who gets to use it."
draft = false
+++

We spent part of this year building a small piece of software called **Screenshot-a-Day**. Version 0.1.0 went out on Saturday. 0.1.1 followed two days later. Both are free and open source. You can [see a gallery it produced](https://screenshots.arts-link.com/) or [read the source](https://github.com/arts-link/screenshot-a-day).

It photographs a website once a day and keeps a record of every picture.

---

## The Failure It's For

Most website monitoring answers one question: Is the site up? That is a useful question, but it often does not tell the entire story.

Just because a website is live does not mean it is running without errors. A plugin updates and the hero image stops loading, but only in Safari. A host changes a default and the typography shifts. A streaming service changes its embed code and the player on your music page becomes an empty grey box. The site is up the entire time. Nobody notices for weeks, and when someone finally does, there's no way to determine when it started or what it looked like before.

An uptime monitor catches none of that, because nothing is down. A person looking at the site every morning might catch it, but that human attention isn't reproducible anyway. You would have to have the same browser, the same window size, the same scroll position, every day, indefinitely.

That's a machine's job.

---

## What It Does

A project in Screenshot-a-Day is a URL plus a set of named capture profiles. Each profile pins a browser — Chromium, Firefox, or WebKit, the engine behind Safari — along with a viewport and rendering preferences. A scheduled run fires every enabled profile as one batch, so the browsers stay in step with each other, and one of them failing doesn't take the others down with it.

Three browsers, because sites will often break in one and not the others.

The galleries can exist somewhere else. Screenshot-a-Day renders a complete static site and deploys it to a Vercel project, a Netlify site, or an SFTP directory. The machine holding the archive never needs a public door into it. It makes outbound connections only.

It then keeps the pictures. All of them, not just the latest ones.

What this provides to you:

- **Any two days can be put side by side.** There are four ways to look at the pair: side by side, a split slider, an overlay, and a heatmap that lights up the pixels that moved. The heatmap is the one that helps you find things you weren't sure how to look for.
- **A run of days becomes an animation.** GIF or WebM, generated from the captures. A site's slow drift is easier to see at speed rather than as a list of dates.
- **When something breaks, the archive says when.** Not approximately. It notes the day, and which browser noticed first.

There are also signed webhooks for wiring it into other tools, and an experimental MCP endpoint so an agent can inspect the capture history or queue a run. Those matter to about four people, and if you're one of them, the [documentation](https://github.com/arts-link/screenshot-a-day/tree/main/docs/api) is thorough.

The self-hosted application collects no telemetry. It doesn't phone us.

---

## Who Gets to Use It

We run it on our own sites, and on a handful of client sites where the client asked for it.

We don't photograph a site we weren't asked to photograph. A visual record of someone's work is theirs to want or not want, and the project's own documentation puts the question of permission squarely on whoever runs it.

Where a gallery does exist, its visibility is a setting rather than a default. A project can be public and indexed; or unlisted, at a share-token URL that carries `noindex` and appears on no index page; or private, in which case nothing is published anywhere and the captures stay on the machine that took them.

If you're a client and you'd like a gallery for your site, say so and we'll set one up. If you'd rather we didn't, that's already the case.

---

## Why We Built It Instead of Buying It

There are services that do a version of this. We looked at them carefully, and two things stopped us.

The first is cost that scales the wrong way. They charge per site watched and per day of history kept, monthly, forever. The bill grows in exactly the dimension the tool is supposed to be good at. Something that gets more useful the longer it runs shouldn't get more expensive the longer it runs.

The second is even more important. Using one of those services would mean the visual record of a site is stored in another company's account, under their retention policy, on their terms. If they change their pricing, or their storage limits, or go out of business, the record goes with them. That is the same failure we spend most of our time rescuing people from.

Screenshot-a-Day runs on hardware we own. Nothing about it depends on a paid subscription.

---

## It's Yours Too, If You Want It

We released it under the AGPL, a license chosen specifically to keep it that way. Anyone who runs it and offers it to others has to share their improvements. It can't quietly become a closed product later, even by us.

Practically, that means two things: If you're technical, or you know someone who is, you can [run your own copy](https://github.com/arts-link/screenshot-a-day#quick-start). Two containers, one volume, on a Docker host you probably already have. It costs nothing but electricity.

And if there's a gallery of yours on our machine, the screenshots are ordinary image files, not images locked inside a database. A small database keeps their dates and browser details organized. If you ever leave, you can take the complete archive with you.

---

## Where It's Going

Version 0.1 is deliberately small, and we're honest about the edges: SQLite, a single API replica, forward-only migrations, and TLS, backups and retention left to whoever runs it.

What comes next isn't settled. The candidates written down are S3-compatible storage, Postgres, remote worker pools, notification adapters, and possibly a hosted version for people who'd rather not run anything. None of them is committed. The project's rule is that nothing gets built until an issue and an architecture decision record make the case for it.

If you self-host it and something about the setup is confusing, [open an issue](https://github.com/arts-link/screenshot-a-day/issues). The deployment path is the part most likely to be wrong, because we have mostly deployed it in one place. If you are a client with an opinion about what you would like to see in a gallery of your own site, tell us.
