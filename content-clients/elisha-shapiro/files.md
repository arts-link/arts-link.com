+++
title = "Files"
weight = 30
blurb = "Your own copies: the full preservation archive, and the LA Freak book file."
client_name = "Elisha Shapiro"
project_title = "Moving nihilists.net"
phase = "Rescued and staged — awaiting launch decisions"
date = 2026-09-09
lastmod = 2026-09-15

eyebrow = "Moving nihilists.net"
title_heading = "Files"
lede = "Your own copies of everything that was on the old server, and the one large file that needs a decision from you."
+++

## Downloads

Both files are large, so they are delivered through a private shared folder
rather than from this page. Each link is restricted to your own account: signing
in with your email is what opens it, and nobody who stumbles across the address
can read it.

### The Preservation Archive

{{< hub/table >}}
| | |
|---|---|
| **Download** | *Pending file link — I'll email you the moment it's uploaded.* |
| File | `nihilists-net-archive-2026-09-14.tar.gz` |
| Size | 96,987,319 bytes (about 92 MB) |
| Taken | 14 September 2026 |
| SHA-256 | `b9143d792a6b381bd0fb08de80f5e8d24fa9f4aa61cf71034377c72f47652d77` |
{{< /hub/table >}}

That last line is a fingerprint of the file's contents. If you ever want to
check that a copy is intact — after a download, or years from now off a backup
drive — the fingerprint should still read exactly the same. On a Mac, open
Terminal, type `shasum -a 256 ` and drag the file onto the window.

**What's in it.** All 1,291 files retrieved from your hosting account, not just
the website: the folders above the public site, the old archived copies, the
statistics history, everything. It also keeps both spellings of two pairs of
files whose names differed only in capitalization — `God.jpeg` and `god.jpeg`,
`WhiteH.gif` and `whiteH.gif`. Each pair turned out to be the same image twice
over, but the names matter, because the new server treats capital letters
strictly and an old link to the wrong spelling would otherwise break.

One file out of 1,292 did not come across: `.membership`, three bytes, a marker
PowWeb keeps for its own billing. The server refuses to hand it over to anyone,
including you. It is not part of your website.

{{< hub/note >}}
**Keep this one to yourself.** It is a copy of the entire old hosting account,
so along with your site it contains the account's own machinery — server
paths, the old login records from the hosting company's file transfer system,
and years of raw visitor logs with people's IP addresses in them. None of that
is dangerous sitting on your own drive. It just isn't something to forward
around or post anywhere, which is why the link is tied to your account rather
than being open to anyone who has it.
{{< /hub/note >}}

### The LA Freak Book File

{{< hub/table >}}
| | |
|---|---|
| **Download** | *Pending file link — private until you've decided how it should be published.* |
| File | `la-freak-pix.pdf` (on the old server: `LA Freak 9o  pix.pdf`) |
| Size | 28,648,629 bytes (about 27.3 MB) |
| SHA-256 | `14d2fabf94ba2be65243546dda28df1194e6964add33e7dd3ac1e34f45583f64` |
{{< /hub/table >}}

This is the one file that could not come along with the rest of the site. The
new host refuses any single file over 25 MB, and this is 27.3 MB. It is safe
— preserved in the archive above and kept as its own copy — and it was left
out of the repository and the test site on purpose rather than by accident.

## Open Questions for Elisha

{{< hub/note >}}
**This is the one thing I need answers on.** There's no rush, and nothing is
broken in the meantime — the book file simply isn't reachable from the test
site until we decide how it should work.
{{< /hub/note >}}

1. Is this the final approved copy of the book, or is there a newer one I should
   be using?
2. What should the file be called when people download it, and what should the
   link on the page say?
3. Should it be a straight download anyone can take, a private file you send on
   request, or something attached to a sale?
4. However you currently send people the link to the book — should that keep
   working exactly as it does now?
5. Would `files.nihilists.net/la-freak-pix.pdf` be a reasonable permanent home
   for it?

**On the last one.** The plan is to put the file in Cloudflare R2, which is the
same company as the new host and is built for exactly this: large files that sit
beside a website without being part of it. It is inexpensive and it would give
the book a permanent address of its own. **Nothing has been set up and nothing
has been decided** — I'd rather hear your answers first, because a download
that's meant to be sold wants a different arrangement from one that's meant to
be free.

## Sending Things to Me

Email is fine:
[ben@benstrawbridge.com](mailto:ben@benstrawbridge.com). If you'd rather not put
a password in an email, call me on (917) 270-4317 and read it out instead.
