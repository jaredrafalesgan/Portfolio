# Motion recipes

All recipes are progressive enhancement: content is visible without them.

## 1. CSS scroll-driven reveal (no JS)

```css
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .reveal {
      animation: reveal linear both;
      animation-timeline: view();
      animation-range: entry 10% cover 30%;
    }
    @keyframes reveal { from { opacity: 0; transform: translateY(24px); } }
  }
}
```
Use on *one* kind of element with a reason (e.g. figures in a story), not every section.

## 2. Scroll progress indicator

```css
.progress { position: fixed; inset: 0 0 auto; height: 2px; background: var(--accent);
  transform-origin: 0 50%; animation: grow linear; animation-timeline: scroll(root); }
@keyframes grow { from { transform: scaleX(0); } }
```

## 3. Parallax layer (CSS only, subtle)

```css
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .parallax-img { animation: drift linear both; animation-timeline: view(); }
    @keyframes drift { from { transform: translateY(-6%) scale(1.08); } to { transform: translateY(6%) scale(1.08); } }
  }
}
```

## 4. Hero load choreography (GSAP, vanilla)

```js
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
gsap.registerPlugin(SplitText);

const mm = gsap.matchMedia();
mm.add('(prefers-reduced-motion: no-preference)', () => {
  document.fonts.ready.then(() => {
    const split = SplitText.create('.hero h1', { type: 'lines', mask: 'lines', autoSplit: true,
      onSplit: (self) => gsap.timeline({ defaults: { ease: 'expo.out', duration: 1 } })
        .from(self.lines, { yPercent: 110, stagger: 0.08 })
        .from('.hero .media', { clipPath: 'inset(0 0 100% 0)', duration: 1.2 }, '<0.15')
        .from('.hero .support', { opacity: 0, y: 12, duration: 0.6 }, '-=0.6') });
    return () => split.revert();
  });
});
```
Hide initial states only via `.js .hero h1 { visibility: hidden }` + `gsap.set(..., {visibility:'visible'})`, or accept the from-state flash risk is nil because `from` runs synchronously after split.

## 5. Pinned scroll story (GSAP ScrollTrigger)

```js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();
mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
  const steps = gsap.utils.toArray('.story .step');
  const tl = gsap.timeline({ scrollTrigger: { trigger: '.story', start: 'top top',
    end: () => '+=' + steps.length * window.innerHeight * 0.8, scrub: 0.6, pin: '.story .stage' } });
  steps.forEach((s, i) => i && tl.to(steps[i - 1], { autoAlpha: 0 }).from(s, { autoAlpha: 0, y: 40 }, '<'));
});
// Below 900px / reduced motion: steps stack vertically, no pin (CSS default).
```

## 6. React + GSAP

```tsx
'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
gsap.registerPlugin(useGSAP);

export function Reveal({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('[data-item]', { opacity: 0, y: 16, stagger: 0.05, ease: 'power3.out' });
    });
  }, { scope });
  return <div ref={scope}>{children}</div>;
}
```

## 7. Motion (React) — enter/exit + layout

```tsx
'use client';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

export function Panel({ open, children }: { open: boolean; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div key="panel" layout
          initial={{ opacity: 0, y: reduce ? 0 : 8 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }}
          exit={{ opacity: 0, transition: { duration: 0.18, ease: [0.55, 0, 1, 0.45] } }}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

## 8. View Transitions (multi-page, CSS only)

```css
@view-transition { navigation: auto; }
::view-transition-old(root) { animation: 180ms var(--ease-in) both fade-out; }
::view-transition-new(root) { animation: 320ms var(--ease-out) both fade-in; }
.project-thumb { view-transition-name: var(--vt-name); } /* set unique per item, matched on detail page */
@media (prefers-reduced-motion: reduce) { ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation: none !important; } }
@keyframes fade-out { to { opacity: 0; } } @keyframes fade-in { from { opacity: 0; } }
```

## 9. Lenis (only for scroll-told experiences)

```js
import Lenis from 'lenis';
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
}
```

## 10. Magnetic / hover-follow (use sparingly)

```js
for (const el of document.querySelectorAll('[data-magnetic]')) {
  if (matchMedia('(hover: none), (prefers-reduced-motion: reduce)').matches) break;
  const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3' });
  const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3' });
  el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect();
    xTo((e.clientX - r.left - r.width / 2) * 0.25); yTo((e.clientY - r.top - r.height / 2) * 0.25); });
  el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
}
```

Before using a library API, confirm the current signature with Context7 (if connected) or the official docs. APIs change (e.g. `framer-motion` → `motion/react`, SplitText's `mask`/`autoSplit` options added in GSAP 3.13).
