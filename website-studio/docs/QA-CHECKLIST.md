# Website quality assurance checklist

Automated (A) items are covered by `visual-qa/scripts/qa.mjs`, `performance-seo/scripts/seo-check.mjs` or `anti-ai-design/scripts/slop-scan.mjs`. Manual (M) items require looking at screenshots or using the site. Nothing ships until all 12 standards pass.

## 1. Visually distinctive & art-directed
- [ ] (M) Swap test fails: a competitor's logo would look wrong on this design
- [ ] (M) Signature element present and memorable
- [ ] (A) slop-scan score < 15; every remaining finding carries a `slop-ok:` reason
- [ ] (M) Rubric "Identity" ≥ 4

## 2. Excellent on desktop, tablet, mobile
- [ ] (A) No horizontal overflow at 390 / 834 / 1280 / 1440 / 1920
- [ ] (M) Every fold and full-page screenshot reviewed; mobile re-composed rather than squashed
- [ ] (A) Tap targets ≥ 24px (aim 44px for primary controls); no text < 12px
- [ ] (M) Headline line breaks good at every width; images cropped well at every width

## 3. Consistent design system
- [ ] (M) Only token values used for color, type, space, radius, motion
- [ ] (M) Shared alignment edges; consistent component states

## 4. Typography & imagery
- [ ] (M) Faces chosen for the client, licensed, ≤ 4 files, self-hosted WOFF2
- [ ] (M) Measure 60–75ch, balanced headlines, real typographic characters
- [ ] (A) No broken images; alt attributes present; no grossly oversized images
- [ ] (M) Imagery authentic and consistently treated; no fake testimonials or people

## 5. Smooth, purposeful motion
- [ ] (M) Each animation's job recorded; one signature moment
- [ ] (A) No content left invisible after scroll or under reduced motion; no infinite animations under reduced motion
- [ ] (M) 60fps on the signature moment with 4× CPU throttle

## 6. Functional navigation & interactions
- [ ] (A) No broken internal links (P0), anchors, dead `#` links
- [ ] (M) Mobile menu opens/closes (button, Escape, link click), traps focus, locks scroll
- [ ] (M) Forms: validation messages, success state, real submission endpoint verified, spam protection
- [ ] (M) Every CTA leads somewhere real

## 7. Clean, maintainable code
- [ ] Build, type-check and lint pass
- [ ] Semantic HTML; components small and typed; content separated from components

## 8. Loading performance
- [ ] (A) Lab CLS < 0.1, LCP image not lazy, JS < 150 KB, fonts ≤ 4
- [ ] (M) Lighthouse ≥ 90 performance on the mobile preview URL; PageSpeed field data after launch

## 9. Accessibility (WCAG 2.2 AA)
- [ ] (A) Contrast passes on rendered text; labels; accessible names; lang; landmarks; heading order; focus visible
- [ ] (A) axe-core run (install `axe-core` in the project) with no serious/critical violations
- [ ] (M) Full keyboard pass; 200% zoom; screen-reader spot check of nav, form and dialog

## 10. SEO foundations
- [ ] (A) Title, description, canonical, OG/Twitter, one h1, JSON-LD valid, favicon
- [ ] (A) robots.txt, sitemap.xml, real 404 status, https redirect (on the deployed preview)

## 11. Nothing broken
- [ ] (A) Zero console errors, page errors and failed same-origin requests at every viewport

## 12. Tested in a real browser
- [ ] (A) `qa-report.md` for the final round attached, P0 = P1 = 0
- [ ] (M) Final screenshots shown to the user; untested surfaces stated (e.g. Safari, real devices)

## Launch extras (when deploying, with your approval)
- [ ] Security headers (HSTS, CSP, nosniff, Referrer-Policy, Permissions-Policy, frame-ancestors)
- [ ] Analytics and conversion events firing; cookie consent only if legally required
- [ ] Redirects for old URLs; Search Console and sitemap submitted
- [ ] Error monitoring (e.g. Sentry) and uptime check
