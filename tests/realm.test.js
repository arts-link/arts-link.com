/**
 * Regression: the Basic Auth realm is echoed into a response header and is
 * built from the request path.
 *
 * Header values are ByteStrings, so a non-ASCII character throws when the
 * Response is constructed — which turns every unauthenticated request into a
 * 500 instead of a password prompt. An unescaped quote would let a crafted URL
 * inject into the header. Both are caught here rather than in production.
 */

import { describe, it, expect, afterEach } from 'vitest';
import middleware from '../middleware.ts';

afterEach(() => {
  for (const key of Object.keys(process.env)) {
    if (key.startsWith('CLIENT_HUB_')) delete process.env[key];
  }
});

const HOSTILE_SEGMENTS = [
  ['em dash', 'ris—a'],
  ['double quote', 'ris"a'],
  ['backslash', 'ris\\a'],
  ['newline', 'ris\na'],
  ['emoji', 'risa\u{1F600}'],
  ['cyrillic', 'риса'],
];

describe('Basic Auth realm is header-safe', () => {
  it.each(HOSTILE_SEGMENTS)('builds a valid 401 for a path containing %s', (_label, segment) => {
    process.env.CLIENT_HUB_ENABLED = '1';

    const url = `https://clients.arts-link.com/${encodeURIComponent(segment)}/`;
    const res = middleware(new Request(url));

    expect(res.status).toBe(401);

    const header = res.headers.get('WWW-Authenticate');
    // Printable ASCII only — anything else would have thrown on construction.
    expect(header).toMatch(/^[\x20-\x7E]*$/);
    // Exactly two quoted values: realm="…" and charset="…". More means injection.
    expect(header.match(/"/g)).toHaveLength(4);
  });
});
