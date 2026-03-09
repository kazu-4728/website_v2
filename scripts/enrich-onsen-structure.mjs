import fs from 'fs';
import path from 'path';

const root = process.cwd();
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'data', 'onsen-catalog.json'), 'utf8'));
const onsenDir = path.join(root, 'content', 'onsen');

const FACILITY_PATTERNS = [
  /温泉/,
  /の湯/,
  /湯本/,
  /湯元/,
  /露天/,
  /足湯/,
  /共同浴場/,
  /浴場/,
  /風呂/,
  /源泉/,
  /スパホテル/,
  /スパ/,
  /ホテル三日月/,
  /鹿の湯/,
  /薬師の湯/,
  /王湯/,
  /御座之湯/,
  /大滝乃湯/,
  /西の河原/,
  /独歩の湯/,
  /もえぎの湯/,
  /天成園/,
  /湯の里/,
  /湯寮/,
  /旅館/,
];

function toSlug(value) {
  return String(value)
    .toLowerCase()
    .replace(/[（）()]/g, ' ')
    .replace(/[^a-z0-9\u3040-\u30ff\u3400-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'spot';
}

function mapSearchUrl(parts) {
  const query = parts.filter(Boolean).join(' ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function looksLikeFacilityName(name) {
  const value = String(name || '').trim();
  if (!value) return false;
  if (/[。.!?：:]/.test(value)) return false;
  if (value.length > 28) return false;
  return FACILITY_PATTERNS.some((pattern) => pattern.test(value));
}

for (const file of fs.readdirSync(onsenDir).filter((entry) => entry.endsWith('.json') && entry !== 'index.json')) {
  const filePath = path.join(onsenDir, file);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const catalogEntry = catalog[content.identity.slug] || {};

  const areaParts = [content.identity.name, content.identity.area, content.identity.prefecture];
  const preservedOfficialLinks = (content.access?.officialLinks || []).filter((link) => link?.url && !/google\.com\/maps/.test(link.url));

  content.access = {
    ...content.access,
    areaMapUrl: content.access?.areaMapUrl || mapSearchUrl(areaParts),
    officialLinks: [
      {
        label: `${content.identity.name} を Google マップで開く`,
        url: mapSearchUrl(areaParts),
      },
      ...preservedOfficialLinks,
    ],
  };

  const spotCandidates = [];
  for (const name of content.stay?.dayTripFacilities || []) {
    if (!String(name || '').trim()) continue;
    spotCandidates.push({
      name,
      type: 'day-trip',
      description: `${content.identity.name}の中でも立ち寄りやすい日帰り入浴候補です。最初の一湯として検討しやすい施設です。`,
    });
  }

  for (const spot of content.nearby || []) {
    if (!looksLikeFacilityName(spot.name)) continue;
    spotCandidates.push({
      name: spot.name,
      type: 'onsen-landmark',
      description: spot.description,
      officialUrl: spot.officialUrl,
    });
  }

  const uniqueSpots = [];
  const seen = new Set();
  for (const candidate of spotCandidates) {
    const key = String(candidate.name || '').trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    const placeQuery = [key, content.identity.name, content.identity.prefecture].filter(Boolean).join(' ');
    uniqueSpots.push({
      slug: toSlug(key),
      name: key,
      type: candidate.type,
      description: candidate.description,
      mapUrl: mapSearchUrl([key, content.identity.name, content.identity.prefecture]),
      officialUrl: candidate.officialUrl,
      bookingHint: '訪問前に営業時間、立ち寄り可否、タオル有無を確認しておくと回遊しやすくなります。',
      placeQuery,
      placeId: undefined,
      googleMapsUri: undefined,
      websiteUri: candidate.officialUrl,
      photoStatus: 'missing',
      imageSourceType: 'pending',
    });
  }

  if (uniqueSpots.length === 0) {
    const areaCoreName = `${content.identity.name} 温泉街中心部`;
    uniqueSpots.push({
      slug: toSlug(areaCoreName),
      name: areaCoreName,
      type: 'area-core',
      description: `${content.identity.name}全体の位置関係と、周辺の入浴施設を確認するための基点です。`,
      mapUrl: mapSearchUrl(areaParts),
      bookingHint: '現地で日帰り湯や共同浴場を追加で探す際の起点として使えます。',
      placeQuery: areaParts.join(' '),
      photoStatus: 'area-only',
      imageSourceType: 'pending',
    });
  }

  content.onsenSpots = uniqueSpots.slice(0, 6).map((spot) => ({
    ...spot,
    photoStatus: spot.photoStatus ?? 'missing',
    imageSourceType: spot.imageSourceType ?? 'pending',
    placeQuery: spot.placeQuery || [spot.name, content.identity.name, content.identity.prefecture].join(' '),
  }));
  content.nearby = (content.nearby || []).map((spot) => ({
    ...spot,
    mapUrl: spot.mapUrl || mapSearchUrl([spot.name, content.identity.name, content.identity.prefecture]),
  }));

  if (catalogEntry.officialUrl && !content.access.officialLinks.some((link) => link.url === catalogEntry.officialUrl)) {
    content.access.officialLinks.push({
      label: `${content.identity.name} の公式案内`,
      url: catalogEntry.officialUrl,
    });
  }

  fs.writeFileSync(filePath, `${JSON.stringify(content, null, 2)}\n`);
}

console.log('Enriched onsen content with spot and map links.');
