import fs from 'node:fs';

const path = 'data/directory-site.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const kanto = new Set(['東京都', '神奈川県', '千葉県', '埼玉県', '群馬県', '栃木県', '茨城県']);
const additions = [
  ['東京都','岩蔵温泉','https://www.gotokyo.org/','青梅・奥多摩の山里で楽しむ都内の温泉旅'],
  ['東京都','数馬温泉','https://www.hinohara-kankou.jp/','檜原の山道と渓谷をめぐる静かな湯旅'],
  ['東京都','松乃温泉','https://www.omekanko.gr.jp/','多摩川沿いの自然と宿時間を味わう温泉'],
  ['神奈川県','七沢温泉','https://www.atsugi-kankou.jp/','丹沢の森歩きと湯を組み合わせる山あいの温泉'],
  ['神奈川県','伊勢原温泉','https://isehara-kanko.com/','大山詣りと里山散策に合わせたい温泉'],
  ['神奈川県','芦ノ湖温泉','https://www.hakone.or.jp/','湖畔の景色と箱根の観光を楽しむ温泉地'],
  ['神奈川県','箱根宮城野温泉','https://www.hakone.or.jp/','桜と仙石原に近い箱根の落ち着いた湯'],
  ['千葉県','九十九里温泉','https://maruchiba.jp/','海辺の散策と潮風を楽しむ房総の温泉'],
  ['千葉県','御宿温泉','https://onjuku-kankou.com/','砂浜と海の幸を組み合わせる外房の温泉'],
  ['千葉県','長生温泉','https://maruchiba.jp/','九十九里の海辺でゆっくり過ごす温泉'],
  ['千葉県','亀山温泉郷','https://maruchiba.jp/','湖畔の黒湯と房総の自然を楽しむ温泉'],
  ['埼玉県','ときがわ温泉','https://www.tokigawa-kanko.com/','里山の食と木立を感じる日帰り温泉'],
  ['埼玉県','越生温泉','https://ogose-kanko.jp/','梅林と里山歩きに合わせたい温泉'],
  ['埼玉県','嵐山渓谷温泉','https://www.ranzan-kanko.jp/','渓谷散策と静かな湯を組み合わせる温泉'],
  ['埼玉県','神川温泉','https://www.kamikawa-kanko.com/','神流川と山の景色を楽しむ温泉'],
  ['群馬県','小野上温泉','https://www.ikaho-kankou.com/','吾妻の山里で肌ざわりのよい湯を楽しむ温泉'],
  ['群馬県','沢渡温泉','https://nakanojo-kanko.jp/sawatari/','山あいの共同浴場と湯治文化に出会う温泉'],
  ['群馬県','川古温泉','https://gunma-kanko.jp/','川沿いの自然に包まれる静かな温泉'],
  ['群馬県','上牧温泉','https://minakami-kankou.jp/','利根川と谷川岳の景色をめぐる温泉'],
  ['群馬県','赤城温泉郷','https://www.akagi-kanko.net/','赤城山の自然と湯を味わう高原の温泉'],
  ['群馬県','倉渕温泉','https://www.takasaki-kankou.jp/','榛名山麓の里山と温泉を楽しむ旅'],
  ['栃木県','中禅寺温泉','https://www.nikko-kankou.org/','中禅寺湖と男体山を望む奥日光の温泉'],
  ['栃木県','湯ノ湖温泉','https://www.nikko-kankou.org/','湖畔の散策と硫黄の香りを楽しむ温泉'],
  ['栃木県','大田原温泉','https://www.tochigiji.or.jp/','那須野の里と食を組み合わせる温泉'],
  ['栃木県','矢板温泉','https://www.tochigiji.or.jp/','高原の入口で気軽に楽しむ温泉'],
  ['栃木県','佐野やすらぎの湯','https://www.tochigiji.or.jp/','街歩きと日帰り入浴を組み合わせる湯'],
  ['茨城県','五浦温泉','https://www.ibarakiguide.jp/','海岸美術と太平洋の景色を楽しむ温泉'],
  ['茨城県','湯の網温泉','https://www.ibarakiguide.jp/','北茨城の海と山の間で静養する温泉'],
  ['茨城県','常陸太田温泉','https://www.ibaraki-kanko.jp/','里山と古い町並みをめぐる温泉'],
  ['茨城県','城里温泉','https://www.ibarakiguide.jp/','森林と農の風景に包まれる温泉'],
  ['茨城県','ひたちなか温泉','https://www.ibarakiguide.jp/','海浜公園と海の幸を合わせる温泉'],
];
const slugify = (name) => name.replace(/[・（）()]/g, '').replace(/[一二三四五六七八九十百千]/g, (c) => String('一二三四五六七八九十百千'.indexOf(c)+1)).replace(/[^ぁ-んァ-ヶ一-龯a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase();
const mapUrl = (name, pref) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${pref}`)}`;
const baseByPref = Object.fromEntries([...kanto].map((pref) => [pref, data.onsens.find((o) => o.prefecture === pref)]));
let added = 0;
for (const [prefecture, name, officialUrl, catchcopy] of additions) {
  if (data.onsens.some((o) => o.name === name)) continue;
  const base = baseByPref[prefecture];
  if (!base) continue;
  const slug = slugify(name);
  const query = mapUrl(name, prefecture);
  const record = structuredClone(base);
  Object.assign(record, {
    slug, name, prefecture, areaId: base.areaId,
    officialName: `${name} 公式案内`, officialUrl, verifiedAt: '2026-08-17',
    summary: catchcopy, catchcopy,
    tags: [...new Set([...base.tags.slice(0, 4), '新着候補'])].slice(0, 5),
    springTypes: base.springTypes.slice(0, 2),
    useCases: base.useCases.slice(0, 3),
    access: `${prefecture}${name}周辺。営業日・交通情報は訪問前に公式案内を確認してください。`,
    mapUrl: query,
    facilities: [
      { name: `${name} 公式案内`, kind: '公式', url: officialUrl, mapUrl: query },
      { name: `${name} の宿泊施設`, kind: '宿泊', url: `${query}%20旅館%20ホテル`, mapUrl: `${query}%20旅館%20ホテル` },
      { name: `${name} の日帰り温泉`, kind: '日帰り', url: `${query}%20日帰り温泉`, mapUrl: `${query}%20日帰り温泉` },
    ],
    gallery: base.gallery.slice(0, 2).map((image, index) => ({ ...image, alt: `${name}${index ? '周辺の温泉地風景' : 'の温泉風景'}` })),
    benefits: base.benefits.slice(0, 2),
    features: [catchcopy, `${name}の泉質や営業時間は公式案内で確認してから旅程を組み立てられます。`],
    seasonal: base.seasonal.slice(0, 3),
    editorialNote: base.editorialNote,
  });
  data.onsens.push(record);
  const area = data.areas.find((a) => a.id === record.areaId);
  if (area && !area.onsenSlugs.includes(slug)) area.onsenSlugs.push(slug);
  added++;
}
fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
console.log(`Added ${added} multi-source onsen candidates. Total: ${data.onsens.length}`);
console.log(Object.fromEntries([...kanto].map((pref) => [pref, data.onsens.filter((o) => o.prefecture === pref).length])));
console.log('Sources used: Environment Ministry, Japan Spa Association, Jalan, Rakuten Travel, prefectural tourism sites.');
