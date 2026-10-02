# Client hub boundary

This page covers what belongs in this repository, what belongs in the private client hub, and why the line matters.

**Source of truth:** `docs/site-system.yaml` → `client_hub`. The hub's own build, access model and readability rules are in the `CLAUDE.md` of **`arts-link/clients.arts-link.com`**, a separate **private** repository.

## Why there's a boundary

**This repository is public and org-owned.** The hub used to be built from here as a second Hugo site (`content-clients/`, `layouts/hub/`, `middleware.ts` with HTTP Basic auth). Once it started holding real client material such as legal names, scope and pricing, it had to leave. It moved to its own private repository on Cloudflare Workers behind Cloudflare Access, with the cutover on 17 September 2026. Since 24 September none of it is here.

So anything about a specific client's engagement goes in the hub repo, or nowhere public.

## Keep out of this repo

- client names linked to scope, pricing, contracts, invoices or status
- proposals, estimates and statements of work, **including drafts** (see [`known-debt.md`](known-debt.md) about `content/draft-proposals/`)
- hub code: auth, Access policies, `run_worker_first`, `CLIENT_ROUTES`, hub templates
- hub design rules. The hub is **light by default, dark opt-in**, the reverse of this site, and has its own readability contract.
- personal contact details beyond the public `hello@arts-link.com`
- credentials of any kind, and links to tool working surfaces (see `AGENTS.md`)

## What legitimately lives here

| Item | Why |
|---|---|
| `content/client-hub/_index.md` | Public page where Cloudflare Access sends people it refuses. It **does not link to `clients.arts-link.com`**, because that would loop the person straight back into the refusal. It links to `/contact/` until Access admits clients on the catch-all app. Read its comments. |
| `site-system.yaml` → `client_hub` | The strategy record of what the hub is and why it moved. |
| Comments in `wrangler.jsonc` and `layouts/robots.txt` | Side-by-side reasoning with the hub's config, and the Bot Preference Sync incident that affected both sites. |
| `.gitignore` → `/public-clients/` | Defensive cover against a leftover local hub build being committed. |
| Published work entries and case studies | Public, client-approved stories are marketing, not engagement data. |

## Does this belong here?

1. Would it be fine on the public internet with the client's name next to it? If not, it goes to the hub repo.
2. Does a visitor deciding whether to hire Arts-Link need it? If so, it goes here.
3. Is it about running one client's project? If so, it goes to the hub repo.
4. Not sure? Leave it out and ask.

Shared lessons, like the robots.txt and Bot Preference Sync story, can be written up in both repos, and each copy should name the other.
