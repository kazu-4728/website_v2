import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
const site = readJson('data/directory-site.json');
const audit = readJson('data/onsen-link-audit.json');
const errors = [];

const currentUrls = new Set();
function addUrl(url, context) {
  if (typeof url !== 'string' || !/^https?:\/\//.test(url)) errors.push(`${context}: HTTP or HTTPS URL is required`);
  else currentUrls.add(url);
}

for (const onsen of site.onsens) {
  addUrl(onsen.officialUrl, `${onsen.slug}: officialUrl`);
  addUrl(onsen.mapUrl, `${onsen.slug}: mapUrl`);
  for (const facility of onsen.facilities ?? []) {
    addUrl(facility.url, `${onsen.slug}: facility ${facility.name} guide URL`);
    addUrl(facility.mapUrl, `${onsen.slug}: facility ${facility.name} map URL`);
  }
  if (onsen.dayTrip?.officialInfoUrl) addUrl(onsen.dayTrip.officialInfoUrl, `${onsen.slug}: dayTrip official URL`);
}

if (audit.schemaVersion !== 2) errors.push('link audit must use schemaVersion 2');
const outcomes = new Map((audit.outcomes ?? []).map((outcome) => [outcome.url, outcome]));
for (const url of currentUrls) {
  const outcome = outcomes.get(url);
  if (!outcome) errors.push(`missing link-audit outcome: ${url}`);
  else if (!['reachable', 'generated-map'].includes(outcome.classification)) {
    errors.push(`unresolved link-audit outcome (${outcome.classification}): ${url}`);
  }
}
for (const url of outcomes.keys()) {
  if (!currentUrls.has(url)) errors.push(`stale link-audit outcome: ${url}`);
}
if (audit.uniqueUrlCount !== currentUrls.size) errors.push(`link-audit count mismatch: audit=${audit.uniqueUrlCount}, current=${currentUrls.size}`);

if (errors.length) {
  console.error('Onsen link audit validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Onsen link audit validation passed: ${currentUrls.size} URLs are current and have no unresolved outcomes.`);
