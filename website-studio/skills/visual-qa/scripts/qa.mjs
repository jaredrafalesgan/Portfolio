#!/usr/bin/env node
// qa.mjs — real-browser website QA.
// Usage: node qa.mjs <url> [--out .studio/qa/round-1] [--pages /,/about,/contact] [--crawl 10]
//                         [--viewports mobile,tablet,laptop,desktop,wide] [--no-full] [--no-links]
// Captures screenshots per viewport, and checks: console/page errors, failed requests, horizontal overflow
// (with culprit elements), broken links & anchors, tap targets, small text, images (broken/missing alt/oversized),
// color contrast (computed on rendered text), heading order, landmarks, labels, accessible names, focus visibility,
// SEO basics, CLS/LCP (lab), content hidden without motion, and a reduced-motion pass. Runs axe-core too if installed.
// Exit code 1 if any P0/P1 issue is found.

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { loadPlaywright, launchChromium } from './lib/browser.mjs';

const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const base = argv.find((a) => /^https?:\/\//.test(a) || a.startsWith('file:'));
if (!base) { console.error('Usage: node qa.mjs <url> [--out dir] [--pages /,/about] [--crawl N] [--viewports mobile,tablet,desktop]'); process.exit(2); }
const outDir = path.resolve(opt('--out', '.studio/qa/latest'));
const full = !argv.includes('--no-full');
const checkLinks = !argv.includes('--no-links');
const crawlN = +opt('--crawl', 0);
const VIEWPORTS = {
  mobile: { width: 390, height: 844, isMobile: true, hasTouch: true },
  tablet: { width: 834, height: 1194, isMobile: true, hasTouch: true },
  laptop: { width: 1280, height: 800 },
  desktop: { width: 1440, height: 900 },
  wide: { width: 1920, height: 1080 },
};
const vpNames = opt('--viewports', 'mobile,tablet,laptop,desktop,wide').split(',').filter((v) => VIEWPORTS[v]);

const pw = await loadPlaywright();
const browser = await launchChromium(pw);
fs.mkdirSync(outDir, { recursive: true });

const issues = [];
const add = (sev, page, viewport, rule, message, detail) => issues.push({ sev, page, viewport, rule, message, detail });
const shots = [];
const perf = {};
const origin = base.startsWith('file:') ? null : new URL(base).origin;

let axeSource = null;
for (const root of [process.cwd()]) {
  try { const req = createRequire(path.join(root, 'noop.js')); axeSource = fs.readFileSync(req.resolve('axe-core/axe.min.js'), 'utf8'); } catch {}
}

// ---------- page list ----------
let pages = (opt('--pages', '') || '').split(',').filter(Boolean).map((p) => new URL(p, base).href);
if (!pages.length) pages = [base];
if (crawlN > 0 && origin) {
  const ctx = await browser.newContext(); const p = await ctx.newPage();
  await p.goto(base, { waitUntil: 'load' }).catch(() => {});
  const found = await p.$$eval('a[href]', (as) => as.map((a) => a.href)).catch(() => []);
  for (const h of found) {
    const u = new URL(h); u.hash = '';
    if (u.origin === origin && !pages.includes(u.href) && !/\.(pdf|zip|jpg|png|webp|avif|svg|mp4)$/i.test(u.pathname)) pages.push(u.href);
    if (pages.length >= crawlN + 1) break;
  }
  await ctx.close();
}

// ---------- per page ----------
for (const url of pages) {
  const slug = (url.replace(/^https?:\/\/[^/]+/, '').replace(/[^\w]+/g, '-').replace(/^-|-$/g, '') || 'home').slice(0, 60);
  for (const vpName of vpNames) {
    const vp = VIEWPORTS[vpName];
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1, isMobile: !!vp.isMobile, hasTouch: !!vp.hasTouch });
    const page = await ctx.newPage();
    const consoleErrors = []; const failed = [];
    page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 300)); });
    page.on('pageerror', (e) => add('P0', url, vpName, 'js-exception', 'Uncaught JavaScript exception', String(e.message).slice(0, 300)));
    page.on('requestfailed', (r) => failed.push(`${r.failure()?.errorText || 'failed'} ${r.url().slice(0, 150)}`));
    page.on('response', (r) => { if (r.status() >= 400) failed.push(`HTTP ${r.status()} ${r.url().slice(0, 150)}`); });
    if (vpName === vpNames[vpNames.length - 1] || vpName === 'desktop') {
      await page.addInitScript(() => {
        window.__qa = { cls: 0, lcp: 0 };
        try {
          new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__qa.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
          new PerformanceObserver((l) => { const es = l.getEntries(); window.__qa.lcp = es[es.length - 1].startTime; window.__qa.lcpEl = es[es.length - 1].element?.tagName; }).observe({ type: 'largest-contentful-paint', buffered: true });
        } catch {}
      });
    }
    let resp;
    try { resp = await page.goto(url, { waitUntil: 'load', timeout: 45000 }); }
    catch (e) { add('P0', url, vpName, 'load-failed', 'Page failed to load', String(e.message).split('\n')[0]); await ctx.close(); continue; }
    if (resp && resp.status() >= 400) add('P0', url, vpName, 'http-status', `Page returned HTTP ${resp.status()}`);
    await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(outDir, `${slug}--${vpName}--fold.png`) });
    shots.push(`${slug}--${vpName}--fold.png`);
    await autoScroll(page);
    if (full) {
      await page.screenshot({ path: path.join(outDir, `${slug}--${vpName}--full.png`), fullPage: true }).catch(() => {});
      shots.push(`${slug}--${vpName}--full.png`);
    }

    // Layout checks at every viewport
    const lay = await page.evaluate(layoutChecks, { mobile: !!vp.isMobile });
    if (lay.overflow) add('P1', url, vpName, 'horizontal-overflow', `Page scrolls horizontally (${lay.scrollWidth}px > ${lay.vw}px)`, lay.culprits.join('\n'));
    if (lay.smallTargets.length) add('P2', url, vpName, 'tap-target', `${lay.smallTargets.length} interactive elements smaller than 24×24px (WCAG 2.5.8)`, lay.smallTargets.slice(0, 10).join('\n'));
    if (lay.tinyText.length) add('P2', url, vpName, 'small-text', `${lay.tinyText.length} text elements under 12px`, lay.tinyText.slice(0, 8).join('\n'));
    if (lay.brokenImgs.length) add('P1', url, vpName, 'broken-image', `${lay.brokenImgs.length} images failed to load`, lay.brokenImgs.slice(0, 8).join('\n'));
    if (lay.oversized.length) add('P3', url, vpName, 'oversized-image', `${lay.oversized.length} images much larger than displayed (wasted bytes)`, lay.oversized.slice(0, 8).join('\n'));
    if (lay.invisible.length) add('P1', url, vpName, 'hidden-content', `${lay.invisible.length} text blocks still invisible (opacity 0) after scrolling — reveal animation may have failed`, lay.invisible.slice(0, 8).join('\n'));
    if (lay.clipped.length) add('P2', url, vpName, 'clipped-text', `${lay.clipped.length} text elements clipped/overflowing their box`, lay.clipped.slice(0, 8).join('\n'));

    // Once per page: deep checks on the largest viewport tested
    if (vpName === (vpNames.includes('desktop') ? 'desktop' : vpNames[vpNames.length - 1])) {
      const a = await page.evaluate(deepChecks);
      const m = await page.evaluate(() => window.__qa || {});
      perf[url] = { cls: +(m.cls || 0).toFixed(3), lcpMs: Math.round(m.lcp || 0), lcpElement: m.lcpEl, ...a.perf };
      if (m.cls > 0.1) add('P1', url, vpName, 'cls', `Cumulative Layout Shift ${m.cls.toFixed(3)} (> 0.1)`);
      else if (m.cls > 0.05) add('P3', url, vpName, 'cls', `CLS ${m.cls.toFixed(3)} — acceptable but watch it`);
      if (m.lcp > 2500) add('P2', url, vpName, 'lcp', `Lab LCP ${Math.round(m.lcp)}ms on ${m.lcpEl} (target < 2500ms; field data will be slower)`);
      for (const f of a.findings) add(f.sev, url, vpName, f.rule, f.message, f.detail);

      // focus visibility
      const focus = await focusCheck(page);
      if (focus.length) add('P2', url, vpName, 'focus-visible', `${focus.length} focusable elements show no visible focus indicator`, focus.slice(0, 10).join('\n'));

      // axe-core (optional)
      if (axeSource) {
        await page.addScriptTag({ content: axeSource });
        const res = await page.evaluate(async () => await window.axe.run(document, { resultTypes: ['violations'] }));
        for (const v of res.violations) {
          const sev = v.impact === 'critical' ? 'P1' : v.impact === 'serious' ? 'P1' : v.impact === 'moderate' ? 'P2' : 'P3';
          add(sev, url, vpName, `axe:${v.id}`, `${v.help} (${v.nodes.length})`, v.nodes.slice(0, 5).map((n) => n.target.join(' ')).join('\n'));
        }
      }

      // links
      if (checkLinks && origin) {
        const { links, anchors, bad } = a.links;
        for (const b of bad) add('P2', url, vpName, 'dead-link', 'Link goes nowhere', b);
        for (const id of anchors.missing) add('P1', url, vpName, 'broken-anchor', `In-page link to #${id} has no target`);
        const checked = new Set();
        for (const l of links.slice(0, 120)) {
          const u = new URL(l); u.hash = '';
          if (checked.has(u.href)) continue; checked.add(u.href);
          const same = u.origin === origin;
          try {
            const r = await page.request.get(u.href, { timeout: 12000, maxRedirects: 5, failOnStatusCode: false });
            if (r.status() >= 400 && !(r.status() === 403 && !same) && !(r.status() === 429)) add(same ? 'P0' : 'P2', url, vpName, 'broken-link', `${same ? 'Internal' : 'External'} link returns HTTP ${r.status()}`, u.href);
          } catch (e) { if (same) add('P1', url, vpName, 'broken-link', 'Internal link unreachable', u.href); }
        }
      }
    }

    if (consoleErrors.length) add('P1', url, vpName, 'console-error', `${consoleErrors.length} console errors`, [...new Set(consoleErrors)].slice(0, 6).join('\n'));
    const ownFails = failed.filter((f) => !origin || f.includes(origin));
    if (ownFails.length) add('P1', url, vpName, 'failed-request', `${ownFails.length} failed same-origin requests`, [...new Set(ownFails)].slice(0, 8).join('\n'));
    else if (failed.length) add('P3', url, vpName, 'failed-request', `${failed.length} failed third-party requests`, [...new Set(failed)].slice(0, 5).join('\n'));
    await ctx.close();
  }

  // Reduced-motion pass (mobile + desktop fold)
  for (const vpName of ['mobile', 'desktop'].filter((v) => vpNames.includes(v))) {
    const vp = VIEWPORTS[vpName];
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, reducedMotion: 'reduce', isMobile: !!vp.isMobile });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'load', timeout: 45000 }).catch(() => {});
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, `${slug}--${vpName}--reduced-motion.png`) });
    shots.push(`${slug}--${vpName}--reduced-motion.png`);
    await autoScroll(page);
    const lay = await page.evaluate(layoutChecks, { mobile: !!vp.isMobile });
    if (lay.invisible.length) add('P1', url, `${vpName} (reduced motion)`, 'hidden-content', `${lay.invisible.length} text blocks invisible with reduced motion — content depends on animation`, lay.invisible.slice(0, 6).join('\n'));
    const moving = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running' && (a.effect?.getComputedTiming().iterations === Infinity)).length);
    if (moving) add('P2', url, `${vpName} (reduced motion)`, 'reduced-motion', `${moving} infinite animations still running under prefers-reduced-motion`);
    await ctx.close();
  }
}
await browser.close();

