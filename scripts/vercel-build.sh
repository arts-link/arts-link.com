#!/usr/bin/env sh
#
# Vercel build.
#
# Every deployment is built from the same repository config, but a preview is
# served from its own hostname. Hugo resolves every absolute URL — og:image,
# og:url, canonical, the JSON-LD @ids, the sitemap line in robots.txt — against
# baseURL, so without this a preview advertises production's social cards and
# canonicalises itself to the live site.
#
# The GitHub Pages workflow already does the same thing with the URL Pages
# hands it; this is the Vercel half.
#
# The same script builds two Vercel projects from this repo. The public site
# leaves HUGO_ENVIRONMENT unset and gets `production`, which is what Hugo would
# have defaulted to anyway; the client hub project sets HUGO_ENVIRONMENT=clients
# and picks up config/clients/.
set -eu

HUGO_ENVIRONMENT="${HUGO_ENVIRONMENT:-production}"
export HUGO_ENVIRONMENT

if [ "${VERCEL_ENV:-}" = "production" ] || [ -z "${VERCEL_URL:-}" ]; then
  # Production, or any build outside Vercel: use the baseURL from config.
  hugo --minify --environment "$HUGO_ENVIRONMENT"
else
  # Prefer the branch alias — it survives redeploys, so a preview link shared
  # from a PR keeps resolving. VERCEL_URL is the per-deployment fallback.
  hugo --minify --environment "$HUGO_ENVIRONMENT" --baseURL "https://${VERCEL_BRANCH_URL:-$VERCEL_URL}/"
fi
