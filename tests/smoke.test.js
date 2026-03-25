/**
 * Smoke tests — verify the Hugo build produces the expected site structure.
 *
 * These tests read from the `public/` directory that Hugo generates.
 * Run `hugo --minify` first (or let the CI workflow do it), then `npm test`.
 *
 * When `public/` is absent the whole suite is skipped with a clear message so
 * that the unit tests still run cleanly on machines without Hugo installed.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const PUBLIC = path.resolve(process.cwd(), 'public');
const built = fs.existsSync(PUBLIC);

// Pages that must pass all SEO checks.
// Update this list when work pages are added or removed.
const INDEXABLE_PAGES = [
  'index.html',
  'work/index.html',
  'services/index.html',
  'contact/index.html',
  'work/cindy-kindred/index.html',
  'work/gordon-landreth-photography/index.html',
  'work/jill-bonovitz/index.html',
  'work/louise-strawbridge/index.html',
  'work/rt2026/index.html',
  'work/writing-sos/index.html',
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

function readPage(relPath) {
  const fullPath = path.join(PUBLIC, relPath);
  const html = fs.readFileSync(fullPath, 'utf8');
  return new JSDOM(html);
}

// ─── Homepage ────────────────────────────────────────────────────────────────

describe.skipIf(!built)('smoke – homepage (public/index.html)', () => {
  let dom;
  beforeAll(() => { dom = readPage('index.html'); });

  it('exists and is not empty', () => {
    const { document } = dom.window;
    expect(document.body.textContent.trim().length).toBeGreaterThan(0);
  });

  it('title contains the site name', () => {
    expect(dom.window.document.title.toLowerCase()).toContain('arts-link');
  });

  it('includes the analytics script', () => {
    const { document } = dom.window;
    const scripts = [...document.querySelectorAll('script[src]')];
    expect(scripts.some((s) => s.getAttribute('src').includes('analytics.js'))).toBe(true);
  });

  it('navigation contains links to all top-level pages', () => {
    const hrefs = [...dom.window.document.querySelectorAll('a')].map((a) =>
      a.getAttribute('href'),
    );
    expect(hrefs).toContain('/work/');
    expect(hrefs).toContain('/services/');
    expect(hrefs).toContain('/contact/');
  });
});

// ─── Work page ───────────────────────────────────────────────────────────────

describe.skipIf(!built)('smoke – work page (public/work/index.html)', () => {
  let dom;
  beforeAll(() => { dom = readPage('work/index.html'); });

  it('exists and is not empty', () => {
    expect(dom.window.document.body.textContent.trim().length).toBeGreaterThan(0);
  });

  it('title contains "Work"', () => {
    expect(dom.window.document.title).toContain('Work');
  });
});

// ─── Services page ───────────────────────────────────────────────────────────

describe.skipIf(!built)('smoke – services page (public/services/index.html)', () => {
  let dom;
  beforeAll(() => { dom = readPage('services/index.html'); });

  it('exists and is not empty', () => {
    expect(dom.window.document.body.textContent.trim().length).toBeGreaterThan(0);
  });

  it('title contains "Services"', () => {
    expect(dom.window.document.title).toContain('Services');
  });
});

// ─── Contact page ────────────────────────────────────────────────────────────

describe.skipIf(!built)('smoke – contact page (public/contact/index.html)', () => {
  let dom;
  beforeAll(() => { dom = readPage('contact/index.html'); });

  it('exists and is not empty', () => {
    expect(dom.window.document.body.textContent.trim().length).toBeGreaterThan(0);
  });

  it('title contains "Contact"', () => {
    expect(dom.window.document.title).toContain('Contact');
  });

  it('contact form has analytics tracking attribute', () => {
    const { document } = dom.window;
    const form = document.querySelector('form[data-track-form]');
    expect(form).not.toBeNull();
  });
});

// ─── SEO: one h1 per page ────────────────────────────────────────────────────

describe.skipIf(!built)('smoke – SEO: one h1 per indexable page', () => {
  it.each(INDEXABLE_PAGES)('%s has exactly one <h1>', (rel) => {
    const { document } = readPage(rel).window;
    expect(document.querySelectorAll('h1').length).toBe(1);
  });
});

// ─── SEO: canonical tag ──────────────────────────────────────────────────────

describe.skipIf(!built)('smoke – SEO: canonical tag', () => {
  it.each(INDEXABLE_PAGES)('%s has exactly one canonical link', (rel) => {
    const { document } = readPage(rel).window;
    expect(document.querySelectorAll('link[rel="canonical"]').length).toBe(1);
  });
});

// ─── SEO: meta description ───────────────────────────────────────────────────

describe.skipIf(!built)('smoke – SEO: meta description', () => {
  it.each(INDEXABLE_PAGES)('%s has a non-empty meta description', (rel) => {
    const { document } = readPage(rel).window;
    const meta = document.querySelector('meta[name="description"]');
    expect(meta).not.toBeNull();
    expect(meta.getAttribute('content').trim().length).toBeGreaterThan(0);
  });
});

// ─── SEO: og:image ───────────────────────────────────────────────────────────

describe.skipIf(!built)('smoke – SEO: og:image', () => {
  it.each(INDEXABLE_PAGES)('%s has og:image', (rel) => {
    const { document } = readPage(rel).window;
    const og = document.querySelector('meta[property="og:image"]');
    expect(og).not.toBeNull();
    expect(og.getAttribute('content').trim().length).toBeGreaterThan(0);
  });
});

// ─── SEO: JSON-LD ────────────────────────────────────────────────────────────

describe.skipIf(!built)('smoke – SEO: JSON-LD', () => {
  // work/index.html is a list page — Hugo's json-ld partial only fires on
  // .IsHome and .IsPage, so the listing is intentionally excluded here.
  const jsonLdPages = INDEXABLE_PAGES.filter(
    (p) => p === 'index.html' || (p.startsWith('work/') && p !== 'work/index.html'),
  );
  it.each(jsonLdPages)('%s contains valid JSON-LD', (rel) => {
    const { document } = readPage(rel).window;
    const scripts = [...document.querySelectorAll('script[type="application/ld+json"]')];
    expect(scripts.length).toBeGreaterThan(0);
    expect(() => JSON.parse(scripts[0].textContent)).not.toThrow();
  });
});

// ─── llms.txt ────────────────────────────────────────────────────────────────

describe.skipIf(!built)('smoke – llms.txt', () => {
  let content;
  beforeAll(() => { content = fs.readFileSync(path.join(PUBLIC, 'llms.txt'), 'utf8'); });

  it('exists and is not empty', () => {
    expect(content.trim().length).toBeGreaterThan(0);
  });

  it('starts with a top-level heading', () => {
    expect(content.trimStart()).toMatch(/^# /);
  });

  it('contains a ## Work section with at least one project', () => {
    expect(content).toContain('## Work');
    expect(content).toMatch(/^- \[.+\]\(https?:\/\//m);
  });

  it('contains ## Services, ## Writing, and ## Contact sections', () => {
    expect(content).toContain('## Services');
    expect(content).toContain('## Writing');
    expect(content).toContain('## Contact');
  });
});

// ─── Internal links resolve ──────────────────────────────────────────────────

describe.skipIf(!built)('smoke – internal links resolve', () => {
  it('all internal hrefs in built pages point to existing files', () => {
    const broken = [];
    for (const file of findHtmlFiles(PUBLIC)) {
      const { document } = new JSDOM(fs.readFileSync(file, 'utf8')).window;
      [...document.querySelectorAll('a[href]')]
        .map((a) => a.getAttribute('href'))
        .filter((h) => h && h.startsWith('/') && !h.startsWith('//'))
        .map((h) => h.split('#')[0].split('?')[0])
        .filter(Boolean)
        .forEach((bare) => {
          const candidate = bare.endsWith('/')
            ? path.join(PUBLIC, bare, 'index.html')
            : path.join(PUBLIC, bare);
          if (!fs.existsSync(candidate)) {
            broken.push(`${path.relative(PUBLIC, file)} → ${bare}`);
          }
        });
    }
    expect(broken).toEqual([]);
  });
});
