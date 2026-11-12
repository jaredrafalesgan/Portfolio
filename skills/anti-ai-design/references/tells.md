# AI-design tells — full reference

Each tell: what it is → why it reads as generated → what to do instead. "Allowed when" describes legitimate uses (log them with `slop-ok:`).

## Visual (check in screenshots)

1. **The template stack.** Hero → logos → 3 features → zig-zag → testimonials → pricing → FAQ → CTA. *Why:* it's the median SaaS page. *Instead:* derive section order from the visitor's questions in order (see conversion-optimization). Allowed when: the user explicitly wants a conventional SaaS page; then differentiate within sections.
2. **Same-width, same-padding sections.** Every band 1200px wide, 96px padding. *Instead:* vary width (content / wide / full) and padding to create pacing.
3. **Centered everything.** *Instead:* left-aligned text on a grid with deliberate asymmetry; center only short statements.
4. **Empty hero.** Huge headline, small subline, two buttons, nothing else. *Instead:* show the product, the place, the people, or make the type itself an image.
5. **Browser-frame screenshot** floating with a shadow and tilt. *Instead:* crop to the interesting part of the UI at legible size, annotate it, or make it interactive.
6. **Glow/orb/blob decorations** behind content. *Instead:* nothing; or a texture/material from the subject's world.
7. **Bento grid of equal-importance tiles.** *Instead:* sizes reflect importance; one dominant tile.
8. **Dark mode + one neon accent** as the default for "tech". *Instead:* choose value and hue from the subject.
9. **Cream + serif + terracotta** as the default for "tasteful". Same fix.
10. **Broadsheet pastiche**: hairlines, zero radius, newspaper columns with no editorial reason. Allowed when: it actually is a publication.

## Code-detectable (slop-scan rules)

| ID | Tell | Instead |
|---|---|---|
| `purple-gradient` | Purple/violet/indigo ↔ blue/pink gradients | Subject-derived flat color, or meaningful gradient |
| `gradient-text` | `background-clip: text` with gradient | Solid ink; emphasis via scale/weight/position |
| `glass` | Multiple `backdrop-filter`/`backdrop-blur` surfaces | Solid surfaces; glass only for overlays over real imagery |
| `blur-blob` | Large blurred absolute shapes | Remove; or real imagery/texture |
| `radius-monoculture` | rounded-2xl/3xl / ≥16px radius on most elements | Radius hierarchy tied to size and role, or deliberate sharpness |
| `default-font` | Inter, Poppins, Roboto, Montserrat, Space Grotesk, Playfair, DM Sans, Open Sans, Lato | A face chosen for the client (see typography.md) |
| `three-col-grid` | Repeated `grid-cols-3` / `repeat(3, 1fr)` | Layout reflecting content priority |
| `eyebrow` | Uppercase + wide tracking labels repeated | Drop, or make labels meaningful; consider small caps |
| `pill-overuse` | `rounded-full` on many buttons/badges | Button shape from the direction; pills only for true tags/toggles |
| `generic-shadow` | `shadow-lg/xl`, `rgba(0,0,0,.1)` repeated | Tinted, layered shadows — or none |
| `emoji-icon` | Emoji used as feature icons | No icon, or custom pictograms |
| `icon-library-decor` | Sparkles/Rocket/Zap/Star icons | Show the real thing |
| `arrow-cta` | "→" appended to link/button text | Clear verb; arrow only when it indicates direction/navigation |
| `numbered-markers` | 01 / 02 / 03 on non-sequential content | Only for real sequences |
| `middot-meta` | `A · B · C` meta strings | Structured metadata (definition list, columns) |
| `claude-tell` | #F4F1EA cream, #D97757 terracotta | Choose palette from subject |
| `cliche-copy` | Unlock, elevate, seamless, supercharge, empower, revolutionize… | Specific, concrete language |
| `placeholder` | Lorem ipsum, Acme, John Doe, example.com | Real or realistic, specific content |
| `fake-stats` | 10k+, 99.9%, 24/7, 5x without source | Real numbers with a source, or remove |
| `bounce-ease` | bounce/elastic easing, `animate-bounce` | Ease-out curves (see motion-designer) |
| `fade-up-everything` | Many identical reveal-on-scroll animations | One orchestrated moment |
| `marquee` | Infinite marquee/ticker | Only for genuine streams; pause on hover; reduced motion stops it |
