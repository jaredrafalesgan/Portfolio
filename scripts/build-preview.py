#!/usr/bin/env python3
"""Build dist/jared-gan-portfolio.html: one self-contained file (CSS, JS, fonts, images inlined) that opens by double-click."""
import re, base64, os
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def b64(path, mime):
    return f"data:{mime};base64," + base64.b64encode(open(os.path.join(root, path.lstrip('/')), 'rb').read()).decode()
html = open(f'{root}/index.html').read()
css = re.sub(r'url\("(/assets/fonts/[^"]+\.woff2)"\)', lambda m: f'url("{b64(m.group(1), "font/woff2")}")', open(f'{root}/assets/css/styles.css').read())
js = open(f'{root}/assets/js/main.js').read()
html = re.sub(r'\s*<link rel="preload"[^>]*>', '', html)
html = html.replace('<link rel="stylesheet" href="/assets/css/styles.css">', f'<style>\n{css}\n</style>')
html = html.replace('<script src="/assets/js/main.js" defer></script>', f'<script>\n{js}\n</script>')
html = html.replace('href="/favicon.svg"', f'href="{b64("/favicon.svg", "image/svg+xml")}"')
def pick(m):
    tag = m.group(0); srcset = re.search(r'srcset="([^"]+)"', tag); src = re.search(r'src="([^"]+)"', tag).group(1)
    if srcset:
        cands = [c.strip().split(' ')[0] for c in srcset.group(1).split(',')]
        mid = [c for c in cands if re.search(r'-(900|960)\.webp$', c)]
        src = mid[0] if mid else cands[-1]
    tag = re.sub(r'\s(srcset|sizes)="[^"]*"', '', tag)
    return re.sub(r'src="[^"]+"', f'src="{b64(src, "image/webp")}"', tag, count=1).replace(' loading="lazy"', '')
html = re.sub(r'<img\b[^>]*>', pick, html)
assert '/assets/' not in html
os.makedirs(f'{root}/dist', exist_ok=True)
open(f'{root}/dist/jared-gan-portfolio.html', 'w').write(html)
print(os.path.getsize(f'{root}/dist/jared-gan-portfolio.html') // 1024, 'KB')
