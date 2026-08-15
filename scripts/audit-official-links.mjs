import fs from 'node:fs';
const data = JSON.parse(fs.readFileSync(new URL('../data/directory-site.json', import.meta.url), 'utf8'));
const limit = 6;
const results = [];
let cursor = 0;
async function worker() {
  while (cursor < data.onsens.length) {
    const onsen = data.onsens[cursor++];
    try {
      const response = await fetch(onsen.officialUrl, { redirect: 'follow', signal: AbortSignal.timeout(15000), headers: { 'User-Agent': 'KantoOnsenDirectory-LinkAudit/1.0' } });
      results.push({ name: onsen.name, url: onsen.officialUrl, status: response.status, finalUrl: response.url });
    } catch (error) {
      results.push({ name: onsen.name, url: onsen.officialUrl, status: 'TIMEOUT_OR_NETWORK', error: error instanceof Error ? error.message : String(error) });
    }
  }
}
await Promise.all(Array.from({ length: limit }, worker));
results.sort((a, b) => a.name.localeCompare(b.name, 'ja'));
fs.writeFileSync(new URL('../docs/OFFICIAL_LINK_AUDIT_2026.json', import.meta.url), `${JSON.stringify(results, null, 2)}\n`);
const broken = results.filter((item) => typeof item.status === 'number' && (item.status >= 400 || item.status < 200));
const reachable = results.filter((item) => item.status === 200 || (typeof item.status === 'number' && item.status >= 300 && item.status < 400));
const uncertain = results.filter((item) => item.status === 'TIMEOUT_OR_NETWORK');
console.log(JSON.stringify({ total: results.length, reachable: reachable.length, broken: broken.length, uncertain: uncertain.length, brokenItems: broken }, null, 2));
if (broken.length) process.exitCode = 1;
