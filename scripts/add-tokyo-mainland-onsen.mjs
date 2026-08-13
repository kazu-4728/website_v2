import fs from 'node:fs';

const path = new URL('../data/directory-site.json', import.meta.url);
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const area = data.areas.find((item) => item.id === 'tokyo-islands');
area.name = '東京・奥多摩・島しょ';
area.summary = '奥多摩や秋川渓谷の山あいの温泉から、火山島の海景色まで楽しめる東京都の温泉エリア。';
area.onsenSlugs = area.onsenSlugs.filter((slug) => slug !== 'okutama' && slug !== 'akigawa' && slug !== 'kazuma');
const image = { ...area.image, alt: '東京の山あいと島しょ温泉のイメージ' };
const additions = [
  ['okutama', '奥多摩温泉', '温泉地', '東京都', '奥多摩観光協会', 'https://www.okutama.gr.jp/', '多摩川や奥多摩湖の自然、渓谷歩きと組み合わせやすい東京都西端の温泉地。', '渓谷と川音に癒やされる東京の山里温泉。', ['日帰り', '渓谷', '自然'], ['day-trip', 'quiet'], 'JR青梅線奥多摩駅から徒歩・バスで各施設へ。'],
  ['akigawa', '秋川渓谷温泉', '温泉地', '東京都', 'あきる野市観光協会', 'https://www.akirunokanko.com/', '清流の渓谷景観と温泉を都心から日帰りで楽しみやすい西多摩の温泉地。', '都心から近い、清流と渓谷の温泉。', ['日帰り', '渓谷', '家族'], ['day-trip', 'family'], 'JR五日市線武蔵五日市駅からバス利用。'],
  ['kazuma', '檜原温泉', '温泉地', '東京都', '檜原温泉センター 数馬の湯', 'https://kazumanoyu.net/', '秋川源流域の山歩きと、檜原村の自然を組み合わせられる温泉地。', '秋川源流の森で整う檜原の湯。', ['日帰り', '自然', '山'], ['day-trip', 'quiet'], 'JR五日市線武蔵五日市駅からバス利用。'],
];
const existing = new Set(data.onsens.map((item) => item.slug));
for (const [slug, name, kind, prefecture, officialName, officialUrl, summary, catchcopy, tags, useCases, access] of additions) {
  if (existing.has(slug)) continue;
  data.onsens.push({ slug, name, kind, areaId: 'tokyo-islands', prefecture, officialName, officialUrl, verifiedAt: '2026-08-14', summary, catchcopy, tags, springTypes: ['温泉地の詳細は公式サイトで確認'], useCases, access, image: { ...image, alt: `${name}の温泉イメージ` } });
  area.onsenSlugs.push(slug);
}
data.home.featuredOnsenSlugs = ['okutama', 'akigawa', 'oshima', 'hakone-yumoto', 'tsurumaki', 'kusatsu', 'minakami', 'nasu', 'tateyama', 'yoro', 'naguri', 'daigo'];
fs.writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Tokyo entries: ${data.onsens.filter((item) => item.prefecture === '東京都').length}`);
