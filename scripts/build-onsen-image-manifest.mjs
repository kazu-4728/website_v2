import fs from 'fs';
import path from 'path';

import { classifyOnsenImage } from './lib/onsen-image-rules.mjs';

const root = process.cwd();
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'data', 'onsen-catalog.json'), 'utf8'));
const master = JSON.parse(fs.readFileSync(path.join(root, 'data', 'onsen-image-master.json'), 'utf8'));
const outputPath = path.join(root, 'content', 'images', 'onsen-images.json');
const reportPath = path.join(root, 'data', 'onsen-image-report.json');
const r2MapPath = path.join(root, 'data', 'r2-image-map.json');
const r2Map = fs.existsSync(r2MapPath) ? JSON.parse(fs.readFileSync(r2MapPath, 'utf8')) : {};

function normalizeUrl(url) {
  if (!url) return url;
  return url
    .replace('/thumb/thumb/', '/thumb/')
    .replace('/800px-1920px-', '/800px-')
    .replace('/800px-1280px-', '/800px-');
}

function normalizeText(value) {
  return String(value || '').replace(/[_/.-]+/g, ' ').toLowerCase();
}

function locationTokens(slug, entry) {
  return [slug, entry.name, entry.nameEn, entry.location, entry.region]
    .filter(Boolean)
    .map((value) => normalizeText(value).replace(/\s+/g, ' ').trim())
    .filter((value) => value.length >= 3);
}

function matchesLocation(textParts, tokens) {
  const text = normalizeText(textParts.filter(Boolean).join(' '));
  return tokens.some((token) => token && text.includes(token));
}

function getR2Entry(slug, variant) {
  const value = r2Map?.[slug]?.[variant];
  if (!value) return null;
  if (typeof value === 'string') {
    return { url: normalizeUrl(value), source: 'r2-sync' };
  }
  return { ...value, url: normalizeUrl(value.url), sourceUrl: normalizeUrl(value.sourceUrl) };
}

function buildCandidate({ entry, slug, variant, payload, r2Entry, origin }) {
  if (!payload?.url && !r2Entry?.url) return null;

  const sourceUrl = normalizeUrl(origin === 'api' ? r2Entry?.sourceUrl || r2Entry?.url : payload?.url || r2Entry?.url);
  const remoteUrl = normalizeUrl(origin === 'api' ? r2Entry?.url : typeof r2Entry?.url === 'string' && r2Entry.source === 'r2-sync' ? r2Entry.url : payload?.url);
  const alt = origin === 'api' ? r2Entry?.title || '温泉写真候補' : payload?.alt || '温泉写真候補';
  const source = origin === 'api' ? r2Entry?.source || 'free-api' : payload?.source || 'Wikimedia Commons';
  const credit = origin === 'api' ? r2Entry?.credit || 'Unknown' : payload?.author || 'Unknown';
  const license = origin === 'api' ? r2Entry?.license || 'Unknown' : payload?.license || 'Unknown';
  let classification = classifyOnsenImage([alt, sourceUrl, r2Entry?.title]);

  if (!matchesLocation([alt, sourceUrl, r2Entry?.title], locationTokens(slug, entry))) {
    classification = { accepted: false, focus: 'rejected', reason: 'location-mismatch' };
  }

  return {
    variant,
    origin,
    remoteUrl,
    sourceUrl,
    alt,
    source,
    credit,
    license,
    classification,
  };
}

function uniqueByRemote(candidates) {
  const seen = new Set();
  return candidates.filter((candidate) => {
    if (!candidate?.remoteUrl) return false;
    if (seen.has(candidate.remoteUrl)) return false;
    seen.add(candidate.remoteUrl);
    return true;
  });
}

function createAsset(id, candidate, entryName, focusOverride) {
  return {
    id,
    type: 'photo',
    alt: candidate.alt,
    remoteUrl: candidate.remoteUrl,
    source: candidate.source,
    credit: candidate.credit,
    license: candidate.license,
    sourceUrl: candidate.sourceUrl || candidate.remoteUrl,
    capturedSubject: entryName,
    verifiedRealWorld: true,
    focus: focusOverride || (candidate.classification.accepted ? candidate.classification.focus : 'area'),
  };
}

