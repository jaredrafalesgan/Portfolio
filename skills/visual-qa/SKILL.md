---
name: visual-qa
description: Inspect the actual rendered website in a real browser and iterate until it meets a professional standard. Runs scripts/qa.mjs (Playwright) for screenshots at 5 viewports plus reduced-motion, console/JS errors, failed requests, horizontal-overflow culprits, broken links/anchors, tap targets, contrast on rendered text, headings, labels, focus visibility, SEO basics, CLS/LCP and hidden-content detection; then applies a creative-director critique rubric to the screenshots. Use after any visual change, before declaring a website done, or when asked to test, review, QA, screenshot or critique a site. Triggers on: test the site, QA, screenshot, responsive check, mobile check, visual review, critique, does it look good, broken layout, console errors, accessibility audit.
---

# Visual Quality Assurance

Source code is not evidence. Pixels are. Never say a website looks good, works, or is done without having opened screenshots of it at mobile, tablet and desktop widths in this session.

## Loop

```
build → run qa.mjs → READ every screenshot → critique with rubric → fix → repeat
```
Minimum two rounds on any new site. Stop only when the automated report has zero P0/P1 issues and every rubric dimension scores ≥ 4.

### 1. Serve the site
Start the dev server (or `npm run build && npm run preview` for production-like output) in the background. Note the actual port from its output.

### 2. Run automated QA
```bash
node <skill-dir>/scripts/qa.mjs http://localhost:4321 --out .studio/qa/round-1 [--crawl 10 | --pages /,/about,/contact]
```
Options: `--viewports mobile,tablet,laptop,desktop,wide` (default all), `--no-full` (skip full-page shots), `--no-links`.
Install `axe-core` in the project (`npm i -D axe-core`) to add axe's rule set automatically.
Exit code 1 = P0/P1 issues exist. The report is `qa-report.md`; screenshots sit next to it.

Also run:
- `node <anti-ai-design>/scripts/slop-scan.mjs src`
- `node <performance-seo>/scripts/seo-check.mjs <preview-url>` (most useful on a deployed preview)

### 3. Look
Open the fold and full-page screenshots for each viewport with the Read tool. Check specifically:
- Mobile: does the hero still communicate? Text sizes, line breaks of the headline, tap targets, menu, sticky elements covering content, images cropped badly.
- Tablet: the awkward middle. Grids that leave orphan items, too-wide measures, hero images too tall.
- Desktop/wide: does content float in a sea of space at 1920? Is the line length controlled?
- Reduced-motion shots: is all content visible and is the page still complete?

For interactions, write a short Playwright flow (or use the Playwright MCP / Anthropic `webapp-testing` skill if installed): open the mobile menu, submit the form with invalid and valid data, hover states, keyboard Tab through the page, modal open/close with Escape. Screenshot each state.

### 4. Critique
Score with `references/critique-rubric.md`. Write findings and fixes to `.studio/critique.md`. Be the demanding creative director: name the exact element, the problem, and the fix. "Spacing feels off" is not a finding. "Gap between hero subline and CTA (12px) equals gap inside the button group, so they read as one cluster; raise to 32px" is.

### 5. Fix & repeat
Fix in priority order: P0 → P1 → rubric scores < 3 → P2 → rubric < 4 → P3. Re-run into `round-N+1`. Compare before/after screenshots.

## Reporting to the user
Attach (or link) the key final screenshots: desktop fold, mobile fold, one full page. Report remaining P2/P3 items honestly, and anything you could not test (e.g. real devices, Safari/Firefox if only Chromium was available, production headers on localhost).

## Cross-browser
The script uses Chromium. For Firefox/WebKit, install them (`npx playwright install firefox webkit`) and run a Playwright test project across all three; at minimum spot-check Safari-specific risks: `backdrop-filter`, `:has()`, scroll-driven animations (need `@supports`), `100vh` on iOS, date inputs, sticky inside overflow containers.
