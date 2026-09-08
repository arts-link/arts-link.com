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
weight = 1
+++

Websites are often changed and their history lost forever. A redesign is implemented, a page gets rewritten. A client asks what the homepage looked like two years ago, and the honest answer is that no one remembers.

Arts-Link built Screenshot-a-Day to document the evolution of websites.

Screenshot-a-Day captures your site on a schedule in Chromium, Firefox and WebKit. It then compares each capture against the last one and tells you what moved. Over months that turns into something more useful than a folder of screenshots. You have browsable galleries, GIF and WebM timelines of a page evolving, and signed webhooks so another tool can react when a page changes unexpectedly. It handles pages behind a login, and an experimental MCP endpoint lets an AI agent inspect a project's capture history or queue a new one.

Most importantly, Screenshot-a-Day is self-hosted. It runs on your own machine or server via Docker, with SQLite and a local volume, and the archive stays on your infrastructure. There is no account to create, no service to depend on, and no product telemetry in the application. If you want the galleries public without exposing the admin interface, it can publish static output to somewhere else entirely. The [public archive](https://screenshots.arts-link.com/) is that mechanism running for real.

It is written in TypeScript on Fastify, drives browsers with Playwright, and ships as versioned container images. Version 0.1.1 is the current release, and it is licensed [AGPL-3.0-or-later](https://github.com/arts-link/screenshot-a-day/blob/main/LICENSE). It is free to run, modify and share, with the condition that anyone offering it as a service passes on the same freedom.

Like [Ryder](/work/ryder/), it was inspired by client work. Keeping a visual record of the sites Arts-Link builds and maintains was a recurring problem worth solving once properly and publicly.
