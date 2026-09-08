#!/usr/bin/env node
/**
 * Local preview of the client hub *with the auth gate in front of it*.
 *
 * `hugo server --environment clients` serves the hub but knows nothing about
 * middleware.ts, so the gate is invisible locally. This script fills that gap:
 * it applies the middleware exactly the way Vercel's contract says to — call
 * it, send whatever Response it returns, and otherwise fall through to the
 * static file — over a built copy of the site.
 *
 *   hugo --environment clients --destination public-clients
 *   CLIENT_HUB_USER=ben CLIENT_HUB_PASS=test node scripts/hub-dev.mjs
 *
 * What this proves: the gate itself — challenge, accept, reject, and that the
 * page really is served once you are through.
 *
 * What it cannot prove: that *Vercel* treats a returned `undefined` as
 * "continue". This script implements that contract; only a deployment or
 * `vercel dev` shows that Vercel implements it the same way. That is the one
 * open question about this design.
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, resolve } from 'node:path';
import middleware from '../middleware.ts';

const ROOT = resolve(import.meta.dirname, '..', 'public-clients');
const PORT = Number(process.env.PORT ?? 1315);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

/** Resolve a URL path to a file, mapping directories to index.html. */
async function locate(pathname) {
  const unsafe = pathname.includes('..');
  if (unsafe) return null;
  const base = join(ROOT, decodeURIComponent(pathname));
  for (const candidate of [base, join(base, 'index.html')]) {
    try {
      if ((await stat(candidate)).isFile()) return candidate;
    } catch {}
  }
  return null;
}

createServer(async (req, res) => {
  const url = `http://localhost:${PORT}${req.url}`;

  // Vercel's contract: a Response means stop, undefined means continue.
  const request = new Request(url, { method: req.method, headers: req.headers });
  const intercepted = middleware(request);

  if (intercepted instanceof Response) {
    res.writeHead(intercepted.status, Object.fromEntries(intercepted.headers));
    res.end(await intercepted.text());
    console.log(`${intercepted.status} ${req.method} ${req.url}`);
    return;
  }

  const file = await locate(new URL(url).pathname);
  if (!file) {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('Not found');
    console.log(`404 ${req.method} ${req.url}`);
    return;
  }

  res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
  res.end(await readFile(file));
  console.log(`200 ${req.method} ${req.url}`);
}).listen(PORT, () => {
  const gated = process.env.CLIENT_HUB_USER && process.env.CLIENT_HUB_PASS;
  console.log(`Client hub on http://localhost:${PORT}`);
  console.log(gated ? '  Auth: ON' : '  Auth: OFF — set CLIENT_HUB_USER and CLIENT_HUB_PASS to enable it');
});
