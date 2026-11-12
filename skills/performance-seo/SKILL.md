---
name: performance-seo
description: Make websites fast, findable, accessible and secure — Core Web Vitals (LCP, INP, CLS), image/font/JS optimization, technical SEO (metadata, canonical, sitemap, robots, structured data, Open Graph), AI-search readiness, WCAG 2.2 AA, and security headers. Includes a site-level checker (scripts/seo-check.mjs). Use when optimizing performance, preparing a launch, auditing SEO or accessibility, or adding metadata/schema. Triggers on: performance, Core Web Vitals, LCP, CLS, INP, page speed, Lighthouse, SEO, meta tags, sitemap, robots.txt, schema, JSON-LD, Open Graph, accessibility, WCAG, security headers, image optimization.
---

# Performance, SEO & Accessibility

Fast, accessible, well-structured sites rank better, convert better, and feel more premium. Build these in from the start; retrofitting is expensive.

## Budgets (marketing site, mobile, p75 field data)

| Metric | Target | Notes |
|---|---|---|
| LCP | < 2.0s (good < 2.5s) | Hero image/headline. Preload it, `fetchpriority="high"`, never lazy |
| INP | < 150ms (good < 200ms) | Little main-thread JS; break long tasks; no heavy hydration |
| CLS | < 0.05 (good < 0.1) | Dimensions on media, font metric overrides, no late-injected banners |
| JS (compressed) | < 100–150 KB | Astro islands / RSC; defer third parties |
| Total page weight | < 1–1.5 MB initial | Video and 3D lazy, poster first |
| Fonts | ≤ 4 files, WOFF2, subset | Preload 1–2 critical |

## Images

- Use the framework component (`astro:assets` `<Image>`/`<Picture>`, `next/image`) to generate AVIF/WebP, `srcset`, `sizes`.
- Always `width`/`height` (or `aspect-ratio`). LCP image: `loading="eager" fetchpriority="high"`; others lazy.
- Export source images at ≤ 2× the largest displayed size. Compress (quality 60–75 AVIF/WebP is usually indistinguishable).
- SVG for logos/icons (optimised with SVGO); never raster logos.
- Decorative backgrounds in CSS with `image-set()`.

## Fonts
WOFF2, subset, self-hosted, `font-display: swap`, metric-matched fallbacks (`size-adjust`, `ascent-override`; automatic with `next/font` or Fontaine/Capsize).

## JavaScript & third parties
Defer analytics; use lightweight analytics (Plausible/Fathom/Vercel); facades for YouTube/Maps/chat; no jQuery/carousel libraries for things CSS can do; check bundle with the framework analyzer.

## Technical SEO checklist

- Unique `<title>` (30–60 chars, primary phrase first, brand last) and meta description (120–160 chars, written as an invitation) per page.
- One `h1` per page that matches search intent; logical heading outline.
- Canonical URL on every page; `hreflang` for multi-language sites.
- `robots.txt` (allow, sitemap reference) and `sitemap.xml` (auto-generated: `@astrojs/sitemap`, Next `app/sitemap.ts`).
- Open Graph + Twitter card tags with a designed 1200×630 OG image per key page (generate with `@vercel/og`/Satori or design in Canva/Figma).
- **Structured data (JSON-LD)**: `Organization`/`LocalBusiness` sitewide; `WebSite`; `BreadcrumbList`; plus content types (`Product`, `Service`, `Article`, `Event`, `FAQPage` only for real FAQs, `Person` for portfolios). Validate at validator.schema.org / Google Rich Results Test.
- Clean, descriptive URLs; 301 redirects for changed URLs; real 404 page that returns HTTP 404 and helps the visitor.
- Internal links with descriptive anchor text; no orphan pages.
- Server-rendered/static HTML for content (crawlers and AI agents read HTML first).
- **AI-search readiness (GEO):** clear factual statements (who/what/where/price) in text, not only in images; consistent NAP (name/address/phone) for local businesses; optional `/llms.txt` summarising the site.

## Accessibility (WCAG 2.2 AA)

Contrast 4.5:1 text / 3:1 large text & UI; keyboard operable everywhere with visible focus; focus not obscured by sticky headers; target size ≥ 24px; labels and error messages; alt text; captions for video; no content conveyed by color alone; `prefers-reduced-motion` respected; zoom to 200% without loss; language set; landmarks and headings; accessible names on icon buttons; dialogs trap and return focus.

## Security & hosting

HTTPS everywhere; headers: `Strict-Transport-Security`, `Content-Security-Policy` (start report-only), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `X-Frame-Options`/`frame-ancestors`. Long cache for hashed assets (`immutable`), short for HTML. Brotli/gzip. Form endpoints rate-limited with spam protection. No secrets in client bundles (`NEXT_PUBLIC_`/`PUBLIC_` only for truly public values). Keep dependencies updated (`npm audit`).

## Tools

- `scripts/seo-check.mjs <url>` (this skill): site-level checks the page-level QA can't do — robots.txt, sitemap.xml, real 404 status, JSON-LD validity, OG image reachability, compression, caching, and security headers.
- `visual-qa/scripts/qa.mjs`: page-level SEO/a11y/CLS/LCP checks plus screenshots.
- Lighthouse (`npx lighthouse <url> --view`, or Chrome DevTools): lab scores. Use PageSpeed Insights / CrUX for real-user field data after launch.
- Vercel Speed Insights / Analytics after deploy.
