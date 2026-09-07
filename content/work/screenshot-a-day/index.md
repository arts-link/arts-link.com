+++
title = "Screenshot-a-Day"
date = 2026-09-07
description = "Screenshot-a-Day is the open source visual archive Arts-Link built so a website's history belongs to whoever owns the site."
client_type = "open source tool"
site_type = "open-source"
live_url = "https://arts-link.github.io/screenshot-a-day/"
repo_url = "https://github.com/arts-link/screenshot-a-day"
live_label = "Visit the project site"
case_study = true
weight = 24
+++

Websites change constantly and remember nothing. A redesign lands, a page gets rewritten, a client asks what the homepage looked like two summers ago — and the honest answer is usually that nobody kept a copy. Screenshot-a-Day is the tool Arts-Link built to stop losing that history.

It captures the sites you point it at on a schedule, in Chromium, Firefox and WebKit, then compares each capture against the last one and tells you what actually moved. Over months that turns into something more useful than a folder of screenshots: browsable galleries, GIF and WebM timelines of a page evolving, and signed webhooks so another tool can react when a page changes unexpectedly. It handles pages behind a login, and an experimental MCP endpoint lets an AI agent inspect a project's capture history or queue a new one.

The part that matters most is where it all lives. Screenshot-a-Day is self-hosted — it runs on your own machine or server via Docker, with SQLite and a local volume, and the archive stays on your infrastructure. There is no account to create, no service to depend on, and no product telemetry in the application. If you want the galleries public without exposing the admin interface, it can publish static output to somewhere else entirely; the [public archive](https://screenshots.arts-link.com/) is that mechanism running for real.

It's written in TypeScript on Fastify, drives browsers with Playwright, and ships as versioned container images. Version 0.1.1 is the current release, and it's licensed [AGPL-3.0-or-later](https://github.com/arts-link/screenshot-a-day/blob/main/LICENSE) — free to run, modify and share, with the condition that anyone offering it as a service passes the same freedom on.

Like [Ryder](/work/ryder/), it came out of client work. Keeping a visual record of the sites Arts-Link builds and maintains was a recurring problem worth solving properly once, in the open, rather than badly and privately every time.
