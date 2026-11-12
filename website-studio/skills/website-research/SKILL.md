---
name: website-research
description: Research exceptional and competitor websites, capture them with a real browser, extract their actual design decisions (type, palette, layout, spacing, motion stack, navigation, content structure), and turn findings into original creative principles instead of copies. Also covers Mobbin/Figma/gallery research. Use at the start of a website project, for competitive analysis, for finding inspiration, or when asked "what do the best sites in X do". Triggers on: design research, inspiration, competitor analysis, moodboard, reference sites, Awwwards, Mobbin, analyze this website, what fonts does this site use.
---

# Website Research Specialist

Research answers three questions:
1. **What does this category look like?** (Conventions: what visitors expect, and what is cliché.)
2. **What does excellence look like?** (In this category and adjacent ones.)
3. **What principles can we transfer?** (Never surfaces. "They use X font" is a look. "They let one photograph per section carry the emotional weight while all text stays small and factual" is a principle.)

## Sources

| Source | Use for | Access |
|---|---|---|
| Direct competitors (3–5) | Category conventions to meet or break | Public web |
| **Awwwards** (SOTD/SOTM, Honors), **CSS Design Awards**, **FWA** | Craft, motion and interaction benchmarks | Public |
| **Godly**, **Siteinspire**, **Land-book**, **Minimal Gallery**, **Httpster**, **One Page Love**, **Lapa Ninja**, **Curated.design**, **Hoverstat.es** | Layout and visual direction by category/style | Public |
| **Typewolf**, **Fonts In Use** | Real-world type choices by industry | Public |
| **Mobbin** (MCP if connected) | Real product UI flows/patterns (onboarding, pricing, checkout, nav) | Paid account; MCP at api.mobbin.com/mcp |
| **Figma Community / client Figma** (Figma MCP) | Design systems, client files | Figma account |
| Studio portfolios (e.g. Pentagram, Locomotive, Instrument, Resn, Active Theory, Basic/Dept, Koto, Studio Freight/Darkroom, Order, Collins, Build in Amsterdam) | How agencies present case studies; editorial pacing | Public |
| Adjacent industries | Fresh ideas: a law firm can learn from museum wayfinding; a SaaS from a magazine | Public |

## Process

1. List 6–12 URLs: ~4 competitors, ~4 excellence references, ~2–4 adjacent-industry wildcards.
2. Capture them:
   ```bash
   node <skill-dir>/scripts/capture-reference.mjs <url1> <url2> ... --out .studio/research
   ```
   For each URL this saves desktop + mobile first-viewport and full-page screenshots, and `analysis.json` with the computed fonts and sizes for h1/h2/body/buttons, dominant colors, section count, nav items, CTA labels, detected motion/framework libraries (GSAP, Lenis, Motion, Three.js, Webflow, Framer, Next, Astro…), and page weight. Requires Playwright (`npm i -D playwright` if not installed; uses a system Chromium if present).
3. **Look at the screenshots** with the Read tool. Don't rely on the JSON alone.
4. Fill `templates/research.md` for each reference: decisions by dimension (typography, layout, navigation, color, spacing, imagery, motion, interaction, content structure), what's excellent, what to avoid, transferable principle.
5. Synthesize: category conventions table (meet / break / ignore), 3–5 transferable principles, and an "anti-reference" list (what everyone in the category does that we will not).

## Rules

- **Inspiration, not imitation.** Never reproduce a reference's layout, copy, illustration style, or signature interaction. If a principle came from a specific site, transform it through the client's subject world.
- Respect robots and terms; capture only public pages; don't scrape assets for reuse. Screenshots are for internal analysis only.
- Note the date: trends age. Prefer principles that have lasted (clarity, pacing, type quality) over effects of the month.
- If a requested gallery or tool is unreachable (network policy, paywall), say so and use alternatives; never invent what a site contains.