// ---------- report ----------
const order = { P0: 0, P1: 1, P2: 2, P3: 3 };
issues.sort((a, b) => order[a.sev] - order[b.sev] || a.rule.localeCompare(b.rule));
const count = (s) => issues.filter((i) => i.sev === s).length;
const md = [];
md.push(`# Visual QA report`, '', `- URL: ${base}`, `- Pages: ${pages.length} · Viewports: ${vpNames.join(', ')} + reduced-motion`, `- Date: ${new Date().toISOString()}`, `- axe-core: ${axeSource ? 'ran' : 'not installed (npm i -D axe-core to enable) — built-in a11y checks ran instead'}`, '');
md.push(`**P0 ${count('P0')} · P1 ${count('P1')} · P2 ${count('P2')} · P3 ${count('P3')}**  →  ${count('P0') + count('P1') ? '❌ NOT shippable' : '✅ no blocking issues — now do the visual critique'}`, '');
md.push('P0 = broken/blocking · P1 = must fix before launch · P2 = should fix · P3 = polish/info', '');
md.push('## Issues', '');
if (!issues.length) md.push('None found by automated checks. Automated checks are necessary, not sufficient: review every screenshot.', '');
for (const i of issues) {
  md.push(`### [${i.sev}] ${i.rule} — ${i.message}`, `_${i.page.replace(origin || '', '') || '/'} @ ${i.viewport}_`);
  if (i.detail) md.push('```', String(i.detail).slice(0, 1500), '```');
  md.push('');
}
md.push('## Performance (lab, local)', '', '| Page | LCP ms | LCP el | CLS | Requests | Transfer KB | JS KB | Fonts | DOM nodes |', '|---|---|---|---|---|---|---|---|---|');
for (const [u, p] of Object.entries(perf)) md.push(`| ${u.replace(origin || '', '') || '/'} | ${p.lcpMs} | ${p.lcpElement || ''} | ${p.cls} | ${p.requests} | ${p.transferKB} | ${p.jsKB} | ${p.fonts} | ${p.domNodes} |`);
md.push('', '## Screenshots — open and LOOK at each one', '', ...shots.map((s) => `- \`${s}\``), '');
md.push('## Next', '', 'Run the critique rubric (visual-qa/references/critique-rubric.md) on these screenshots. Automated checks cannot judge hierarchy, rhythm, taste or brand fit.');
fs.writeFileSync(path.join(outDir, 'qa-report.md'), md.join('\n'));
fs.writeFileSync(path.join(outDir, 'qa-report.json'), JSON.stringify({ base, pages, viewports: vpNames, counts: { P0: count('P0'), P1: count('P1'), P2: count('P2'), P3: count('P3') }, issues, perf, shots }, null, 2));
console.log(`QA: P0 ${count('P0')} · P1 ${count('P1')} · P2 ${count('P2')} · P3 ${count('P3')}`);
for (const i of issues.filter((x) => x.sev === 'P0' || x.sev === 'P1').slice(0, 15)) console.log(`  [${i.sev}] ${i.rule} @ ${i.viewport}: ${i.message}`);
console.log(`Report: ${path.join(outDir, 'qa-report.md')}\nScreenshots: ${shots.length} in ${outDir}`);
process.exit(count('P0') + count('P1') ? 1 : 0);

