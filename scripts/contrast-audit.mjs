#!/usr/bin/env node
/**
 * Text contrast audit, both themes, every built page.
 *
 *   npm run build && npm run contrast
 *
 * Serves public/, opens each page in Chromium once in the dark theme (the
 * default) and once in the light theme (localStorage theme=light, exactly as
 * the toggle stores it), and measures every visible piece of text against the
 * background actually behind it: the element's own colour and opacity, composited
 * over each ancestor's background colour. Fails if any text is below WCAG AA:
 * 4.5:1, or 3:1 for large text (24px+, or 18.66px+ bold).
 *
 * Why this exists: the blog body used Tailwind Typography's `prose-invert`,
 * whose colours are fixed light greys meant for a dark page. Only paragraphs
 * and headings were re-coloured, so list items rendered light grey on the
 * light theme's cream. Nothing reading HTML could see it; only a browser can.
 *
 * Elements over a background image (hero photos, screenshots) are skipped,
 * because their real background isn't a colour we can compute. Hidden and
 * aria-hidden text is skipped too, as is text in disabled controls.
 *
 * Browser: Playwright's own Chromium, or CHROMIUM_PATH for a preinstalled one.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = path.join(ROOT, 'public');
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.xml': 'application/xml',
};

function serve(root) {
  const server = http.createServer((req, res) => {
    let rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (rel.endsWith('/')) rel += 'index.html';
    const file = path.join(root, path.normalize(rel).replace(/^(\.\.[/\\])+/, ''));
    if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404).end('not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] ?? 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

/** Every index.html in public/, as a site path. Skips the social-card renders. */
function pages(dir = PUBLIC) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...pages(full));
    else if (entry.name === 'index.html') {
      out.push('/' + path.relative(PUBLIC, path.dirname(full)).split(path.sep).join('/') + '/');
    }
  }
  return out.map((p) => p.replace(/^\/\.?\/$/, '/').replace('//', '/')).sort();
}

/** Runs inside the page. Returns failing text, one entry per element. */
function audit() {
  const parse = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const over = (top, under) => {
    const a = top.a + under.a * (1 - top.a);
    if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
    const mix = (k) => (top[k] * top.a + under[k] * under.a * (1 - top.a)) / a;
    return { r: mix('r'), g: mix('g'), b: mix('b'), a };
  };
  const lum = ({ r, g, b }) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const ratio = (x, y) => { const [a, b] = [lum(x), lum(y)].sort((m, n) => n - m); return (a + 0.05) / (b + 0.05); };

  // Background behind an element: its ancestors' colours composited bottom-up.
  // Returns null when an ancestor paints an image, which we can't measure.
  const backdrop = (el) => {
    const chain = [];
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) chain.push(n);
    let bg = { r: 255, g: 255, b: 255, a: 1 };
    for (const n of chain.reverse()) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage && cs.backgroundImage !== 'none' && !cs.backgroundImage.startsWith('url("data:image/svg')) return null;
      const c = parse(cs.backgroundColor);
      if (c && c.a > 0) bg = over({ ...c, a: c.a * Number(cs.opacity) }, bg);
    }
    return bg;
  };
  const effectiveOpacity = (el) => {
    let o = 1;
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) o *= Number(getComputedStyle(n).opacity);
    return o;
  };

  const fails = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  for (let t = walker.nextNode(); t; t = walker.nextNode()) {
    if (!t.textContent.trim()) continue;
    const el = t.parentElement;
    if (!el || seen.has(el)) continue;
    seen.add(el);
    if (el.closest('[aria-hidden="true"], script, style, noscript, template, [hidden]')) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    if (el.closest('.sr-only')) continue;
    const bg = backdrop(el);
    if (!bg) continue;
    const fg = parse(cs.color);
    if (!fg) continue;
    const ink = over({ ...fg, a: fg.a * effectiveOpacity(el) }, bg);
    const r = ratio(ink, bg);
    const size = parseFloat(cs.fontSize);
    const large = size >= 24 || (size >= 18.66 && Number(cs.fontWeight) >= 700);
    const need = large ? 3 : 4.5;
    if (r + 1e-6 < need) {
      const cls = (typeof el.className === 'string' ? el.className : '').trim().split(/\s+/).slice(0, 6).join('.');
      fails.push({
        ratio: Math.round(r * 100) / 100,
        need,
        el: el.tagName.toLowerCase() + (cls ? '.' + cls : ''),
        text: t.textContent.trim().replace(/\s+/g, ' ').slice(0, 60),
      });
    }
  }
  return fails;
}

if (!fs.existsSync(PUBLIC)) {
  console.error('public/ not found — run `npm run build` first.');
  process.exit(1);
}

const { chromium } = await import('playwright');
const { server, port } = await serve(PUBLIC);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
let total = 0;

try {
  for (const theme of ['dark', 'light']) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
    await context.addInitScript((t) => { try { localStorage.setItem('theme', t); } catch (e) {} }, theme);
    const page = await context.newPage();
    for (const p of pages()) {
      await page.goto(`http://127.0.0.1:${port}${p}`, { waitUntil: 'load' });
      // Hero text animates in; let it settle so opacity is final.
      await page.waitForTimeout(50);
      await page.evaluate(() => document.getAnimations().forEach((a) => a.finish()));
      const fails = await page.evaluate(audit);
      for (const f of fails) {
        total++;
        console.log(`[${theme}] ${p}  ${f.ratio}:1 < ${f.need}:1  <${f.el}>  "${f.text}"`);
      }
    }
    await context.close();
  }
} finally {
  await browser.close();
  server.close();
}

if (total) {
  console.error(`\n${total} text element(s) below WCAG AA contrast.`);
  process.exit(1);
}
console.log('All text meets WCAG AA contrast in both themes.');
