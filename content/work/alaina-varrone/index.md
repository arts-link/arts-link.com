+++
title = "Alaina Varrone"
date = 2026-09-18
description = "A site rescue for embroidery artist Alaina Varrone — 138 artworks recovered from a Wix site that had been gone for years, rebuilt as a fast portfolio she owns outright."
client_type = "visual artist"
site_type = "rescue"
live_url = "https://alainavarrone.art"
case_study = true
weight = 1
+++

Alaina Varrone's embroidery portfolio had been offline for years. The Wix site was gone, and with it the only organized record of her work: titles, descriptions, sale status, and the full-resolution photographs of 138 pieces.

The Internet Archive's Wayback Machine had kept some of it, but not in a form anyone could use. Wix does not publish a gallery as ordinary HTML. It ships a large blob of JavaScript bootstrap data and builds the page in the browser, so the archived snapshots looked mostly empty. Walking back through the captures turned up a version from March 2021 that still had the full gallery model embedded in it. Pulling that data apart recovered the page text, the menu, the theme, and 139 image records.

Each image record pointed at an obfuscated Wix media ID rather than a real file. Tracing those IDs back to Wix's own image CDN showed the original full-resolution photographs were still sitting there, years after the site that used them had disappeared. A download pass retrieved every one. Thirty-four failed the first time and were pulled down on a second pass. That came to about 263 MB of artwork that had seemed lost.

With the originals back in hand, we rebuilt the site from scratch so it would never depend on Wix again. Every image is self-hosted, and every artwork has its own permanent page and its own social card. The gallery scores 100 on desktop Lighthouse. It's a small static build with no framework, served from Cloudflare's edge, and Alaina owns it outright at a domain of her own.

This is what a site rescue can look like even when the site is already gone. If the work was ever online, there's often more of it left than anyone thinks.