// ================= helpers (run in Node) =================
async function autoScroll(page) {
  await page.evaluate(async () => {
    const step = Math.max(200, innerHeight * 0.7);
    for (let y = 0; y < document.documentElement.scrollHeight && y < 40000; y += step) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 140)); }
    scrollTo(0, document.documentElement.scrollHeight); await new Promise((r) => setTimeout(r, 500));
    scrollTo(0, 0); await new Promise((r) => setTimeout(r, 500));
  });
}

async function focusCheck(page) {
  return page.evaluate(async () => {
    const sel = (el) => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.classList.length ? '.' + [...el.classList].slice(0, 2).join('.') : '') + ` "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30)}"`;
    const els = [...document.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter((e) => e.offsetParent !== null).slice(0, 25);
    const bad = [];
    const snap = (e) => { const s = getComputedStyle(e); return [s.outlineStyle, s.outlineWidth, s.outlineColor, s.boxShadow, s.borderColor, s.backgroundColor, s.textDecorationLine, s.color].join('|'); };
    for (const el of els) {
      const before = snap(el);
      // focus-visible only matches keyboard focus heuristically; force via keyboard-like focus
      el.focus({ focusVisible: true });
      await new Promise((r) => setTimeout(r, 20));
      const s = getComputedStyle(el);
      const after = snap(el);
      const hasOutline = s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0;
      if (!hasOutline && before === after) bad.push(sel(el));
      el.blur();
    }
    return bad;
  });
}

