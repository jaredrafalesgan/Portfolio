# Website project rules

This project follows the **website-studio** system. Run the `studio-workflow` skill for any new page or redesign.

## Always
- Read `.studio/brief.md` and `.studio/direction.md` before changing anything visual. The direction is the contract; log deviations in `.studio/decisions.md`.
- Use design tokens from `src/styles/tokens.css`. No raw hex colors or ad-hoc spacing in components.
- Real copy only. No lorem ipsum, no "Acme", no fabricated testimonials or stats.
- Semantic HTML, visible focus, labels on inputs, alt text on images, one h1 per page.
- Animate only transform/opacity/filter/clip-path; honor `prefers-reduced-motion`.
- After any visual change: run `visual-qa` (`node website-studio/skills/visual-qa/scripts/qa.mjs http://localhost:PORT --out .studio/qa/round-N`) and **look at the screenshots** before reporting done.
- Run `slop-scan` on `src/` before each hand-off; justify any finding with a `slop-ok:` comment or fix it.

## Never
- Declare work complete without desktop, tablet, and mobile screenshots of the result.
- Deploy publicly, buy fonts/assets, or create paid accounts without asking.
- Default to purple/blue gradients, gradient text, glassmorphism, generic card grids, or emoji icons without a logged reason.

## Commands
- Dev: `npm run dev` · Build: `npm run build` · QA: see above

## This project
- Static site: `index.html`, `assets/css/styles.css`, `assets/js/main.js`. No build step.
- Preview locally: `python3 -m http.server 4321` from the repo root, then QA against `http://localhost:4321/`.
- Only claims confirmed by Jared go on the site (see `.studio/brief.md`). No invented numbers, testimonials or results.
- Source images live in `.studio/source-images/` (gitignored); optimised WebP in `assets/img/`.
