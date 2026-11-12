#!/usr/bin/env bash
# website-studio installer
#   ./install.sh                 install studio skills + curated third-party skills to ~/.claude/skills
#   ./install.sh --project DIR   install into DIR/.claude/skills instead (commit them with the project)
#   ./install.sh --studio-only   only the 10 website-studio skills
#   ./install.sh --with-mcp      also register free MCP servers with the Claude Code CLI (Playwright, Context7, Figma, Vercel)
# Third-party skills are copied from their official GitHub repos (Markdown instructions only; no code is executed).
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST="$HOME/.claude/skills"; STUDIO_ONLY=0; WITH_MCP=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --project) DEST="$(cd "$2" && pwd)/.claude/skills"; shift 2;;
    --studio-only) STUDIO_ONLY=1; shift;;
    --with-mcp) WITH_MCP=1; shift;;
    *) echo "Unknown option $1"; exit 2;;
  esac
done
mkdir -p "$DEST"
echo "→ Installing into $DEST"

# 1. website-studio skills
for s in "$HERE"/skills/*/; do
  name="$(basename "$s")"; rm -rf "$DEST/$name"; cp -R "$s" "$DEST/$name"; echo "  ✓ $name (website-studio)"
done

# 2. Curated third-party skills (repo | path inside repo | skill names)
if [[ $STUDIO_ONLY -eq 0 ]]; then
  TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
  fetch() { # repo subdir skills...
    local repo="$1" sub="$2"; shift 2
    local dir="$TMP/$(echo "$repo" | tr / _)"
    [[ -d "$dir" ]] || git clone -q --depth 1 "https://github.com/$repo" "$dir" || { echo "  ✗ could not clone $repo"; return; }
    for sk in "$@"; do
      if [[ -d "$dir/$sub/$sk" ]]; then rm -rf "$DEST/$sk"; cp -R "$dir/$sub/$sk" "$DEST/$sk"; echo "  ✓ $sk ($repo)"
      else echo "  ✗ $sk not found in $repo/$sub (repo layout changed?)"; fi
    done
  }
  fetch anthropics/claude-plugins-official plugins/frontend-design/skills frontend-design
  fetch anthropics/skills skills webapp-testing
  fetch vercel-labs/agent-skills skills web-design-guidelines react-best-practices composition-patterns react-view-transitions
  fetch emilkowalski/skills skills emil-design-eng review-animations improve-animations animation-performance
  fetch greensock/gsap-skills skills gsap-core gsap-timeline gsap-scrolltrigger gsap-react gsap-plugins gsap-performance
  echo ""
  echo "  ℹ Impeccable (recommended) installs via its own tool. In your project root run:  npx impeccable install"
  echo "    or inside Claude Code:  /plugin marketplace add pbakaus/impeccable  then  /plugin install impeccable@impeccable"
fi

# 3. Optional MCP servers (free tiers; OAuth ones prompt in-browser on first use via /mcp)
if [[ $WITH_MCP -eq 1 ]]; then
  if command -v claude >/dev/null; then
    claude mcp add --scope user playwright -- npx -y @playwright/mcp@latest || true
    claude mcp add --scope user --transport http context7 https://mcp.context7.com/mcp || true
    claude mcp add --scope user --transport http figma https://mcp.figma.com/mcp || true
    claude mcp add --scope user --transport http vercel https://mcp.vercel.com || true
    echo "  ✓ MCP servers registered. In Claude Code run /mcp and Authenticate Figma and Vercel."
  else
    echo "  ✗ claude CLI not found; see docs/INSTALLATION.md for manual MCP setup."
  fi
fi

# 4. Project helpers
echo ""
echo "Done. Restart Claude Code (or start a new session) so the skills load."
echo "For each new website repo:  cp $HERE/skills/frontend-engineer/templates/project-CLAUDE.md <repo>/CLAUDE.md"
echo "QA needs Playwright in the project:  npm i -D playwright axe-core && npx playwright install chromium"
