---
name: studio-workflow
description: The master process for designing and building any website, landing page, or marketing site to an elite-agency standard. Use whenever the user asks to build, design, redesign, or overhaul a website or web page. It sequences discovery, research, creative direction, build, motion, real-browser QA and critique, and routes to the specialist skills (creative-director, website-research, premium-ui-designer, anti-ai-design, motion-designer, frontend-engineer, conversion-optimization, performance-seo, visual-qa). Triggers on: build a website, landing page, redesign site, marketing site, portfolio site, homepage, agency-quality site.
---

# Studio Workflow

You are running a small, demanding creative studio. Every website goes through the same seven gates. A gate is not passed because code was written; it is passed when its exit criteria are met. Never skip a gate silently. If the user explicitly asks to skip one, say what is lost.

Keep a running project log in `.studio/` at the project root (create it). It is your memory between passes and the place the user can inspect your reasoning:

```
.studio/
  brief.md          # Gate 1 output
  research.md       # Gate 2 output (+ research/ screenshots)
  direction.md      # Gate 3 output: the chosen concept + tokens
  decisions.md      # Running log: every non-obvious design decision and why
  qa/               # Gate 6 output: screenshots + qa-report.md per round
  critique.md       # Gate 7 rounds: findings → fixes
```

## Gate 1 — Discovery  → skill: `creative-director` (discovery section)

Establish: purpose, primary audience, the single most important action, brand positioning, industry, tone, required pages/features, content that exists vs. must be written, technical constraints (hosting, CMS, framework, budget), and success metric.

- Ask only questions whose answers change the design. Batch them into one message (max ~6). Propose defaults for each so the user can just say "yes".
- If the user gave enough, skip questions and state your assumptions in `brief.md`.

Exit: `.studio/brief.md` written using `creative-director/templates/brief.md`.

## Gate 2 — Design research  → skill: `website-research`

Study 6–12 references: direct competitors (what the category looks like, so you can deliberately depart from it), adjacent-industry excellence, and gallery-level work. Capture screenshots with `website-research/scripts/capture-reference.mjs` and record the **decisions**, not the looks.

Exit: `.studio/research.md` with category conventions, what to keep, what to break, and 3+ transferable principles. Nothing copied.

## Gate 3 — Creative direction  → skills: `creative-director`, `premium-ui-designer`, `anti-ai-design`

1. Generate **three genuinely different concepts** (use the divergence axes in `creative-director/references/concept-axes.md`). Each gets: name, one-line idea, palette (4–6 hex), type pairing, layout sketch (ASCII), signature element, motion stance, risk.
2. Score them with the matrix in `creative-director/SKILL.md`. Pick one, possibly stealing one idea from a runner-up.
3. Run the `anti-ai-design` pre-flight on the chosen plan. Revise anything that is a default rather than a choice.
4. Lock the system: color tokens, type scale, spacing scale, grid, radius/elevation, image direction, component inventory, motion principles, the signature element.

Exit: `.studio/direction.md` (template: `creative-director/templates/direction.md`). Show the user the chosen concept summary (and the two rejected ones in a line each) before heavy building if the project is large; for small builds, proceed and report.

## Gate 4 — Design & development  → skills: `frontend-engineer`, `premium-ui-designer`, `conversion-optimization`

- Pick the stack with the decision table in `frontend-engineer`. Default: Astro for content/marketing sites, Next.js App Router when there is real app logic, a single static HTML file only for one-off pages/artifacts.
- Tokens first (`templates/tokens.css`), then layout primitives, then sections. Real copy, never lorem ipsum. Every section must answer: *what job does this do for the visitor?* If none, cut it.
- Write the page's conversion path before styling it (`conversion-optimization`).

Exit: site runs locally with no console errors; every link/button goes somewhere real or is visibly marked as a placeholder in `decisions.md`.

## Gate 5 — Motion & interaction  → skill: `motion-designer`

One orchestrated signature moment, plus responsive feedback on user actions. Everything else stays still. `prefers-reduced-motion` honored. Only transform/opacity/filter/clip-path animated.

Exit: motion inventory in `decisions.md` (what moves, why, duration, easing, reduced-motion fallback).

## Gate 6 — Real-browser testing  → skill: `visual-qa`

Run `node <visual-qa>/scripts/qa.mjs <url> --out .studio/qa/round-N`. It captures 5 viewports, console/page errors, failed requests, horizontal overflow culprits, broken links, small tap targets, missing alts, contrast failures, heading order, SEO basics and a reduced-motion pass. Then **look at every screenshot** with the Read tool. Source code is not evidence; pixels are.

Also run `anti-ai-design/scripts/slop-scan.mjs <src>` and `performance-seo/scripts/seo-check.mjs <url>`.

Exit: zero P0/P1 issues in `qa-report.md`.

## Gate 7 — Critique & refinement  → skills: `visual-qa` (critique rubric), `anti-ai-design`

Review the screenshots as a hostile creative director using `visual-qa/references/critique-rubric.md`. Score each of the 10 dimensions 1–5. Anything < 4 gets a concrete fix written into `critique.md`, implemented, and re-screenshotted. Repeat Gates 6–7 until every dimension ≥ 4 and the "would a senior designer sign this?" test passes. Minimum two rounds on any new site.

Exit: final QA round clean, critique scores recorded, a short handover summary to the user with screenshots attached.

## Definition of done

All 12 standards in `docs/QA-CHECKLIST.md` (plugin root) pass, and you have *looked at* desktop, tablet and mobile screenshots of the final build. Never declare done without them. If something could not be verified (e.g. no browser, blocked network), say exactly what and why.

## Routing to other installed skills

When available, these complement the studio skills (don't duplicate their work):
- `frontend-design` (Anthropic): baseline aesthetic guidance, read at Gate 3.
- `impeccable` commands (`critique`, `audit`, `polish`, `bolder`, `quieter`, `typeset`, `layout`): targeted refinement moves in Gate 7.
- `web-design-guidelines` (Vercel): code-level UI rule audit in Gate 6.
- `emil-design-eng`, `review-animations`: motion polish in Gate 5.
- GSAP official skills (`gsap-core`, `gsap-scrolltrigger`, `gsap-react`): implementation detail for GSAP.
- `webapp-testing` (Anthropic): writing bespoke Playwright flows for forms/apps.
- Figma MCP: when the user supplies a Figma file, it replaces Gates 2–3 as the source of truth. Use `get_design_context`/`get_variable_defs`, and still run Gates 5–7.
