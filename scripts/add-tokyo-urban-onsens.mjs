import fs from 'node:fs';
const dataPath = new URL('../data/directory-site.json', import.meta.url);
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const areaId = 'tokyo-urban-onsen';
const baseArea = data.areas.find((area) => area.id === 'tokyo-islands');
if (!data.areas.some((area) => area.id === areaId)) {
  data.areas.push({
    id: areaId,
    slug: areaId,
    name: '東京23区・多摩の天然温泉',
    prefectures: ['東京都'],
    summary: '駅近の日帰り温泉から庭園を望む湯処まで、東京の街なかで天然温泉を楽しめる施設をまとめたエリア。',
    image: baseArea.image,
    onsenSlugs: [],
  });
}
const candidates = [
  ['maeno-hara-onsen','前野原温泉 さやの湯処','https://www.sayanoyudokoro.co.jp/','前野原温泉 さやの湯処公式サイト','板橋区で源泉かけ流しのにごり湯と枯山水の庭を楽しめる日帰り温泉。','都内で、源泉と日本庭園に浸る。',['源泉かけ流し','庭園','日帰り']],
  ['jindaiji-yumorinosato','深大寺天然温泉 湯守の里','https://yumorinosato.com/','湯守の里公式サイト','深大寺の森と寺社めぐりに近い、調布の黒湯天然温泉。','深大寺の森を歩いて、黒湯へ。',['黒湯','深大寺','日帰り']],
  ['tam境-morinoirodori','多摩境天然温泉 森乃彩','https://morinoirodori.com/','森乃彩公式サイト','多摩丘陵の緑に囲まれ、源泉かけ流しと露天風呂を楽しめる町田の温泉施設。','森の緑と、かけ流しの湯。',['源泉かけ流し','森','日帰り']],
  ['toshimaen-niwanoyu','豊島園 庭の湯','https://www.seibu-leisure.co.jp/niwanoyu/index.html','豊島園 庭の湯公式サイト','1200坪の日本庭園を望む、練馬の天然温泉とスパ施設。','庭園を眺めて、都心の湯宿気分。',['日本庭園','スパ','日帰り']],
  ['heiwajima-onsen','天然温泉平和島','https://www.heiwajima-onsen.jp/','天然温泉平和島公式サイト','大田区で地下深くから湧く天然温泉とリラクゼーションを楽しめる施設。','羽田からも近い、都市の深い湯。',['黒湯','空港近く','日帰り']],
  ['musashikoyama-shimizuyu','武蔵小山温泉 清水湯','https://www.shimizuyu.com/','武蔵小山温泉 清水湯公式サイト','品川区で黄金の湯と黒湯、岩盤浴を楽しめる駅近の天然温泉。','駅から5分、二つの天然温泉。',['黒湯','駅近','日帰り']],
  ['spa-laqua','東京ドーム天然温泉 Spa LaQua','https://www.laqua.jp/spa/','Spa LaQua公式サイト','東京ドームシティ内で天然温泉、サウナ、岩盤浴を楽しめる都心のスパ。','街の真ん中で、深く休む。',['天然温泉','サウナ','駅近']],
  ['otaniyuta-myogin','大谷田温泉 明神の湯','https://dormy-hotels.com/spa/myoujin/','大谷田温泉 明神の湯公式サイト','足立区で趣のある湯場と露天風呂を楽しめる日帰り天然温泉。','木の湯場で、東京の休日。',['露天風呂','日帰り','和の湯場']],
  ['ofuro-no-osama-oimachi','おふろの王様 大井町店','https://www.ousama2603.com/ooimachi/','おふろの王様 大井町店公式サイト','大井町駅徒歩1分で露天風呂や岩盤浴を楽しめる都市型温浴施設。','駅前で、仕事帰りの湯旅。',['駅近','岩盤浴','日帰り']],
  ['kodai-no-yu','東京天然温泉 古代の湯','http://kodainoyu.jp/','東京天然温泉 古代の湯公式サイト','葛飾区で天然温泉と食事、休憩を一日ゆっくり楽しめる施設。','下町で、ゆっくり一日湯。',['天然温泉','下町','日帰り']],
  ['tokyo-somei-sakura','東京染井温泉 SAKURA','https://tokyosomeionsensakura.com/','東京染井温泉 SAKURA公式サイト','巣鴨の静かな街並みにある、天然温泉とサウナを楽しめる温浴施設。','桜の街で、静かな湯浴み。',['天然温泉','サウナ','駅近']],
  ['takaido-utsukushinoyu','高井戸天然温泉 美しの湯','http://utsukushi-yu.com/','高井戸天然温泉 美しの湯公式サイト','高井戸駅から徒歩2分、琥珀色の源泉を楽しめる杉並の温泉施設。','駅近の琥珀色の湯。',['琥珀色の湯','駅近','日帰り']],
  ['togoshiginza-onsen','戸越銀座温泉','https://shinagawa1010.jp/list/togoshiginza/','品川浴場組合公式案内','戸越銀座商店街の散策と合わせて楽しめる、品川の天然温泉銭湯。','商店街を歩いて、黒湯へ。',['黒湯','銭湯','街歩き']],
];
const existing = new Set(data.onsens.map((item) => item.slug));
const mapUrl = (query) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
const image = baseArea.image;
let added = 0;
for (const [slug, name, officialUrl, officialName, summary, catchcopy, tags] of candidates) {
  if (existing.has(slug)) continue;
  const query = `${name} 東京都`;
  data.onsens.push({
    slug, name, kind: '温泉施設', areaId, prefecture: '東京都', officialName, officialUrl, mapUrl: mapUrl(query), verifiedAt: '2026-08-16', summary, catchcopy, tags, springTypes: ['ナトリウム塩化物泉'], useCases: ['day-trip'], access: '各施設の公式アクセス案内とGoogleマップで最新情報をご確認ください。', image: { ...image, alt: `${name}の温泉案内画像` }, gallery: [{ ...image, alt: `${name}の温泉案内画像` }], facilities: [{ name: `${officialName}（公式案内）`, kind: '公式案内', url: officialUrl, mapUrl: mapUrl(query) }, { name: `${name}の利用案内`, kind: '施設情報', url: officialUrl, mapUrl: mapUrl(query) }, { name: `${name}の地図`, kind: '地図', url: mapUrl(query), mapUrl: mapUrl(query) }], features: [summary, catchcopy, `${tags.join('・')}を楽しめる東京の温泉施設`], benefits: [{ label: '入浴体験', text: '泉質や浴槽の特徴、営業時間は公式案内を確認しながら、無理のない入浴を楽しめます。' }], seasonal: [{ season: '通年', text: '季節を問わず立ち寄りやすい施設。営業日・休館日は公式情報で確認してください。' }], editorialNote: '施設ごとに泉質・入浴条件が異なるため、訪問前に公式案内を確認してください。'
  });
  data.areas.find((area) => area.id === areaId).onsenSlugs.push(slug);
  added += 1;
}
fs.writeFileSync(dataPath, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Added ${added} Tokyo urban onsen facilities. Total: ${data.onsens.length}`);
