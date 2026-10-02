# Arts-Link.com knowledge base

This folder covers how arts-link.com works, why it is built the way it is, and how to change it safely. `AGENTS.md` at the repository root is the short version for agents, and every rule in it links back here.

Nothing in `docs/` is published. Hugo's content directory is `content/`, so these files never reach the build.

## Where to look

| If you need to… | Read | Authoritative for |
|---|---|---|
| Understand what the site is *for* | [`site-system.yaml`](site-system.yaml) | Metrics, positioning, services, page inventory, nav, conversion flow, content model |
| Plan a new page or module | [`web-systems-adventure-mode.md`](web-systems-adventure-mode.md) | The planning framework |
| Find where a template or style lives | [`architecture.md`](architecture.md) | Templates, CSS/JS pipeline, config, output formats |
| Add a work entry or blog post | [`content-model.md`](content-model.md) | Sections, front matter, the description cascade |
| Add a color, font or component | [`design-system.md`](design-system.md) | Tokens, theming, type, modules, Claude Design source |
| Write or edit copy | [`writing-style.md`](writing-style.md) | Voice, positioning, descriptions, story structure |
| Change the social share image | [`social-cards.md`](social-cards.md) | `ogcard` output, renderer, legibility |
| Ship, preview, or debug a deploy | [`deployment.md`](deployment.md) | Cloudflare Workers, Workers Builds, robots, DNS |
| Understand a red check | [`ci-and-testing.md`](ci-and-testing.md) | Workflows and test assertions |
| Track a new interaction | [`analytics.md`](analytics.md) | PostHog wiring, event inventory, dashboards |
| Read the numbers | [`metrics-and-stats.md`](metrics-and-stats.md) | Keystone metrics → events → funnels, review cadence |
| Decide whether something belongs in this repo | [`client-hub-boundary.md`](client-hub-boundary.md) | What lives in `clients.arts-link.com` |
| Log something stale you didn't fix | [`known-debt.md`](known-debt.md) | Known drift between docs, code and copy |

When two sources disagree, **the code that ships wins** over the docs, and `site-system.yaml` wins over the other docs on matters of strategy. Fix the loser in the same PR.

## Writing these docs

- **One topic per page.** Open with a sentence on what the page covers, then list the files it describes under **Source of truth**.
- **Explain *why*.** The code already says what it does. The useful part of a doc is the reasoning, the incident behind a rule, and what breaks when the rule is ignored. `scripts/cf-build.sh` and `wrangler.jsonc` set the standard here.
- **Use paths, not prose pointers.** Write `layouts/partials/page-description.html`, not "the description partial", so a reader can open the file.
- **Don't duplicate.** If something is explained in a file's own comment block, summarise it in a line and link to the file.
- **No secrets, no client material, and no links to tool working surfaces**: no `claude.ai` artifact links, shared chats or scratch notebooks. This repository is public.
- **Update in the same PR** as the change. A doc that lags the code is worse than no doc.
- Use plain Markdown, sentence-case headings and short sections. Use tables for inventories and fenced blocks for commands.
