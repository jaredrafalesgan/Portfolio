# Research report: an elite website design & development system for Claude

_Compiled 12 Nov 2026. Covers deliverables 1–5: research findings, ranked skills/plugins, ranked connectors/MCP servers, installation, and existing skills worth installing. Tool availability and versions change fast, so re-verify before relying on a specific version._

---

## 1. Executive summary

**The main finding:** models are not short on frontend coding ability. Generic-looking sites come from three gaps:

1. **No point of view.** When a decision isn't pinned by the brief, the model falls back to the statistical default (Inter, purple gradient, 3 cards, fade-ups). The fix is a *process* that forces concepts, scoring and a locked direction before code. → `creative-director`, `anti-ai-design`.
2. **No eyes.** Code that looks right often renders wrong (overflow at 390px, invisible reveal content, contrast on images, awkward tablet grids). The fix is mandatory real-browser screenshots plus a critique loop. → `visual-qa`.
3. **No craft vocabulary.** Agency quality is many small correct decisions (type scale contrast, measure, rhythm, radius hierarchy, motion jobs). Encoding them as references the model loads on demand works better than long prompts. → `premium-ui-designer`, `motion-designer`, and third-party Impeccable, Emil Kowalski and Vercel guidelines.

So the system is built as a **process skill (studio-workflow) + 9 specialists + 3 deterministic scripts**, layered on the best existing open-source skills instead of duplicating them.

## 2. What exists in this environment today (audited, not assumed)

| Category | Present | Notes |
|---|---|---|
| Connectors (claude.ai) | **Canva** (connected), HyperFrames by HeyGen (connected), Google Calendar, Gemini (crypto; irrelevant) | Canva usable now for supporting assets |
| Not connected | Figma, Vercel, Context7, Supabase, Webflow, GitHub MCP, Framer, Mobbin | All exist; see §5 |
| Plugins already synced | `hzblj-skills` (GSAP, Tailwind, Next.js routing, UI polish, clean code), `remotion`, `ffmpeg-llm` | Useful; partly overlaps official GSAP skills (prefer the official ones for GSAP API detail) |
| Browser | Chromium + Playwright preinstalled in the cloud container | Used by `visual-qa` and `website-research` scripts |
| GitHub CLI | Present, but `GH_TOKEN` invalid in this session | So I could not create/push a repo. See "What you need to do" |
| Running third-party npm CLIs | Blocked by this session's safety policy | So Impeccable's CLI wasn't executed here; Markdown skills were copied and inspected instead |

## 3. Research findings

### 3.1 Agency design methodology (what top studios actually do)
- **Discovery → strategy → concept → design system → build → QA** is universal. Studios present 2–3 divergent *territories* before committing, and the chosen one is articulated as a sentence plus a system (palette, type, grid, motion, image direction), not a mood.
- **Derive identity from the subject's world** (materials, vernacular, artefacts), not from category conventions. Anthropic's own frontend-design skill makes the same point.
- **One signature element**, everything else disciplined ("spend your boldness in one place").
- **Content-first**: real copy and imagery shape layout; lorem ipsum hides problems.
- **Critique rituals**: work is reviewed visually against the brief in repeated rounds.

### 3.2 Current design direction in high-quality studio work (2025–26)
- Typography as the primary image: expressive variable fonts, extreme scale contrast, careful editorial setting.
- Editorial pacing: sections with different densities and widths, full-bleed interludes, captions as content.
- Restrained, purposeful motion: one choreographed load or scroll story, otherwise calm; native CSS scroll-driven animations and View Transitions replacing JS for simple cases.
- Authentic imagery (real photography, documentary crops) over stock and over generic 3D/AI renders.
- Tactile and material references (paper, print, grain), used sparingly and tied to the subject.
- Backlash against the "SaaS card kit" and generic AI aesthetics. Distinctiveness is the premium signal.

### 3.3 Engineering techniques worth standardising
- **CSS:** cascade layers, container queries, `:has()`, subgrid, `clamp()` fluid type/space, OKLCH color and `color-mix()`, `text-wrap: balance/pretty`, logical properties, `dvh` units, scroll-driven animations, View Transitions (same- and cross-document).
- **Frameworks:** Astro for content and marketing sites (zero JS by default, islands, built-in image optimisation); Next.js App Router for app-like sites; Tailwind v4 (CSS-first `@theme`) or authored CSS with tokens.
- **Motion:** Motion (`motion/react`, formerly Framer Motion) for React UI state; GSAP 3 + ScrollTrigger + SplitText (all plugins free since 2025) for timelines and scroll stories; Lenis only for scroll-told experiences.
- **Quality:** Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1); WCAG 2.2 AA (including target size 2.5.8 and focus-not-obscured); JSON-LD; security headers; AI-search readiness (factual HTML, `llms.txt`).

