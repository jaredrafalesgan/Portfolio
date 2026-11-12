# Installation

Everything here is free unless marked 💳. Nothing here deploys anything publicly.

## 0. Keep this system somewhere permanent
The cloud session that built this is ephemeral. It lives at https://github.com/jaredrafalesgan/Portfolio, so every step below works on any machine.

## 1. Skills (one command)

```bash
git clone https://github.com/jaredrafalesgan/Portfolio && cd Portfolio/website-studio
```
```bash
./install.sh
```
This installs the 10 website-studio skills plus 16 curated official skills into `~/.claude/skills`. Use `./install.sh --project /path/to/site` to install into a single project instead, `--studio-only` to skip third-party skills, or `--with-mcp` to also register Playwright, Context7, Figma and Vercel MCP servers.

**Alternative: install as a Claude Code plugin** (stays updatable):
```
/plugin marketplace add jaredrafalesgan/Portfolio
/plugin install website-studio@website-studio
```

**Claude.ai / Claude Desktop (not Code):** zip each folder in `skills/` and upload it under Settings → Capabilities → Skills. The scripts need Claude Code or a code-execution environment with Playwright.

## 2. Plugins (inside Claude Code)

| Plugin | Command |
|---|---|
| Impeccable (auto-enabled for this repo via `.claude/settings.json`) | `/plugin marketplace add pbakaus/impeccable` then `/plugin install impeccable@impeccable` (or `npx impeccable install` in a project root, then `/impeccable init`) |
| Anthropic frontend-design | `/plugin install frontend-design@claude-plugins-official` (already copied by install.sh) |
| Figma (skills + MCP) | `/plugin install figma@claude-plugins-official` |
| Playwright MCP | `/plugin install playwright@claude-plugins-official` |
| Context7 | `/plugin install context7@claude-plugins-official` |
| Vercel | `/plugin install vercel@claude-plugins-official` |
| Supabase | `/plugin install supabase@claude-plugins-official` |
| GSAP (as plugin instead of skills) | `/plugin marketplace add greensock/gsap-skills` then `/plugin install gsap-skills@gsap-skills` |
| Anthropic Design plugin | claude.ai → Customize → Plugins → "Design" (Anthropic Directory) |

If the official marketplace isn't present, add it first: `/plugin marketplace add anthropics/claude-plugins-official`.

## 3. MCP servers (CLI, if not using plugins)

```bash
claude mcp add --scope user playwright -- npx -y @playwright/mcp@latest
```
```bash
claude mcp add --scope user --transport http context7 https://mcp.context7.com/mcp --header "CONTEXT7_API_KEY: <free key from context7.com/dashboard>"
```
```bash
claude mcp add --scope user --transport http figma https://mcp.figma.com/mcp
```
```bash
claude mcp add --scope user --transport http vercel https://mcp.vercel.com
```
```bash
claude mcp add --scope user --transport http mobbin https://api.mobbin.com/mcp
```
💳 Mobbin needs a paid plan.
```bash
claude mcp add --scope user --transport http framer https://mcp.framer.com/mcp
```
```bash
claude mcp add --scope user --transport http webflow https://mcp.webflow.com/mcp
```
```bash
claude mcp add --scope user --transport http supabase https://mcp.supabase.com/mcp
```
Then in Claude Code run `/mcp`, select each OAuth server (Figma, Vercel, Mobbin, Framer, Webflow, Supabase), and choose **Authenticate**.

**On claude.ai (web/desktop/cloud sessions):** Settings → Connectors → add Figma, Vercel, Context7, Supabase, Webflow (all in the directory). Canva is already connected on your account.

**Cloud sessions:** remote hosts must be allowed by the environment's network policy. If a connector host is blocked, add it in the environment's network settings.

## 4. Per-project setup

```bash
cp ~/.claude/skills/frontend-engineer/templates/project-CLAUDE.md ./CLAUDE.md
```
```bash
npm i -D playwright axe-core && npx playwright install chromium
```

## 5. Verify

In a new Claude Code session ask: "What skills do you have for website design?" You should see `studio-workflow`, `creative-director`, … and the third-party ones. Then run:
```bash
node ~/.claude/skills/visual-qa/scripts/qa.mjs https://example.com --out /tmp/qa-test --viewports mobile,desktop
```
