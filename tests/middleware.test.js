/**
 * Client hub Basic Auth (middleware.ts).
 *
 * The one thing these tests cannot cover is whether returning `undefined`
 * actually continues the request to the static asset — that is Vercel edge
 * behaviour and only a real deployment proves it. Everything else about the
 * gate is decided here.
 */

import { describe, it, expect, afterEach } from 'vitest';
import middleware from '../middleware.ts';

const USER = 'client';
const PASS = 'correct horse battery staple';

function req(credentials) {
  const headers = credentials ? { authorization: `Basic ${btoa(credentials)}` } : {};
  return new Request('https://clients.arts-link.com/risa/proposal/', { headers });
}

// Assigning undefined to process.env stringifies it to "undefined", which is
// truthy — an unset variable has to be deleted.
function configure(user, pass) {
  if (user === undefined) delete process.env.CLIENT_HUB_USER;
  else process.env.CLIENT_HUB_USER = user;
  if (pass === undefined) delete process.env.CLIENT_HUB_PASS;
  else process.env.CLIENT_HUB_PASS = pass;
}

afterEach(() => {
  delete process.env.CLIENT_HUB_USER;
  delete process.env.CLIENT_HUB_PASS;
});

describe('client hub Basic Auth', () => {
  // The public production build sets neither variable. If this ever regresses,
  // arts-link.com starts asking visitors for a password.
  it('is inert when no credentials are configured', () => {
    expect(middleware(req())).toBeUndefined();
    expect(middleware(req(`${USER}:${PASS}`))).toBeUndefined();
  });

  it('is inert when only one of the two is set', () => {
    configure(USER, undefined);
    expect(middleware(req())).toBeUndefined();
  });

  it('challenges an unauthenticated request', () => {
    configure(USER, PASS);
    const res = middleware(req());
    expect(res.status).toBe(401);
    expect(res.headers.get('WWW-Authenticate')).toContain('Basic realm="Arts-Link"');
    expect(res.headers.get('X-Robots-Tag')).toContain('noindex');
  });

  it('lets correct credentials through', () => {
    configure(USER, PASS);
    expect(middleware(req(`${USER}:${PASS}`))).toBeUndefined();
  });

  it.each([
    ['wrong password', `${USER}:nope`],
    ['wrong user', `someone:${PASS}`],
    ['both wrong', 'someone:nope'],
    ['empty', ':'],
    ['no colon', USER],
  ])('challenges on %s', (_label, credentials) => {
    configure(USER, PASS);
    expect(middleware(req(credentials)).status).toBe(401);
  });

  // A password may legitimately contain a colon; only the first one separates.
  it('accepts a password containing a colon', () => {
    configure(USER, 'a:b:c');
    expect(middleware(req(`${USER}:a:b:c`))).toBeUndefined();
  });

  it('challenges on a malformed authorization header', () => {
    configure(USER, PASS);
    for (const header of ['Basic !!!not-base64!!!', 'Bearer token', 'Basic']) {
      const r = new Request('https://clients.arts-link.com/', { headers: { authorization: header } });
      expect(middleware(r).status).toBe(401);
    }
  });
});
