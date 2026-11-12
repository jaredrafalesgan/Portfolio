---
name: motion-designer
description: Design and implement purposeful, performant website motion — page-load choreography, scroll-driven sequences, microinteractions, hover/press feedback, page and view transitions, parallax and layered motion — with reduced-motion support. Chooses between CSS, scroll-driven animations, View Transitions, Motion (Framer Motion), GSAP + ScrollTrigger and Lenis. Use when adding or reviewing animation, interactions, transitions or scroll effects, or when motion feels janky, excessive or generic. Triggers on: animation, motion, microinteraction, hover effect, scroll animation, parallax, page transition, GSAP, Framer Motion, ScrollTrigger, smooth scroll, reveal.
---

# Motion Designer

Motion is a design material with three legitimate jobs:
1. **Feedback** — confirm an action (press, toggle, submit, add-to-cart).
2. **Orientation** — show where something came from / went (menus, modals, page transitions, expanding cards).
3. **Emphasis** — direct attention once, at the right moment (the signature moment, a key stat, a reveal in a story).

If an animation doesn't do one of these, delete it. Ask "would anyone miss it?"

## Principles

- **One signature moment per page.** A choreographed hero load or one scroll-told story. Everything else is quiet.
- **Respond fast, settle slow.** Feedback 100–200ms. Entrances 300–600ms. Large choreography ≤ 1200ms total. Exits ~70% of the entrance duration.
- **Ease-out for entrances** (things arriving decelerate), **ease-in-out for movement on screen**, **ease-in only for exits**. Never linear except for continuous loops/scrubs. No bounce/elastic unless the brand is literally playful.
- **Animate only `transform`, `opacity`, `filter`, `clip-path`.** Never width/height/top/left/margin. Use `will-change` only during the animation.
- **Interruptible.** Hover/press feedback uses transitions (which reverse mid-way), not keyframes.
- **Stagger with restraint:** 30–80ms between items, cap total stagger at ~400ms.
- **Content must be readable without JS.** Never ship content at `opacity: 0` that depends on JS to appear; gate initial hidden states behind a `.js` class or use CSS-only reveals.
- **Reduced motion:** under `prefers-reduced-motion: reduce`, replace movement with instant or opacity-only changes; stop autoplay, parallax, marquees, smooth-scroll hijacking.

## Tokens

```css
:root {
  --dur-instant: 100ms; --dur-fast: 180ms; --dur-base: 280ms; --dur-slow: 480ms; --dur-story: 900ms;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);        /* expo-ish out: arrivals */
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);     /* on-screen movement */
  --ease-in: cubic-bezier(0.55, 0, 1, 0.45);         /* exits */
  --ease-spring: linear(0, 0.38 9%, 0.81 21%, 1.02 32%, 1.07 40%, 1.03 52%, 0.99 66%, 1); /* subtle overshoot */
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
```

## Choosing the tool

| Need | Use | Notes |
|---|---|---|
| Hover/press/focus, simple state changes | CSS transitions | Free, interruptible |
| One-off entrance on load | CSS keyframes or Web Animations API | |
| Scroll-linked progress, reveals, parallax (simple) | **CSS scroll-driven animations** (`animation-timeline: view()/scroll()`) | Off main thread; Chrome/Edge/Safari 26+; wrap in `@supports` with static fallback |
| Page-to-page or state-to-state morphs | **View Transitions API** (same-document; cross-document via `@view-transition { navigation: auto }`) | Progressive enhancement; Astro has built-in support |
| React component enter/exit/layout animations, gestures | **Motion** (`motion/react`, formerly Framer Motion) | `AnimatePresence`, `layout`, `useReducedMotion`; use `LazyMotion` + `m` to cut bundle |
| Complex timelines, pinning, scrubbed storytelling, SVG morphs, SplitText | **GSAP 3 + ScrollTrigger** (all plugins free since 2025) | `useGSAP` in React; `gsap.matchMedia()` for reduced motion and breakpoints |
| Smooth scroll inertia | **Lenis** — only for scroll-told experiences | Never on content/docs sites; disable under reduced motion |
| WebGL/3D | Three.js / React Three Fiber / OGL | Only if 3D is the signature; provide poster fallback; lazy-load |

See `references/recipes.md` for tested snippets. If the official GSAP skills or Emil Kowalski's `emil-design-eng` / `review-animations` skills are installed, use them for implementation detail and review.

## Microinteraction checklist

- Buttons: hover (subtle color/underline/translate ≤ 2px), active `scale(0.97)` ~100ms, focus-visible ring, loading state that keeps width stable, success confirmation.
- Links: underline animation from `text-decoration-thickness`/`background-size`, not layout properties.
- Inputs: focus transition on border/ring, inline validation appears without layout jump.
- Menus/modals: origin-aware (scale from trigger), backdrop fades, focus moves in and back out.
- Images: load with a blurred placeholder or dominant-color background (no pop-in CLS).
- Cursor effects: only if they reveal information; never hide the native cursor on text; disable on touch.

## Review (Gate 5 exit)

For every animation, record in `.studio/decisions.md`: element · job (feedback/orientation/emphasis) · trigger · duration · easing · reduced-motion behaviour. Then test: throttle CPU 4× in DevTools (or use the visual-qa script's trace option) and confirm 60fps on the signature moment; confirm the page is fully usable with reduced motion on (visual-qa captures this).
