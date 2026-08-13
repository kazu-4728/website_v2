import fs from 'node:fs';

const data = JSON.parse(fs.readFileSync(new URL('../data/directory-site.json', import.meta.url), 'utf8'));
const check = async (onsen) => {
  try {
    const response = await fetch(onsen.officialUrl, {
      method: 'GET',
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
      headers: { 'user-agent': 'website_v2-link-checker/1.0' },
    });
    return { name: onsen.name, url: onsen.officialUrl, status: response.status, finalUrl: response.url };
  } catch (error) {
    return { name: onsen.name, url: onsen.officialUrl, status: 'ERROR', error: error instanceof Error ? error.message : String(error) };
  }
};
const results = await Promise.all(data.onsens.map(check));
const failures = results.filter((item) => item.status === 'ERROR' || item.status >= 400);
for (const item of results) console.log(`${item.status}\t${item.name}\t${item.url}${item.finalUrl && item.finalUrl !== item.url ? `\t=> ${item.finalUrl}` : ''}${item.error ? `\t${item.error}` : ''}`);
console.log(`Checked ${results.length} official URLs; ${failures.length} failures.`);
