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

const RISA = { user: 'risa', pass: 'correct horse battery staple' };
const JILL = { user: 'jill', pass: 'a different password entirely' };

function req(path, credentials) {
  const headers = credentials ? { authorization: `Basic ${btoa(credentials)}` } : {};
  return new Request(`https://clients.arts-link.com${path}`, { headers });
}

/** Set up a clients deployment carrying the given clients. */
function deploy(clients = {}) {
  process.env.CLIENT_HUB_ENABLED = '1';
  for (const [slug, { user, pass }] of Object.entries(clients)) {
    const key = slug.toUpperCase().replace(/[^A-Z0-9]/g, '_');
    process.env[`CLIENT_HUB_${key}_USER`] = user;
    process.env[`CLIENT_HUB_${key}_PASS`] = pass;
  }
}

afterEach(() => {
  for (const key of Object.keys(process.env)) {
    if (key.startsWith('CLIENT_HUB_') || key.startsWith('HUB_ADMIN_')) delete process.env[key];
  }
});

describe('client hub auth — the public build', () => {
  // If this regresses, arts-link.com starts asking visitors for a password.
  it('is inert without CLIENT_HUB_ENABLED, whatever the path', () => {
    for (const path of ['/', '/work/', '/risa/proposal/', '/blog/some-post/']) {
      expect(middleware(req(path))).toBeUndefined();
    }
  });

  it('stays inert even if client credentials are somehow present', () => {
    process.env.CLIENT_HUB_RISA_USER = RISA.user;
    process.env.CLIENT_HUB_RISA_PASS = RISA.pass;
    expect(middleware(req('/risa/proposal/'))).toBeUndefined();
  });
});

describe('client hub auth — the public surface of the clients build', () => {
  it('serves the landing stub without credentials', () => {
    deploy({ risa: RISA });
    expect(middleware(req('/'))).toBeUndefined();
  });

  it.each(['/robots.txt', '/404.html', '/flyer.html'])('serves %s without credentials', (path) => {
    deploy({ risa: RISA });
    expect(middleware(req(path))).toBeUndefined();
  });
});

describe('client hub auth — per-client credentials', () => {
  it('challenges an unauthenticated client path', () => {
    deploy({ risa: RISA });
    const res = middleware(req('/risa/proposal/'));
    expect(res.status).toBe(401);
    expect(res.headers.get("WWW-Authenticate")).toContain(String.raw`realm="Arts-Link risa"`);
    expect(res.headers.get('X-Robots-Tag')).toContain('noindex');
  });

  it('lets the right client through', () => {
    deploy({ risa: RISA });
    expect(middleware(req('/risa/proposal/', `${RISA.user}:${RISA.pass}`))).toBeUndefined();
  });

  // The reason this exists at all: every proposal carries pricing.
  it('does not let one client into another client’s hub', () => {
    deploy({ risa: RISA, jill: JILL });
    expect(middleware(req('/jill/proposal/', `${RISA.user}:${RISA.pass}`)).status).toBe(401);
    expect(middleware(req('/risa/proposal/', `${JILL.user}:${JILL.pass}`)).status).toBe(401);
    // …and each still works on their own.
    expect(middleware(req('/risa/', `${RISA.user}:${RISA.pass}`))).toBeUndefined();
    expect(middleware(req('/jill/', `${JILL.user}:${JILL.pass}`))).toBeUndefined();
  });

  // Adding a content folder and forgetting the variables must not publish it.
  it('fails closed for a client with no credentials configured', () => {
    deploy({ risa: RISA });
    expect(middleware(req('/newclient/proposal/')).status).toBe(401);
    expect(middleware(req('/newclient/proposal/', `${RISA.user}:${RISA.pass}`)).status).toBe(401);
  });

  it('maps a hyphenated folder to an underscored variable', () => {
    deploy({ 'jill-bonovitz': JILL });
    expect(middleware(req('/jill-bonovitz/', `${JILL.user}:${JILL.pass}`))).toBeUndefined();
    expect(middleware(req('/jill-bonovitz/')).status).toBe(401);
  });
});

describe('client hub auth — credential handling', () => {
  it.each([
    ['wrong password', `${RISA.user}:nope`],
    ['wrong user', `someone:${RISA.pass}`],
    ['both wrong', 'someone:nope'],
    ['empty', ':'],
    ['no colon', RISA.user],
  ])('challenges on %s', (_label, credentials) => {
    deploy({ risa: RISA });
    expect(middleware(req('/risa/', credentials)).status).toBe(401);
  });

  // A password may legitimately contain a colon; only the first one separates.
  it('accepts a password containing a colon', () => {
    deploy({ risa: { user: 'risa', pass: 'a:b:c' } });
    expect(middleware(req('/risa/', 'risa:a:b:c'))).toBeUndefined();
  });

  it('challenges on a malformed authorization header', () => {
    deploy({ risa: RISA });
    for (const header of ['Basic !!!not-base64!!!', 'Bearer token', 'Basic']) {
      const r = new Request('https://clients.arts-link.com/risa/', { headers: { authorization: header } });
      expect(middleware(r).status).toBe(401);
    }
  });
});

describe('client hub auth — the admin pair', () => {
  const ADMIN = { user: 'ben', pass: 'a master password' };

  function withAdmin(clients = {}) {
    deploy(clients);
    process.env.HUB_ADMIN_USER = ADMIN.user;
    process.env.HUB_ADMIN_PASS = ADMIN.pass;
  }

  const admin = `${ADMIN.user}:${ADMIN.pass}`;

  it('opens every client hub', () => {
    withAdmin({ risa: RISA, jill: JILL });
    for (const path of ['/risa/', '/risa/proposal/', '/jill/', '/jill/status/']) {
      expect(middleware(req(path, admin))).toBeUndefined();
    }
  });

  // So a new hub can be reviewed before its own password is set.
  it('opens a client that has no credentials of its own', () => {
    withAdmin({});
    expect(middleware(req('/newclient/proposal/', admin))).toBeUndefined();
  });

  it('does not weaken the client pairs', () => {
    withAdmin({ risa: RISA, jill: JILL });
    expect(middleware(req('/risa/', `${RISA.user}:${RISA.pass}`))).toBeUndefined();
    expect(middleware(req('/jill/', `${RISA.user}:${RISA.pass}`)).status).toBe(401);
    expect(middleware(req('/risa/')).status).toBe(401);
  });

  it('is still refused when wrong', () => {
    withAdmin({ risa: RISA });
    for (const bad of [`${ADMIN.user}:nope`, `nobody:${ADMIN.pass}`, 'nobody:nope']) {
      expect(middleware(req('/risa/', bad)).status).toBe(401);
    }
  });

  // Absent admin variables, behaviour is exactly as before.
  it('changes nothing when not configured', () => {
    deploy({ risa: RISA });
    expect(middleware(req('/risa/', admin)).status).toBe(401);
    expect(middleware(req('/risa/', `${RISA.user}:${RISA.pass}`))).toBeUndefined();
    expect(middleware(req('/newclient/', admin)).status).toBe(401);
  });

  // HUB_ADMIN_ rather than CLIENT_HUB_ADMIN_ precisely so this cannot happen.
  it('does not collide with a client folder named admin', () => {
    withAdmin({ admin: { user: 'theclient', pass: 'their own password' } });
    expect(middleware(req('/admin/', 'theclient:their own password'))).toBeUndefined();
    expect(middleware(req('/admin/', admin))).toBeUndefined();
    expect(middleware(req('/admin/', 'theclient:wrong')).status).toBe(401);
  });
});
