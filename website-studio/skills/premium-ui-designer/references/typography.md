# Typography

Typography is ~90% of a website's personality. Choose it first, and choose it for *this* client.

## Choosing faces

Ask: what does the subject's world *read like*? Engineering spec sheets, auction catalogues, cookbooks, airport signage, a label on a wine bottle? Start from that vernacular.

**Avoid as unexamined defaults** (fine when chosen for a reason): Inter, Roboto, Open Sans, Poppins, Montserrat, Lato, Space Grotesk, Playfair Display, DM Sans. These are what every generator reaches for.

**Free, high-quality sources** (check license per family):
- Google Fonts (OFL) — has excellent, less-overused families.
- Fontshare (Indian Type Foundry, free for commercial use) — Satoshi, General Sans, Clash Display, Cabinet Grotesk, Switzer, Erode, Gambetta, Zodiak, Sentient, Supreme, Boska, Chillax.
- Velvetyne, Collletttivo, Open Foundry — libre display faces with character.
- Paid (ask before purchasing): Klim, Grilli Type, Commercial Type, Dinamo, Pangram Pangram (free trials for personal use), Displaay, Production Type, Colophon.

**Less-overused Google Fonts by mood** (starting points, not prescriptions):

| Mood | Display | Text |
|---|---|---|
| Precise / technical | Familjen Grotesk, Schibsted Grotesk, Geist | IBM Plex Sans, Geist, Public Sans |
| Editorial / literary | Fraunces (with opsz/SOFT axes), Newsreader, Instrument Serif, Young Serif | Source Serif 4, Literata, Newsreader |
| Warm / human | Bricolage Grotesque, Gloock, Recoleta-like: Young Serif | Figtree, Onest, Atkinson Hyperlegible |
| Luxurious / quiet | Cormorant (display sizes only), Bodoni Moda, Italiana | Jost, Karla |
| Bold / poster | Anton, Big Shoulders Display, Archivo (wdth axis), Unbounded | Archivo, Barlow |
| Quirky / playful | Syne, Gasoek, Darumadrop One, Rubik Mono One | Rubik, Nunito Sans |
| Archival / mono | JetBrains Mono, Martian Mono, Space Mono, IBM Plex Mono | (pair with a humanist sans) |

**Pairing rule:** one family can be enough (use weight/width/size for contrast). If two, make them clearly different in structure (serif + grotesk, wide + narrow), not two similar sans.

**Variable fonts** are a superpower: use `wdth`, `opsz`, `wght` and custom axes for expressive display treatments without extra files.

## Type scale

Use a modular scale with fluid sizes. Ratio depends on density: 1.2 (dense, product) · 1.25 (balanced) · 1.333–1.5 (editorial, expressive). The display size can break the scale on purpose.

```css
:root {
  --step--1: clamp(0.83rem, 0.80rem + 0.15vw, 0.90rem);
  --step-0:  clamp(1.00rem, 0.95rem + 0.25vw, 1.13rem);
  --step-1:  clamp(1.25rem, 1.15rem + 0.45vw, 1.50rem);
  --step-2:  clamp(1.56rem, 1.40rem + 0.80vw, 2.00rem);
  --step-3:  clamp(1.95rem, 1.65rem + 1.40vw, 2.75rem);
  --step-4:  clamp(2.44rem, 1.90rem + 2.60vw, 4.00rem);
  --step-5:  clamp(3.05rem, 2.10rem + 4.60vw, 6.00rem);
  --display: clamp(3.50rem, 1.50rem + 9.00vw, 10.0rem);
}
```
(Generate exact values at utopia.fyi for the chosen ratio and viewport range.)

## Setting text

| Property | Body | Headings | Display |
|---|---|---|---|
| line-height | 1.5–1.7 (serif higher) | 1.1–1.25 | 0.9–1.05 |
| letter-spacing | 0 | −0.01em | −0.02 to −0.05em |
| measure | 60–75ch | ≤ 20ch for display | |
| weight | 400 (350 on dark) | 500–700 | per face |
| wrap | `text-wrap: pretty` | `text-wrap: balance` | manual `<br>` only if responsive-safe |

- Body text ≥ 16px (17–19px is often better on desktop for editorial).
- Light text on dark backgrounds: reduce weight slightly and increase letter-spacing slightly; enable `-webkit-font-smoothing: antialiased` only for light-on-dark.
- Use real typographic characters: ’ “ ” – — … × and non-breaking spaces before units and between short words at line ends where needed.
- Small caps (`font-variant-caps: all-small-caps`) beat tracked-out ALL CAPS for labels when the face supports them.
- Links in body text: underline, with `text-underline-offset: 0.2em` and a tuned `text-decoration-thickness`.

## Loading

- Self-host WOFF2, subset to used glyph ranges, `font-display: swap` (body) or `optional` (decorative).
- Preload only the 1–2 files used above the fold.
- Use `size-adjust`/`ascent-override` on the fallback `@font-face` to kill layout shift (Next.js `next/font` and Fontaine do this automatically).
- Max ~4 font files total on a marketing page.

## Type as image

When the direction is type-led, treat the headline as the hero's image: deliberate line breaks, scale extremes, interaction with photography (overlap, masking, knockout), variable-axis animation. Set it by hand per breakpoint, checking each breakpoint screenshot.
