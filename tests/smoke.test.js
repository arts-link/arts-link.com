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
    expect(dom.window.document.title).toContain('arts-link');
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
