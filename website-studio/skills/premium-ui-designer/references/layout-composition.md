# Layout & composition

## Grid

- Desktop: 12 columns (flexible) or a bespoke grid derived from content (e.g. 5 columns for a product with 5 parts). Max content width 1200–1440px; full-bleed elements break out on purpose.
- Use CSS Grid with named lines so breakouts are explicit:

```css
.layout {
  display: grid;
  grid-template-columns:
    [full-start] minmax(var(--gutter), 1fr)
    [wide-start] minmax(0, 8rem)
    [content-start] min(100% - 2 * var(--gutter), 72rem) [content-end]
    minmax(0, 8rem) [wide-end]
    minmax(var(--gutter), 1fr) [full-end];
}
.layout > * { grid-column: content; }
.layout > .wide { grid-column: wide; }
.layout > .full { grid-column: full; }
```

- A grid is felt through *consistency*: repeated column starts, consistent gutters. Breaking it once is a statement; breaking it everywhere is chaos.

## Composition patterns (alternatives to the template stack)

The generic structure is: centered hero → logo strip → 3 feature cards → alternating image/text rows → testimonial cards → pricing cards → FAQ accordion → CTA banner. Use parts of it only when the content demands. Alternatives:

| Pattern | When it fits |
|---|---|
| **Asymmetric hero**: headline across 7 cols, image bleeding off the right edge, caption anchored bottom-left | Most brands; instantly less templated |
| **Type-only hero** with oversized display and one small supporting line | Strong verbal brand, studios, manifesto sites |
| **Product-as-hero**: the live product/demo IS the hero | Software, tools, configurators |
| **Index / table of contents** opening: a typographic list of sections or projects that previews on hover | Portfolios, studios, publications |
| **Editorial spread**: large image + pull quote + body columns + captions | Storytelling, case studies, hospitality |
| **Sticky split**: one side pinned (image, title, index), the other scrolls through content | Processes, features with visuals, long-form |
| **Horizontal strip**: a scroll-snapping row of images or steps | Galleries, timelines (keep vertical fallback on mobile) |
| **Bento with hierarchy**: a mosaic where tile sizes reflect importance (not equal cards) | Feature overviews with 1 hero feature + supporting ones |
| **Data-as-design**: a real chart, map, or table as a visual centrepiece | Analytical, scientific, financial brands |
| **Specimen sheet**: annotated object with callouts and leader lines | Physical products, hardware, craft |
| **Ledger / spec list**: dense two-column definition lists with rules | Technical credibility, pricing details |
| **Full-bleed image interlude** between dense sections | Pacing, emotional beats |
| **Marquee/ticker**: only if the content is genuinely a stream (news, clients) and respects reduced motion | Rarely — easy to overuse |

## Section rhythm

Plan the page as a sequence of beats, alternating tension and release:

```
HERO (loud) → proof (quiet, dense) → idea 1 (image-led) → idea 2 (type-led) →
interlude (full-bleed) → details (dense, structured) → social proof (human) → CTA (loud, simple) → footer
```

Rules:
- No two adjacent sections share the same layout pattern.
- Vary background value (ground / surface / inverted) at most 2–3 times; each change marks a new chapter.
- Vary vertical padding: dense sections tighter (64–96px), statement sections looser (160–240px).
- Every section has one clear focal point.

## Whitespace

Whitespace is not empty; it is what makes the focal point read. But a vast empty screen with a small headline is not minimalism, it's under-designed. Test: at every scroll position on desktop, is there something worth looking at in the viewport?

## Images in layout

- Decide ratios per role (hero 16:9 or 3:2, portraits 4:5, details 1:1) and stick to them.
- Let images bleed off one edge to create movement; keep text on the grid.
- Captions are content: credit, place, date, or detail. They add authenticity.
