import fs from 'node:fs';
const dataPath = new URL('../data/directory-site.json', import.meta.url);
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const repairs = {
  '鴨川温泉': ['https://www.city.kamogawa.lg.jp/site/kamogawa-kanko/', '鴨川市公式観光案内'],
  '犬吠埼温泉郷': ['https://www.choshikanko.com/', '銚子市観光協会'],
  '新木鉱泉': ['https://www.onsen-yado.net/', '新木鉱泉公式サイト'],
  '草津温泉': ['https://www.town.kusatsu.gunma.jp/', '草津町公式サイト'],
  '湯西川温泉': ['https://yunishigawa-mizunosato.jp/', '湯西川水の郷公式案内'],
  '箱根湯本温泉': ['https://www.hakone.or.jp/', '箱根町観光協会'],
  '皆野温泉': ['https://www.minano.gr.jp/catleisure/leisure_spa/', '皆野町観光協会'],
};
let changed = 0;
for (const onsen of data.onsens) {
  const repair = repairs[onsen.name];
  if (!repair) continue;
  onsen.officialUrl = repair[0];
  onsen.officialName = repair[1];
  for (const facility of onsen.facilities ?? []) {
    if (facility.kind === '公式案内') facility.url = repair[0];
  }
  changed += 1;
}
fs.writeFileSync(dataPath, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Repaired ${changed} official links.`);
