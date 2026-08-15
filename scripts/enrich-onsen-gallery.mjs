import fs from 'node:fs';

const dataPath = new URL('../data/directory-site.json', import.meta.url);
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const headers = { 'User-Agent': 'KantoOnsenDirectory/1.0 (https://github.com/kazu-4728/website_v2)' };
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function searchWikipedia(term) {
  const url = new URL('https://ja.wikipedia.org/w/api.php');
  url.search = new URLSearchParams({ action: 'query', list: 'search', srsearch: term, srnamespace: '0', srlimit: '8', format: 'json', origin: '*' }).toString();
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(12000) });
  if (!response.ok) return [];
  const json = await response.json();
  return (json.query?.search ?? []).map((item) => item.title);
}

async function pageImage(title) {
  const url = new URL('https://ja.wikipedia.org/w/api.php');
  url.search = new URLSearchParams({ action: 'query', prop: 'pageimages|info', titles: title, piprop: 'original|thumbnail', pithumbsize: '1400', inprop: 'url', format: 'json', origin: '*' }).toString();
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(12000) });
  if (!response.ok) return null;
  const json = await response.json();
  const page = Object.values(json.query?.pages ?? {})[0];
  if (!page?.thumbnail?.source && !page?.original?.source) return null;
  return { title: page.title, src: page.original?.source || page.thumbnail.source, pageUrl: page.fullurl || `https://ja.wikipedia.org/wiki/${encodeURIComponent(page.title)}` };
}

function mapUrl(query) { return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`; }
function relevantTitle(title, onsen) {
  const cleaned = onsen.name.replace(/温泉郷|温泉地|温泉|郷/g, '').replace(/[・\s]/g, '');
  const tokens = cleaned.match(/[一-龯ぁ-んァ-ンA-Za-z0-9]{2,}/g) || [cleaned];
  const lower = title.toLowerCase();
  const hasPlaceToken = tokens.some((token) => token.length >= 2 && title.includes(token));
  const forbidden = /電力|地震|スポーツ|サッカー|駅前|路線|地図|旗|ロゴ|県庁|議員|選挙/.test(title) || /symbol|map|flag|logo|stadium|football|earthquake/i.test(lower);
  return hasPlaceToken && !forbidden;
}
function imageRecord(image, onsenName, index) {
  return { src: image.src, alt: `${onsenName}の${index === 0 ? '温泉風景' : '周辺風景'}`, credit: 'Wikipedia contributors / Wikimedia Commons', license: 'Wikipedia image (各画像のライセンスを出典ページで確認)', sourceUrl: image.pageUrl };
}

let galleryCount = 0;
for (const onsen of data.onsens) {
  const terms = [`${onsen.name} ${onsen.prefecture}`, onsen.name, onsen.name.replace(/温泉郷|温泉地|温泉$/, ''), `${onsen.name} 観光`];
  const titles = [];
  for (const term of terms) {
    try { for (const title of await searchWikipedia(term)) if (!titles.includes(title)) titles.push(title); } catch {}
    if (titles.length >= 8) break;
    await sleep(60);
  }
  const images = [];
  for (const title of titles.slice(0, 8)) {
    try {
      if (!relevantTitle(title, onsen)) continue;
      const image = await pageImage(title);
      if (image && !images.some((item) => item.src === image.src)) images.push(image);
    } catch {}
    if (images.length >= 3) break;
    await sleep(60);
  }
  if (images.length) {
    onsen.gallery = images.map((image, index) => imageRecord(image, onsen.name, index));
    onsen.image = onsen.gallery[0];
    galleryCount += 1;
  } else if (!onsen.gallery?.length) {
    onsen.gallery = [onsen.image];
  }
  const base = `${onsen.name} ${onsen.prefecture}`;
  onsen.mapUrl = mapUrl(base);
  onsen.facilities = [
    { name: `${onsen.officialName}（公式案内）`, kind: '公式案内', url: onsen.officialUrl, mapUrl: mapUrl(base) },
    { name: `${onsen.name}の宿泊施設`, kind: '宿泊', url: mapUrl(`${base} 旅館 ホテル`), mapUrl: mapUrl(`${base} 旅館 ホテル`) },
    { name: `${onsen.name}の日帰り温泉`, kind: '日帰り', url: mapUrl(`${base} 日帰り温泉`), mapUrl: mapUrl(`${base} 日帰り温泉`) },
  ];
  await sleep(80);
}
fs.writeFileSync(dataPath, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Prepared galleries for ${galleryCount}/${data.onsens.length} onsens.`);
