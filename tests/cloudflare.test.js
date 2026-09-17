/**
 * Cloudflare Workers deployment.
 *
 * Two things are checked here, and they fail in very different ways.
 *
 * The Wrangler config is read straight off disk — cheap, no build needed.
 *
 * The preview-build behaviour needs a real Hugo run, because the thing being
 * tested is what the template emits under a flag, and asserting that by
 * reading the template back would only prove the file says what the file says.
 * That build goes to a temp directory so it can never clobber `public/`, which
 * the rest of the suite reads.
 *
 * Both skip themselves when their prerequisite is missing, matching the rest
 * of the suite, so this file is safe on a machine with no Hugo.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const WRANGLER = path.join(ROOT, 'wrangler.jsonc');

const hasHugo = (() => {
  try {
    execFileSync('hugo', ['version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
})();

describe('wrangler.jsonc', () => {
  const config = JSON.parse(
    // Strip // comments. Crude, but the file is ours and has no string
    // literal containing a double slash except the $schema path, which is
    // matched only at the start of a line's leading whitespace.
    fs.readFileSync(WRANGLER, 'utf8').replace(/^\s*\/\/.*$/gm, ''),
  );

  it('names the Worker so Workers Builds can find it', () => {
    // Workers Builds matches on this. A mismatch fails the deploy with an
    // error that does not obviously point back at this file.
    expect(config.name).toBe('arts-link-com');
  });

  it('is assets-only — no Worker script in front of a static site', () => {
    expect(config.main).toBeUndefined();
  });

  it('serves the site out of public/', () => {
    expect(config.assets.directory).toBe('./public');
  });

  it('serves the real 404 page with a 404 status', () => {
    expect(config.assets.not_found_handling).toBe('404-page');
  });

  it('serves folder indexes with a trailing slash', () => {
    // Hugo emits /about/index.html. Dropping trailing slashes here would
    // break every internal link on the site at once.
    expect(config.assets.html_handling).toBe('auto-trailing-slash');
  });
});

describe.skipIf(!hasHugo)('preview builds do not impersonate production', () => {
  let head;
  let robots;
  let out;

  beforeAll(() => {
    out = fs.mkdtempSync(path.join(os.tmpdir(), 'cf-preview-'));
    execFileSync('sh', ['scripts/cf-build.sh', '--destination', out], {
      cwd: ROOT,
      stdio: 'ignore',
      env: {
        ...process.env,
        WORKERS_CI: '1',
        WORKERS_CI_BRANCH: 'a-branch-that-is-not-production',
      },
    });
    head = fs.readFileSync(path.join(out, 'index.html'), 'utf8');
    robots = fs.readFileSync(path.join(out, 'robots.txt'), 'utf8');
  });

  // The whole point. Workers Builds cannot tell the build its own preview
  // hostname, so a preview's absolute URLs still say www.arts-link.com. If it
  // also shipped a canonical, it would be telling Google that a throwaway
  // deployment and the live site are the same page.
  it('emits no canonical', () => {
    expect(head).not.toMatch(/rel=["']?canonical/);
  });

  it('emits no og:url', () => {
    expect(head).not.toMatch(/og:url/);
  });

  it('asks not to be indexed', () => {
    expect(head).toMatch(/name=["']?robots["']?\s+content=["']noindex/);
  });

  it('disallows crawling in robots.txt and advertises no sitemap', () => {
    expect(robots).toMatch(/Disallow:\s*\/\s*$/m);
    expect(robots).not.toMatch(/Sitemap:/i);
  });
});

describe.skipIf(!hasHugo)('production builds are unchanged', () => {
  let head;
  let robots;

  beforeAll(() => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), 'cf-prod-'));
    // WORKERS_CI unset — the same path a local `hugo --minify` takes, and the
    // one Workers Builds takes on the production branch.
    execFileSync('sh', ['scripts/cf-build.sh', '--destination', out], {
      cwd: ROOT,
      stdio: 'ignore',
    });
    head = fs.readFileSync(path.join(out, 'index.html'), 'utf8');
    robots = fs.readFileSync(path.join(out, 'robots.txt'), 'utf8');
  });

  it('still emits a canonical', () => {
    // --minify strips quotes from attribute values, so every quote here has
    // to be optional. The smoke suite carries the same warning at the top of
    // the file; this is the mistake it is warning about.
    expect(head).toMatch(/rel=["']?canonical["']?\s+href=["']?https:\/\/www\.arts-link\.com/);
  });

  it('still emits og:url', () => {
    expect(head).toMatch(/og:url/);
  });

  it('does not carry the preview noindex', () => {
    expect(head).not.toMatch(/name=["']?robots["']?\s+content=["']noindex/);
  });

  it('still allows crawling and advertises the sitemap', () => {
    expect(robots).toMatch(/Allow:\s*\//);
    expect(robots).toMatch(/Sitemap:\s*https:\/\/www\.arts-link\.com\/sitemap\.xml/);
  });
});
