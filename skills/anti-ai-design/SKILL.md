---
name: anti-ai-design
description: Detect and eliminate generic AI-generated design patterns ("AI slop") in website plans, code and rendered pages, and replace them with deliberate, project-specific choices. Includes a deterministic scanner (scripts/slop-scan.mjs) for HTML/CSS/JSX/TSX/Vue/Svelte/Astro. Use before building (pre-flight on the design plan), after building (scan + screenshot review), or whenever a site looks templated, generic, "vibe-coded" or AI-made. Triggers on: AI slop, looks generic, looks AI generated, templated, deslop, make it original, purple gradient, too many cards, generic landing page.
---

# Anti-AI Design

Generic output is what happens when every unpinned decision falls to its statistical default. The cure is not a blacklist; it is **forcing every visible choice to have a reason tied to this client**. The patterns below are not banned. They are suspects: each must be justified in `.studio/decisions.md` or replaced.

## 1. Pre-flight (on the plan, before code)

For each item in `.studio/direction.md`, ask: *"If I'd been given a different client in a different industry, would I have made the same choice?"* If yes, it's a default. Replace it with something derived from the subject's world, and log the change.

Then run the **swap test**: replace the client name and logo with a competitor's. Does anything break? If not, the design has no identity yet.

## 2. Scan (on code)

```bash
node <skill-dir>/scripts/slop-scan.mjs <src-dir-or-file> [--json] [--strict]
```

Reports each tell with file:line, why it's a tell, and what to do instead, plus a 0–100 "genericness" score. Lines containing `slop-ok: <reason>` are skipped. This is how you record a deliberate exception. Target: score < 15 and zero `high` findings without a `slop-ok` reason.

If installed, also run Impeccable's detector (`npx impeccable detect src/`, 60+ rules) for a second opinion.

## 3. Look (on pixels)

Code scans miss composition. Review screenshots from `visual-qa` against `references/tells.md` § Visual. Composition-level slop (identical sections, centered-everything, empty heroes) is only visible in the render.

## The tells (summary — full list with replacements in `references/tells.md`)

**Color:** purple→blue/pink gradients; gradient text; neon-on-near-black with one acid accent; cream #F4F1EA + terracotta #D97757 + serif (the "tasteful default"); untinted grays; decorative gradient washes and blurred color blobs.

**Surface:** glassmorphism everywhere; identical rounded-2xl white cards with the same soft shadow; one radius on everything; cards nested in cards; gradient borders.

**Typography:** Inter/Poppins/Space Grotesk/Playfair by default; tracked-out ALL-CAPS eyebrow above every heading; one word in a headline accented with italic/color/gradient; giant headline with no hierarchy beneath it; monospace for random labels.

**Layout:** centered hero + two pill buttons + screenshot in a browser frame; logo cloud; 3-column icon-feature grid; alternating zig-zag image/text rows; testimonial card carousel; 3-tier pricing with "Most popular" badge; FAQ accordion; CTA banner with gradient — all in that order; every section the same width and padding.

**Decoration:** random floating shapes/orbs/grids; emoji or generic icons (Lucide sparkles, rockets, lightning) as section decoration; numbered 01/02/03 markers on non-sequential content; "→" appended to every link; meta strings joined with " · ".

**Motion:** fade-up on every section; hover-lift on every card; infinite marquee for no reason; bounce/elastic easing; parallax on everything.

**Copy:** "Unlock", "Elevate", "Seamless", "Supercharge", "Empower", "Revolutionize", "Next-level", "Effortless", "All-in-one", "Built for the future"; three-word feature titles with a one-line description; vague hero ("The platform for modern teams"); fake stats ("10k+ users", "99.9% uptime") with no source; lorem ipsum, "Acme", "John Doe".

## Replacement strategies

| Instead of | Try |
|---|---|
| Gradient background | A color from the subject's world, flat; or real photography/texture; or a gradient that depicts actual light |
| Feature card grid | Prioritized layout: one lead feature large + supporting list; specimen/annotated product shot; sticky split with visuals |
| Generic icons | No icons; or custom pictograms with a consistent stroke derived from the brand; or real product details / photographs |
| Eyebrow labels | Let the heading stand alone; or use a meaningful label (a date, a category that filters, a chapter number when there are chapters) |
| Centered hero | Asymmetric composition anchored to the grid; product-as-hero; type-as-image |
| Fade-up everything | Static page + one choreographed moment + responsive feedback on actions |
| Vague copy | Specific nouns and numbers from the client: who, what, how much, how fast, for whom. Write the version only this client could say |
| Testimonial carousel | One substantial quote with name, role, photo and a specific outcome; or a case-study excerpt |
| Stock photos | Client's real photos; commissioned; generated images only with a consistent art direction and never of people pretending to be customers |

## Rule of thumb

Minimalism is not emptiness, and complexity is not quality. A design is finished when every element can answer *"why are you here, and why do you look like this?"* with a reason specific to this client.
