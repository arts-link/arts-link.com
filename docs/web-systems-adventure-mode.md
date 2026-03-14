---
type:
tags: [web, systems]
created: 2026-02-26
---

# Web Systems Adventure Mode

## Modular, Metric-Driven Website Planning System

---

## 1. Keystone Definition

A website must have **one primary keystone metric**.
A secondary metric is optional.
Never exceed two.

Examples:

- Monthly revenue
- Qualified leads
- Demo bookings
- Paid subscribers
- Email signups

If more than two metrics are proposed:

- Stop planning.
- Force prioritization.
- Select the single highest-leverage outcome.

```yaml
keystone_metrics:
  primary: ""
  secondary: ""
```

---

## 2. Page Classification System

Every page must belong to exactly one category.

### A. Converters

Purpose: Convert visitors into customers or leads.

Examples:

- Pricing
- Book Demo
- Checkout
- Start Trial

Rules:

- One job only.
- One CTA only.
- Remove navigation distractions.
- Minimize steps from CTA to completion.

Metric:

- % of visitors who complete the target action.

---

### B. Collectors

Purpose: Capture organic traffic via SEO.

Examples:

- Blog posts
- Long-form guides
- Knowledge articles

Requirements:

- Visible Table of Contents.
- Short summary block at the top.
- Clear routing to a Converter.

Metric:

- Organic traffic volume.
- % routed to Converter pages.

---

### C. Attractors

Purpose: Convert paid or social traffic.

Examples:

- Seasonal landing pages
- Product launches
- Promotional campaigns

Characteristics:

- High visual clarity.
- Campaign-specific messaging.
- Limited lifespan.

Metric:

- Campaign conversion rate.
- Cost per conversion.

---

### D. Informers

Purpose: Administrative or compliance pages.

Examples:

- Privacy Policy
- Terms
- About
- Careers

Rules:

- Accurate.
- Updated.
- Not metric-driven.

---

## 3. Page Mission Definition

Every page (except homepage) must answer:

> What is the single action this page exists to drive?

```yaml
page:
  name: ""
  type: ""
  target_action: ""
  metric: ""
```

If more than one target action exists:

- Split the page.
- Remove secondary CTAs.

---

## 4. Module System

All pages are composed of modules.

Each module must be:

- Performant (fast loading)
- AA Accessible
- Fully Responsive
- SEO-Optimized
- CMS Editable
- Variant Configurable

---

### 4.1 Workhorse Modules

Reusable foundational modules.

Examples:

- Hero
- 3-Up Feature Grid
- 4-Up Feature Grid
- CTA Block
- Testimonial Strip

Rules:

- Build these first.
- Design for reuse.
- Avoid hardcoded content.

---

### 4.2 Showstopper Modules

High-impact, custom modules.

Examples:

- Interactive storytelling
- Complex animations
- Immersive product demos

Rules:

- Use sparingly.
- High cost.
- High fragility.
- Never stack multiple showstoppers on one page.

---

### 4.3 High-Touch Modules

Modules requiring heavy optimization and iteration.

Primary example:

- Pricing table

Rules:

- Must be tested.
- Cannot be blindly reused from other companies.
- Optimize for clarity and decision ease.

---

## 5. Navigation Rules

### Primary Navigation

- Keep links minimal (ideally ≤ 5).
- No novelty patterns.
- Immediate clarity.

If too many links:

- Consolidate.
- Reduce.
- Simplify.

---

### Footer

Purpose:

- Directory of the site.
- Final CTA opportunity.
- Administrative anchor.

Must include:

- Careers
- Legal pages
- Structured sitemap
- One final CTA

Optional:

- Brand personality expression.

---

## 6. Conversion Flow Rules

- Minimize steps between CTA and completion.
- Remove unnecessary form fields.
- Remove navigation from checkout or booking flows.
- Audit mobile first.
- Maintain fast load speeds (sub-2s ideal).
- Regularly review flows on Desktop and Mobile.

---

## 7. Technical Architecture Requirements

Architecture must support:

- Modular content model
- Component-driven frontend
- CMS-driven content editing
- SEO-friendly rendering (SSR or hybrid)
- CDN-backed assets
- Core Web Vitals monitoring
- Event-based analytics tracking

```yaml
architecture:
  frontend: ""
  cms: ""
  hosting: ""
  seo_strategy: ""
  performance_monitoring: ""
```

---

## 8. Analytics Instrumentation

Every target action must be trackable.

Required:

- Keystone event tracking.
- Page-level conversion tracking.
- Funnel tracking.

Recommended:

- Form abandonment tracking.
- Scroll depth tracking.
- CTA click tracking.

```yaml
tracking:
  keystone_event: true
  page_conversion_events: true
  funnel_defined: true
```

---

## 9. System Planning Output Template

When planning a website, generate:

```yaml
site_system:
  keystone_metrics:
    primary: ""
    secondary: ""

  page_inventory:
    - name: ""
      type: ""
      target_action: ""
      metric: ""

  modules:
    workhorse: []
    showstopper: []
    high_touch: []

  nav:
    primary_links: []

  footer:
    sections: []
    final_cta: ""

  conversion_flow:
    steps: []
    friction_points: []

  architecture:
    frontend: ""
    cms: ""
    hosting: ""
    seo_strategy: ""

  analytics:
    primary_events: []
    funnel_definition: ""
```

---

## 10. Execution Phases

### Phase 1 — Strategy

- Define keystone metric.
- Define page inventory.
- Define conversion flows.

### Phase 2 — Architecture

- Define tech stack.
- Define CMS model.
- Define module schema.

### Phase 3 — Module Library

- Build workhorse modules first.
- Validate accessibility.
- Test responsiveness.

### Phase 4 — Optimization

- Instrument analytics.
- Measure baseline.
- Improve high-touch modules.
- Reduce friction.

### Phase 5 — Iteration

- Review metrics monthly.
- Remove underperforming modules.
- Improve speed.
- Tighten navigation.
- Simplify flows.

---

## Core Principle

A website is a modular conversion system.

It is:

- Driven by one dominant metric.
- Structured by page intent.
- Built with reusable modules.
- Governed by clarity and speed.
- Improved through continuous measurement.

---