### 3.4 How to avoid "AI-looking" sites
Synthesised from Anthropic's frontend-design skill, Impeccable's 60+ detector rules, and gallery observation. The full catalogue is in `skills/anti-ai-design/references/tells.md`. The key insight from both Anthropic and Impeccable: the tells are not banned. They are *defaults*. Each must be either justified for this brief or replaced. The system enforces this three ways: a pre-flight on the plan, `slop-scan.mjs` on the code (with `slop-ok:` justifications), and a rubric sweep on the screenshots.

## 4. Ranked skills & plugins

Ranked by impact on final quality for website work. **Status:** ✅ installed by `install.sh` · 🧩 install as plugin · ⭐ built here.

| # | Skill / plugin | Source | Status | Real value to the process |
|---|---|---|---|---|
| 1 | **studio-workflow** + 9 specialists | this repo | ⭐ | The process: gates, artefacts, definition of done, routing |
| 2 | **visual-qa** (`qa.mjs`) | this repo | ⭐ | Real-browser evidence: 5 viewports, 25+ automated checks, critique rubric. Biggest single quality lever |
| 3 | **Impeccable** (Paul Bakaus) | `pbakaus/impeccable`, Apache-2.0 | 🧩 | 18+ design-move commands (`critique`, `audit`, `polish`, `bolder`, `quieter`, `typeset`, `layout`…) and a 60+ rule deterministic slop detector. Best existing design-quality skill |
| 4 | **frontend-design** (Anthropic, official) | `anthropics/claude-plugins-official` | ✅ | Baseline aesthetic judgement and the clearest description of current AI defaults |
| 5 | **anti-ai-design** (`slop-scan.mjs`) | this repo | ⭐ | Dependency-free detector (22 rules) + replacement strategies; complements Impeccable |
| 6 | **creative-director** | this repo | ⭐ | Discovery, 3 concepts on divergence axes, scoring matrix, locked direction. Nothing equivalent existed |
| 7 | **emil-design-eng**, **review-animations**, **improve-animations**, **animation-performance** | `emilkowalski/skills`, MIT | ✅ | Motion and interaction craft from a leading design engineer (Sonner, Vaul) |
| 8 | **web-design-guidelines** | `vercel-labs/agent-skills` | ✅ | Audits code against Vercel's 100+ live Web Interface Guidelines |
| 9 | **GSAP official skills** (core, timeline, scrolltrigger, react, plugins, performance) | `greensock/gsap-skills`, MIT | ✅ | Correct, current GSAP API usage; prevents outdated patterns |
| 10 | **react-best-practices**, **composition-patterns**, **react-view-transitions** | `vercel-labs/agent-skills` | ✅ | React/Next performance and component architecture rules |
| 11 | **premium-ui-designer**, **motion-designer**, **frontend-engineer**, **performance-seo**, **conversion-optimization**, **website-research** | this repo | ⭐ | Craft references, stack decision table, tokens/base CSS templates, CRO method, SEO/security checker, reference-capture tool |
| 12 | **webapp-testing** | `anthropics/skills` | ✅ | Pattern for bespoke Playwright flows (forms, menus, apps) |
| 13 | **Design** plugin (Anthropic: design-critique, accessibility-review, ux-copy, design-system, handoff) | Anthropic directory | 🧩 | Second-opinion critique and UX-copy passes; bundles Figma MCP |
| 14 | **Figma** plugin (16 skills + MCP) | `figma/mcp-server-guide` | 🧩 | Design-to-code, variables/tokens, Code Connect. Essential when designs come from Figma |
| 15 | **playwright** plugin (Microsoft MCP) | official marketplace | 🧩 | Interactive browser driving (click, type, inspect) beyond the scripted QA |
| 16 | **SearchFit SEO** or **SEO-AEO-GEO Ultimate** | Knowledge Work / directory | 🧩 optional | Content strategy, keyword clustering, AI-visibility. Useful for content-heavy sites; `performance-seo` covers technical SEO |
| — | Already synced: `hzblj-skills` (ui-typography, ui-motion, tailwind, nextjs-routing, polish…) | claude.ai | present | Good component-level polish rules. Overlaps GSAP official; keep both, prefer official for API facts |

**Deliberately not recommended:** generic "UI/UX Pro Max"-style mega-prompts and "taste" packs that hard-code one aesthetic (they create a *new* default look); multiple competing SEO mega-plugins at once (noise); duplicate frontend-design forks.

## 5. Ranked connectors & MCP servers

