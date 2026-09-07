+++
title = "We Keep a Picture of Your Site, Every Day"
date = 2026-09-05
description = "Screenshot-a-Day is a small tool we built and now run for every Arts-Link client. Here's what it does and why it matters."
draft = false
+++

Every Arts-Link client site now has its home page photographed once a day, and we keep every one of those pictures.

The tool doing it is called **Screenshot-a-Day**. We built it, we released version 0.1.0 this week as free and open-source software, and you can [see one of its galleries in action](https://screenshots.arts-link.com/).

---

## The Problem It Solves

Most website monitoring answers one question: is the site up? That's a useful question, and it's not the one that usually bites.

What actually happens is quieter. A plugin updates and the hero image stops loading — but only in Safari. A host changes a default and your typography shifts. A form quietly stops sending. The site is up the entire time. Nobody notices for weeks, and when someone finally does, there's no way to say when it started or what it looked like before.

That's a bad position for you, and it's a bad position for us. So we stopped guessing.

---

## What We Actually Do for You

Once a day, on our own machine, your home page is loaded and photographed in three different browsers — Chrome, Firefox, and Safari's engine. Three pictures, because sites break in one browser and not the others more often than you'd think.

Those pictures are kept. Not the latest one — all of them. Which means:

- **We can show you what your site looked like on any past day.** Before the redesign. Before the plugin update. Last spring.
- **We can put two days side by side** and see exactly what moved, including a view that highlights the changed pixels.
- **We can play the whole history as a short animation.** A year of your site in a few seconds is a genuinely different way to see your own work.
- **When something breaks, we can find when.** Not approximately. The day.

This is included in what we already do. You don't have to set anything up, install anything, or think about it.

---

## Why We Built It Instead of Buying It

There are services that do a version of this. We looked at them carefully, and two things stopped us.

The first is cost that scales the wrong way. These tools charge per site watched and per day of history kept, monthly, forever. Watching a dozen client sites and keeping years of history is exactly the usage that gets expensive — and years of history is the whole point.

The second matters more. Using one of those services would mean the visual record of your site lives in a company's account, under their retention policy, on their terms. If they change their pricing, or their storage limits, or go away, the history goes with them. That's the same failure we spend most of our time rescuing people *from*. It would have been strange to solve it by signing up for another one.

So Screenshot-a-Day runs on hardware we own. The archive sits on a machine in our office. Nothing about it depends on a subscription staying paid.

---

## It's Yours Too, If You Want It

We released it as open-source software under the AGPL, which is a license chosen specifically to keep it that way — anyone who runs it and offers it to others has to share their improvements back. It can't quietly become a closed product later, including by us.

Practically, that means two things. If you're technical, or you know someone who is, you can [run your own copy](https://github.com/arts-link/screenshot-a-day) — it's two Docker containers and it costs nothing but electricity. And if you'd rather we just handle it, that's what we're already doing.

Either way, the history is yours. If you ever leave, you take the archive with you. That's not a promise we're making about our good intentions; it's just what files on a disk are.

---

## Where It's Going

Version 0.1.0 is a first release and we're honest about it being early. The next things on the list are whole-site archives rather than just home pages, better comparison tools, and clearer setup for people running their own.

Planning happens in the open on our [public roadmap board](https://github.com/orgs/arts-link/projects/2). If you're a developer and you'd like to help, the smaller issues in the first two phases are good places to start — and if you're a client with an opinion about what you'd want to see in your own gallery, tell us. That's the more useful kind of feedback right now.

*If you want the engineering side of this — the architecture, the decisions, and the dependency we deleted three days before release — Ben wrote that up separately: [Building Screenshot-a-Day v0.1.0](https://www.benstrawbridge.com/posts/building-screenshot-a-day-v0-1-0/).*
