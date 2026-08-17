import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const filePath = path.join(root, 'data/directory-site.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const replacements = new Map([
  ['https://www.ibaraki-kanko.jp/', 'https://www.ibarakiguide.jp/'],
  ['https://minakami-kankou.jp/', 'https://www.enjoy-minakami.jp/'],
  ['https://www.akagi-kanko.net/', 'https://gunma-kanko.jp/spots/1359'],
  ['https://www.takasaki-kankou.jp/', 'https://www.city.takasaki.gunma.jp/'],
  ['https://www.tokigawa-kanko.com/', 'https://www.town.tokigawa.lg.jp/'],
  ['https://www.umibe-4126.com/', 'https://www.futtsu-kanko.info/'],
  ['https://utsukushi-yu.com/', 'http://utsukushi-yu.com/'],
  ['https://utsukushi-yu.com/price.html', 'http://utsukushi-yu.com/price.html'],
  ['https://kodainoyu.jp/', 'http://kodainoyu.jp/'],
]);

let changed = 0;
function transform(value) {
  if (typeof value === 'string') {
    const replacement = replacements.get(value);
    if (replacement) {
      changed += 1;
      return replacement;
    }
    return value;
  }
  if (Array.isArray(value)) return value.map(transform);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, transform(item)]));
  return value;
}

const updated = transform(data);
fs.writeFileSync(filePath, `${JSON.stringify(updated, null, 2)}\n`);
console.log(`Replaced ${changed} stale or TLS-invalid links.`);
