---
name: frontend-engineer
description: Build production-quality website frontends — stack selection (Astro, Next.js, Vite, static HTML), project structure, component architecture, design tokens, modern CSS (cascade layers, container queries, fluid type, :has, subgrid), Tailwind v4, TypeScript, semantic HTML, images and fonts, forms, and clean responsive implementation. Use when scaffolding or implementing a website, converting a design direction into code, or refactoring frontend code for maintainability. Triggers on: build the site, scaffold, Next.js, Astro, React, TypeScript, Tailwind, CSS architecture, components, responsive, semantic HTML, design tokens.
---

# Frontend Engineer

Code quality is visible: in load speed, layout stability, how the site behaves at 375px and 2560px, and how easily the next change lands. Build like the site will be maintained for five years.

## 1. Choose the stack

| Project | Default | Why |
|---|---|---|
| Marketing site, portfolio, brand site, blog, docs-like | **Astro** (+ MDX, content collections) | Zero JS by default, islands for interactivity, built-in image optimisation and view transitions |
| Site with app features (auth, dashboards, heavy personalisation, e-commerce logic) | **Next.js (App Router)** + TypeScript | Server Components, route handlers, ISR, Vercel-native |
| Single interactive page / prototype | **Vite + React** or plain HTML/CSS/JS | Lowest overhead |
| One self-contained page (artifact, email-like microsite) | Single HTML file | Portability |
| Client needs to edit visually / non-technical team | Recommend **Webflow** or **Framer**, built via their MCP | Ownership by the client |

Styling: **Tailwind v4** (CSS-first `@theme` config) *or* hand-written modern CSS with tokens. Tailwind is not mandatory; for highly art-directed sites, authored CSS with cascade layers is often cleaner. Never mix three styling systems.

Always confirm current framework APIs with Context7 or official docs before scaffolding. Versions move fast.

## 2. Structure

```
src/
  styles/
    tokens.css        # from templates/tokens.css — the design system in variables
    base.css          # reset, element defaults, typography
    layout.css        # grid primitives (.layout, .stack, .cluster, .sidebar)
    utilities.css
  components/
    ui/               # primitives: Button, Link, Input, Media, Icon
    sections/         # page sections: Hero, CaseStudy, Pricing… each self-contained
  layouts/            # page shells: BaseLayout (head/meta/nav/footer)
  content/            # copy, data, MDX — content separated from components
  pages/ or app/
public/               # fonts, favicons, robots.txt, og images
```

## 3. Rules

**HTML**
- Semantic landmarks: `header`, `nav`, `main`, `footer`, `section` with headings, `article` where content is standalone. One `h1` per page; no skipped heading levels.
- Buttons are `<button>`, navigation is `<a href>`. Never `div onClick`.
- Every image has meaningful `alt` (or `alt=""` if decorative). Every input has a `<label>`.
- `lang` on `<html>`; `<meta name="viewport" content="width=device-width, initial-scale=1">`.

**CSS**
- Tokens in custom properties; components reference tokens, never raw hex or px for spacing/color.
- `@layer reset, base, layout, components, utilities;` to control specificity instead of fighting it.
- Fluid type and space via `clamp()`; container queries (`@container`) for components that live in different widths.
- Logical properties (`margin-inline`, `padding-block`) for i18n-readiness.
- `:focus-visible` styles for all interactive elements. Never `outline: none` without a replacement.
- No fixed heights on text containers. Test long words, long names and 200% zoom.
- Use `dvh`/`svh` for full-height heroes on mobile, not `100vh`.
- `overflow-x: clip` on the root only as a last resort. Find the element that overflows (visual-qa reports it).

**Components**
- Small, single-purpose, typed props; content passed in, not hard-coded inside.
- Variants via a variant map (`tailwind-variants`/`cva` or data attributes), not boolean prop soup.
- Sections are composable and independent, so they can be reordered without breaking.

**JavaScript**
- Ship as little as possible. Hydrate only interactive islands (`client:visible` in Astro; Server Components by default in Next).
- No layout-driving JS (measure-then-set loops). Prefer CSS.
- Third-party scripts loaded `defer`/after interaction; facades for embeds (YouTube, maps).

**Images & media** (see performance-seo)
- AVIF/WebP via framework image component, explicit `width`/`height` or `aspect-ratio`, `sizes` attribute, `loading="lazy"` except the LCP image which gets `fetchpriority="high"`.
- Video: muted, playsinline, poster, `preload="none"` unless hero; provide pause control for autoplay.

**Forms**
- Native validation attributes + accessible error messages linked with `aria-describedby`; preserve input on error; disable double submit; show success state; spam protection (honeypot/Turnstile); real endpoint (route handler, Formspree, Supabase, etc.), never a dead form.

## 4. Templates

- `templates/tokens.css` — starter token file to fill from `.studio/direction.md`.
- `templates/base.css` — modern reset + typography defaults + focus + reduced motion.
- `templates/project-CLAUDE.md` — drop into a new website repo as `CLAUDE.md` so every session follows the studio rules.

## 5. Before handing to QA

- `npm run build` passes with no warnings you haven't read.
- Type-check and lint pass.
- No console errors in dev.
- All internal links resolve; external links have `rel="noopener"` when `target="_blank"`.
- Run the `visual-qa` script.
