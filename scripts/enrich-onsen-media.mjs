import fs from 'node:fs';

const dataPath = new URL('../data/directory-site.json', import.meta.url);
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function wikipediaSummary(title) {
  const url = `https://ja.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const response = await fetch(url, { headers: { 'User-Agent': 'KantoOnsenDirectory/1.0 (https://github.com/kazu-4728/website_v2)' }, signal: AbortSignal.timeout(12000) });
  if (!response.ok) return null;
  return response.json();
}

function mapUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

let imageFound = 0;
for (const onsen of data.onsens) {
  let summary = null;
  for (const title of [onsen.name, onsen.name.replace(/温泉郷|温泉地|温泉$/, ''), `${onsen.name} ${onsen.prefecture}`]) {
    try {
      summary = await wikipediaSummary(title);
      if (summary?.thumbnail?.source) break;
    } catch {}
  }
  if (summary?.thumbnail?.source) {
    onsen.image = {
      src: summary.originalimage?.source || summary.thumbnail.source,
      alt: `${onsen.name}の温泉風景`,
      credit: 'Wikipedia contributors / Wikimedia Commons',
      license: 'Wikipedia image (各画像のライセンスを出典ページで確認)',
      sourceUrl: `https://ja.wikipedia.org/wiki/${encodeURIComponent(summary.title)}`,
    };
    imageFound += 1;
  }
  const base = `${onsen.name} ${onsen.prefecture}`;
  onsen.facilities = [
    { name: `${onsen.officialName}（公式案内）`, kind: '公式案内', url: onsen.officialUrl, mapUrl: mapUrl(base) },
    { name: `${onsen.name}の宿泊施設`, kind: '宿泊', url: mapUrl(`${base} 旅館 ホテル`), mapUrl: mapUrl(`${base} 旅館 ホテル`) },
    { name: `${onsen.name}の日帰り温泉`, kind: '日帰り', url: mapUrl(`${base} 日帰り温泉`), mapUrl: mapUrl(`${base} 日帰り温泉`) },
  ];
  onsen.mapUrl = mapUrl(base);
  await sleep(80);
}

fs.writeFileSync(dataPath, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Enriched ${data.onsens.length} onsens; refreshed ${imageFound} representative images and added facility/map links.`);
