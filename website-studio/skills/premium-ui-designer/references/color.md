# Color

## Build palettes in OKLCH

OKLCH (`oklch(L C H)`) has perceptually even lightness, so tints and shades stay coherent and contrast is predictable.

1. Pick the **hue** from the subject's world (the clay of a pottery studio, the green of surgical scrubs, the blue of a blueprint) — not from "tech = blue/purple".
2. Build a **neutral ramp tinted with that hue** (chroma 0.005–0.02). Pure grays look dead next to a colored accent.
3. Pick **one accent** with enough chroma to be unmistakable; check it at 4.5:1 against the ground for text use (or 3:1 for large text/UI).
4. Optional: one secondary color for data or categories, never competing with the accent.

```css
:root {
  --hue: 55;                                    /* from the subject */
  --ground:  oklch(97.5% 0.008 var(--hue));
  --surface: oklch(94%   0.012 var(--hue));
  --line:    oklch(86%   0.015 var(--hue));
  --muted:   oklch(50%   0.020 var(--hue));
  --ink:     oklch(22%   0.020 var(--hue));
  --accent:  oklch(58%   0.170 calc(var(--hue) + 180));
  --accent-ink: oklch(98% 0.01 var(--hue));     /* text on accent */
}
```

## Contrast

- WCAG 2.2 AA: 4.5:1 body text, 3:1 large text (≥ 24px, or 18.66px bold) and UI components/focus indicators.
- Check with the visual-qa script (it computes contrast on rendered text) and spot-check hover/focus states.
- Text over images: use a real scrim (gradient overlay sized to the text area) or place text on a solid area of the image; verify at every breakpoint since crops change.

## Dark mode

- Not inverted light mode. Lower chroma, raise lightness of accents slightly, avoid pure black (use L ≈ 14–20%) unless the direction is deliberately stark.
- Elevation in dark mode = lighter surfaces, not shadows.
- Ship it only if the brand benefits; one excellent theme beats two mediocre ones.

## Usage discipline

- Ground ~70–85%, ink ~10–20%, accent ≤ 5%.
- The accent marks *the* action. If a secondary button uses the accent too, demote it.
- Gradients only when they depict something (light, material, sky, heat) — and then use OKLCH interpolation (`linear-gradient(in oklch, …)`) to avoid muddy midpoints.
