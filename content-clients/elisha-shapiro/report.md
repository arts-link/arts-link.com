+++
title = "Report"
weight = 40
blurb = "What was rescued, what was rebuilt, and how each step was checked."
client_name = "Elisha Shapiro"
project_title = "Moving nihilists.net"
phase = "Rescued and staged — awaiting launch decisions"
date = 2026-09-15
lastmod = 2026-09-15

eyebrow = "Moving nihilists.net"
title_heading = "The move, in"
title_emphasis = "review"
lede = "Twenty-three years of nihilists.net, taken off a dying host, verified file by file, and rebuilt somewhere it can sit safely for another twenty-three."
+++

## What came off the old server

Your hosting account held a great deal more than the website. Above the public
folder sat old archived copies, a `stats` directory going back to 2002, loose
working files and duplicate folders from past edits. A backup that only took the
public site — which is what most tools do by default — would have quietly left
all of that behind.

So the whole account came across, not just the website. **1,291 of the 1,292
files on the server were retrieved**, and the count was verified independently
rather than taken on trust. The single miss, `.membership`, is a three-byte
marker PowWeb keeps for its own accounting; the server refuses to release it to
anybody.

That complete copy was then sealed into a single archive file, which keeps
everything exactly as it was — including the two pairs of filenames that differ
only by a capital letter. Your copy of that archive is on
[Your files]({{< relref "files" >}}).

## What was rebuilt

From those 1,291 files, the actual public website is **29 pages and 143
images, PDFs and other pieces** they depend on. Everything else — the duplicate
folders, the old statistics, the abandoned experiments — stays preserved in the
archive rather than being republished.

That website now lives in a private repository in the Arts-Link organisation on
GitHub. A repository is really just a folder that remembers every version of
itself: nothing can be lost by overwriting it, and any earlier state can be
brought back. It is private, so only you and I can see it.

From there, **Cloudflare publishes the site automatically.** Cloudflare is one
of the largest networks on the internet, and for a site like yours — pages,
images and PDFs, with no software running behind them — it costs nothing and it
does not go down.

## Old links still work

Some page and image names changed along the way, mostly to remove the spaces
and capital letters that the old host tolerated and the new one does not.
**Thirty-six permanent redirects** sit in front of the site so that every
historic address still lands in the right place.

That matters more here than it would for most sites. Almost nobody arrives at
nihilists.net from a search engine — they type the address or use a bookmark
saved years ago. There is no search index quietly re-pointing people, so old
links are the only way in.

## How it was checked

{{< hub/spine >}}
{{< hub/era years="EVERY FILE" title="All 143 public files load" >}}
Each page, image and PDF requested individually on the test site. All returned
successfully.
{{< /hub/era >}}
{{< hub/era years="ALL 36" title="Every old address redirects" >}}
Each historic link followed, and each one arrives at the page it should.
{{< /hub/era >}}
{{< hub/era years="THE GAPS" title="Missing pages behave" >}}
A page that does not exist returns a proper "not found" rather than an error —
and the site's own working files stay invisible to visitors.
{{< /hub/era >}}
{{< hub/era years="BY EYE" title="Pages looked at, not just tested" >}}
Home, the film festival, press, the newsletter and the 1988 archive page were
opened and read in a browser.
{{< /hub/era >}}
{{< hub/era years="ONE FIX" title="A broken image, found and repaired" >}}
The newsletter pulled one image over an old insecure address, which modern
browsers block. It now loads from the site itself.
{{< /hub/era >}}
{{< /hub/spine >}}

That last one is the argument for looking at pages with your own eyes. Every
automated check had passed; the image only revealed itself when someone actually
read the page.

## The lesson worth keeping

{{< hub/pull >}}
Several of the old systems reported success while quietly leaving things out.
{{< /hub/pull >}}

The file transfer said it had copied everything, and had missed a file. The
statistics program said it was running, and had stopped in June. The hosting
control panel listed settings that were not actually in effect anywhere.

None of that is unusual for software of this vintage — and none of it announces
itself. It is the reason each step of this move was checked independently
afterwards, by a different means than the one that did the work. The one loose
file on your server was caught exactly that way, by a second pass that had no
reason to agree with the first.

## Your statistics

Your visitor statistics had already failed on the old host, months before any of
this started — which is what the apparent drop in traffic really was. The full
picture, including what the raw records actually show about who reads your site,
is in the [audience report](/elisha-shapiro/audience-report.html), with the
longer historical view in the [full traffic
report](https://claude.ai/artifact/GnX8caft4bxAhGkkH7ZDgn).

Statistics are running on the test site now, which is how I know they work. But
**those numbers are mine, not yours** — they are my own checking visits, and a
handful of them. A clean count that only measures your real readers gets set up
as part of the launch.

## What has not happened

Nothing about the live site has been touched. Its domain settings and
nameservers are exactly as they were, the PowWeb account is still running and
paid, and the old site is still the one the world sees. What is left to do
before that changes is on [Status]({{< relref "status" >}}).