| # | Tool | Type | What it does → why it improves quality | Account / cost | Status here |
|---|---|---|---|---|---|
| 1 | **Playwright MCP** (Microsoft) | Local MCP (npx) | Drives a real browser: navigate, click, type, screenshot, read console. Lets Claude *see and operate* the site interactively | Free | Not configured. Scripts use the preinstalled Playwright library instead |
| 2 | **Context7** (Upstash) | Remote MCP `https://mcp.context7.com/mcp` | Current docs for Next, Astro, Tailwind v4, Motion, GSAP… Prevents outdated APIs, a top source of subtle bugs | Free (free API key raises limits) | Not connected |
| 3 | **Figma** | Remote MCP `https://mcp.figma.com/mcp` (+ plugin with skills) | Reads frames, variables, components, screenshots; writes back to canvas. Pixel-faithful builds from real designs | Free Figma account works with rate limits; Dev/Full seat for heavy use | Not connected |
| 4 | **GitHub** | Connector / `gh` CLI / plugin | Repos, PRs, version history. Essential for persistence (this container is ephemeral) | Free | `gh` present but token invalid this session |
| 5 | **Vercel** | Remote MCP `https://mcp.vercel.com` | Projects, deployments, build logs, docs search. Preview URLs for real-device and production-header QA | Free Hobby tier (non-commercial); Pro for commercial use | Not connected |
| 6 | **Mobbin** | Remote MCP `https://api.mobbin.com/mcp` (OAuth) | 600k+ real app/web screens and flows for pattern research (pricing, onboarding, nav) | **Paid Mobbin plan required** (sources differ on which tier; check mobbin.com/pricing) | Not connected |
| 7 | **Canva** | claude.ai connector | Generate and export supporting assets: OG images, social cards, brand kits, presentations | Canva account (free; Pro for brand kits) | ✅ **Connected** |
| 8 | **Supabase** | Remote MCP / connector | Database, auth, storage, edge functions for forms, CMS-lite, waitlists | Free tier | Not connected |
| 9 | **Webflow** | Remote MCP `https://mcp.webflow.com/mcp` (verify path in Webflow docs) | Build/edit Webflow sites and CMS when the client needs visual editing ownership | Webflow site plan for publishing | Not connected |
| 10 | **Framer** | Remote MCP `https://mcp.framer.com/mcp` | Build/edit Framer sites; strong for design-led marketing sites the client edits | Framer plan for custom domains | Not connected |
| + | **Chrome DevTools MCP** | Local MCP | Performance traces, network and CPU throttling, Lighthouse-like insights | Free | Recommended addition |
| + | **Wonder** / **Adobe** connectors | claude.ai | Canvas design in code / Adobe assets | Varies | Optional |
| + | **Sentry** | Plugin/MCP | Production error monitoring after launch | Free tier | Optional, post-launch |

## 6. Installation instructions

See **`docs/INSTALLATION.md`** for step-by-step commands for every item above.

## 7. Existing skills worth installing (summary)

Installed automatically by `./install.sh`: `frontend-design`, `webapp-testing`, `web-design-guidelines`, `react-best-practices`, `composition-patterns`, `react-view-transitions`, `emil-design-eng`, `review-animations`, `improve-animations`, `animation-performance`, `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-react`, `gsap-plugins`, `gsap-performance`.

Install yourself: **Impeccable** (`npx impeccable install` in each project, or the plugin), **Figma** plugin, **Design** plugin (Anthropic), **playwright** plugin.

## Sources
- Anthropic frontend-design: [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) (read in full) · [anthropics/skills](https://github.com/anthropics/skills)
- [pbakaus/impeccable](https://github.com/pbakaus/impeccable) · [skills.sh/pbakaus/impeccable/audit](https://skills.sh/pbakaus/impeccable/audit)
- [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) · [Vercel MCP docs](https://vercel.com/docs/mcp/vercel-mcp)
- [emilkowalski/skills](https://github.com/emilkowalski/skills) · [Agents with taste](https://emilkowal.ski/ui/agents-with-taste)
- [greensock/gsap-skills](https://github.com/greensock/gsap-skills)
- [Figma remote MCP setup](https://developers.figma.com/docs/figma-mcp-server/remote-server-installation) · [figma/mcp-server-guide](https://github.com/figma/mcp-server-guide)
- [Mobbin MCP server](https://github.com/mobbin/mobbin-mcp-server) · [Mobbin launch (BusinessWire, May 2026)](https://www.businesswire.com/news/home/20260511053592/en/Mobbin-Launches-MCP-Server-Giving-AI-Tools-621500-Real-App-Screens-to-Reference)
- [Framer official MCP announcement](https://agilebrandguide.com/framer-launches-official-mcp-server-letting-outside-ai-agents-build-and-edit-websites/) · [Webflow AI tools docs](https://developers.webflow.com/data/docs/ai-tools.md)
- [upstash/context7](https://github.com/upstash/context7) · [Context7 Claude Code setup](https://www.mintlify.com/upstash/context7/mcp/claude-code)
- [Playwright MCP with Claude Code (Simon Willison)](https://til.simonwillison.net/claude-code/playwright-mcp-claude-code)
- Roundups consulted (treated as secondary): [Firecrawl](https://www.firecrawl.dev/blog/best-claude-code-skills), [Subframe](https://www.subframe.com/tips/best-claude-code-skills-for-ui-design), [Composio](https://composio.dev/content/top-design-skills), [Superdesign](https://superdesign.dev/blog/best-claude-code-skills)
- claude.ai connector registry and plugin directory (queried live in this session)
