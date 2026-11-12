#!/usr/bin/env node
// capture-reference: screenshot reference websites and extract their real design decisions.
// Usage: node capture-reference.mjs <url...> [--out .studio/research] [--no-full]
// Requires: playwright (npm i -D playwright). Uses PLAYWRIGHT/system Chromium if available.

import fs from 'node:fs';
import path from 'node:path';
import { loadPlaywright, launchChromium } from './lib/browser.mjs';

const argv = process.argv.slice(2);
const outIdx = argv.indexOf('--out');
const outDir = path.resolve(outIdx >= 0 ? argv[outIdx + 1] : '.studio/research');
const full = !argv.includes('--no-full');
const urls = argv.filter((a, i) => /^https?:\/\//.test(a) && argv[i - 1] !== '--out');
if (!urls.length) { console.error('Usage: node capture-reference.mjs <url...> [--out dir] [--no-full]'); process.exit(2); }

const pw = await loadPlaywright();
const browser = await launchChromium(pw);
fs.mkdirSync(outDir, { recursive: true });
const summary = [];

for (const url of urls) {
  const slug = new URL(url).hostname.replace(/^www\./, '') + (new URL(url).pathname.replace(/\/+$/, '').replace(/[^\w]+/g, '-') || '');
  const dir = path.join(outDir, slug);
  fs.mkdirSync(dir, { recursive: true });
  const result = { url, slug, ok: true };
  try {
    for (const [name, vp] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
      const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, isMobile: name === 'mobile', hasTouch: name === 'mobile',
        userAgent: name === 'mobile' ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1' : undefined });
      const page = await ctx.newPage();
      let bytes = 0;
      page.on('response', async (r) => { try { const l = r.headers()['content-length']; if (l) bytes += +l; } catch {} });
      await page.goto(url, { waitUntil: 'load', timeout: 45000 });
      await page.waitForTimeout(2500);
      await page.screenshot({ path: path.join(dir, `${name}-fold.png`) });
      if (full) {
        await autoScroll(page);
        await page.screenshot({ path: path.join(dir, `${name}-full.png`), fullPage: true }).catch(() => {});
      }
      if (name === 'desktop') {
        result.analysis = await page.evaluate(analyze);
        result.analysis.transferBytesApprox = bytes;
      }
      await ctx.close();
    }
  } catch (e) {
    result.ok = false; result.error = String(e.message || e).split('\n')[0];
  }
  fs.writeFileSync(path.join(dir, 'analysis.json'), JSON.stringify(result, null, 2));
  summary.push(result);
  console.log(`${result.ok ? '✓' : '✗'} ${url}${result.ok ? '' : '  ' + result.error}`);
}
await browser.close();

// Markdown digest
const md = ['# Reference capture digest', ''];
for (const r of summary) {
  md.push(`## ${r.url}`, '');
  if (!r.ok) { md.push(`Capture failed: ${r.error}`, ''); continue; }
  const a = r.analysis;
  md.push(`Screenshots: \`${r.slug}/desktop-fold.png\`, \`mobile-fold.png\`, full-page variants`, '');
  md.push(`- Title: ${a.title}`);
  md.push(`- Fonts: ${a.fontsLoaded.slice(0, 8).join(', ') || '(none reported)'}`);
  for (const [k, v] of Object.entries(a.type)) if (v) md.push(`- ${k}: ${v.family} · ${v.size} / ${v.lineHeight} · wt ${v.weight} · ls ${v.letterSpacing}${v.transform !== 'none' ? ' · ' + v.transform : ''}`);
  md.push(`- Background colors (by area): ${a.backgrounds.join(', ')}`);
  md.push(`- Text colors: ${a.textColors.join(', ')}`);
  md.push(`- Sections: ${a.sectionCount} · Headings: ${a.headings.slice(0, 8).map((h) => `${h.tag}:"${h.text}"`).join(' | ')}`);
  md.push(`- Nav: ${a.nav.join(' / ')}`);
  md.push(`- CTAs: ${a.ctas.join(' / ')}`);
  md.push(`- Stack/motion detected: ${a.tech.join(', ') || 'none detected'}`);
  md.push(`- Page height: ${a.pageHeight}px · Images: ${a.imageCount} · Videos: ${a.videoCount} · ~${Math.round(a.transferBytesApprox / 1024)} KB transferred (approx)`);
  md.push('');
}
fs.writeFileSync(path.join(outDir, 'capture-digest.md'), md.join('\n'));
console.log(`\nDigest: ${path.join(outDir, 'capture-digest.md')}  — now LOOK at the screenshots.`);

async function autoScroll(page) {
  await page.evaluate(async () => {
    const step = innerHeight * 0.8;
    for (let y = 0; y < document.documentElement.scrollHeight && y < 30000; y += step) {
      scrollTo(0, y); await new Promise((r) => setTimeout(r, 120));
    }
    scrollTo(0, 0); await new Promise((r) => setTimeout(r, 400));
  });
}

function analyze() {
  const cs = (el) => el && getComputedStyle(el);
  const pick = (sel) => {
    const el = [...document.querySelectorAll(sel)].find((e) => e.offsetParent !== null && e.textContent.trim());
    if (!el) return null;
    const s = cs(el);
    return { family: s.fontFamily.split(',')[0].replace(/["']/g, ''), size: s.fontSize, lineHeight: s.lineHeight, weight: s.fontWeight, letterSpacing: s.letterSpacing, transform: s.textTransform };
  };
  const type = { h1: pick('h1'), h2: pick('h2'), h3: pick('h3'), body: pick('main p, article p, p'), button: pick('button, a[class*="btn"], a[class*="button"]'), nav: pick('nav a') };
  const area = new Map(); const txt = new Map();
  for (const el of document.querySelectorAll('body, body *')) {
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
    const s = cs(el);
    if (s.backgroundColor && !/rgba\(0, 0, 0, 0\)|transparent/.test(s.backgroundColor)) area.set(s.backgroundColor, (area.get(s.backgroundColor) || 0) + r.width * Math.min(r.height, 4000));
    if (el.childNodes.length && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) txt.set(s.color, (txt.get(s.color) || 0) + 1);
  }
  const top = (m, n) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([k]) => k);
  const fontsLoaded = [...new Set([...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family.replace(/["']/g, '')} ${f.weight}${f.style !== 'normal' ? ' ' + f.style : ''}`))];
  const tech = [];
  const w = window; const html = document.documentElement.outerHTML.slice(0, 400000);
  if (w.gsap) tech.push('GSAP' + (w.gsap.version ? ' ' + w.gsap.version : ''));
  if (w.ScrollTrigger || /ScrollTrigger/.test(html)) tech.push('ScrollTrigger');
  if (w.Lenis || w.lenis || document.documentElement.classList.contains('lenis')) tech.push('Lenis');
  if (w.LocomotiveScroll || document.querySelector('[data-scroll-container]')) tech.push('Locomotive Scroll');
  if (w.THREE || document.querySelector('canvas[data-engine*="three"]')) tech.push('Three.js');
  if (document.querySelector('canvas')) tech.push('canvas');
  if (w.__NEXT_DATA__ || document.querySelector('script[src*="/_next/"]')) tech.push('Next.js');
  if (document.querySelector('astro-island, [data-astro-cid], script[src*="/_astro/"]')) tech.push('Astro');
  if (/data-wf-page|webflow/.test(html)) tech.push('Webflow');
  if (/framerusercontent|__framer/.test(html)) tech.push('Framer');
  if (/data-framer-|framer-motion|motion\/react/.test(html)) tech.push('Motion/Framer Motion (likely)');
  if (/swiper/.test(html)) tech.push('Swiper');
  if (/barba/.test(html)) tech.push('Barba.js');
  if (/tailwind|\b(?:px|py|mx|my)-\d+\b.*\b(?:md|lg):/.test(html)) tech.push('Tailwind (likely)');
  if ([...document.styleSheets].some((s) => { try { return [...s.cssRules].some((r) => /animation-timeline/.test(r.cssText)); } catch { return false; } })) tech.push('CSS scroll-driven animations');
  return {
    title: document.title,
    type, fontsLoaded,
    backgrounds: top(area, 6), textColors: top(txt, 6),
    sectionCount: document.querySelectorAll('main > section, body > section, main > div > section, [class*="section"]').length,
    headings: [...document.querySelectorAll('h1, h2')].slice(0, 14).map((h) => ({ tag: h.tagName.toLowerCase(), text: h.textContent.trim().replace(/\s+/g, ' ').slice(0, 70) })),
    nav: [...document.querySelectorAll('header nav a, nav a')].slice(0, 10).map((a) => a.textContent.trim()).filter(Boolean),
    ctas: [...document.querySelectorAll('a, button')].filter((a) => { const s = cs(a); return a.offsetParent && s.backgroundColor !== 'rgba(0, 0, 0, 0)' && a.textContent.trim().length < 40; }).slice(0, 8).map((a) => a.textContent.trim().replace(/\s+/g, ' ')),
    tech,
    pageHeight: document.documentElement.scrollHeight,
    imageCount: document.images.length, videoCount: document.querySelectorAll('video').length,
  };
}
