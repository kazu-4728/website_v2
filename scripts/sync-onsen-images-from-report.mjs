import fs from 'fs';
import path from 'path';

const root = process.cwd();
const reportPath = path.join(root, 'data', 'onsen-image-report.json');
const listPath = path.join(root, 'data', 'unsplash-onsen-images.json');
const stockPath = path.join(root, 'data', 'onsen-image-stock.json');
const themePath = path.join(root, 'themes', 'onsen-kanto', 'content.json');

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
const list = JSON.parse(fs.readFileSync(listPath, 'utf8'));
const stock = JSON.parse(fs.readFileSync(stockPath, 'utf8'));
const theme = JSON.parse(fs.readFileSync(themePath, 'utf8'));

const altByFocus = (name, focus) => {
  switch (focus) {
    case 'bath':
      return `${name}の温泉・浴場`;
    case 'onsen-area':
      return `${name}の温泉地風景`;
    default:
      return `${name}周辺の風景`;
  }
};

const uniqueByUrl = (items) => {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    if (!item || !item.url || seen.has(item.url)) continue;
    seen.add(item.url);
    result.push(item);
  }
  return result;
};

const imageBySlug = new Map();
for (const entry of list.images || []) {
  const reportEntry = report.entries?.[entry.slug];
  if (!reportEntry?.heroSourceUrl) continue;
  const imgUrl = reportEntry.heroSourceUrl;
  const alt = altByFocus(entry.name, reportEntry.heroFocus);
  entry.imgUrl = imgUrl;
  entry.alt = alt;
  imageBySlug.set(entry.slug, { imgUrl, alt, reportEntry, entry });
}

stock.onsenPages = stock.onsenPages || {};
for (const entry of list.images || []) {
  const synced = imageBySlug.get(entry.slug);
  if (!synced) continue;
  const existing = Array.isArray(stock.onsenPages[entry.slug]) ? stock.onsenPages[entry.slug] : [];
  const synthesized = {
    id: `${entry.slug}-primary`,
    url: synced.imgUrl,
    title: entry.name,
    description: entry.description,
    hasOnsen: true,
    features: [synced.reportEntry.heroFocus],
    author: synced.reportEntry.heroSource === 'wikimedia' ? 'Wikimedia Commons' : (synced.reportEntry.heroSource || 'Unknown'),
    license: 'See source',
    licenseUrl: '',
    source: synced.reportEntry.heroSource || 'wikimedia',
    recommended: true,
  };

  const normalizedExisting = existing.map((item, index) => ({
    ...item,
    id: item.id || `${entry.slug}-${index + 2}`,
    title: item.title || entry.name,
    description: item.description || entry.description,
    hasOnsen: typeof item.hasOnsen === 'boolean' ? item.hasOnsen : true,
    features: Array.isArray(item.features) ? item.features : [synced.reportEntry.heroFocus],
    author: item.author || 'Unknown',
    license: item.license || 'Unknown',
    licenseUrl: item.licenseUrl || '',
    source: item.source || 'wikimedia',
  }));

  stock.onsenPages[entry.slug] = uniqueByUrl([
    synthesized,
    ...normalizedExisting.map((item) => item.url === synthesized.url ? { ...item, ...synthesized } : item),
  ]);
}

const areaItems = theme.pages?.home?.sections?.find((section) => section.id === 'area-selection')?.items || [];
for (const item of areaItems) {
  const slug = typeof item.link === 'string' ? item.link.replace('/docs/', '').replace(/^\//, '') : '';
  const synced = imageBySlug.get(slug);
  if (!synced || !item.image) continue;
  item.image.url = synced.imgUrl;
  item.image.alt = synced.alt;
}

const docs = theme.pages?.docs || [];
for (const doc of docs) {
  const synced = imageBySlug.get(doc.slug);
  if (!synced) continue;
  doc.image = synced.imgUrl;
}

fs.writeFileSync(listPath, JSON.stringify(list, null, 2) + '\n', 'utf8');
fs.writeFileSync(stockPath, JSON.stringify(stock, null, 2) + '\n', 'utf8');
fs.writeFileSync(themePath, JSON.stringify(theme, null, 2) + '\n', 'utf8');

console.log(`Synced ${imageBySlug.size} onsen image entries.`);
