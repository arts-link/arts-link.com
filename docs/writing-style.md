# Writing style

This page covers how arts-link.com sounds, what copy must never do, and how to write the descriptions, work entries and posts the site depends on.

**Source of truth:** `docs/site-system.yaml` → `positioning`, `services`, `page_inventory`; the copywriting rules in `AGENTS.md`. Good examples to read: `layouts/partials/modules/hero.html`, `content/work/alaina-varrone/index.md`, `content/blog/web-systems-adventure-mode.md`, `content/blog/screenshot-a-day/index.md`, `content/blog/family-archive/index.md`.

## Voice

The pitch is **"you get a real person"**, and the copy has to sound like one.

- **First person singular, from Ben.** Write "I build", "I'll be there when you need me". Use "we" only where it reads naturally in a project story ("we migrated the entire site"), and never as corporate filler.
- **Plain and concrete.** Short sentences. Name the actual thing: "138 artworks recovered from a Wix site", not "comprehensive content migration".
- **Warm, not salesy.** No urgency tricks, exclamation marks or superlatives. Confidence comes from specifics.
- **Honest about limits.** The Screenshot-a-Day post says plainly that it isn't a service promise. The archive worksheet sets price and timeline expectations up front. Say what something isn't.
- **Ownership is the through-line**: no lock-in, no recurring fees, yours to keep, take it with you.

## Positioning rules

**Don't let technology define the offering.** Arts-Link is a web studio, not a Hugo shop. Projects are built in whatever fits, and the portfolio already spans Hugo, Astro and other static builds.

| Surface | Name the stack? |
|---|---|
| Hero, taglines, nav, footer | ❌ sell the outcome: fast, beautiful, accessible, yours to own |
| Service descriptions, pricing | ❌ |
| `description`, meta, OG and Twitter text, social cards, `llms.txt` intro | ❌ |
| Work entry body, case study, blog post | ✅ when it's the subject: say Hugo when it's Hugo, Astro when it's Astro |

Rule of thumb: technology in the *body* of a project story, yes; technology in the *pitch*, no. `page-description.html` follows this too. Derived work descriptions never name a stack.

**Never link to the working surface of a tool we used.** That means no `claude.ai` artifact, shared chat, design-tool project, scratch document or notebook, anywhere a reader might follow it: work entries, posts, client email. Such links:
1. are usually private to whoever made them, so the reader hits a login wall
2. can be revoked or expire, and nothing here would notice
3. tell someone buying the result how the work was made

If something is worth showing, bring it into the repository and serve it from our domain.

## Descriptions

Each description is the meta description, the OG and Twitter text, and (on cards without a screenshot) the social card text, all at once.

- **Unique per page.** The smoke test enforces this.
- **Aim for 120–160 characters.** Authored copy isn't truncated, so you own the length.
- Lead with **who it was for and what changed**: "A site rescue for embroidery artist Alaina Varrone — 138 artworks recovered from a Wix site that had been gone for years, rebuilt as a fast portfolio she owns outright."
- No stack names, and no "Welcome to…".

## Work entries

Keep them short, usually 2–4 paragraphs:
1. **The situation**: what the client had or lacked, in their terms.
2. **What was done**: concrete, and the stack is fine here.
3. **The result**: speed, cost, ownership, and what the client can now do themselves.
4. If there's a longer write-up, link it: "Read the full story of how we built it →".

Open-source entries describe a contribution, not a client: what it is, its licence, and why it exists.

## Blog posts

- Open with the reader's problem, not with Arts-Link.
- Use `##` sections with plain-language headings, often questions ("Where Do You Even Start?").
- Use `---` rules between major movements, as the existing posts do.
- Use figures with real alt text that describes what's in the image (`{{< figure >}}`).
- End with the route to Contact. The layout adds the CTA block, so the closing paragraph should lead into it naturally.
- Every post needs a reason to exist in `site-system.yaml` → Blog notes.

## Conventions

- **"Arts-Link"** for the studio in prose. Use **arts-link.com** (lowercase) when referring to the website or domain.
- **Verdèzul** keeps its accent. Keep client names exactly as the client writes them.
- Use em dashes (—) with spaces, as the existing copy does. Use the arrow → for onward links and ↗ for external ones.
- Use US spelling (`languageCode = "en-us"`).
- Store `client_type` in lowercase; templates capitalize it.
- Prices are written "from $1,000", never as a range or "only".
