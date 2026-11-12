# Reusable website brief prompt

Copy, fill what you know, delete what you don't. Unknown fields are fine: Claude will propose defaults and ask only what matters.

```text
Use the studio-workflow skill to design and build this website to an elite-agency standard.

PROJECT
- Name / brand:
- What it is (one sentence):
- Website purpose & success metric:
- Primary action I want visitors to take:

AUDIENCE
- Who visits, on what device, deciding what:
- What they care about / fear:

POSITIONING
- Industry & competitors (URLs):
- What makes us different (real facts, numbers, proof):
- Brand personality — 3 words it IS, 1 word it must NEVER be:

CONTENT & ASSETS
- Pages / sections needed:
- Copy: [provided / draft it for me / I'll review]
- Images: [real photos at … / use Canva to create … / none yet]
- Logo, colors, fonts, brand guidelines: [link / none: create direction]
- Testimonials, case studies, numbers I can use (real only):

INSPIRATION (optional)
- Sites I like and WHY:
- Sites I dislike and WHY:
- Figma file (if any):

TECHNICAL
- Stack preference: [let Claude choose / Astro / Next.js / Webflow / Framer / single HTML]
- Features: [contact form / booking / CMS / blog / e-commerce / auth / multilingual]
- Hosting: [Vercel / Netlify / other / decide later]
- Form/data backend: [Supabase / Formspree / email / decide later]

CONSTRAINTS
- Deadline, budget for fonts/assets (ask before buying), accessibility needs:

PROCESS PREFERENCES
- Show me the 3 concepts before building? [yes / no, just pick the strongest]
- Deploy a preview when done? [ask me first / no]
```

## Short version

```text
Use studio-workflow. Build a [type of site] for [brand], who [what they do] for [audience].
Goal: [primary action]. Differentiator: [real fact]. Feel: [3 adjectives], never [1 word].
Content: [what exists]. Stack: [choice or "you choose"]. Show me concepts first: [yes/no].
```

## Follow-up prompts for refinement

- "Run visual-qa on the current build and critique it as a hostile creative director. Fix everything below 4."
- "Run anti-ai-design on src/ and replace every unjustified default."
- "The hero doesn't communicate the brand. Give me 3 alternative hero compositions as ASCII sketches, then build the strongest."
- "Make the mobile experience as considered as desktop. Re-compose, don't shrink."
- "Audit motion: remove anything without a job, then design one signature moment."
