+++
title = "Your Website Isn't Broken. It's Just Invisible."
date = 2026-11-19
description = "A well-built website can still be hard to find. The hidden problems that keep artists' sites out of web searches, AI answers and link previews, and how to fix them."
# PREVIEW ONLY: published on the PR branch so the Workers preview can show it.
# BEFORE MERGING: set draft = true and date = 2026-12-10, then run
# `npm run build && npm run og` (it removes this page's social card).
draft = false
# The closing paragraph is the invitation; skip the shared "Ready to Talk?" block.
hide_cta_block = true
+++

A website may look good, load properly, and work as it should. Anyone who already knows the address can find everything on it.

But for a lot of people who may be looking for it, it's practically invisible.

What you see when you open your site in a browser and what a search engine sees are two different things. A site can be beautiful to people and confusing to machines, and these days, machines decide a lot about who finds you.

I wrote recently about [websites that need rescuing](/blog/website-rescue/) even though they work fine. The surprise bills, the lapsed domains, the hosts that change hands. This is a different problem: nothing is going wrong, but something isn't happening.

---

## The Site That Ranks First and Still Has Gaps

A writer I've been working with has a site that comes up first on Google for the searches that matter most to it. By any normal measure, it's doing well.

Then we looked at Google's own reports. Search Console, the free tool Google gives site owners, listed 54 of the site's story essays as "crawled, currently not indexed." Google had visited those pages and, for the time being, left them out of its search results.

That label isn't an error message. Google doesn't index every page it sees, and it doesn't explain its choices page by page. But when the pages being passed over are the heart of the site, it's worth a careful look.

The same review turned up a few other things, unrelated to that list and to each other. The site had a sitemap, but it had never been submitted to Search Console, so nobody was taking note of what Google made of it. The homepage's title and main heading needed work. And a 418 KB font file that wasn't used on the page was loading anyway.

Addressing these issues didn't change anything about how the site looks.

---

## Can People Find Your Work?

Every page has a title, the one in the browser tab, and Google usually shows it as the blue link in search results. On a lot of sites every page is titled "Home," or just the artist's name. Each page can also carry a short description. Google often uses it as the gray text under the link, but it's free to write its own snippet from the page instead, which is how a portfolio can end up described by its cookie notice. The description is a suggestion. The page itself has to say what it's about.

Then there's getting in. Sometimes a setting left over from when the site was being built is still telling search engines to stay away. A sitemap, a plain list of your pages, helps search engines find everything, though they also find pages by following links. That makes the links between your own pages matter more than people expect. An exhibition page that nothing links to is hard for anyone to find, human or machine.

Sites also collect duplicate addresses over the years: with and without "www," old and new versions of the same page. Search engines usually work out which one is the real one, but when a site sends mixed signals, they may pick the wrong one. And when pages move, the old addresses should lead somewhere. When I moved [a hand-built site that had been online since the late 1990s](/work/nihilists-net/), part of the job was 36 permanent redirects, so addresses people had bookmarked and linked to for decades still land where they should.

---

## Does Anyone Understand What They've Found?

Getting found is half of it. The other half is being understood.

A page should have one main heading that says what it's about, with sections under it that make sense in order. People skim that way, and so do machines. Images need words too. Every picture can carry a short description, called alt text, that tells search engines and anyone using a screen reader what's in it. Without it, a painting and a placeholder look the same. For an artist, whose whole site is pictures, that's a lot of work going unseen.

You can tell in a second that a site belongs to an artist and that these are their works and exhibitions. A search engine has to work that out from the code. Structured data spells it out: a small block of labeled information on each page, invisible to visitors, that says this is a person, this is an artwork, this is a performance on this date at this place. This site uses it to describe the studio and its services. It doesn't guarantee special treatment in search results or a better ranking. It removes the guesswork.

Then there's AI search. More people now find artists and writers by asking an AI assistant, and it's reasonable to wonder whether your work is part of those answers.

I'll be straight about this. Nobody controls what those systems include, and anyone promising to get you "into" AI answers is promising something they can't deliver. What does help is the same groundwork as everything above: clear writing that says who you are and what you make, [pages that each have one job](/blog/web-systems-adventure-mode/), accurate titles, and labeled information about your work. That makes a site easier for any system to read and to quote correctly. It's worth doing for its own sake, and it doesn't depend on guessing where AI search goes next.

---

## What Happens When Someone Shares It?

Here's one most people only notice when it's embarrassing. Someone shares a link to your show, and the preview in their post or message shows the wrong image, a stretched logo, or nothing at all. That preview comes from a few lines of hidden information on each page that name the image, title and description to use. They're often left at whatever the platform defaults to.

This is where putting artwork online and making it findable part ways. When I rebuilt [an embroidery artist's portfolio](/work/alaina-varrone/), 138 recovered artworks each got a permanent page of their own and their own preview card. A single piece has an address that can be searched for, linked to and shared, and sharing it shows that piece, not the homepage.

The visit itself matters too. A gallery page of photographs uploaded straight from a camera can weigh as much as a small app; on a phone in a gallery basement, it may never finish loading. Layouts that break on a small screen, menus that need a mouse, and pale gray text on a light background turn people away just as quietly. Search engines do pay some attention to speed and mobile layouts, but don't expect a faster site to leap up the rankings on its own. The real reason to fix these is the visitors who leave and never tell you why.

---

## How Do You Know What's Working?

Finally, you should be able to answer a simple question: are people finding my site, how, and what do they look at?

That doesn't have to mean invasive tracking or a cookie banner. On recent sites I've set up visitor statistics that don't use cookies at all. The trade-off is that they can't recognize a returning visitor, which is why it's your decision, not mine. Paired with Search Console, which shows the searches your site appears for and how Google is handling your pages, that's usually enough to see which pages people actually find useful, and which ones nobody reaches.

---

## You Don't Need a New Website for This

Almost none of this requires a redesign. Most of it happens where visitors never look.

For artists, the point isn't to rank for some generic phrase like "contemporary painter." It's that when someone searches for your name, a particular piece, a past exhibition, or a project they heard about, they find you, and what they find is accurate.

If you'd like me to look at your site with that in mind, whoever built it, [send me the address](/contact/). I'll tell you what I find, and what I'd leave alone.
