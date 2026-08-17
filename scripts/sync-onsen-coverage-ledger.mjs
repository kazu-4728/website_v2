import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
const writeJson = (relativePath, value) => fs.writeFileSync(path.join(root, relativePath), `${JSON.stringify(value, null, 2)}\n`);

const siteData = readJson('data/directory-site.json');
const policy = readJson('data/onsen-coverage-policy.json');
const candidateRegistry = readJson('data/onsen-coverage-candidates.json');
const generatedAt = policy.generatedAt;
const prefectureOrder = Object.keys(policy.prefectures);

function classifyRecord(onsen) {
  if (/温泉地|温泉郷/.test(onsen.kind)) return 'onsen-place';
  if (/施設|銭湯|スパ/.test(onsen.kind)) return 'day-trip-facility';
  return 'other';
}

const entries = siteData.onsens
  .map((onsen) => ({
    siteSlug: onsen.slug,
    name: onsen.name,
    officialName: onsen.officialName,
    prefecture: onsen.prefecture,
    classification: classifyRecord(onsen),
    publicationStatus: 'published',
    officialUrl: onsen.officialUrl,
    verifiedAt: onsen.verifiedAt,
    hasDetailedDayTripGuide: Boolean(onsen.dayTrip),
    imageStatus: onsen.imageVerified === false ? 'needs-source' : 'legacy-review-needed',
  }))
  .sort((a, b) => a.prefecture.localeCompare(b.prefecture, 'ja') || a.name.localeCompare(b.name, 'ja'));

const summary = prefectureOrder.map((prefecture) => {
  const prefectureEntries = entries.filter((entry) => entry.prefecture === prefecture);
  const onsenPlaces = prefectureEntries.filter((entry) => entry.classification === 'onsen-place').length;
  const facilities = prefectureEntries.filter((entry) => entry.classification === 'day-trip-facility').length;
  const officialCount = policy.prefectures[prefecture].officialOnsenPlaceCount;
  return {
    prefecture,
    officialOnsenPlaceCount: officialCount,
    publishedOnsenPlaceCount: onsenPlaces,
    publishedDayTripFacilityCount: facilities,
    referenceDifference: officialCount - onsenPlaces,
  };
});

const totals = summary.reduce((accumulator, item) => ({
  officialOnsenPlaceCount: accumulator.officialOnsenPlaceCount + item.officialOnsenPlaceCount,
  publishedOnsenPlaceCount: accumulator.publishedOnsenPlaceCount + item.publishedOnsenPlaceCount,
  publishedDayTripFacilityCount: accumulator.publishedDayTripFacilityCount + item.publishedDayTripFacilityCount,
  referenceDifference: accumulator.referenceDifference + item.referenceDifference,
}), { officialOnsenPlaceCount: 0, publishedOnsenPlaceCount: 0, publishedDayTripFacilityCount: 0, referenceDifference: 0 });

writeJson('data/onsen-coverage-ledger.json', {
  schemaVersion: 1,
  generatedAt,
  source: policy.source,
  definition: policy.definition,
  importantNote: 'referenceDifference is a planning indicator. Confirm duplicate names, naming variants, and the official statistical unit before treating it as a final missing-record count.',
  summary,
  totals,
  entries,
  candidates: candidateRegistry.candidates,
});

console.log(`Coverage ledger synchronized: ${entries.length} site records, ${totals.publishedOnsenPlaceCount} onsen-place records, ${totals.publishedDayTripFacilityCount} day-trip facilities, ${candidateRegistry.candidates.length} candidates awaiting review.`);
