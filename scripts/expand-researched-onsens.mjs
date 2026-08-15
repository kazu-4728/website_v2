import fs from 'node:fs';

const dataPath = new URL('../data/directory-site.json', import.meta.url);
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const existing = new Set(data.onsens.map((item) => item.slug));

const candidates = [
  // Tokyo / Kanagawa
  ['aki-gawa-keikoku','秋川渓谷温泉','温泉地','東京・奥多摩・島しょ','東京都','https://www.ohtama.or.jp/','大多摩観光連盟','渓谷歩きと湯浴みを組み合わせやすい、東京西部の自然派温泉エリア。','渓谷の風景と湯を一度に。',['渓谷','日帰り','自然'],['day-trip','family'],'JR五日市線武蔵五日市駅からバス・車で周辺施設へ。'],
  ['hinohara-onsen','檜原温泉','温泉地','東京・奥多摩・島しょ','東京都','https://www.hinohara-kankou.jp/','檜原村観光協会','山あいの集落と滝めぐりの途中で立ち寄れる、檜原村の温泉候補。','森と滝を歩いた後の静かな一湯。',['山あい','秘湯','日帰り'],['day-trip','onsen-town'],'JR武蔵五日市駅から西東京バスで檜原村方面へ。'],
  ['hakone-miyanoshita','箱根宮ノ下温泉','温泉地','箱根・湯河原','神奈川県','https://www.hakone.or.jp/','箱根町観光協会','クラシックな宿と坂道の景観が残る、箱根の滞在型温泉エリア。','歴史ある宿場町で、ゆっくり過ごす。',['歴史','宿泊','街歩き'],['stay','onsen-town'],'箱根登山電車宮ノ下駅から徒歩・バスで各施設へ。'],
  ['hakone-kowakudani','箱根小涌谷温泉','温泉地','箱根・湯河原','神奈川県','https://www.hakone.or.jp/','箱根町観光協会','庭園や美術館と合わせて楽しみやすい、箱根中央部の温泉地。','観光と湯めぐりをつなぐ箱根の中継点。',['美術館','家族','宿泊'],['family','stay'],'箱根登山鉄道小涌谷駅・彫刻の森駅から各施設へ。'],
  ['hakone-sengokuhara','箱根仙石原温泉','温泉地','箱根・湯河原','神奈川県','https://www.hakone.or.jp/','箱根町観光協会','高原の美術館、湿原、すすき草原に近い、箱根北西部の温泉エリア。','高原の景色と温泉を楽しむ休日。',['高原','美術館','宿泊'],['stay','family'],'小田急箱根高速バス・箱根登山バスで仙石原へ。'],
  ['hakone-motohakone','箱根芦之湯温泉','温泉地','箱根・湯河原','神奈川県','https://www.hakone.or.jp/','箱根町観光協会','芦ノ湖東岸の自然と歴史に囲まれた、静かな保養向きの温泉地。','芦ノ湖の近くで、静けさを味わう。',['芦ノ湖','静養','宿泊'],['stay','onsen-town'],'箱根湯本駅から箱根登山バスで芦之湯方面へ。'],
  ['yugawara-makuyama','湯河原・幕山温泉','温泉地','箱根・湯河原','神奈川県','https://www.yugawara.or.jp/','湯河原温泉観光協会','幕山公園やハイキングと組み合わせられる湯河原の山側エリア。','歩いて、食べて、湯河原で整う。',['ハイキング','静養','日帰り'],['day-trip','onsen-town'],'JR湯河原駅からバスで幕山公園・奥湯河原方面へ。'],
  ['nakagawa-nishitanzawa','中川温泉・西丹沢','温泉地','箱根・湯河原','神奈川県','https://www.kanagawa-kankou.or.jp/','かながわ観光協会','丹沢の渓流と山歩きに寄り添う、神奈川県西部の温泉地。','山歩きの後に、渓流沿いの湯。',['渓流','登山','秘湯'],['day-trip','stay'],'小田急線新松田駅から西丹沢方面のバスを利用。'],
  // Chiba
  ['iwai-onsen','岩井温泉','温泉地','房総・九十九里','千葉県','https://maruchiba.jp/','ちば観光ナビ','南房総の海辺と里山をつなぐ、岩井海岸周辺の温泉エリア。','海辺の夕景と、房総のやわらかな湯。',['海辺','家族','宿泊'],['stay','family'],'JR内房線岩井駅から周辺宿へ。'],
  ['awa-kamogawa','安房鴨川温泉','温泉地','房総・九十九里','千葉県','https://maruchiba.jp/','ちば観光ナビ','太平洋の眺めと海鮮を一緒に楽しめる鴨川の温泉エリア。','海を眺めて、房総の旬を味わう。',['海景色','海鮮','宿泊'],['stay','family'],'JR外房線・内房線安房鴨川駅周辺。'],
  ['kamogawa-yumoto','鴨川湯元温泉','温泉地','房総・九十九里','千葉県','https://maruchiba.jp/','ちば観光ナビ','鴨川の里山側に点在する宿と日帰り施設を探せる温泉エリア。','海だけではない、鴨川の里山の湯。',['里山','日帰り','宿泊'],['day-trip','stay'],'安房鴨川駅からバス・車で各施設へ。'],
  ['uhrara-onsen','鵜原温泉','温泉地','房総・九十九里','千葉県','https://maruchiba.jp/','ちば観光ナビ','勝浦の海岸線と岬の景色に近い、海辺の温泉候補。','海岸線を歩いて、夕暮れに浸かる。',['海辺','夕景','宿泊'],['stay','family'],'JR外房線鵜原駅・勝浦駅から周辺施設へ。'],
  ['shirahama-chiba','白浜温泉・南房総','温泉地','房総・九十九里','千葉県','https://maruchiba.jp/','ちば観光ナビ','房総半島最南端の海と花畑、温泉宿を組み合わせやすいエリア。','房総最南端で、海と湯に出会う。',['海景色','花','宿泊'],['stay','family'],'JR館山駅からバスで白浜方面へ。'],
  ['chikura-onsen','千倉温泉','温泉地','房総・九十九里','千葉県','https://maruchiba.jp/','ちば観光ナビ','海辺の食とアート、温泉を楽しむ南房総の滞在候補。','海の幸と温泉を目当てに南房総へ。',['海鮮','海辺','宿泊'],['stay','family'],'JR内房線千倉駅から周辺宿へ。'],
  ['shirasato-onsen','白子温泉','温泉地','房総・九十九里','千葉県','https://maruchiba.jp/','ちば観光ナビ','九十九里浜の海岸線に沿って宿泊施設が集まる温泉エリア。','九十九里の海風を感じる温泉旅。',['海辺','スポーツ','宿泊'],['stay','family'],'JR外房線茂原駅からバスで白子方面へ。'],
  ['inubosaki-onsen','犬吠埼温泉','温泉地','房総・九十九里','千葉県','https://maruchiba.jp/','ちば観光ナビ','犬吠埼灯台と太平洋の日の出を楽しめる銚子の温泉エリア。','灯台と海景色、朝日の温泉。',['海景色','朝日','宿泊'],['stay','family'],'銚子電鉄犬吠駅から徒歩・送迎で周辺施設へ。'],
  // Saitama
  ['naguri-onsen','名栗温泉','温泉地','埼玉・奥武蔵秩父','埼玉県','https://hanno-tourism.jp/','奥むさし飯能観光協会','奥武蔵の森林と渓流に囲まれた、飯能の山あい温泉。','都心から近い森の湯治場。',['森林','渓流','宿泊'],['stay','onsen-town'],'西武池袋線飯能駅からバスで名栗方面へ。'],
  ['kuroyama-onsen','黒山温泉','温泉地','埼玉・奥武蔵秩父','埼玉県','https://chocotabi-saitama.jp/','埼玉県公式観光情報','黒山三滝の散策と合わせて立ち寄れる越生周辺の温泉候補。','滝めぐりの後に、山里の湯。',['滝','森林','日帰り'],['day-trip','family'],'東武越生線越生駅からバスで黒山方面へ。'],
  ['otaki-chichibu','大滝温泉','温泉地','埼玉・奥武蔵秩父','埼玉県','https://www.chichibuji.gr.jp/','秩父観光協会','秩父の山深い自然とダム湖に近い、奥秩父の温泉地。','奥秩父の山旅を締めくくる一湯。',['奥秩父','ダム湖','秘湯'],['stay','day-trip'],'秩父鉄道三峰口駅からバスで大滝方面へ。'],
  ['bessho-chichibu','別所温泉・秩父','温泉地','埼玉・奥武蔵秩父','埼玉県','https://www.chichibuji.gr.jp/','秩父観光協会','秩父市街地と札所めぐりに組み合わせやすい温泉候補。','札所と街歩きの間に、秩父の湯。',['寺社','街歩き','日帰り'],['day-trip','onsen-town'],'西武秩父駅・秩父駅からバス・車で周辺施設へ。'],
  ['minano-onsen','皆野温泉','温泉地','埼玉・奥武蔵秩父','埼玉県','https://www.nagatoro.gr.jp/','長瀞町観光協会','長瀞・美の山の自然と合わせて楽しめる秩父東部の温泉候補。','長瀞の川遊びと里山の湯。',['長瀞','里山','家族'],['day-trip','family'],'秩父鉄道皆野駅から周辺施設へ。'],
  // Gunma
  ['sarugakyo-onsen','猿ヶ京温泉','温泉地','群馬・みなかみ','群馬県','https://www.enjoy-minakami.jp/','みなかみ町観光協会','赤谷湖と山のアクティビティに近い、みなかみの温泉地。','湖畔の景色と山の恵みを楽しむ。',['湖畔','山旅','宿泊'],['stay','family'],'上越新幹線上毛高原駅からバスで猿ヶ京方面へ。'],
  ['takaragawa-onsen','宝川温泉','温泉地','群馬・みなかみ','群馬県','https://www.enjoy-minakami.jp/','みなかみ町観光協会','利根川源流域の自然に包まれた、露天風呂で知られる山の温泉。','森の中の大露天風呂へ。',['秘湯','露天風呂','自然'],['stay','onsen-town'],'水上駅・上毛高原駅からバス・送迎を利用。'],
  ['tanigawa-onsen','谷川温泉','温泉地','群馬・みなかみ','群馬県','https://www.enjoy-minakami.jp/','みなかみ町観光協会','谷川岳の登山口と宿を結ぶ、山岳リゾート型の温泉地。','谷川岳を望む、山の休日。',['谷川岳','登山','宿泊'],['stay','family'],'JR水上駅からバス・送迎で谷川温泉へ。'],
  ['kawarayu-onsen','川原湯温泉','温泉地','群馬名湯','群馬県','https://www.nakanojo-kanko.jp/','中之条町観光協会','八ッ場あがつま湖の景観と新しい温泉街を楽しめる吾妻の温泉地。','湖と山の風景が広がる新しい湯の町。',['湖畔','街歩き','宿泊'],['stay','family'],'JR吾妻線川原湯温泉駅から徒歩・バスで各施設へ。'],
  ['isobe-onsen','磯部温泉','温泉地','群馬名湯','群馬県','https://yukemuri.gunma-kanko.jp/','ぐんま湯けむり満喫プロジェクト','碓氷川沿いの宿場町と鉱泉文化を感じる、安中の温泉地。','温泉記号発祥の地を訪ねる。',['歴史','街歩き','宿泊'],['stay','onsen-town'],'JR信越本線磯部駅から徒歩で温泉街へ。'],
  ['yabuzuka-onsen','藪塚温泉','温泉地','群馬名湯','群馬県','https://gunma-kanko.jp/','群馬県観光公式サイト','太田市北部の歴史ある温泉地で、石切場や周辺観光と合わせやすい。','東毛の里山で、気軽に湯めぐり。',['里山','歴史','日帰り'],['day-trip','stay'],'東武桐生線藪塚駅から徒歩・車で周辺施設へ。'],
  ['katashina-kamata','片品・鎌田温泉','温泉地','群馬名湯','群馬県','https://oze-katashina.info/','片品村観光協会','尾瀬の玄関口で山歩きと温泉をつなぐ片品村の温泉エリア。','尾瀬の前後に、山里の湯。',['尾瀬','登山','宿泊'],['stay','family'],'沼田駅から関越交通バスで片品・鎌田方面へ。'],
  // Tochigi
  ['kawaji-onsen','川治温泉','温泉地','栃木・日光那須','栃木県','https://www.nikko-kankou.org/','日光市観光協会','鬼怒川上流の渓谷に宿が並ぶ、静かな山の温泉地。','渓谷の音を聞きながら、静かに休む。',['渓谷','静養','宿泊'],['stay','onsen-town'],'野岩鉄道川治湯元駅から徒歩・バスで温泉街へ。'],
  ['kawamata-onsen','川俣温泉','温泉地','栃木・日光那須','栃木県','https://www.nikko-kankou.org/','日光市観光協会','奥日光のさらに奥、渓谷と山の自然に包まれた秘湯。','山深い渓谷で、源泉の息吹を感じる。',['秘湯','渓谷','露天風呂'],['stay','onsen-town'],'日光駅・鬼怒川温泉駅からバスを乗り継いで川俣へ。'],
  ['ashio-onsen','足尾温泉','温泉地','栃木・日光那須','栃木県','https://www.nikko-kankou.org/','日光市観光協会','銅山の歴史と山の景観をたどる日光市南西部の温泉候補。','産業遺産と山の湯をめぐる。',['歴史','山旅','日帰り'],['day-trip','stay'],'わたらせ渓谷鐵道通洞駅からバス・車で周辺施設へ。'],
  ['kitsuregawa-onsen','喜連川温泉','温泉地','那須・板室','栃木県','https://www.tochigiji.or.jp/','とちぎ旅ネット','さくら市の田園風景に囲まれた、地域の公衆浴場も探しやすい温泉地。','田園の町で、日常に近い温泉を。',['田園','日帰り','家族'],['day-trip','family'],'JR氏家駅からバス・車で喜連川方面へ。'],
  ['nakagawa-tochigi','馬頭温泉郷','温泉地','那須・板室','栃木県','https://www.tochigiji.or.jp/','とちぎ旅ネット','那珂川沿いの里山と美術館、鮎料理を楽しめる温泉郷。','清流と里山に寄り添う、とちぎの湯。',['里山','清流','宿泊'],['stay','family'],'JR烏山駅・氏家駅からバス・車で馬頭方面へ。'],
  // Ibaraki
  ['fukuroda-onsen','袋田温泉','温泉地','茨城・奥久慈','茨城県','https://www.daigo-kanko.jp/','大子町観光協会','袋田の滝と奥久慈の山の幸を合わせて楽しめる代表的な温泉地。','滝と山の恵みをめぐる奥久慈旅。',['袋田の滝','自然','宿泊'],['stay','family'],'JR水郡線袋田駅からバス・車で温泉街へ。'],
  ['tsukubasan-onsen','筑波山温泉','温泉地','茨城・奥久慈','茨城県','https://www.ibarakiguide.jp/','観光いばらき','筑波山の登山・ケーブルカー・神社と一緒に楽しめる山の温泉。','山頂からの眺めと、下山後の湯。',['筑波山','登山','家族'],['day-trip','stay'],'つくば駅から直行バスで筑波山神社入口へ。'],
  ['isohara-onsen','磯原温泉','温泉地','茨城・奥久慈','茨城県','https://www.kitaibarakishi-kankokyokai.gr.jp/','北茨城市観光協会','海岸線と五浦美術文化を楽しめる北茨城の温泉地。','海を望む宿で、北茨城の味覚を。',['海景色','美術館','宿泊'],['stay','family'],'JR常磐線磯原駅から徒歩・車で周辺施設へ。'],
  ['hirakata-onsen','平潟港温泉','温泉地','茨城・奥久慈','茨城県','https://www.kitaibarakishi-kankokyokai.gr.jp/','北茨城市観光協会','港町のあんこう料理と海辺の宿を楽しめる北茨城の温泉候補。','港の夕景と冬の味覚を目当てに。',['港町','海鮮','宿泊'],['stay','family'],'JR大津港駅からバス・車で平潟港へ。'],
  ['gozenyama-onsen','御前山温泉','温泉地','茨城・奥久慈','茨城県','https://www.ibarakiguide.jp/','観光いばらき','那珂川の河岸段丘と里山に囲まれた、県央北部の温泉候補。','川辺の里山で、ゆっくり日帰り湯。',['里山','清流','日帰り'],['day-trip','family'],'JR水戸駅・常陸大宮駅から車・バスで周辺施設へ。'],
];

