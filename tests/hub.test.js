/**
 * Client hub build checks.
 *
 * Reads `public-clients/`, which is produced by:
 *
 *   hugo --environment clients --destination public-clients
 *
 * When that directory is absent the suite skips itself, the same way
 * smoke.test.js skips without `public/`.
 *
 * The relative-link check exists because of a real bug: `[files](files/)` in
 * the hub landing page emitted `href="files/"`, which resolves against the
 * *current* URL. From `/risa/` that is `/risa/files/` and looks fine; from
 * `/risa` — no trailing slash — it is `/files/`, which does not exist.
 * smoke.test.js could not catch it, because it only inspects hrefs beginning
 * with `/` and a relative one is filtered out before it is ever checked.
 */

import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const PUBLIC = path.resolve(process.cwd(), 'public-clients');
const built = fs.existsSync(PUBLIC);

const CLIENT_PAGES = [
  'risa/index.html',
  'risa/proposal/index.html',
  'risa/status/index.html',
  'risa/files/index.html',
];

function findHtmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? findHtmlFiles(path.join(dir, e.name))
      : e.name.endsWith('.html')
        ? [path.join(dir, e.name)]
        : [],
  );
}

const read = (rel) => new JSDOM(fs.readFileSync(path.join(PUBLIC, rel), 'utf8'));

const hrefsIn = (file) =>
  [...new JSDOM(fs.readFileSync(file, 'utf8')).window.document.querySelectorAll('a[href]')].map(
    (a) => a.getAttribute('href'),
  );

// ─── Links ───────────────────────────────────────────────────────────────────

describe.skipIf(!built)('hub – links', () => {
  // Hugo pages are served at directory URLs, so a relative href silently means
  // something different depending on the trailing slash. Everything internal
  // must be rooted. Use {{< relref >}} in content rather than a bare path.
  it('no page emits a relative internal link', () => {
    const offenders = [];
    for (const file of findHtmlFiles(PUBLIC)) {
      for (const href of hrefsIn(file)) {
        const external = /^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(href);
        if (!external && !href.startsWith('/')) {
          offenders.push(`${path.relative(PUBLIC, file)} → ${href}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it('every internal link points at a file that exists', () => {
    const broken = [];
    for (const file of findHtmlFiles(PUBLIC)) {
      for (const href of hrefsIn(file)) {
        if (!href.startsWith('/') || href.startsWith('//')) continue;
        const bare = href.split('#')[0].split('?')[0];
        if (!bare) continue;
        const candidate = bare.endsWith('/')
          ? path.join(PUBLIC, bare, 'index.html')
          : path.join(PUBLIC, bare);
        if (!fs.existsSync(candidate)) broken.push(`${path.relative(PUBLIC, file)} → ${bare}`);
      }
    }
    expect(broken).toEqual([]);
  });
});

// ─── Privacy ─────────────────────────────────────────────────────────────────

describe.skipIf(!built)('hub – privacy', () => {
  it.each(CLIENT_PAGES)('%s is noindex', (rel) => {
    const robots = read(rel).window.document.querySelector('meta[name="robots"]');
    expect(robots?.getAttribute('content')).toContain('noindex');
  });

  it('robots.txt is a blanket disallow', () => {
    const robots = fs.readFileSync(path.join(PUBLIC, 'robots.txt'), 'utf8');
    expect(robots).toContain('Disallow: /');
    expect(robots).not.toContain('Allow: /');
    expect(robots).not.toContain('Sitemap:');
  });

  // The [outputs] override drops llmstxt/RSS/ogcard; disableKinds drops the
  // sitemap. Any of them reappearing means a private page got enumerated.
  it.each(['og.html', 'llms.txt', 'index.xml', 'sitemap.xml'])(
    'publishes no %s anywhere',
    (name) => {
      const found = [];
      const walk = (dir) => {
        for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
          const p = path.join(dir, e.name);
          if (e.isDirectory()) walk(p);
          else if (e.name === name) found.push(path.relative(PUBLIC, p));
        }
      };
      walk(PUBLIC);
      expect(found).toEqual([]);
    },
  );

  // The landing page must not name clients — anyone who belongs here arrived
  // with a direct link.
  it('the landing page enumerates no clients', () => {
    const text = read('index.html').window.document.body.textContent;
    expect(text).not.toMatch(/risa/i);
    expect(read('index.html').window.document.querySelectorAll('a[href^="/risa"]')).toHaveLength(0);
  });
});

// ─── Styling ─────────────────────────────────────────────────────────────────

describe.skipIf(!built)('hub – styling', () => {
  // The module-mounts trap: drop the assets mount and the CSS pipeline yields
  // nothing, silently.
  it.each(CLIENT_PAGES)('%s has non-empty inlined CSS', (rel) => {
    const styles = [...read(rel).window.document.querySelectorAll('style')];
    const total = styles.reduce((n, s) => n + s.textContent.length, 0);
    expect(total).toBeGreaterThan(10000);
  });
});
