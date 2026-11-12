# Creative direction — Portfolio

## The direction in one sentence
> The site runs like one of Jared's automations: a real workflow is the hero, and every project is shown as a system with a trigger, the build, and the result, backed by his actual GoHighLevel screenshots.

Chosen: **A — Live Workflow** (46/50), grafting B's captioned, annotated case-study spreads. See `concepts.md`.

## Color
| Token | Hex | Role | Contrast |
|---|---|---|---|
| --ground | #111418 | page | — |
| --panel | #171B21 | raised areas, workflow canvas | — |
| --line | #262C35 | rules, borders | decorative |
| --ink | #ECE8E1 | text ("bone", warm, not pure white) | 15:1 on ground |
| --muted | #A2AAB4 | secondary text | 7.6:1 on ground |
| --signal | #4C86FF | live/active states, focus, links on hover — his old brand blue | 5.4:1 on ground |
| Primary button | bone fill, graphite text | the one action | 15:1 |
Ratio: ground ~85% · ink ~12% · signal ≤3%.

## Typography
- Display: **Schibsted Grotesk** (variable 400–900): editorial-technical, compact, distinctive capitals.
- Text: **Schibsted Grotesk** as well (one family; contrast comes from size and weight). Geist was dropped after Impeccable flagged it as overused and because two similar sans broke the pairing rule.
- System output only (workflow nodes, run log): **IBM Plex Mono** 400/500.
- Scale ~1.333, fluid. Display tracking −0.035em. Body 17–18px, measure ≤ 66ch.

## Space & grid
- 12-column grid, 1240px max, fluid gutter. Hero 6/6; case studies 4/8 (sticky meta column / content).
- Section rhythm varies: proof ledger is tight; case studies breathe; approach is a horizontal "workflow" band.

## Imagery
- Only Jared's real screenshots, captioned in his voice. Screenshots sit on a panel with a 1px line, small radius, no tilt or shadow theatre.
- Portrait once, in About. Canva work in a secondary strip.

## Components
- Buttons: 6px radius rectangles (not pills). Primary = bone fill. Secondary = text link with underline.
- Radius hierarchy: 4px tags, 6px buttons/inputs, 12px panels.
- Workflow node: panel with left type stripe (trigger/wait/condition/action) mirroring GHL's node anatomy.

## Motion
- Signature: hero workflow run (~5s): nodes activate in order, connectors draw, log lines print. Then idle; "Run again" replays it.
- Feedback: button press 0.98 scale, link underline thickness, focus rings in signal blue.
- Nothing else animates. Reduced motion: the workflow renders completed, no replay animation.
- Without JS: everything is visible and complete.

## Signature element
The live workflow hero, built from his real "[31.01] VSL – Reminder & Tracking" structure.

## Do / don't
| Do | Don't |
|---|---|
| Real screenshots, real numbers (3,000+, 15+, 160+) | Counters, invented percentages, fake testimonials |
| Name tools where they were used | Tool logo strips |
| Mono only for system output | Mono labels as decoration |
| Number only the 4-step process (a real sequence) | 01/02/03 on case studies |
