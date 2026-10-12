#!/usr/bin/env sh
#
# Run the Hugo this site is pinned to, wherever it is being built.
#
# The version lives in .hugo-version and nowhere else. CI, Workers Builds,
# the GitHub Pages workflow and every npm script go through this file, so
# changing that one line moves all of them together.
#
# WHY IT MATTERS HERE MORE THAN USUAL
#
# Different Hugo versions name resized images differently, and the social
# card pages embed those filenames. Cards rendered under one version look
# stale to `og:check` under another, so a local Hugo that drifts from CI's
# fails CI on cards nobody touched. That has already happened (PR #64).
#
# HOW
#
# If the `hugo` on PATH is already the pinned extended build, use it — that
# is the normal case on Workers Builds, whose image installs the version
# named by its HUGO_VERSION variable. Otherwise download the pinned release
# once into node_modules/.cache/hugo/<version>/, verify it against the
# release's published checksums, and use that. Nothing is installed
# globally, so a brew Hugo for other projects is left alone.
#
# layouts/partials/hugo-version-guard.html refuses to build under any other
# version, so running a bare `hugo` that does not match fails loudly rather
# than quietly producing different output.
set -eu

ROOT=$(cd "$(dirname "$0")/.." && pwd)
WANT=$(tr -d '[:space:]' < "$ROOT/.hugo-version")

matches() {
  # `hugo version` prints e.g. "hugo v0.138.0-ad82998d...+extended darwin/arm64"
  "$1" version 2>/dev/null | grep -q "v${WANT}[-+].*extended"
}

if command -v hugo >/dev/null 2>&1 && matches hugo; then
  exec hugo "$@"
fi

CACHE="$ROOT/node_modules/.cache/hugo/$WANT"
BIN="$CACHE/hugo"

if [ ! -x "$BIN" ] || ! matches "$BIN"; then
  case "$(uname -s)/$(uname -m)" in
    Darwin/*)              ASSET="hugo_extended_${WANT}_darwin-universal.tar.gz" ;;
    Linux/x86_64)          ASSET="hugo_extended_${WANT}_linux-amd64.tar.gz" ;;
    Linux/aarch64|Linux/arm64) ASSET="hugo_extended_${WANT}_linux-arm64.tar.gz" ;;
    *) echo "hugo.sh: no Hugo release for $(uname -s)/$(uname -m)" >&2; exit 1 ;;
  esac

  BASE="https://github.com/gohugoio/hugo/releases/download/v${WANT}"
  TMP=$(mktemp -d)
  trap 'rm -rf "$TMP"' EXIT

  echo "hugo.sh: fetching Hugo extended ${WANT} (pinned in .hugo-version)" >&2
  curl -fsSL -o "$TMP/$ASSET" "$BASE/$ASSET"
  curl -fsSL -o "$TMP/checksums.txt" "$BASE/hugo_${WANT}_checksums.txt"

  EXPECTED=$(grep " ${ASSET}\$" "$TMP/checksums.txt" | cut -d' ' -f1)
  if command -v sha256sum >/dev/null 2>&1; then
    ACTUAL=$(sha256sum "$TMP/$ASSET" | cut -d' ' -f1)
  else
    ACTUAL=$(shasum -a 256 "$TMP/$ASSET" | cut -d' ' -f1)
  fi
  if [ -z "$EXPECTED" ] || [ "$EXPECTED" != "$ACTUAL" ]; then
    echo "hugo.sh: checksum mismatch for $ASSET" >&2
    exit 1
  fi

  tar -xzf "$TMP/$ASSET" -C "$TMP" hugo
  mkdir -p "$CACHE"
  mv "$TMP/hugo" "$BIN"
  chmod +x "$BIN"
fi

exec "$BIN" "$@"
