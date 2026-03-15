# TODO

## Launch Playbook — Technical Readiness

### 1. Canonical Domain & HTTPS
- [ ] Confirm `https://www.arts-link.com/` is the canonical host in Vercel/DNS settings
- [ ] Verify all redirect variants return 301:
  - `http://arts-link.com` → `https://www.arts-link.com/`
  - `https://arts-link.com` → `https://www.arts-link.com/`
  - `http://www.arts-link.com` → `https://www.arts-link.com/`
- [ ] Test with `curl -IL https://arts-link.com` to confirm 301 chain

### 2. Robots & Crawlability
- [x] `enableRobotsTXT = true` set in hugo.toml — Hugo generates robots.txt
- [x] Custom `layouts/robots.txt` template created with `Allow: /` and `Sitemap:` URL
- [ ] After launch: fetch `https://www.arts-link.com/robots.txt` and confirm no `Disallow: /` and sitemap URL is present

### 3. XML Sitemap
- [ ] After launch: fetch `https://www.arts-link.com/sitemap.xml` and confirm it loads cleanly
- [ ] Confirm all URLs use `https://www.arts-link.com/` (canonical host, no dev/staging URLs)
- [ ] No querystring variants or draft pages included

### 4. Canonical Tags
- [x] `<link rel="canonical" href="{{ .Permalink }}">` present in `baseof.html` on every page
- [ ] After launch: spot-check a few pages to confirm canonical equals the page URL

### 5. Open Graph & Social Metadata
- [x] `og:site_name`, `og:type`, `og:title`, `og:description`, `og:url`, `og:image` in `baseof.html`
- [x] `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` added to `baseof.html`
- [x] Default OG image `static/images/og-default.png` exists at 1200×630
- [ ] After launch: test OG tags with [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) and [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [ ] Consider per-page custom OG images for key work entries (optional)

### 6. Structured Data (JSON-LD)
- [x] `layouts/partials/head/json-ld.html` created with `WebSite` + `LocalBusiness` schema on homepage
- [x] `BreadcrumbList` schema added for inner pages
- [ ] Validate with [https://validator.schema.org/](https://validator.schema.org/) after launch
- [ ] Optional: test with [Google Rich Results Test](https://search.google.com/test/rich-results)

### 7. Titles, Descriptions, and Headings
- [x] Dynamic `<title>` tag in `baseof.html` (page title · site name pattern)
- [x] `meta name="description"` present on every page with per-page fallback to site description
- [x] Homepage description added to `content/_index.md` front matter
- [x] Services, Work, Contact pages have unique `description` in front matter
- [x] Each key page has exactly one `<h1>` (Home hero, Work list, Services, work singles)
- [ ] After launch: spot-check title lengths (~50–60 chars) and descriptions (120–160 chars) for key pages

### 8. Internal Link Architecture
- [x] Nav links to Work, Services, Contact on every page
- [x] Homepage links to Work preview and Contact CTA
- [x] Services page links to Contact CTA
- [x] Work single pages link back to `/work/` and Contact CTA
- [ ] Review draft/cut pages (`features/`, `resources/`, `domain-names/`) — confirm they are not indexed or are properly redirected

### 9. Search Engine Discovery
- [ ] Set up Google Search Console — add Domain property for `arts-link.com`
- [ ] Submit sitemap in GSC: `https://www.arts-link.com/sitemap.xml`
- [ ] Request indexing in GSC for key pages: `/`, `/work/`, `/services/`, `/contact/`
- [ ] Set up Bing Webmaster Tools — verify site, submit sitemap, request site scan
- [ ] IndexNow: add IndexNow key file at `https://www.arts-link.com/<key>.txt` (Bing/Yandex instant indexing)

### 10. Performance
- [x] CSS inlined (zero render-blocking)
- [x] Self-hosted fonts preloaded (zero third-party, zero CLS)
- [x] Alpine.js and analytics scripts loaded `defer`
- [x] Plausible loads deferred after initial render
- [ ] After launch: run [PageSpeed Insights](https://pagespeed.web.dev/) on homepage and a work page; target 90+ mobile score
- [ ] Manually verify on mobile: nav usable, text readable, no horizontal overflow

### 11. Technical QA Smoke Tests
- [ ] Verify every indexable page has exactly one `<h1>`
- [ ] Verify every indexable page has exactly one canonical tag
- [ ] Verify every indexable page has a meta description
- [ ] Verify `og:image` is present on every page
- [ ] Verify JSON-LD is present on homepage and work pages
- [ ] Verify all internal links resolve (no 404s)

### 12. Post-Launch Monitoring
- [x] Plausible Analytics configured for production (`arts-link.com`)
- [ ] After launch: confirm Plausible is recording pageviews
- [ ] Add Plausible custom events to CTA buttons (keystone conversion tracking)
- [ ] Add Plausible custom event on contact form submission
- [ ] After launch: monitor Google Search Console for coverage errors and crawl errors
- [ ] After launch: monitor Bing Webmaster Tools for crawl activity

---

## Forms
- [ ] Update Formspree redirect from relative `thanks` to absolute `https://www.arts-link.com/thanks/`

## Content
- [ ] Add more work entries as new projects come in
