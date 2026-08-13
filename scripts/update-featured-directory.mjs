import fs from 'node:fs';

const path = new URL('../data/directory-site.json', import.meta.url);
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
data.home.featuredAreaIds = data.areas.map((area) => area.id);
data.home.featuredOnsenSlugs = [
  'hakone-yumoto', 'tsurumaki', 'kusatsu', 'minakami', 'nasu', 'nikko-yumoto',
  'tateyama', 'yoro', 'naguri', 'daigo', 'fukuroda', 'oshima',
];
fs.writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Featured areas: ${data.home.featuredAreaIds.length}`);
console.log(`Featured onsens: ${data.home.featuredOnsenSlugs.length}`);
