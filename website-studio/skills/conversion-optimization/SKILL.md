---
name: conversion-optimization
description: Design the user journey, page narrative, messaging, calls to action, forms, trust signals and pricing presentation so a website converts without feeling pushy. Use when planning page structure and copy, writing headlines/CTAs, designing forms, pricing or sign-up flows, or diagnosing why a site doesn't convert. Triggers on: conversion, CRO, CTA, call to action, landing page copy, headline, value proposition, user journey, funnel, form design, pricing page, trust, social proof, sign up flow.
---

# Conversion Optimization

A beautiful site that doesn't move people to act has failed. A pushy site that converts once and erodes trust has also failed. Clarity converts: the visitor must understand **what this is, who it's for, why it's better, and what to do next** in about five seconds.

## 1. Map the visitor's questions → page order

Write the visitor's questions in the order they'd ask them, then make each section answer one. This replaces the template section stack.

```
Typical B2B service:  What is it? → Is it for me? → Can they actually do it? (proof) → How does it work?
                      → What does it cost / what's the commitment? → What if it goes wrong? → How do I start?
Typical hospitality:  What's it like there? (feel) → Where/when? → What will I do/eat? → How much? → Book
Typical portfolio:    What do you make? → Show me the best one → Who've you worked with? → How do I hire you?
```

Record the map in `.studio/brief.md`. Every section in the build must point to one question.

## 2. Messaging

- **Hero headline:** say the outcome or the thing, specifically. Test: could a competitor put their name on it? If yes, rewrite. Use the client's real differentiator, a concrete number, or the audience's own words.
- **Subline:** who it's for + how it works, in one sentence.
- **Specific beats clever.** "Bookkeeping for UK restaurants, done by people who've run kitchens" beats "Financial clarity, reimagined".
- Benefits are anchored by **evidence**: numbers with sources, named clients, real photographs, demos.
- Voice from `direction.md`. Sentence case. No exclamation marks unless the brand truly shouts.
- Read copy aloud. Cut every sentence that would survive being deleted.

## 3. Calls to action

- **One primary action per page**, visually dominant and repeated at natural decision points (after hero, after proof, end of page). Secondary actions are visually quieter (text link or outline).
- Label = verb + object + (outcome): "Book a 20-minute call", "Reserve a table", "See pricing". Not "Submit", "Learn more", "Get started" (unless there truly is nothing more specific).
- Reduce perceived risk next to the CTA: "No card required", "Reply within one working day", "Free cancellation until 24h before".
- Mobile: primary CTA reachable by thumb; consider a sticky bottom bar on long pages, but only after the hero has scrolled away.

## 4. Trust & proof (choose what is real; never fabricate)

Ranked by persuasive weight: specific results with named client > case study > recognisable client logos (with permission) > detailed testimonial with name/photo/role > ratings from third parties (Google, Trustpilot) > certifications/awards > press mentions > counts ("200 projects since 2014"). Put proof **near the claim it supports**, not in a quarantined "testimonials" band.

If the client has no proof yet, use process transparency, founder story, guarantees, and real photography of the work instead. Never invent testimonials, logos, or numbers.

## 5. Forms

- Ask for the minimum. Every field costs completions. Name + email + one qualifying question beats a 9-field form.
- Single column, labels above fields, input types/autocomplete set (`type="email" autocomplete="email"`), sensible tab order.
- Inline validation on blur, errors that say how to fix, input preserved on error.
- Clear success state that says what happens next and when. Send a confirmation email if possible.
- For multi-step flows: show progress, allow back, save state.

## 6. Pricing presentation

- Lead with the plan most visitors should choose; explain who each plan is for in one line.
- Show what's included in plain language; put the comparison table below the cards for detail-seekers.
- Annual/monthly toggle shows real savings; currency and tax clarity; FAQ addresses objections (cancel, refunds, contracts).

## 7. Friction audit (run on the built site)

- [ ] 5-second test: show the fold screenshot to yourself cold. Can you state what, who, and next action?
- [ ] Primary CTA visible above the fold on mobile and desktop.
- [ ] Every CTA label is specific; every CTA works (visual-qa checks links).
- [ ] No dead ends: every page ends with a next step.
- [ ] Contact info / response time visible where people decide.
- [ ] Load speed (performance-seo): every second of delay costs conversions.
- [ ] Nothing interrupts the visitor in the first 30s (no modal, no chat popup, no cookie wall beyond what law requires).
- [ ] Analytics events planned for primary CTA, form start, form submit success (ask the user which tool: Plausible, Fathom, GA4, Vercel Analytics, PostHog).