// ================= in-page functions =================
function layoutChecks({ mobile }) {
  const vw = document.documentElement.clientWidth;
  const sel = (el) => {
    const parts = []; let e = el;
    for (let i = 0; e && e !== document.body && i < 3; i++, e = e.parentElement)
      parts.unshift(e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (e.classList.length ? '.' + [...e.classList].slice(0, 2).join('.') : ''));
    return parts.join(' > ');
  };
  const visible = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
  const scrollWidth = document.documentElement.scrollWidth;
  const overflow = scrollWidth > vw + 1;
  const culprits = [];
  if (overflow) {
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.right > vw + 1 && r.width > 0 && visible(el)) {
        let clipped = false;
        for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if (o === 'hidden' || o === 'clip' || o === 'auto' || o === 'scroll') { clipped = true; break; } }
        if (!clipped && ![...el.children].some((c) => c.getBoundingClientRect().right > vw + 1)) culprits.push(`${sel(el)}  (right edge ${Math.round(r.right)}px)`);
      }
      if (culprits.length >= 10) break;
    }
  }
  const smallTargets = [];
  if (mobile) for (const el of document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, [role=button]')) {
    if (!visible(el)) continue; const r = el.getBoundingClientRect();
    const inline = getComputedStyle(el).display === 'inline' && el.closest('p, li, dd, td');
    if (!inline && (r.width < 24 || r.height < 24)) smallTargets.push(`${sel(el)}  ${Math.round(r.width)}×${Math.round(r.height)} "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30)}"`);
  }
  const tinyText = []; const clipped = []; const invisible = [];
  for (const el of document.querySelectorAll('body *')) {
    if (!el.childNodes.length || ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1)) continue;
    if (!visible(el)) continue;
    const s = getComputedStyle(el);
    if (parseFloat(s.fontSize) < 12 && !el.closest('sup, sub, [aria-hidden=true]')) tinyText.push(`${sel(el)}  ${s.fontSize} "${el.textContent.trim().slice(0, 30)}"`);
    if ((s.overflow === 'hidden' || s.overflowX === 'hidden') && el.scrollWidth > el.clientWidth + 2 && s.textOverflow !== 'ellipsis') clipped.push(`${sel(el)} "${el.textContent.trim().slice(0, 30)}"`);
    let op = 1; for (let p = el; p && p !== document.documentElement; p = p.parentElement) op *= parseFloat(getComputedStyle(p).opacity);
    if (op < 0.05 && !el.closest('[aria-hidden=true], [hidden], dialog:not([open]), [inert]')) invisible.push(`${sel(el)} "${el.textContent.trim().slice(0, 40)}"`);
  }
  const brokenImgs = []; const oversized = [];
  for (const img of document.images) {
    if (img.loading === 'lazy' && !img.complete) continue;
    if (img.complete && img.naturalWidth === 0 && img.currentSrc) brokenImgs.push(img.currentSrc.slice(0, 140));
    const r = img.getBoundingClientRect();
    if (img.naturalWidth > 0 && r.width > 0 && img.naturalWidth > r.width * 2.5 && img.naturalWidth > 800) oversized.push(`${(img.currentSrc || img.src).slice(0, 100)}  natural ${img.naturalWidth}px shown at ${Math.round(r.width)}px`);
  }
  return { vw, scrollWidth, overflow, culprits, smallTargets, tinyText, clipped, invisible, brokenImgs, oversized };
}

