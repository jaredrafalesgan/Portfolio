# Professional website workflow

The executable version of this workflow is the `studio-workflow` skill. This page is the human-readable overview.

```
 1 DISCOVERY ──▶ 2 RESEARCH ──▶ 3 CREATIVE DIRECTION ──▶ 4 BUILD ──▶ 5 MOTION ──▶ 6 BROWSER QA ⇄ 7 CRITIQUE ──▶ HANDOVER
   brief.md      research.md     direction.md             code        decisions.md   qa/round-N     critique.md
```

| Gate | Skill(s) | Output | Exit criteria |
|---|---|---|---|
| 1 Discovery | creative-director | `.studio/brief.md` | Purpose, audience, primary action, positioning, scope, constraints, subject's-world nouns. ≤ 6 essential questions, each with a proposed default |
| 2 Research | website-research | `.studio/research.md` + screenshots | 6–12 references captured and analysed by decision; conventions table (meet/break); 3–5 transferable principles; nothing copied |
| 3 Direction | creative-director, premium-ui-designer, anti-ai-design | `.studio/direction.md` | 3 concepts differing on ≥ 3 axes, scored; chosen direction with tokens, type, grid, imagery, motion and signature element; passes anti-AI pre-flight |
| 4 Build | frontend-engineer, premium-ui-designer, conversion-optimization | Working site | Stack chosen by table; tokens first; real copy; question-ordered sections; builds clean, no console errors |
| 5 Motion | motion-designer (+ Emil/GSAP skills) | Motion inventory | Every animation has a job; one signature moment; transform/opacity only; reduced motion honoured |
| 6 QA | visual-qa, performance-seo, anti-ai-design | `.studio/qa/round-N/` | `qa.mjs` zero P0/P1; slop-scan < 15 with no unjustified highs; screenshots *viewed* |
| 7 Critique | visual-qa rubric (+ Impeccable critique/polish) | `.studio/critique.md` | All 10 rubric dimensions ≥ 4; minimum 2 rounds |
| Handover | — | Summary + screenshots | QA checklist complete; known limitations stated; deploy only with your approval |

## Where you get asked
- Gate 1, if essentials are missing (one batched message).
- Gate 3, on large projects: a summary of the chosen direction (and 2 rejected) before heavy building.
- Before any paid purchase (fonts, stock, plans), account creation, or public deployment.
