import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'content', 'onsen');
const REPORT_PATH = path.join(ROOT, 'data', 'official-link-report.json');

if (!fs.existsSync(REPORT_PATH)) {
  throw new Error(`Missing report: ${REPORT_PATH}`);
}

const report = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf8'));
const statusByUrl = new Map(report.entries.map((entry) => [entry.url, entry]));
let updatedFiles = 0;
let updatedLinks = 0;

for (const file of fs.readdirSync(CONTENT_DIR)) {
  if (!file.endsWith('.json') || file === 'index.json') continue;
  const filePath = path.join(CONTENT_DIR, file);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let changed = false;

  if (Array.isArray(content.access?.officialLinks)) {
    content.access.officialLinks = content.access.officialLinks.flatMap((link) => {
      const status = statusByUrl.get(link.url);
      if (!status) return [link];
      if (!status.ok) {
        changed = true;
        updatedLinks += 1;
        return [];
      }
      if (status.finalUrl && status.finalUrl !== link.url) {
        changed = true;
        updatedLinks += 1;
        return [{ ...link, url: status.finalUrl }];
      }
      return [link];
    });
  }

  if (Array.isArray(content.onsenSpots)) {
    content.onsenSpots = content.onsenSpots.map((spot) => {
      let nextSpot = { ...spot };
      for (const key of ['officialUrl', 'websiteUri']) {
        if (!nextSpot[key]) continue;
        const status = statusByUrl.get(nextSpot[key]);
        if (!status) continue;
        if (!status.ok) {
          delete nextSpot[key];
          changed = true;
          updatedLinks += 1;
          continue;
        }
        if (status.finalUrl && status.finalUrl !== nextSpot[key]) {
          nextSpot[key] = status.finalUrl;
          changed = true;
          updatedLinks += 1;
        }
      }
      return nextSpot;
    });
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf8');
    updatedFiles += 1;
  }
}

console.log(`Updated ${updatedLinks} links across ${updatedFiles} files.`);
