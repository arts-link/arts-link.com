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
set -eu

if [ "${VERCEL_ENV:-}" = "production" ] || [ -z "${VERCEL_URL:-}" ]; then
  # Production, or any build outside Vercel: use the baseURL from config.
  hugo --minify
else
  # Prefer the branch alias — it survives redeploys, so a preview link shared
  # from a PR keeps resolving. VERCEL_URL is the per-deployment fallback.
  hugo --minify --baseURL "https://${VERCEL_BRANCH_URL:-$VERCEL_URL}/"
fi
