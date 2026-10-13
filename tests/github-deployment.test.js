/**
 * Production deploys are recorded as GitHub Deployments, and doing so can
 * never hold up or change a deploy.
 *
 * Cloudflare Workers Builds only posts a check run, so
 * .github/workflows/github-deployment.yml turns a successful one on a `main`
 * commit into a "Production" Deployment (what Vercel's integration used to
 * do). These checks keep its shape: it reacts only to Cloudflare's finished
 * build, skips previews and reruns, can't turn a run red, and holds no
 * permission beyond `deployments: write`.
 */

import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

const FILE = path.join(process.cwd(), '.github/workflows/github-deployment.yml');
const text = fs.readFileSync(FILE, 'utf8');
const wf = parse(text);
const job = wf.jobs.record;
const step = (id) => job.steps.find((s) => s.id === id);

describe('GitHub deployment workflow', () => {
  it('runs only when a check run completes', () => {
    expect(Object.keys(wf.on)).toEqual(['check_run']);
    expect(wf.on.check_run.types).toEqual(['completed']);
  });

  it('acts only on a successful Workers Builds check', () => {
    expect(job.if).toContain("github.event.check_run.name == 'Workers Builds: arts-link-com'");
    expect(job.if).toContain("github.event.check_run.conclusion == 'success'");
  });

  it('asks GitHub whether the commit is on the default branch, so previews are skipped', () => {
    expect(step('meta').run).toMatch(/compare\/\$DEFAULT_BRANCH\.\.\.\$SHA/);
    expect(step('record').if).toContain("steps.meta.outputs.production == 'true'");
  });

  it('does nothing when a Production deployment already exists for the commit', () => {
    expect(step('meta').run).toMatch(/deployments\?sha=\$SHA&environment=Production/);
  });

  it('creates a Production deployment and marks it successful, without waiting on checks', () => {
    const run = step('record').run;
    expect(run).toContain('environment: "Production"');
    expect(run).toContain('production_environment: true');
    expect(run).toContain('required_contexts: []');
    expect(run).toContain('state: "success"');
    expect(run).toContain('environment_url');
  });

  it('cannot fail the run, and says so when recording fails', () => {
    expect(step('record')['continue-on-error']).toBe(true);
    expect(job.steps.some((s) => s.if === "steps.record.outcome == 'failure'")).toBe(true);
  });

  it('has read access plus deployments: write and uses no secrets', () => {
    expect(wf.permissions).toEqual({ contents: 'read', deployments: 'write' });
    expect(text).not.toMatch(/secrets\./);
  });

  it('never deploys anything itself', () => {
    expect(text).not.toMatch(/wrangler|cf:deploy|versions upload/);
  });
});