function deepChecks() {
  const findings = []; const f = (sev, rule, message, detail) => findings.push({ sev, rule, message, detail });
  const sel = (el) => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.classList.length ? '.' + [...el.classList].slice(0, 2).join('.') : '');
  const q = (s) => document.querySelector(s); const qa = (s) => [...document.querySelectorAll(s)];
  const visible = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };

  // ---- SEO / head ----
  const title = document.title.trim();
  if (!title) f('P1', 'seo-title', 'Missing <title>');
  else if (title.length < 15 || title.length > 65) f('P3', 'seo-title', `Title length ${title.length} chars (aim 30–60)`, title);
  const desc = q('meta[name="description"]')?.content?.trim();
  if (!desc) f('P2', 'seo-description', 'Missing meta description');
  else if (desc.length < 70 || desc.length > 165) f('P3', 'seo-description', `Meta description length ${desc.length} (aim 120–160)`, desc);
  if (!document.documentElement.lang) f('P1', 'html-lang', 'Missing lang attribute on <html>');
  if (!q('meta[name="viewport"]')) f('P1', 'viewport-meta', 'Missing viewport meta tag');
  if (!q('link[rel="canonical"]')) f('P3', 'seo-canonical', 'No canonical link');
  if (!q('meta[property="og:title"]') || !q('meta[property="og:image"]')) f('P2', 'seo-og', 'Missing Open Graph title/image (social previews will be poor)');
  if (!q('link[rel~="icon"]')) f('P3', 'favicon', 'No favicon link');
  if (!q('script[type="application/ld+json"]')) f('P3', 'seo-schema', 'No JSON-LD structured data');
  if (/noindex/i.test(q('meta[name="robots"]')?.content || '')) f('P2', 'seo-noindex', 'Page is set to noindex (fine for staging, not production)');

  // ---- structure ----
  const h1s = qa('h1').filter(visible);
  if (h1s.length === 0) f('P1', 'h1', 'No visible <h1>');
  if (h1s.length > 1) f('P2', 'h1', `${h1s.length} <h1> elements`, h1s.map((h) => h.textContent.trim().slice(0, 50)).join('\n'));
  let last = 0; const skips = [];
  for (const h of qa('h1,h2,h3,h4,h5,h6')) { const n = +h.tagName[1]; if (last && n > last + 1) skips.push(`${h.tagName} after H${last}: "${h.textContent.trim().slice(0, 40)}"`); last = n; }
  if (skips.length) f('P2', 'heading-order', 'Heading levels skipped', skips.slice(0, 6).join('\n'));
  if (!q('main')) f('P2', 'landmark-main', 'No <main> landmark');
  if (!q('a[href^="#"]') || !qa('a[href^="#"]').some((a) => /skip|main|content/i.test(a.textContent + a.getAttribute('href')))) f('P3', 'skip-link', 'No skip-to-content link');
  const ids = qa('[id]').map((e) => e.id); const dup = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
  if (dup.length) f('P2', 'duplicate-id', 'Duplicate ids', dup.slice(0, 10).join(', '));

  // ---- accessible names / labels / alt ----
  const name = (el) => (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') && document.getElementById(el.getAttribute('aria-labelledby'))?.textContent || el.textContent || el.getAttribute('title') || el.querySelector('img[alt]')?.alt || el.querySelector('svg title')?.textContent || '').trim();
  const noName = qa('a[href], button, [role=button]').filter((e) => visible(e) && !name(e));
  if (noName.length) f('P1', 'accessible-name', `${noName.length} links/buttons without an accessible name`, noName.slice(0, 8).map(sel).join('\n'));
  const unlabeled = qa('input:not([type=hidden]):not([type=submit]):not([type=button]), select, textarea').filter((i) => visible(i) && !(i.id && q(`label[for="${CSS.escape(i.id)}"]`)) && !i.closest('label') && !i.getAttribute('aria-label') && !i.getAttribute('aria-labelledby'));
  if (unlabeled.length) f('P1', 'form-label', `${unlabeled.length} form fields without a label`, unlabeled.slice(0, 8).map((i) => sel(i) + (i.placeholder ? ` placeholder="${i.placeholder}"` : '')).join('\n'));
  const noAlt = qa('img').filter((i) => !i.hasAttribute('alt'));
  if (noAlt.length) f('P2', 'img-alt', `${noAlt.length} images missing alt attribute`, noAlt.slice(0, 8).map((i) => (i.currentSrc || i.src).slice(0, 100)).join('\n'));
  const forms = qa('form').filter((fm) => !fm.getAttribute('action') && !fm.onsubmit && !fm.hasAttribute('data-netlify'));
  if (forms.length) f('P3', 'form-action', `${forms.length} forms have no action attribute — confirm they are handled by JS and actually submit somewhere`);

  // ---- contrast on rendered text ----
  const cv = document.createElement('canvas'); cv.width = cv.height = 1; const cx = cv.getContext('2d', { willReadFrequently: true });
  const rgba = (c) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
  const parseAlpha = (c) => { const m = c.match(/\/\s*([\d.]+%?)\s*\)|rgba\([^)]*,\s*([\d.]+)\s*\)/); if (!m) return 1; const v = m[1] || m[2]; return v.endsWith('%') ? parseFloat(v) / 100 : parseFloat(v); };
  const lum = ([r, g, b]) => { const t = [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * t[0] + 0.7152 * t[1] + 0.0722 * t[2]; };
  const ratio = (a, b) => { const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x); return (l1 + 0.05) / (l2 + 0.05); };
  const bgOf = (el) => {
    const stack = [];
    for (let e = el; e; e = e.parentElement) {
      const s = getComputedStyle(e);
      if (s.backgroundImage !== 'none' && !/^linear-gradient\(\s*(?:rgba?\([^)]*\)|#\w+)\s*,\s*\1\s*\)$/.test(s.backgroundImage)) return null; // image/gradient → unknown
      if (s.backgroundColor && s.backgroundColor !== 'transparent') { const c = rgba(s.backgroundColor); c[3] = parseAlpha(s.backgroundColor); if (c[3] > 0) { stack.push(c); if (c[3] >= 0.999) break; } }
    }
    let out = [255, 255, 255];
    for (const c of stack.reverse()) out = out.map((v, i) => c[i] * c[3] + v * (1 - c[3]));
    return out;
  };
  const fails = new Map(); let unknown = 0; let checked = 0;
  for (const el of qa('body *')) {
    if (checked > 600) break;
    if (!el.childNodes.length || ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1)) continue;
    if (!visible(el) || el.closest('[aria-hidden=true]')) continue;
    const s = getComputedStyle(el); checked++;
    const bg = bgOf(el); if (!bg) { unknown++; continue; }
    const fg = rgba(s.color); const a = parseAlpha(s.color); const fgc = fg.slice(0, 3).map((v, i) => v * a + bg[i] * (1 - a));
    const size = parseFloat(s.fontSize); const bold = +s.fontWeight >= 700;
    const large = size >= 24 || (size >= 18.66 && bold);
    const r = ratio(fgc, bg); const need = large ? 3 : 4.5;
    if (r < need) { const k = `${s.color} on rgb(${bg.map(Math.round).join(',')}) = ${r.toFixed(2)}:1 (needs ${need})`; if (!fails.has(k)) fails.set(k, []); fails.get(k).push(`${sel(el)} "${el.textContent.trim().slice(0, 30)}"`); }
  }
  if (fails.size) f('P1', 'contrast', `${[...fails.values()].flat().length} text elements fail WCAG AA contrast`, [...fails.entries()].slice(0, 8).map(([k, v]) => `${k}\n    e.g. ${v.slice(0, 3).join(' | ')}`).join('\n'));
  if (unknown) f('P3', 'contrast-unknown', `${unknown} text elements sit on images/gradients — verify contrast visually in screenshots`);

  // ---- links ----
  const links = qa('a[href]').map((a) => a.href).filter((h) => /^https?:/.test(h));
  const bad = qa('a').filter((a) => visible(a) && (!a.getAttribute('href') || a.getAttribute('href') === '#' || /^javascript:/i.test(a.getAttribute('href')))).map((a) => `${sel(a)} "${a.textContent.trim().slice(0, 30)}" href="${a.getAttribute('href') || ''}"`);
  const missing = qa('a[href^="#"]').map((a) => decodeURIComponent(a.getAttribute('href').slice(1))).filter((id) => id && !document.getElementById(id) && !document.getElementsByName(id).length);
  const blank = qa('a[target=_blank]').filter((a) => !/noopener|noreferrer/.test(a.rel));
  if (blank.length) f('P3', 'target-blank', `${blank.length} target=_blank links without rel="noopener"`);

  // ---- perf snapshot ----
  const res = performance.getEntriesByType('resource');
  const nav = performance.getEntriesByType('navigation')[0];
  const kb = (n) => Math.round(n / 1024);
  const perf = {
    requests: res.length + 1,
    transferKB: kb(res.reduce((s, r) => s + (r.transferSize || r.encodedBodySize || 0), 0) + (nav?.transferSize || 0)),
    jsKB: kb(res.filter((r) => r.initiatorType === 'script' || /\.m?js(\?|$)/.test(r.name)).reduce((s, r) => s + (r.transferSize || r.encodedBodySize || 0), 0)),
    fonts: res.filter((r) => /\.(woff2?|ttf|otf)(\?|$)/.test(r.name)).length,
    domNodes: document.getElementsByTagName('*').length,
  };
  if (perf.jsKB > 300) f('P2', 'js-weight', `${perf.jsKB} KB of JavaScript (marketing pages should aim < 150 KB)`);
  if (perf.fonts > 6) f('P3', 'font-count', `${perf.fonts} font files loaded (aim ≤ 4)`);
  if (perf.domNodes > 1800) f('P3', 'dom-size', `${perf.domNodes} DOM nodes (large)`);
  const lcpImg = qa('img').find((i) => { const r = i.getBoundingClientRect(); return r.top < innerHeight && r.width * r.height > innerWidth * innerHeight * 0.15; });
  if (lcpImg && lcpImg.loading === 'lazy') f('P2', 'lcp-lazy', 'Large above-the-fold image is loading="lazy" (hurts LCP)', lcpImg.currentSrc || lcpImg.src);
  const noDims = qa('img').filter((i) => !i.getAttribute('width') && !i.getAttribute('height') && getComputedStyle(i).aspectRatio === 'auto');
  if (noDims.length) f('P3', 'img-dimensions', `${noDims.length} images without width/height or aspect-ratio (CLS risk)`);

  return { findings, perf, links: { links, bad, anchors: { missing: [...new Set(missing)] } } };
}
