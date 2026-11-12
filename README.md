# website-studio

An agency-grade website design and development system for Claude Code: a 7-gate process, 10 specialist skills, and 3 tested scripts that give Claude *taste*, *a process*, and *eyes*.

## What's inside

| Skill | Role | Tools |
|---|---|---|
| `studio-workflow` | Orchestrator: Discovery → Research → Direction → Build → Motion → Browser QA ⇄ Critique | `.studio/` project log |
| `creative-director` | Brief, 3 divergent concepts, scoring matrix, locked direction, signature element | brief/direction templates, divergence axes |
| `website-research` | Capture and analyse reference sites by decision, not look | `capture-reference.mjs` (screenshots + computed fonts, colors, stack detection) |
| `premium-ui-designer` | Typography, scale, spacing, grid, composition, OKLCH color, detail pass | typography/layout/color references |
| `anti-ai-design` | Detect and replace generic AI patterns | `slop-scan.mjs` (22 rules, 0–100 score, `slop-ok:` exceptions) |
| `motion-designer` | Purposeful motion; CSS scroll-driven, View Transitions, Motion, GSAP, Lenis | tokens + 10 recipes |
| `frontend-engineer` | Stack choice, architecture, modern CSS, components, forms | `tokens.css`, `base.css`, project `CLAUDE.md` |
| `conversion-optimization` | Question-ordered pages, messaging, CTAs, proof, forms, pricing | friction audit |
| `performance-seo` | Core Web Vitals, images/fonts, technical SEO, schema, WCAG 2.2, security | `seo-check.mjs` (robots, sitemap, 404, JSON-LD, OG, compression, caching, headers) |
| `visual-qa` | Real-browser testing + creative-director critique loop | `qa.mjs` (5 viewports + reduced motion, 25+ checks, optional axe-core), 10-dimension rubric |

## Docs
- [Research report, ranked skills & connectors](docs/RESEARCH-REPORT.md)
- [Installation](docs/INSTALLATION.md)
- [Workflow](docs/WORKFLOW.md)
- [QA checklist](docs/QA-CHECKLIST.md)
- [Prompt template](docs/PROMPT-TEMPLATE.md)

## Quick start

```bash
./install.sh
```
Then, in any project: *"Use studio-workflow to build a site for …"* (see the prompt template).

## Scripts (Node 18+, Playwright for the browser ones)

```bash
node skills/visual-qa/scripts/qa.mjs http://localhost:4321 --out .studio/qa/round-1 --crawl 10
```
```bash
node skills/anti-ai-design/scripts/slop-scan.mjs src
```
```bash
node skills/performance-seo/scripts/seo-check.mjs https://preview-url.vercel.app
```
```bash
node skills/website-research/scripts/capture-reference.mjs https://site-a.com https://site-b.com --out .studio/research
```

## Install from this repo
```bash
git clone https://github.com/jaredrafalesgan/Portfolio website-studio && cd website-studio && ./install.sh
```
Or as a Claude Code plugin: `/plugin marketplace add jaredrafalesgan/Portfolio` then `/plugin install website-studio@website-studio`.

## Credits
Builds on and routes to: Anthropic `frontend-design` and `webapp-testing`, Paul Bakaus's Impeccable, Emil Kowalski's skills, Vercel agent-skills, and GreenSock's official GSAP skills. Those are installed from their own repos under their own licenses (Apache-2.0 / MIT) and are not redistributed here.
