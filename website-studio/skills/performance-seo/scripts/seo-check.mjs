#!/usr/bin/env node
// seo-check: site-level SEO, delivery and security checks. No dependencies (Node 18+ fetch).
// Usage: node seo-check.mjs <site-url> [--json]
// Note: localhost dev servers won't have production headers; run against a preview/production URL for the full picture.

const argv = process.argv.slice(2);
const site = argv.find((a) => /^https?:\/\//.test(a));
if (!site) { console.error('Usage: node seo-check.mjs <https://site> [--json]'); process.exit(2); }
const origin = new URL(site).origin;
const out = []; const add = (sev, rule, msg, detail) => out.push({ sev, rule, msg, detail });
const get = async (u, opts = {}) => { try { return await fetch(u, { redirect: 'follow', headers: { 'accept-encoding': 'br, gzip', 'user-agent': 'website-studio-seo-check/1.0' }, ...opts }); } catch (e) { return { ok: false, status: 0, error: e.message, headers: new Headers() }; } };

const home = await get(site);
if (!home.ok) { add('P0', 'home', `Homepage returned ${home.status || home.error}`); finish(); }
const html = await home.text();
const h = home.headers;

// robots & sitemap
const robots = await get(origin + '/robots.txt');
let sitemapUrls = [];
if (!robots.ok) add('P2', 'robots', 'No robots.txt');
else {
  const txt = await robots.text();
  if (/^\s*disallow:\s*\/\s*$/im.test(txt) && /user-agent:\s*\*/i.test(txt)) add('P1', 'robots', 'robots.txt disallows the whole site (fine for staging only)');
  sitemapUrls = [...txt.matchAll(/^\s*sitemap:\s*(\S+)/gim)].map((m) => m[1]);
  if (!sitemapUrls.length) add('P3', 'robots', 'robots.txt does not reference a sitemap');
}
const smUrl = sitemapUrls[0] || origin + '/sitemap.xml';
let sm = await get(smUrl);
if (!sm.ok && !sitemapUrls.length) sm = await get(origin + '/sitemap-index.xml');
if (!sm.ok) add('P2', 'sitemap', 'No sitemap.xml found');
else { const x = await sm.text(); const n = (x.match(/<loc>/g) || []).length; if (!n) add('P2', 'sitemap', 'Sitemap has no <loc> entries'); else add('OK', 'sitemap', `Sitemap found with ${n} entries`, smUrl); }

// 404 behaviour
const nf = await get(origin + '/this-page-should-not-exist-' + Date.now());
if (nf.status === 200) add('P1', 'soft-404', 'Missing pages return HTTP 200 (soft 404) — must return 404');
else if (nf.status === 404) { const t = await nf.text(); if (t.length < 300) add('P3', '404-page', '404 page is bare — design a helpful one'); }

// head tags
const meta = (re) => (html.match(re) || [])[1];
const canon = meta(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)/i) || meta(/<link[^>]+href=["']([^"']+)["'][^>]*rel=["']canonical/i);
if (!canon) add('P2', 'canonical', 'No canonical link on homepage');
else if (!canon.startsWith('http')) add('P3', 'canonical', 'Canonical is relative — use an absolute URL', canon);
const ogImg = meta(/<meta[^>]+property=["']og:image["'][^>]*content=["']([^"']+)/i) || meta(/<meta[^>]+content=["']([^"']+)["'][^>]*property=["']og:image/i);
if (!ogImg) add('P2', 'og-image', 'No og:image');
else {
  const r = await get(new URL(ogImg, site).href, { method: 'GET' });
  if (!r.ok) add('P2', 'og-image', `og:image not reachable (HTTP ${r.status})`, ogImg);
  else if (!/^image\//.test(r.headers.get('content-type') || '')) add('P2', 'og-image', 'og:image is not served as an image', ogImg);
}
if (!/<meta[^>]+name=["']twitter:card/i.test(html)) add('P3', 'twitter-card', 'No twitter:card meta');
const ld = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
if (!ld.length) add('P3', 'json-ld', 'No JSON-LD structured data');
for (const block of ld) {
  try { const j = JSON.parse(block); const types = [].concat(j).flatMap((x) => x['@graph'] ? x['@graph'].map((g) => g['@type']) : x['@type']); add('OK', 'json-ld', `Valid JSON-LD: ${types.join(', ')}`); }
  catch (e) { add('P1', 'json-ld', 'Invalid JSON-LD (parse error)', e.message); }
}
if (!/<html[^>]+lang=/i.test(html)) add('P1', 'lang', 'No lang on <html>');
if (!/rel=["'](?:shortcut )?icon|rel=["']apple-touch-icon/i.test(html)) add('P3', 'favicon', 'No favicon / apple-touch-icon links');
if (!/<link[^>]+rel=["']manifest/i.test(html)) add('P3', 'manifest', 'No web app manifest (optional)');
const llms = await get(origin + '/llms.txt');
if (!llms.ok) add('P3', 'llms-txt', 'No /llms.txt (optional, helps AI agents summarise the site)');

// delivery
const enc = h.get('content-encoding');
if (!enc) add('P2', 'compression', 'HTML not compressed (no br/gzip content-encoding)');
const assets = [...html.matchAll(/(?:src|href)=["']([^"']+\.(?:js|css|woff2))["']/gi)].map((m) => new URL(m[1], site).href).filter((u) => u.startsWith(origin)).slice(0, 5);
for (const a of assets) {
  const r = await get(a, { method: 'HEAD' });
  const cc = r.headers.get('cache-control') || '';
  if (!/max-age=(?:[1-9]\d{5,})|immutable/.test(cc)) add('P3', 'asset-cache', 'Static asset without long cache (use hashed filenames + max-age=31536000, immutable)', `${a}  cache-control: ${cc || '(none)'}`);
}
if (site.startsWith('https:')) {
  const http = await get(site.replace(/^https:/, 'http:'), { redirect: 'manual' });
  if (http.status && ![301, 308, 307, 302].includes(http.status)) add('P1', 'https-redirect', `http:// does not redirect to https (status ${http.status})`);
}

// security headers
const sec = {
  'strict-transport-security': ['P2', 'HSTS missing'],
  'content-security-policy': ['P3', 'No Content-Security-Policy (start with Report-Only)'],
  'x-content-type-options': ['P3', 'X-Content-Type-Options: nosniff missing'],
  'referrer-policy': ['P3', 'Referrer-Policy missing'],
  'permissions-policy': ['P3', 'Permissions-Policy missing'],
};
for (const [k, [sev, msg]] of Object.entries(sec)) if (!h.get(k) && !(k === 'strict-transport-security' && !site.startsWith('https:'))) add(sev, 'security-header', msg);
if (!h.get('x-frame-options') && !/frame-ancestors/.test(h.get('content-security-policy') || '')) add('P3', 'security-header', 'No clickjacking protection (X-Frame-Options or CSP frame-ancestors)');
if (h.get('x-powered-by')) add('P3', 'security-header', `X-Powered-By header leaks stack: ${h.get('x-powered-by')}`);

finish();

function finish() {
  const order = { P0: 0, P1: 1, P2: 2, P3: 3, OK: 4 };
  out.sort((a, b) => order[a.sev] - order[b.sev]);
  if (argv.includes('--json')) console.log(JSON.stringify({ site, results: out }, null, 2));
  else {
    console.log(`\nseo-check · ${site}\n`);
    for (const r of out) console.log(`[${r.sev}] ${r.rule}: ${r.msg}${r.detail ? `\n      ${r.detail}` : ''}`);
    if (/localhost|127\.0\.0\.1/.test(site)) console.log('\nNote: local dev servers lack production headers/compression; re-run on the deployed preview URL.');
  }
  process.exit(out.some((r) => r.sev === 'P0' || r.sev === 'P1') ? 1 : 0);
}
