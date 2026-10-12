/**
 * docs/site-system.yaml — the strategy document CLAUDE.md names as the source
 * of truth for why the site is structured the way it is.
 *
 * Nothing reads it programmatically, which is exactly how it spent a long time
 * not parsing: an unquoted value containing ": " reads fine to a person and is
 * a nested mapping to YAML. These checks are the only consumer it has.
 *
 * Parsed with the `yaml` package rather than PyYAML because it reports
 * duplicate keys as errors; PyYAML keeps the last one silently, which in a
 * hand-edited document means a section quietly overwritten by a later one.
 */

import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { parseDocument } from 'yaml';

const FILE = path.resolve(process.cwd(), 'docs/site-system.yaml');
const doc = parseDocument(fs.readFileSync(FILE, 'utf8'));

describe('docs/site-system.yaml', () => {
  it('parses without errors', () => {
    expect(doc.errors.map((e) => e.message)).toEqual([]);
  });

  it('parses without warnings', () => {
    expect(doc.warnings.map((w) => w.message)).toEqual([]);
  });

  // The sections CLAUDE.md tells people to keep current. If one disappears it
  // was probably swallowed by an indentation mistake, not removed on purpose.
  it.each([
    'keystone_metrics',
    'services',
    'page_inventory',
    'pages_cut',
    'nav',
    'conversion_flow',
    'content_model',
    'analytics',
  ])('has a %s section', (section) => {
    expect(doc.toJS().site_system).toHaveProperty(section);
  });

  it('documents the work entry fields', () => {
    const work = doc.toJS().site_system.content_model.work_entries;
    expect(Array.isArray(work.required)).toBe(true);
    expect(Array.isArray(work.optional)).toBe(true);
  });
});
