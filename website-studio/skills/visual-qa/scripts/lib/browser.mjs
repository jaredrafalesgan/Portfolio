// Shared browser loader: finds Playwright locally, globally, or tells the user how to install it.
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

export async function loadPlaywright() {
  try { return await import('playwright'); } catch {}
  const roots = [process.cwd()];
  try { roots.push(execSync('npm root -g', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()); } catch {}
  for (const root of roots) {
    try {
      const req = createRequire(path.join(root, 'noop.js'));
      return req(req.resolve('playwright', { paths: [root] }));
    } catch {}
  }
  console.error('\nPlaywright not found. Install it in your project:\n  npm i -D playwright && npx playwright install chromium\n');
  process.exit(3);
}

export async function launchChromium(pw) {
  const chromium = pw.chromium || pw.default?.chromium;
  try { return await chromium.launch(); } catch (e) {
    const candidates = [process.env.CHROME_PATH, '/opt/pw-browsers/chromium', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome',
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean);
    for (const p of candidates) {
      const exe = fs.existsSync(p) && fs.statSync(p).isDirectory() ? findChrome(p) : p;
      if (exe && fs.existsSync(exe)) {
        try { return await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] }); } catch {}
      }
    }
    try { return await chromium.launch({ channel: 'chrome' }); } catch {}
    throw e;
  }
}

function findChrome(dir) {
  for (const sub of ['chrome-linux/chrome', 'chrome-linux64/chrome', 'chrome']) {
    const p = path.join(dir, sub); if (fs.existsSync(p) && !fs.statSync(p).isDirectory()) return p;
  }
  return null;
}
