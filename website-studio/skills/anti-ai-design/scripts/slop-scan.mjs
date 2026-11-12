#!/usr/bin/env node
// slop-scan: deterministic detector for generic AI-website patterns.
// Usage: node slop-scan.mjs <path...> [--json] [--strict]
// Lines containing "slop-ok" are ignored (document the reason after it).
// No dependencies.

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const strict = args.includes('--strict');
const targets = args.filter((a) => !a.startsWith('--'));
if (!targets.length) {
  console.error('Usage: node slop-scan.mjs <dir-or-file...> [--json] [--strict]');
  process.exit(2);
}

const EXT = new Set(['.html', '.htm', '.css', '.scss', '.jsx', '.tsx', '.js', '.ts', '.vue', '.svelte', '.astro', '.mdx', '.md']);
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', '.astro', '.output', 'coverage', '.studio', '.vercel', '.turbo', 'out']);

function walk(p, acc = []) {
  const st = fs.statSync(p);
  if (st.isDirectory()) {
    for (const e of fs.readdirSync(p)) if (!SKIP_DIRS.has(e)) walk(path.join(p, e), acc);
  } else if (EXT.has(path.extname(p)) && !/\.min\./.test(p) && st.size < 2_000_000) acc.push(p);
  return acc;
}

// Each rule: id, severity (high|medium|low), regex (global, per line), threshold (min hits before reporting),
// why, fix. "perHit" weight contributes to the score.
const PURPLE = '(?:purple|violet|indigo|fuchsia|#(?:7c3aed|8b5cf6|a855f7|6366f1|4f46e5|9333ea|a78bfa|c084fc|818cf8))';
const BLUEPINK = '(?:blue|sky|cyan|pink|#(?:3b82f6|60a5fa|06b6d4|ec4899|2563eb|0ea5e9))';
const RULES = [
  { id: 'purple-gradient', sev: 'high', w: 8, th: 1,
    re: new RegExp(`(?:gradient\\([^)]*${PURPLE}[^)]*${BLUEPINK}|gradient\\([^)]*${BLUEPINK}[^)]*${PURPLE}|from-(?:purple|violet|indigo|fuchsia|blue|sky|pink)-\\d+[\\w/-]*\\s+(?:via-\\S+\\s+)?to-(?:blue|sky|cyan|pink|indigo|violet|purple|fuchsia)-\\d+)`, 'gi'),
    why: 'Purple/indigo↔blue/pink gradients are the single most common AI-generated aesthetic.',
    fix: 'Use a flat color from the client\'s world, or a gradient that depicts real light/material (interpolate in oklch).' },
  { id: 'gradient-text', sev: 'high', w: 6, th: 1,
    re: /(?:background-clip:\s*text|bg-clip-text)/gi,
    why: 'Gradient-filled headline text is a stock "modern" effect with no meaning.',
    fix: 'Solid ink. Create emphasis with scale, weight, placement or a real typographic treatment.' },
  { id: 'glass', sev: 'medium', w: 2, th: 3,
    re: /(?:backdrop-filter|backdrop-blur)/gi,
    why: 'Glassmorphism on many surfaces is decoration standing in for hierarchy.',
    fix: 'Solid surfaces; reserve blur for overlays sitting on real imagery (e.g. a sticky nav over photos).' },
  { id: 'blur-blob', sev: 'medium', w: 4, th: 1,
    re: /(?:blur-3xl|blur-\[\d{2,}px\]|filter:\s*blur\(\s*[4-9]\d+px|filter:\s*blur\(\s*\d{3,}px)/gi,
    why: 'Large blurred color blobs/orbs behind content are a generator signature.',
    fix: 'Remove them, or replace with a texture/material/photo that belongs to the subject.' },
  { id: 'radius-monoculture', sev: 'medium', w: 0.5, th: 8,
    re: /(?:rounded-(?:2xl|3xl)|border-radius:\s*(?:1[6-9]|2\d|3\d)px|border-radius:\s*(?:1|1\.25|1\.5|2)rem)/gi,
    why: 'The same large radius on everything flattens hierarchy and reads as a UI kit.',
    fix: 'Define a radius hierarchy (by element size/role) or choose deliberate sharpness.' },
  { id: 'default-font', sev: 'medium', w: 5, th: 1,
    re: /(?:font-family:[^;]*\b(?:Inter|Poppins|Roboto|Montserrat|Space Grotesk|Playfair Display|DM Sans|Open Sans|Lato)\b|from ['"]next\/font\/google['"].*\b(?:Inter|Poppins|Roboto|Montserrat|Space_Grotesk|Playfair_Display|DM_Sans)\b|\b(?:Inter|Poppins|Roboto|Montserrat|Space_Grotesk|Playfair_Display|DM_Sans)\s*\(\s*\{|fonts\.googleapis\.com\/css2?\?family=(?:Inter|Poppins|Roboto|Montserrat|Space\+Grotesk|Playfair\+Display|DM\+Sans|Open\+Sans|Lato)\b)/g,
    why: 'Default-generator typefaces make a site look like every other generated site.',
    fix: 'Choose a face for this client (see premium-ui-designer/references/typography.md). Mark slop-ok if it is a brand font.' },
  { id: 'three-col-grid', sev: 'low', w: 1.5, th: 2,
    re: /(?:grid-cols-3\b|md:grid-cols-3|lg:grid-cols-3|grid-template-columns:\s*repeat\(\s*3\s*,\s*(?:1fr|minmax))/g,
    why: 'Repeated equal three-column grids are the default feature layout.',
    fix: 'Let content priority drive layout: one lead item large, supporting items smaller; or a list.' },
  { id: 'eyebrow', sev: 'medium', w: 1, th: 3,
    re: /(?:\buppercase\b[^"'`]*\btracking-(?:wide|wider|widest|\[0?\.\d+em\])|\btracking-(?:wider|widest|\[0?\.\d+em\])[^"'`]*\buppercase\b|text-transform:\s*uppercase[^}]*letter-spacing:\s*0?\.(?:1|1\d|2\d?|3)\d*em|letter-spacing:\s*0?\.(?:1|1\d|2\d?|3)\d*em[^}]*text-transform:\s*uppercase)/gi,
    why: 'Tracked-out ALL-CAPS "eyebrow" labels above every heading are template chrome.',
    fix: 'Drop them, or make labels carry real information. Prefer small caps when the face supports them.' },
  { id: 'pill-overuse', sev: 'low', w: 0.5, th: 6,
    re: /rounded-full|border-radius:\s*(?:9999px|999px|100px|50rem)/gi,
    why: 'Pills on every button and badge are a UI-kit default.',
    fix: 'Derive button shape from the direction; keep pills for true tags/toggles/avatars.' },
  { id: 'generic-shadow', sev: 'low', w: 0.5, th: 5,
    re: /(?:\bshadow-(?:md|lg|xl|2xl)\b|rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0?\.1\s*\))/g,
    why: 'Identical soft grey shadows under every card are the SaaS-card kit.',
    fix: 'No shadow, or layered shadows tinted with the ground hue, used only to show real elevation.' },
  { id: 'emoji-icon', sev: 'medium', w: 2, th: 2,
    re: /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]\uFE0F?/gu,
    why: 'Emoji as feature icons/decoration reads as generated filler.',
    fix: 'No icons, or custom pictograms with a consistent style; or real imagery.' },
  { id: 'icon-library-decor', sev: 'low', w: 1.5, th: 1,
    re: /\b(?:Sparkles|Rocket|Zap|Wand2|WandSparkles|Stars|BrainCircuit|Bot)\b(?=[\s,}\/>])/g,
    why: 'Sparkle/rocket/lightning icons signal "AI startup" regardless of subject.',
    fix: 'Show the real product or remove the icon.' },
  { id: 'arrow-cta', sev: 'low', w: 1, th: 3,
    re: /(?:→|&rarr;|-&gt;)\s*(?:<\/|['"`]|$)/gm,
    why: '"→" appended to every link/button is template chrome.',
    fix: 'Use a clear verb; use arrows only where they indicate navigation direction.' },
  { id: 'numbered-markers', sev: 'low', w: 1, th: 3,
    re: />\s*0[1-9]\s*[.\/]?\s*</g,
    why: '01/02/03 markers imply a sequence; on non-sequential content they are decoration.',
    fix: 'Use numbering only for real steps/chapters.' },
  { id: 'middot-meta', sev: 'low', w: 0.5, th: 4,
    re: /\S\s·\s\S/g,
    why: 'Meta strings joined with middle dots are a generated-page signature.',
    fix: 'Structure metadata (definition list, columns) or simplify.' },
  { id: 'claude-tell', sev: 'medium', w: 4, th: 1,
    re: /#(?:f4f1ea|d97757|faf9f5|f5f0e8)\b/gi,
    why: 'Cream #F4F1EA / terracotta #D97757 is the "tasteful default" of current models.',
    fix: 'Derive the palette from the subject.' },
  { id: 'cliche-copy', sev: 'medium', w: 1.5, th: 1,
    re: /\b(?:unlock(?:s|ing)? (?:the|your)|elevate (?:your|the)|seamless(?:ly)?|supercharge|empower(?:s|ing)? (?:you|your|teams)|revolutioni[sz]e|game[- ]changer|cutting[- ]edge|next[- ]level|effortless(?:ly)?|all[- ]in[- ]one|world[- ]class|harness the power|in today'?s (?:fast[- ]paced|digital)|take your \w+ to the next|transform your|built for the future|delve|unleash|reimagin(?:e|ed|ing)|tailored solutions|state[- ]of[- ]the[- ]art)\b/gi,
    why: 'Marketing clichés typical of generated copy; they say nothing specific.',
    fix: 'Replace with concrete nouns, numbers, and claims only this client could make.' },
  { id: 'placeholder', sev: 'high', w: 6, th: 1,
    re: /\b(?:lorem ipsum|dolor sit amet|Acme(?: Inc| Corp)?|John Doe|Jane Doe|your company|example\.com)\b/gi,
    why: 'Placeholder content hides real layout problems and ships looking unfinished.',
    fix: 'Use real or realistic, specific content.' },
  { id: 'fake-stats', sev: 'low', w: 1, th: 2,
    re: /\b(?:10[kK]\+|50[kK]\+|100[kK]\+|1[mM]\+|99\.9+%|24\/7|10x|5x)\b/g,
    why: 'Round, unsourced hero stats are filler.',
    fix: 'Use real numbers with a source, or remove.' },
  { id: 'bounce-ease', sev: 'low', w: 2, th: 1,
    re: /(?:animate-bounce|easeOutBounce|bounce\.out|elastic\.out|cubic-bezier\(\s*[\d.]+\s*,\s*-?[\d.]+\s*,\s*[\d.]+\s*,\s*1\.[5-9])/gi,
    why: 'Bouncy/elastic easing feels toy-like and generic.',
    fix: 'Use confident ease-out curves (see motion-designer).' },
  { id: 'fade-up-everything', sev: 'medium', w: 0.7, th: 6,
    re: /(?:data-aos=|animate-fade-in-up|fadeInUp|initial=\{\{\s*opacity:\s*0\s*,\s*y:\s*\d+|whileInView|\.reveal\b|from\(\s*["'`][^"'`]+["'`]\s*,\s*\{\s*(?:opacity:\s*0\s*,\s*y|y:\s*\d+\s*,\s*opacity:\s*0))/g,
    why: 'Fade-and-slide-up on every section is the generic motion default.',
    fix: 'Keep the page still; choreograph one signature moment; animate in response to user actions.' },
  { id: 'marquee', sev: 'low', w: 2, th: 1,
    re: /(?:<marquee|animate-marquee|@keyframes\s+marquee|class(?:Name)?=["'][^"']*\bmarquee\b)/gi,
    why: 'Infinite logo/text marquees are overused filler motion.',
    fix: 'Only for genuine streams; pause on hover/focus; stop under reduced motion.' },
];

const files = targets.flatMap((t) => walk(path.resolve(t)));
const hits = Object.fromEntries(RULES.map((r) => [r.id, []]));

for (const f of files) {
  const lines = fs.readFileSync(f, 'utf8').split(/\r?\n/);
  lines.forEach((line, i) => {
    if (line.includes('slop-ok') || line.length > 5000) return;
    for (const r of RULES) {
      if (r.id === 'cliche-copy' && /\.(css|scss)$/.test(f)) continue;
      if (r.id === 'middot-meta' && /\.(css|scss|js|ts)$/.test(f)) continue;
      r.re.lastIndex = 0;
      const m = line.match(r.re);
      if (m) for (const s of m) hits[r.id].push({ file: path.relative(process.cwd(), f), line: i + 1, match: s.trim().slice(0, 80) });
    }
  });
}

const findings = [];
let score = 0;
for (const r of RULES) {
  const h = hits[r.id];
  const th = strict ? 1 : r.th;
  if (h.length >= th) {
    findings.push({ id: r.id, severity: r.sev, count: h.length, why: r.why, fix: r.fix, locations: h.slice(0, 12) });
    score += Math.min(20, r.w * h.length);
  }
}
score = Math.min(100, Math.round(score));
const sevOrder = { high: 0, medium: 1, low: 2 };
findings.sort((a, b) => sevOrder[a.severity] - sevOrder[b.severity] || b.count - a.count);
const verdict = score < 15 ? 'PASS — reads as deliberate' : score < 35 ? 'WARN — some defaults to justify or replace' : 'FAIL — reads as generated; rework the direction';

if (asJson) {
  console.log(JSON.stringify({ filesScanned: files.length, score, verdict, findings }, null, 2));
} else {
  console.log(`\nslop-scan · ${files.length} files · genericness score ${score}/100 · ${verdict}\n`);
  if (!findings.length) console.log('No tells found above thresholds.');
  for (const f of findings) {
    console.log(`[${f.severity.toUpperCase()}] ${f.id} ×${f.count}`);
    console.log(`  why: ${f.why}`);
    console.log(`  fix: ${f.fix}`);
    for (const l of f.locations) console.log(`    ${l.file}:${l.line}  ${l.match}`);
    if (f.count > f.locations.length) console.log(`    … ${f.count - f.locations.length} more`);
    console.log('');
  }
  console.log('Deliberate exception? Add a comment containing "slop-ok: <reason>" on that line.');
}
process.exit(findings.some((f) => f.severity === 'high') ? 1 : 0);
