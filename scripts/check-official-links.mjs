import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const ENV_FILES = ['.env', '.env.local', '.env.production'].map((file) => path.join(ROOT, file));
const CONTENT_DIR = path.join(ROOT, 'content', 'onsen');
const REPORT_PATH = path.join(ROOT, 'data', 'official-link-report.json');

function loadEnv(target) {
  if (process.env[target]) return process.env[target];
  for (const envFile of ENV_FILES) {
    if (!fs.existsSync(envFile)) continue;
    const lines = fs.readFileSync(envFile, 'utf8').split(/\r?\n/);
    for (const line of lines) {
      const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!match) continue;
      const [, key, value] = match;
      if (key === target) {
        const normalized = value.replace(/^['"]|['"]$/g, '');
        process.env[key] = normalized;
        return normalized;
      }
    }
  }
  return '';
}

async function checkUrl(url) {
  try {
    const head = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    if (head.ok) {
      return { ok: true, status: head.status, finalUrl: head.url };
    }
    const get = await fetch(url, { method: 'GET', redirect: 'follow' });
    return { ok: get.ok, status: get.status, finalUrl: get.url };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function main() {
  loadEnv('HTTP_PROXY');
  const entries = [];

  for (const file of fs.readdirSync(CONTENT_DIR).filter((name) => name.endsWith('.json') && name !== 'index.json')) {
    const filePath = path.join(CONTENT_DIR, file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    for (const link of content.access?.officialLinks || []) {
      if (!link.url || /google\.com\/maps/.test(link.url)) continue;
      const result = await checkUrl(link.url);
      entries.push({ type: 'area', slug: content.identity.slug, label: link.label, url: link.url, ...result });
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
    for (const spot of content.onsenSpots || []) {
      const url = spot.officialUrl || spot.websiteUri;
      if (!url) continue;
      const result = await checkUrl(url);
      entries.push({ type: 'spot', slug: content.identity.slug, spot: spot.slug, label: spot.name, url, ...result });
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }

  const summary = {
    total: entries.length,
    ok: entries.filter((entry) => entry.ok).length,
    broken: entries.filter((entry) => !entry.ok).length,
  };

  fs.writeFileSync(REPORT_PATH, `${JSON.stringify({ summary, entries }, null, 2)}\n`);
  console.log(`Checked ${summary.total} official links. OK=${summary.ok} broken=${summary.broken}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
