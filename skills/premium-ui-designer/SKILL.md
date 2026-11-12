---
name: premium-ui-designer
description: Craft-level visual design for websites — typography systems, type scales, spacing rhythm, grids and composition, visual hierarchy, color systems (OKLCH), navigation, and component detailing. Use when designing or refining layouts, choosing fonts, setting a type scale or spacing system, fixing hierarchy, or when a page looks "flat", "cramped", "amateur" or "template-like". Triggers on: typography, type scale, font pairing, spacing, whitespace, grid, layout, composition, hierarchy, color palette, navigation design, polish layout.
---

# Premium UI Designer

Premium is not decoration. It is the accumulation of a hundred correct small decisions: a type scale with real contrast, spacing that varies to create rhythm, a grid that is felt even when broken, colors that are tuned rather than picked, and details (rag, kerning, alignment, states) that nobody notices until they are wrong.

Read the relevant reference before working on that area:
- `references/typography.md` — choosing faces, scales, measure, rag, and details.
- `references/layout-composition.md` — grids, composition patterns beyond "hero + 3 cards", section rhythm.
- `references/color.md` — building palettes in OKLCH, contrast, dark mode.

## Non-negotiables

1. **Hierarchy has three levels max per view.** One primary focus, a few secondary, the rest quiet. If everything is bold, nothing is.
2. **Scale contrast is the cheapest premium signal.** Display text should be ≥ 3× body size on desktop. Pair huge with small; avoid a sea of mediums.
3. **Spacing is a system, varied on purpose.** Use the token scale only. Related things close (8–16px), groups apart (32–64px), sections far apart (96–192px). Vary section padding to create pacing; equal padding everywhere = template.
4. **Alignment is shared edges.** Fewer alignment lines = calmer layout. Check that text blocks, images, and buttons share left edges across sections.
5. **Measure 60–75ch** for body text. Never full-width paragraphs on desktop.
6. **One accent color, used sparingly**, for the primary action and maybe one signature detail. Accent everywhere is no accent.
7. **Real content drives layout.** Design with the actual headline lengths, image ratios, and number of items. Placeholder content hides layout problems.
8. **Every container earns its border.** Prefer spacing and alignment to group; use boxes only when content is literally an object (a product, a plan, a file).
9. **States are design.** Hover, focus-visible, active, disabled, loading, empty, error — design them all for every interactive element.
10. **Mobile is a composition, not a squashed desktop.** Re-compose: reorder, resize type with `clamp()`, change image crops, consider sticky primary CTA.

## Workflow

1. Start from `.studio/direction.md`. Translate into tokens (`frontend-engineer/templates/tokens.css`).
2. Block out layout in grayscale with real copy. Fix hierarchy before color.
3. Apply type system, then color, then imagery, then details.
4. Screenshot (visual-qa) and run the squint test: blur your eyes. Do you see one clear focal point per screen, and a clear reading path? If not, fix scale/weight/space before anything else.

## Navigation

- Header: logo left, ≤ 5 primary items, one primary CTA visually distinct. Sticky only if it earns it (long pages, frequent CTA). Hide on scroll down / show on scroll up for long reads.
- Mobile: full-screen or sheet menu with large targets (≥ 48px), focus trapped, Escape closes, body scroll locked, current page indicated.
- Always: skip link, visible focus, `aria-current="page"`.
- Footer is a real section: sitemap, contact, legal, and a final CTA. Not an afterthought.

## Detail pass (do before calling a design finished)

- [ ] Headlines: `text-wrap: balance`; body: `text-wrap: pretty`; no orphans in key headlines.
- [ ] Optical alignment: icons and quotes hanging-punctuated where it matters; button text visually centered.
- [ ] Numbers: `font-variant-numeric: tabular-nums` in tables/prices/stats.
- [ ] Letter-spacing: tighten large display (−0.01 to −0.04em), loosen small caps/labels (+0.02 to +0.08em).
- [ ] Concentric radii: inner radius = outer radius − padding.
- [ ] Images: consistent ratios per context, `object-fit: cover` with intentional `object-position`.
- [ ] Shadows (if any): layered, tinted with the ground hue, not `rgba(0,0,0,.1)` everywhere.
- [ ] Borders: 1px in a tuned line color, not default gray.
- [ ] Selection color, focus ring, scrollbar (subtle), favicon set: all on-brand.
