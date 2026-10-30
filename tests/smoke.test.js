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
  'work/new-sites/index.html',
  'work/rescues/index.html',
  'work/open-source/index.html',
  'services/index.html',
  'services/site-rescue/index.html',
  'contact/index.html',
  'work/cindy-kindred/index.html',
  'work/gordon-landreth-photography/index.html',
  'work/jill-bonovitz/index.html',
  'work/louise-strawbridge/index.html',
  'work/rt2026/index.html',
  'work/ryder/index.html',
  'work/writing-sos/index.html',
];

// Listing pages under work/: the grid itself and one page per project type.
const WORK_LISTS = ['work/index.html', 'work/new-sites/index.html', 'work/rescues/index.html', 'work/open-source/index.html'];

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

describe.skipIf(!built)('smoke – site rescue page (public/services/site-rescue/index.html)', () => {
  it('is linked from the Site Rescue box on the services page', () => {
    const { document } = readPage('services/index.html').window;
    const hrefs = [...document.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('/services/site-rescue/');
  });

  // The page shows the two newest rescues (lowest weight; see
  // modules/rescue-proof.html). Those are the only client names it may carry,
  // and each must link to its own case study. Update when a newer rescue lands.
  it('names only the two rescue clients it links to', () => {
    const { document } = readPage('services/site-rescue/index.html').window;
    const text = document.body.textContent;
    for (const name of ['Alaina Varrone', 'Nihilists’ Corner']) {
      expect(text).toContain(name);
    }
    for (const name of ['Jill Bonovitz', 'Writing SOS']) {
      expect(text).not.toContain(name);
    }
    const hrefs = [...document.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    for (const slug of ['alaina-varrone', 'nihilists-net']) {
      expect(hrefs).toContain(`/work/${slug}/`);
    }
  });

  it('offers the contact action at the opening, after the process and at the end', () => {
    const { document } = readPage('services/site-rescue/index.html').window;
    const locations = [...document.querySelectorAll('a[href="/contact/?from=site-rescue"]')].map(
      (a) => JSON.parse(a.getAttribute('data-track-props')).location,
    );
    expect(locations).toEqual(['site-rescue-opening', 'site-rescue-process', 'site-rescue-closing']);
  });

  it('has one h1 and a search title distinct from it', () => {
    const { document } = readPage('services/site-rescue/index.html').window;
    expect(document.querySelectorAll('h1').length).toBe(1);
    expect(document.title).toContain('Website Rescue & Migration for Artists');
  });

  it('describes Site rescue as a Service tied to the business and page, priced as a minimum', () => {
    const { document } = readPage('services/site-rescue/index.html').window;
    const graph = JSON.parse(
      document.querySelector('script[type="application/ld+json"]').textContent,
    )['@graph'];
    const service = graph.find((n) => n['@type'] === 'Service');
    expect(service['@id']).toMatch(/\/services\/site-rescue\/#service$/);
    expect(service.provider['@id']).toMatch(/\/#organization$/);
    expect(graph.some((n) => n['@id'] === service.mainEntityOfPage['@id'])).toBe(true);
    expect(service.offers.price).toBeUndefined();
    expect(service.offers.priceSpecification.minPrice).toBe(1000);
    expect(service.offers.priceSpecification.priceCurrency).toBe('USD');
    expect(service.areaServed).toBeUndefined();
  });

  it('breadcrumbs follow the page ancestry: Home, Services, Site Rescue', () => {
    const { document } = readPage('services/site-rescue/index.html').window;
    const graph = JSON.parse(
      document.querySelector('script[type="application/ld+json"]').textContent,
    )['@graph'];
    const names = graph.find((n) => n['@type'] === 'BreadcrumbList').itemListElement.map((i) => i.name);
    expect(names).toEqual(['Home', 'Services', 'Site Rescue']);
  });

  it('is listed in llms.txt with its price', () => {
    const llms = fs.readFileSync(path.join(PUBLIC, 'llms.txt'), 'utf8');
    expect(llms).toMatch(/\[Site rescue\]\([^)]*\/services\/site-rescue\/\).*\$1,000/);
  });
});

// ─── FAQ (front-matter `faq`, layouts/partials/modules/faq.html) ─────────────

describe.skipIf(!built)('smoke – FAQ on the site rescue page', () => {
  const rel = 'services/site-rescue/index.html';
  const faqSchema = () => {
    const { document } = readPage(rel).window;
    return [...document.querySelectorAll('script[type="application/ld+json"]')]
      .map((s) => JSON.parse(s.textContent))
      .find((d) => d['@type'] === 'FAQPage');
  };

  it('emits a FAQPage with a question and answer for every entry', () => {
    const faq = faqSchema();
    expect(faq?.mainEntity.length).toBeGreaterThanOrEqual(5);
    for (const q of faq.mainEntity) {
      expect(q['@type']).toBe('Question');
      expect(q.name.length).toBeGreaterThan(0);
      expect(q.acceptedAnswer.text.length).toBeGreaterThan(0);
    }
  });

  it('answer text is plain: no tags or HTML entities', () => {
    for (const q of faqSchema().mainEntity) {
      expect(q.acceptedAnswer.text).not.toMatch(/<[a-zA-Z/]|&(?:[a-zA-Z]+|#\d+);/);
    }
  });

  // The schema is only honest if the page shows the same questions.
  it('every schema question is visible on the page', () => {
    const { document } = readPage(rel).window;
    const shown = [...document.querySelectorAll('#faq-heading ~ div h3, #faq-heading ~ div summary h3')].map((h) =>
      h.textContent.trim(),
    );
    expect(shown.sort()).toEqual(faqSchema().mainEntity.map((q) => q.name).sort());
  });

  it('shows the featured questions open and folds the rest into accordions', () => {
    const { document } = readPage(rel).window;
    expect(document.querySelectorAll('section[aria-labelledby="faq-heading"] details').length).toBeGreaterThan(0);
    expect(document.querySelectorAll('section[aria-labelledby="faq-heading"] > div:first-of-type h3').length).toBe(4);
  });

  it('pages without a faq emit no FAQPage', () => {
    const { document } = readPage('services/index.html').window;
    const types = [...document.querySelectorAll('script[type="application/ld+json"]')].map(
      (s) => JSON.parse(s.textContent)['@type'],
    );
    expect(types).not.toContain('FAQPage');
    expect(document.querySelector('#faq-heading')).toBeNull();
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
    (p) => p === 'index.html' || p === 'services/site-rescue/index.html' || (p.startsWith('work/') && !WORK_LISTS.includes(p)),
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

// ─── Work filter pages ───────────────────────────────────────────────────────

describe.skipIf(!built)('smoke – work filter pages', () => {
  const FILTERS = [
    { page: 'work/index.html', href: '/work/', label: 'All', type: null },
    { page: 'work/new-sites/index.html', href: '/work/new-sites/', label: 'New sites', heading: 'New Sites', type: 'new' },
    { page: 'work/rescues/index.html', href: '/work/rescues/', label: 'Site rescues', heading: 'Site Rescues', type: 'rescue' },
    { page: 'work/open-source/index.html', href: '/work/open-source/', label: 'Open source', heading: 'Open Source', type: 'open-source' },
  ];
  const cards = (rel) =>
    [...readPage(rel).window.document.querySelectorAll('article h3')].map((h) => h.textContent.trim());
  const tabs = (rel) =>
    [...readPage(rel).window.document.querySelectorAll('nav[aria-label="Filter work"] a')];

  it('each filter page lists exactly its own entries, and together they are all the work', () => {
    const all = cards('work/index.html');
    const parts = FILTERS.slice(1).map((f) => cards(f.page));
    expect(parts.flat().sort()).toEqual([...all].sort());
    expect(parts.every((p) => p.length > 0)).toBe(true);
  });

  it.each(FILTERS)('$page: same four plain links, current one marked, counts match the cards', ({ page, href }) => {
    const links = tabs(page);
    expect(links.map((a) => a.getAttribute('href'))).toEqual(FILTERS.map((f) => f.href));
    expect(links.filter((a) => a.getAttribute('aria-current') === 'page').map((a) => a.getAttribute('href'))).toEqual([href]);
    FILTERS.forEach((f, i) => {
      expect(Number(links[i].querySelector('span').textContent)).toBe(cards(f.page).length);
    });
  });

  it('has no filter switch left: no select, no Alpine state, no data-filter', () => {
    const { document } = readPage('work/index.html').window;
    expect(document.querySelector('select')).toBeNull();
    expect(document.querySelector('.work-filter').closest('[x-data]')).toBeNull();
    expect(document.querySelector('.work-filter').parentElement.querySelector('[x-show], [\\@click]')).toBeNull();
    expect(document.querySelector('[data-filter]')).toBeNull();
  });

  it.each(FILTERS.slice(1))('$page has its own title, description and canonical', ({ page, heading, href }) => {
    const { document } = readPage(page).window;
    expect(document.querySelector('h1').textContent.trim()).toBe(heading);
    expect(document.title).toContain(heading);
    expect(document.querySelector('link[rel="canonical"]').getAttribute('href')).toMatch(new RegExp(`${href}$`));
    expect(document.querySelector('header p.text-cream\\/55')?.textContent.trim()).toBe(metaDescription(page));
  });

  it('filter pages are never listed as projects (home, llms.txt)', () => {
    const home = readPage('index.html').window.document.body.innerHTML;
    const llms = fs.readFileSync(path.join(PUBLIC, 'llms.txt'), 'utf8');
    for (const slug of ['new-sites', 'rescues', 'open-source']) {
      expect(home).not.toContain(`/work/${slug}/`);
      expect(llms).not.toContain(`/work/${slug}/`);
    }
  });
});

// ─── Title case ──────────────────────────────────────────────────────────────

// h1 and h2 are title case site-wide. Templates and the markdown heading hook
// run text through Hugo's `title` (AP style: these small words stay lowercase
// unless they start the heading). The content/ layouts' hand-written headings
// are checked here too, since Hugo cannot do that for literal text.
describe.skipIf(!built)('smoke – title case headings', () => {
  const SMALL = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'if', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'vs', 'yet']);
  const offenders = [];
  for (const file of findHtmlFiles(PUBLIC)) {
    const { document } = new JSDOM(fs.readFileSync(file, 'utf8')).window;
    for (const h of document.querySelectorAll('h1, h2')) {
      const words = h.textContent.replace(/\s+/g, ' ').trim().split(' ');
      const bad = words.find((w, i) => {
        const bare = w.replace(/^[^A-Za-z]+/, '');
        return bare && /[a-z]/.test(bare[0]) && (i === 0 || !SMALL.has(bare.toLowerCase().replace(/[^a-z]+$/, '')));
      });
      if (bad) offenders.push(`${path.relative(PUBLIC, file)}: "${words.join(' ')}"`);
    }
  }

  it('every h1 and h2 is in title case', () => {
    expect(offenders).toEqual([]);
  });
});
