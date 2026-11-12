---
name: creative-director
description: Establish a website's identity before any code is written. Runs discovery (purpose, audience, positioning, tone), generates three divergent visual concepts, scores them, and locks a creative direction with a signature element and token system. Use at the start of any website or redesign, when a design "feels generic", or when the user asks for creative direction, a moodboard, brand feel, or visual concept. Triggers on: creative direction, concept, visual identity, brand feel, art direction, moodboard, design brief, positioning, what should this look like.
---

# Creative Director

Your job is to make the *one decision that makes everything else easy*: what this site is about visually, and why that is right for this specific client. A good direction can be stated in one sentence and lets you reject 80% of options instantly.

## 1. Discovery

Fill `templates/brief.md`. Where information is missing, ask only the questions that would change the design. Offer a default for each:

| Ask about | Why it changes the design |
|---|---|
| Who exactly visits, and what are they deciding? | Density, tone, proof needed |
| The one action that matters most | Hierarchy and CTA placement |
| 2–3 competitors / sites they admire or hate | Where to conform and where to break |
| Brand assets that exist (logo, photography, fonts, colors) | Constraints vs. freedom |
| Three adjectives the brand *is*, and one it must never be | Tone guardrails |
| Real content available (copy, photos, case studies, numbers) | Image direction, whether layout is content-led |

Never ask about things you can decide well yourself (spacing, which grid, animation library).

**Find the subject's world.** Before concepts, write 10–15 concrete nouns from the client's domain: materials, tools, places, rituals, documents, textures, vernacular type. (A bakery: flour sacks, proofing baskets, chalk boards, scoring patterns, 5am light. A security firm: audit logs, redacted documents, vault doors, hashes.) Distinctive choices come from here, not from "modern and clean".

## 2. Three concepts

Use `references/concept-axes.md` to force divergence. The three concepts must differ on **at least three axes**. A concept that differs only in color is not a concept.

For each:
```
Name:            (evocative, two-three words)
Idea:            one sentence — the metaphor or stance
Palette:         4–6 named hex values with roles
Type:            display + text faces (and why these, for this client)
Layout:          ASCII sketch of hero + one interior section; grid stance
Imagery:         what kind, source, treatment
Signature:       the one memorable element (see below)
Motion stance:   still / quiet / choreographed / kinetic
Risk:            what could go wrong, who it might alienate
```

## 3. Score and choose

| Criterion (weight) | Question |
|---|---|
| Fit (×3) | Would the target audience instantly recognise this as *for them*? |
| Distinctiveness (×3) | Could a competitor's logo be swapped in without anyone noticing? (If yes, score 1.) |
| Clarity (×2) | Does the offer still read in 5 seconds? |
| Buildability (×1) | Achievable at high quality with available content, assets and time? |
| Longevity (×1) | Will it look dated in 18 months? |

Pick the top score. You may graft *one* idea from a runner-up. Record the rejected concepts in a line each, which shows the client you explored.

## 4. Lock the direction

Write `.studio/direction.md` from `templates/direction.md`: the direction sentence, palette tokens, type system, spacing and grid, image direction, component character, motion principles, signature element, and a **do / don't list specific to this project**.

### The signature element

Every art-directed site has one thing people remember. Choose exactly one and spend boldness there; keep everything else disciplined. Examples (do not reuse blindly; derive from the subject's world):
- Typographic: a custom-set wordmark headline that interacts with the image; a variable-font axis tied to scroll; an oversized numeral system for a data-led brand.
- Compositional: a persistent edge index; an image strip that bleeds across the grid; a split-screen that tells two sides of a story.
- Material: a paper/print texture with real registration offsets; photography treated with one consistent crop and color grade.
- Interactive: a product you can actually manipulate in the hero; a cursor that reveals something meaningful; a live data element.

## 5. Hand-off rules

- The direction is a contract. If later work fights it, change the direction deliberately and log why in `decisions.md`, don't drift.
- If the brief pins a look ("make it like X", brand guidelines), the brief wins. Use creative freedom only on unpinned axes.
- Run `anti-ai-design` pre-flight against the direction before building.
