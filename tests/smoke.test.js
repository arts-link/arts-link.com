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
  'work/ryder/index.html',
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
    expect(hrefs).toContain('/blog/');
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

const metaDescription = (rel) =>
  readPage(rel).window.document.querySelector('meta[name="description"]')?.getAttribute('content')?.trim();

describe.skipIf(!built)('smoke – SEO: meta description', () => {
  it.each(INDEXABLE_PAGES)('%s has a non-empty meta description', (rel) => {
    expect(metaDescription(rel)?.length).toBeGreaterThan(0);
  });

  // Descriptions are derived from the page's own content (front matter
  // description, then summary, then a line composed from a work entry's front
  // matter). Sharing one blurb across pages is what that exists to prevent.
  it('every indexable page has its own description', () => {
    const byDescription = new Map();
    for (const rel of INDEXABLE_PAGES) {
      const d = metaDescription(rel);
      byDescription.set(d, [...(byDescription.get(d) ?? []), rel]);
    }
    const shared = [...byDescription.entries()].filter(([, pages]) => pages.length > 1);
    expect(shared).toEqual([]);
  });

  it.each(INDEXABLE_PAGES)('%s repeats its description in og and twitter tags', (rel) => {
    const { document } = readPage(rel).window;
    const expected = metaDescription(rel);
    expect(document.querySelector('meta[property="og:description"]')?.getAttribute('content')).toBe(expected);
    expect(document.querySelector('meta[name="twitter:description"]')?.getAttribute('content')).toBe(expected);
  });

  // plainify + htmlUnescape run before the text reaches an attribute; a raw
  // entity here means one of them was dropped.
  it.each(INDEXABLE_PAGES)('%s description carries no HTML entities or tags', (rel) => {
    const d = metaDescription(rel);
    expect(d).not.toMatch(/&(?:[a-zA-Z]+|#\d+);/);
    expect(d).not.toMatch(/<[a-zA-Z/]/);
  });
});

// ─── SEO: og:image ───────────────────────────────────────────────────────────

const ogImage = (rel) =>
  readPage(rel).window.document.querySelector('meta[property="og:image"]')?.getAttribute('content')?.trim();

describe.skipIf(!built)('smoke – SEO: og:image', () => {
  it.each(INDEXABLE_PAGES)('%s has an absolute og:image', (rel) => {
    const content = ogImage(rel);
    expect(content).toBeTruthy();
    expect(content).toMatch(/^https?:\/\/\S+\.jpg$/);
  });

  it.each(INDEXABLE_PAGES)('%s declares og:image dimensions', (rel) => {
    const { document } = readPage(rel).window;
    expect(document.querySelector('meta[property="og:image:width"]')?.getAttribute('content')).toBe('1200');
    expect(document.querySelector('meta[property="og:image:height"]')?.getAttribute('content')).toBe('630');
    expect(
      document.querySelector('meta[property="og:image:alt"]')?.getAttribute('content')?.trim().length,
    ).toBeGreaterThan(0);
  });

  // The point of the per-page cards: no two pages may share one image.
  it('every indexable page has its own card', () => {
    const byImage = new Map();
    for (const rel of INDEXABLE_PAGES) {
      const image = ogImage(rel);
      byImage.set(image, [...(byImage.get(image) ?? []), rel]);
    }
    const shared = [...byImage.entries()].filter(([, pages]) => pages.length > 1);
    expect(shared).toEqual([]);
  });

  it.each(INDEXABLE_PAGES.filter((p) => p.startsWith('work/') && p !== 'work/index.html'))(
    '%s points at its own generated card',
    (rel) => {
      const slug = rel.split('/')[1];
      expect(ogImage(rel)).toContain(`/og/work/${slug}.jpg`);
    },
  );

  // Falling back to the shared card means `npm run og` has not been run for a
  // page that needs it — og:check catches this in CI, but assert it here too.
  it.each(INDEXABLE_PAGES)('%s does not fall back to the shared card', (rel) => {
    expect(ogImage(rel)).not.toContain('og-default.jpg');
  });

  it.each(INDEXABLE_PAGES)('%s og:image resolves to a built file', (rel) => {
    const file = path.join(PUBLIC, new URL(ogImage(rel)).pathname);
    expect(fs.existsSync(file), `missing ${file}`).toBe(true);
    expect(fs.statSync(file).size).toBeGreaterThan(1024);
  });

  it('twitter:image matches og:image', () => {
    for (const rel of INDEXABLE_PAGES) {
      const { document } = readPage(rel).window;
      expect(document.querySelector('meta[name="twitter:image"]')?.getAttribute('content')).toBe(ogImage(rel));
    }
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

  it('contains ## Services, ## Blog, and ## Contact sections', () => {
    expect(content).toContain('## Services');
    expect(content).toContain('## Blog');
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
