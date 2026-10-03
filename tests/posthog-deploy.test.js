/**
 * PostHog deploy annotations stay CI-only and can never hold up a deploy.
 *
 * .github/workflows/posthog-deploy-annotation.yml holds a PostHog Personal
 * API Key, a credential that can write to the project, unlike the public
 * phc_ key the browser uses. These checks keep its shape: it only reacts to
 * Cloudflare's finished build, the PostHog call can't turn a run red, the
 * third-party action is pinned to a commit, and the key name never shows up
 * in anything the site build reads or the browser receives.
 * Runbook: docs/runbooks/posthog-deploy-tracking.md
 */

import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

const ROOT = process.cwd();
const FILE = path.join(ROOT, '.github/workflows/posthog-deploy-annotation.yml');
const wf = parse(fs.readFileSync(FILE, 'utf8'));
const job = wf.jobs.annotate;
const step = (id) => job.steps.find((s) => s.id === id);

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

describe('PostHog deploy annotation workflow', () => {
  it('runs only when a check run completes', () => {
    expect(Object.keys(wf.on)).toEqual(['check_run']);
    expect(wf.on.check_run.types).toEqual(['completed']);
  });

  it('acts only on a successful Workers Builds check', () => {
    expect(job.if).toContain("github.event.check_run.name == 'Workers Builds: arts-link-com'");
    expect(job.if).toContain("github.event.check_run.conclusion == 'success'");
  });

  it('asks GitHub whether the commit is on the default branch before annotating', () => {
    expect(step('meta').run).toMatch(/compare\/\$DEFAULT_BRANCH\.\.\.\$SHA/);
    expect(step('annotate').if).toContain("steps.meta.outputs.production == 'true'");
  });

  it('cannot fail the run, and says so when PostHog fails', () => {
    expect(step('annotate')['continue-on-error']).toBe(true);
    expect(job.steps.some((s) => s.if === "steps.annotate.outcome == 'failure'")).toBe(true);
  });

  it('pins the PostHog action to a full commit SHA', () => {
    expect(step('annotate').uses).toMatch(/^PostHog\/posthog-github-action@[0-9a-f]{40}$/);
  });

  it('dedupes on repository, environment and full SHA', () => {
    const w = step('annotate').with;
    expect(w['annotation-dedupe']).toBe(true);
    expect(step('meta').run).toContain('key="arts-link.com production deploy @ $SHA"');
  });

  it('only reads the key from GitHub secrets, with read-only repo access', () => {
    expect(wf.permissions).toEqual({ contents: 'read' });
    const text = fs.readFileSync(FILE, 'utf8');
    for (const m of text.matchAll(/POSTHOG_CI_API_KEY/g)) {
      const line = text.slice(text.lastIndexOf('\n', m.index) + 1, text.indexOf('\n', m.index));
      if (line.trim().startsWith('#') || line.includes('::notice')) continue;
      expect(line).toMatch(/\$\{\{ secrets\.POSTHOG_CI_API_KEY( != '')? \}\}/);
    }
  });
});

describe('The CI key stays out of the site', () => {
  // Everything Hugo, Workers Builds or the browser can read.
  const sources = ['layouts', 'static', 'assets', 'config', 'content', 'data', 'scripts', 'wrangler.jsonc', 'package.json']
    .flatMap((p) => {
      const full = path.join(ROOT, p);
      if (!fs.existsSync(full)) return [];
      return fs.statSync(full).isDirectory() ? walk(full) : [full];
    })
    .filter((f) => /\.(html|js|mjs|json|jsonc|toml|ya?ml|md|txt|sh|xml|css)$/.test(f));

  it.each(sources.map((f) => [path.relative(ROOT, f), f]))('%s does not mention the CI key', (_, f) => {
    const text = fs.readFileSync(f, 'utf8');
    expect(text).not.toContain('POSTHOG_CI_API_KEY');
    // PostHog Personal API Keys start with phx_; the public project key is phc_.
    expect(text).not.toMatch(/\bphx_[A-Za-z0-9]{10,}/);
  });

  const built = walk(path.join(ROOT, 'public')).filter((f) => /\.(html|js|json|xml|txt)$/.test(f));
  it.skipIf(built.length === 0)('the built site carries no Personal API Key', () => {
    for (const f of built) {
      const text = fs.readFileSync(f, 'utf8');
      expect(text, f).not.toContain('POSTHOG_CI_API_KEY');
      expect(text, f).not.toMatch(/\bphx_[A-Za-z0-9]{10,}/);
    }
  });
});
