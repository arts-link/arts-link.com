#!/usr/bin/env sh
#
# Cloudflare Workers Builds build.
#
# Replaces scripts/vercel-build.sh. Same job — stop a preview deployment from
# lying about its own identity — but it cannot solve it the same way, and the
# difference is worth understanding before changing anything here.
#
# WHY THIS IS NOT A PORT OF THE VERCEL SCRIPT
#
# Hugo bakes baseURL into every absolute URL at build time: og:image, og:url,
# canonical, the JSON-LD @ids, the Sitemap line in robots.txt. On Vercel we
# handled previews by building with --baseURL set to the deployment's own
# hostname, which Vercel hands the build in VERCEL_BRANCH_URL.
#
# Workers Builds has no equivalent. It injects WORKERS_CI, WORKERS_CI_BRANCH,
# WORKERS_CI_COMMIT_SHA and WORKERS_CI_BUILD_UUID — and no URL. That is not an
# oversight: a preview URL is <ALIAS-OR-VERSION-PREFIX>-<WORKER>.<SUBDOMAIN>
# .workers.dev, and the alias is assigned during `versions upload`, i.e. after
# this script has already finished. The hostname does not exist yet while we
# are building for it.
#
# We could guess it. That would mean reproducing Cloudflare's branch-name
# sanitisation (lowercase, dashes only, must start with a letter, alias plus
# worker name capped at 63 characters for DNS) and its truncate-and-hash rule
# for long names. Guessing wrong is silent and produces a build whose canonical
# points at a host that does not resolve — worse than not setting one at all.
#
# WHAT WE DO INSTEAD
#
# Production builds use the configured baseURL, which is simply correct.
#
# Preview builds keep that baseURL but set HUGO_PARAMS_PREVIEW, which makes
# layouts/_default/baseof.html emit `noindex, nofollow` and omit both the
# canonical link and og:url entirely. That addresses the real harm more
# directly than swapping the hostname did: the danger was never an ugly URL, it
# was a public crawlable copy of the site telling search engines either to index
# it or that its canonical is the production page. Emitting no canonical at all
# asserts nothing, which is the honest answer for a build that does not know
# where it lives.
#
# Preview URLs are public when enabled, so this matters here even though the
# site has nothing secret in it.
#
# If you do know the preview hostname — you assigned the alias yourself, or you
# are building for some other host — set PREVIEW_BASE_URL and it is used as-is.
# The noindex still applies: a preview should not compete with production in
# search results regardless of whether its URLs are right.
set -eu

PRODUCTION_BRANCH="${PRODUCTION_BRANCH:-main}"

# Outside Workers Builds (a local run, or CI that just wants the artifact)
# there is no deployment to be wrong about, so build exactly as production.
# Same rule the Vercel script used for builds with no VERCEL_URL.
if [ -z "${WORKERS_CI:-}" ] || [ "${WORKERS_CI_BRANCH:-}" = "$PRODUCTION_BRANCH" ]; then
  echo "cf-build: production build (baseURL from config)"
  exec hugo --minify "$@"
fi

echo "cf-build: preview build of branch '${WORKERS_CI_BRANCH:-unknown}' — noindex, no canonical"

# Exported rather than prefixed onto the command: `VAR=x exec cmd` is valid
# POSIX but its scoping around a special builtin is subtle enough that it is
# not worth being clever about in a build that runs unattended.
HUGO_PARAMS_PREVIEW=true
export HUGO_PARAMS_PREVIEW

if [ -n "${PREVIEW_BASE_URL:-}" ]; then
  echo "cf-build: using PREVIEW_BASE_URL=$PREVIEW_BASE_URL"
  exec hugo --minify --baseURL "$PREVIEW_BASE_URL" "$@"
fi

exec hugo --minify "$@"
