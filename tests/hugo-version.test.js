/**
 * One Hugo version, everywhere.
 *
 * .hugo-version is the only place the version is written. scripts/hugo.sh
 * runs it, and CI, Workers Builds, the Pages workflow and the npm scripts all
 * go through that script. These checks keep it that way: a workflow that
 * grows its own Hugo install step is exactly how CI and local drifted apart,
 * which surfaced as og:check failing on social cards nobody had touched.
 */

import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const WANT = fs.readFileSync(path.join(ROOT, '.hugo-version'), 'utf8').trim();
const WORKFLOWS = path.join(ROOT, '.github/workflows');
const INDEX = path.join(ROOT, 'public/index.html');

describe('Hugo version pin', () => {
  it('.hugo-version holds a bare version number', () => {
    expect(WANT).toMatch(/^\d+\.\d+\.\d+$/);
  });

  describe.each(fs.readdirSync(WORKFLOWS).filter((f) => f.endsWith('.yml')))(
    '.github/workflows/%s',
    (file) => {
      const text = fs.readFileSync(path.join(WORKFLOWS, file), 'utf8');

      it('does not pin its own Hugo version', () => {
        expect(text).not.toMatch(/HUGO_VERSION\s*:/);
        expect(text).not.toMatch(/gohugoio\/hugo\/releases/);
      });

      it('does not call a bare `hugo`', () => {
        // `run: hugo …` or a continuation line starting with `hugo`.
        expect(text).not.toMatch(/^\s*(run:\s*)?hugo(\s|$)/m);
      });
    },
  );

  it('the Workers Builds script goes through scripts/hugo.sh', () => {
    const text = fs.readFileSync(path.join(ROOT, 'scripts/cf-build.sh'), 'utf8');
    expect(text).not.toMatch(/^\s*exec hugo\b/m);
    expect(text).toMatch(/exec sh scripts\/hugo\.sh/);
  });

  // The proof that matters: whatever built public/ was the pinned version.
  // Hugo writes its version into the generator meta tag.
  it.skipIf(!fs.existsSync(INDEX))('public/ was built with the pinned version', () => {
    const html = fs.readFileSync(INDEX, 'utf8');
    expect(html).toMatch(new RegExp(`name=["']?generator["']?\\s+content=["']?Hugo ${WANT.replace(/\./g, '\\.')}["'>\\s]`));
  });
});