function chooseHero(candidates) {
  const bath = candidates.find((candidate) => candidate.classification.accepted && candidate.classification.focus === 'bath');
  if (bath) return bath;

  const area = candidates.find((candidate) => candidate.classification.accepted && candidate.classification.focus === 'onsen-area');
  if (area) return area;

  return candidates.find((candidate) => candidate.origin === 'master' && candidate.variant === 'hero')
    || candidates.find((candidate) => candidate.origin === 'master')
    || candidates[0]
    || null;
}

const assets = [];
const onsens = {};
const report = {};
let bathHeroCount = 0;
let areaHeroCount = 0;
let fallbackHeroCount = 0;

for (const [slug, entry] of Object.entries(catalog)) {
  const imageEntry = master[slug] || {};
  const heroR2 = getR2Entry(slug, 'hero');
  const thumbR2 = getR2Entry(slug, 'thumb');

  const candidates = uniqueByRemote([
    heroR2 && heroR2.source !== 'r2-sync' ? buildCandidate({ entry, slug, variant: 'hero', payload: null, r2Entry: heroR2, origin: 'api' }) : null,
    buildCandidate({ entry, slug, variant: 'hero', payload: imageEntry.hero, r2Entry: heroR2, origin: 'master' }),
    buildCandidate({ entry, slug, variant: 'thumb', payload: imageEntry.thumbnail, r2Entry: thumbR2, origin: 'master' }),
  ].filter(Boolean));

  if (candidates.length === 0) continue;

  const heroCandidate = chooseHero(candidates);
  if (!heroCandidate) continue;

  const acceptedGallery = candidates.filter((candidate) => candidate !== heroCandidate && candidate.classification.accepted);
  const townscapeCandidate = candidates.find((candidate) => candidate.variant === 'thumb' && candidate !== heroCandidate) || null;
  const heroFocus = heroCandidate.classification.accepted ? heroCandidate.classification.focus : 'area';

  if (heroFocus === 'bath') bathHeroCount += 1;
  else if (heroFocus === 'onsen-area') areaHeroCount += 1;
  else fallbackHeroCount += 1;

  const heroAsset = createAsset(`${slug}-hero`, heroCandidate, entry.name, heroFocus);
  assets.push(heroAsset);

  const galleryAssets = (acceptedGallery.length > 0 ? acceptedGallery : [heroCandidate]).slice(0, 4).map((candidate, index) => {
    const id = candidate === heroCandidate ? heroAsset.id : `${slug}-gallery-${index + 1}`;
    return candidate === heroCandidate ? heroAsset : createAsset(id, candidate, entry.name);
  });

  for (const asset of galleryAssets) {
    if (!assets.some((existing) => existing.id === asset.id)) {
      assets.push(asset);
    }
  }

  let townscapeAsset;
  if (townscapeCandidate && townscapeCandidate.remoteUrl !== heroAsset.remoteUrl) {
    townscapeAsset = createAsset(`${slug}-townscape`, townscapeCandidate, entry.name, 'area');
    assets.push(townscapeAsset);
  }

  onsens[slug] = {
    hero: heroAsset.id,
    gallery: galleryAssets.map((asset) => asset.id),
    townscape: townscapeAsset?.id,
  };

  report[slug] = {
    heroFocus,
    heroSource: heroCandidate.source,
    heroSourceUrl: heroCandidate.sourceUrl,
    acceptedCandidates: candidates.filter((candidate) => candidate.classification.accepted).map((candidate) => ({
      source: candidate.source,
      sourceUrl: candidate.sourceUrl,
      focus: candidate.classification.focus,
      reason: candidate.classification.reason,
    })),
    rejectedCandidates: candidates.filter((candidate) => !candidate.classification.accepted).map((candidate) => ({
      source: candidate.source,
      sourceUrl: candidate.sourceUrl,
      reason: candidate.classification.reason,
    })),
  };
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify({ assets, onsens }, null, 2)}\n`);
fs.writeFileSync(reportPath, `${JSON.stringify({
  summary: {
    total: Object.keys(onsens).length,
    bathHeroCount,
    onsenAreaHeroCount: areaHeroCount,
    fallbackAreaHeroCount: fallbackHeroCount,
  },
  entries: report,
}, null, 2)}\n`);
console.log(`Generated image manifest for ${Object.keys(onsens).length} onsens.`);
console.log(`Hero focus: bath=${bathHeroCount}, onsen-area=${areaHeroCount}, fallback-area=${fallbackHeroCount}`);