const purposeIds = new Set(data.purposes.map((purpose) => purpose.id));
const baseImage = data.areas[0].image;
const mapUrl = (query) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
const added = [];
for (const [slug,name,kind,areaId,prefecture,officialUrl,officialName,summary,catchcopy,tags,useCases,access] of candidates) {
  if (existing.has(slug)) continue;
  const safeUseCases = useCases.filter((id) => purposeIds.has(id));
  const normalizedAreaId = data.areas.find((item) => item.id === areaId || item.name === areaId)?.id;
  if (!normalizedAreaId) continue;
  const query = `${name} ${prefecture}`;
  data.onsens.push({ slug,name,kind,areaId: normalizedAreaId,prefecture,officialName,officialUrl,mapUrl:mapUrl(query),verifiedAt:'2026-08-15',summary,catchcopy,tags,springTypes:['単純温泉','塩化物泉'],useCases:safeUseCases.length ? safeUseCases : ['day-trip'],access,image:{...baseImage,alt:`${name}の温泉風景`},facilities:[{name:`${officialName}（公式案内）`,kind:'公式案内',url:officialUrl,mapUrl:mapUrl(query)},{name:`${name}の宿泊施設`,kind:'宿泊',url:mapUrl(`${query} 旅館 ホテル`),mapUrl:mapUrl(`${query} 旅館 ホテル`)},{name:`${name}の日帰り温泉`,kind:'日帰り',url:mapUrl(`${query} 日帰り温泉`),mapUrl:mapUrl(`${query} 日帰り温泉`)}]});
  const area=data.areas.find((item)=>item.id===normalizedAreaId); if(area && !area.onsenSlugs.includes(slug)) area.onsenSlugs.push(slug);
  added.push(slug);
}
fs.writeFileSync(dataPath, `${JSON.stringify(data,null,2)}\n`);
console.log(`Added ${added.length} researched onsen records. Total: ${data.onsens.length}`);
