import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const write = (relative, value) => fs.writeFileSync(path.join(root, relative), `${JSON.stringify(value, null, 2)}\n`);
const site = read('data/directory-site.json');
const manifest = read('data/onsen-image-manifest.json');
const reviewedAt = '2026-08-17';
const mapUrl = (query) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
const placeholderImage = (slug, name, sourceUrl) => ({
  src: `/images/onsens/${slug}/primary.jpg`, alt: `${name}の周辺写真`, credit: 'Wikimedia Commons（台帳を参照）', license: '台帳記載の再利用可能ライセンス', sourceUrl,
});

const additions = [
  {
    slug: 'sugito-utanoyu', name: '杉戸天然温泉 雅楽の湯', officialName: '杉戸天然温泉 雅楽の湯', prefecture: '埼玉県', areaId: 'tokyo-saitama', kind: '日帰り温浴施設',
    officialUrl: 'https://utanoyu.com/', mapUrl: mapUrl('杉戸天然温泉 雅楽の湯 埼玉県北葛飾郡杉戸町杉戸2517'), verifiedAt: reviewedAt,
    catchcopy: '日光街道の宿場町で、源泉と庭を楽しむ一日湯旅。',
    summary: '杉戸町にある日帰り天然温泉施設です。源泉かけ流しの露天・内湯、高濃度炭酸温泉、岩盤処、食事処を備え、日光街道沿いの小旅行や東武動物公園周辺の休憩先として計画できます。',
    access: '埼玉県北葛飾郡杉戸町杉戸2517。車での来館を基本に、送迎バスの運行・停留所は公式案内を確認してください。',
    tags: ['源泉かけ流し', '高濃度炭酸泉', '岩盤処', '食事', '日帰り'], springTypes: ['含鉄・塩化物系の源泉（施設案内を確認）'], useCases: ['day-trip'],
    features: ['源泉かけ流しの露天・内湯、高濃度炭酸温泉、足湯を公式サイトが案内しています。', '岩盤処、ビュッフェ・和食レストラン、リラクゼーションを併設しています。', '日光街道の宿場町・杉戸に立地し、近隣観光と組み合わせやすい施設です。'],
    seasonal: [{season:'通年', text:'全日営業の案内ですが、不定休や設備点検による変更があるため、出発前に公式のお知らせを確認してください。'}, {season:'秋', text:'公式ギャラリーでは中庭の紅葉が紹介されています。'}],
    editorialNote: '営業条件、利用制限、送迎バス、館内サービスは変更される場合があります。入館前に公式案内と注意事項を確認してください。',
    benefits: [{label:'一日滞在型', text:'入浴に食事・岩盤処・休憩を組み合わせ、時間に余裕を持った日帰り計画に向きます。'}],
    facilities: [{name:'杉戸天然温泉 雅楽の湯', kind:'日帰り温浴', url:'https://utanoyu.com/', mapUrl:mapUrl('杉戸天然温泉 雅楽の湯')}, {name:'雅楽の湯 アクセス', kind:'公式案内', url:'https://utanoyu.com/access/', mapUrl:mapUrl('杉戸天然温泉 雅楽の湯')}],
    dayTrip: {summary:'源泉かけ流し・高濃度炭酸温泉・岩盤処・食事を一施設で利用できる日帰り温泉です。混雑・利用条件を公式で確認してから訪問してください。', hours:'全日10:00〜24:00、最終受付23:30。', closingNote:'不定休。設備点検や臨時変更は公式のお知らせを確認。', feeNote:'入館料・岩盤処・各種サービスの料金は公式料金案内で確認。', accessNote:'埼玉県北葛飾郡杉戸町杉戸2517。送迎バスを利用する場合は運行・停留所の最新案内を確認。', bookingNote:'団体利用・館内サービス・混雑状況は施設へ事前確認。', highlights:['源泉かけ流し','高濃度炭酸温泉','岩盤処','食事'], officialInfoUrl:'https://utanoyu.com/', verifiedAt:reviewedAt},
  },
  {
    slug: 'saitama-seiganji-onsen', name: 'さいたま清河寺温泉', officialName: 'さいたま清河寺温泉', prefecture: '埼玉県', areaId: 'tokyo-saitama', kind: '日帰り温浴施設',
    officialUrl: 'https://www.seiganji-onsen.com/', mapUrl: mapUrl('さいたま清河寺温泉 埼玉県さいたま市西区清河寺683-4'), verifiedAt: reviewedAt,
    catchcopy: '竹林を望む露天で、さいたま市内の一日温泉休憩。',
    summary: 'さいたま市西区の天然温泉施設です。敷地内に湧出したナトリウム—塩化物泉を、竹林を望む露天・生源泉湯などで楽しめます。',
    access: '埼玉県さいたま市西区大字清河寺683-4。車または公共交通での経路は公式アクセス案内・地図で確認してください。',
    tags: ['竹林', '源泉かけ流し', 'ナトリウム-塩化物泉', '日帰り'], springTypes: ['ナトリウム-塩化物泉'], useCases: ['day-trip'],
    features: ['敷地内で湧出した泉温約38.3度の天然温泉と公式が案内しています。', '竹林を展望する露天、生源泉湯、岩風呂、壺湯、寝湯などを備えています。', '内湯の高濃度炭酸温泉・アトラクション風呂も利用できます。'],
    seasonal: [{season:'通年', text:'竹林を望む露天を楽しめます。年に数日の設備点検休館があるため、直前に公式のお知らせを確認してください。'}],
    editorialNote: '営業時間・設備・利用上の注意事項は変更される場合があります。タトゥー・おむつ等の利用条件も含めて公式情報を確認してください。',
    benefits: [{label:'市街地近接の天然温泉', text:'さいたま市内で、露天と休憩を中心に半日〜一日で組み立てやすい施設です。'}],
    facilities: [{name:'さいたま清河寺温泉', kind:'日帰り温浴', url:'https://www.seiganji-onsen.com/', mapUrl:mapUrl('さいたま清河寺温泉')}, {name:'露天風呂案内', kind:'公式案内', url:'https://www.seiganji-onsen.com/guide/roten/', mapUrl:mapUrl('さいたま清河寺温泉')}],
    dayTrip: {summary:'竹林を眺めながら天然温泉を楽しめる日帰り施設です。源泉かけ流しの生源泉湯など、利用したい浴槽・混雑状況を確認して計画してください。', hours:'全日10:00〜24:00、最終受付23:30。', closingNote:'設備点検のため年間数日休館。直前に公式案内を確認。', feeNote:'入館料・岩盤浴等の料金は公式料金案内を確認。', accessNote:'埼玉県さいたま市西区大字清河寺683-4。経路は公式アクセス案内・地図で確認。', bookingNote:'利用制限や混雑状況は施設へ確認。', highlights:['竹林の露天','ナトリウム-塩化物泉','生源泉湯','高濃度炭酸温泉'], officialInfoUrl:'https://www.seiganji-onsen.com/', verifiedAt:reviewedAt},
  },
  {
    slug: 'sawarabi-no-yu', name: 'さわらびの湯', officialName: '日帰り天然温泉 さわらびの湯', prefecture: '埼玉県', areaId: 'saitama-west', kind: '日帰り温浴施設',
    officialUrl: 'https://sawarabino-yu.jp/', mapUrl: mapUrl('さわらびの湯 埼玉県飯能市下名栗685'), verifiedAt: reviewedAt,
    catchcopy: '飯能の森と清流へ向かう、木の温もりの日帰り温泉。',
    summary: '飯能市名栗にある日帰り天然温泉です。西川材を使った館内と、飯能の森林・清流を感じる環境が特徴で、名栗・棒ノ嶺・秩父方面の散策と組み合わせられます。',
    access: '埼玉県飯能市下名栗685。車でも電車でも都心から約90分と公式が案内。無料駐車場約150台があります。',
    tags: ['飯能', '名栗', '森林', '西川材', '日帰り'], springTypes: ['天然温泉（詳細は公式案内を確認）'], useCases: ['day-trip'],
    features: ['埼玉県産の西川材を使った館内と、飯能の森林・清流に囲まれた環境を公式が案内しています。', '飯能・秩父の土産、ラウンジ、露天風呂を備えています。', '駐車場約150台を無料で利用できます。'],
    seasonal: [{season:'春〜秋', text:'名栗・棒ノ嶺・周辺の散策と合わせる場合は、天候と登山・道路状況を確認してください。'}, {season:'通年', text:'第1・第3水曜が定休ですが、祝祭日の扱いと臨時休業は公式の休館情報で確認してください。'}],
    editorialNote: '山間部への移動を伴う場合があります。道路・交通・悪天候時の状況、休館情報を出発前に確認してください。',
    benefits: [{label:'自然と組み合わせる', text:'歩行・観光の後に、ラウンジと露天で休憩を入れる日帰りプランに向きます。'}],
    facilities: [{name:'さわらびの湯', kind:'日帰り温浴', url:'https://sawarabino-yu.jp/', mapUrl:mapUrl('さわらびの湯')}, {name:'さわらびの湯 アクセス', kind:'公式案内', url:'https://sawarabino-yu.jp/access', mapUrl:mapUrl('さわらびの湯')}],
    dayTrip: {summary:'飯能の森に囲まれた日帰り天然温泉です。散策後に利用する場合は、3時間制の入館料と閉館時刻を踏まえて早めに到着してください。', hours:'10:00〜18:00。', closingNote:'毎月第1・第3水曜定休。祝祭日は営業し翌週水曜休み。年末年始は営業と案内。', feeNote:'3時間制。大人（高校生以上）800円、小中学生400円、障がい者400円、乳幼児無料。', accessNote:'埼玉県飯能市下名栗685。無料駐車場約150台。', bookingNote:'臨時休業や混雑は公式の休館情報を確認。', highlights:['飯能の森林','西川材','露天風呂','無料駐車場'], officialInfoUrl:'https://sawarabino-yu.jp/', verifiedAt:reviewedAt},
  },
  {
    slug: 'hyakukannon-onsen', name: '百観音温泉', officialName: '百観音温泉', prefecture: '埼玉県', areaId: 'tokyo-saitama', kind: '日帰り温浴施設',
    officialUrl: 'https://100kannon.com/', mapUrl: mapUrl('百観音温泉 埼玉県久喜市西大輪2-19-1'), verifiedAt: reviewedAt,
    catchcopy: '東鷲宮駅から歩いて、豊富な自噴湯を日帰りで。',
    summary: '久喜市東鷲宮にある日帰り温泉です。自噴温度57度の源泉、露天・内風呂、サウナ、食事処、貸切風呂を備え、JR東鷲宮駅から徒歩約3分と公式が案内しています。',
    access: '埼玉県久喜市西大輪2-19-1。JR東鷲宮駅から徒歩約3分。無料駐車場210台。',
    tags: ['自噴源泉', '駅近', '露天風呂', '貸切風呂', '日帰り'], springTypes: ['ナトリウム・カルシウムを多く含むアルカリ性の湯（施設案内を確認）'], useCases: ['day-trip'],
    features: ['自噴温度57度の豊富な湯量と源泉かけ流しを公式が案内しています。', '露天・内風呂、寝湯、サウナ、高濃度炭酸泉、5室の貸切風呂を備えています。', 'JR東鷲宮駅から徒歩約3分、無料駐車場210台で公共交通・車の双方に対応しています。'],
    seasonal: [{season:'通年', text:'駅近のため公共交通で組み立てやすい一方、土日祝は開館時刻が早いため、混雑・最新料金・休館日を確認してください。'}],
    editorialNote: '源泉や貸切風呂、各種サービスの利用条件・料金は変動する場合があります。公式の料金・休館案内を確認してください。',
    benefits: [{label:'駅近の源泉かけ流し', text:'移動時間を抑えて入浴・食事・休憩を組み合わせたい日帰り利用に向きます。'}],
    facilities: [{name:'百観音温泉', kind:'日帰り温浴', url:'https://100kannon.com/', mapUrl:mapUrl('百観音温泉')}, {name:'百観音温泉 ご案内', kind:'公式案内', url:'https://100kannon.com/guide/', mapUrl:mapUrl('百観音温泉')}],
    dayTrip: {summary:'東鷲宮駅から徒歩約3分で利用できる日帰り温泉です。公共交通・車のいずれでも訪れやすく、露天・内風呂・食事・貸切風呂を組み合わせられます。', hours:'館内は平日8:00〜23:00、土日祝7:00〜23:00。', closingNote:'毎月第3火曜休館。祝日の場合は翌日。', feeNote:'大人は平日850円、土日祝900円。3〜12歳400円。貸切風呂は別途入館料が必要。', accessNote:'埼玉県久喜市西大輪2-19-1。JR東鷲宮駅徒歩約3分、無料駐車場210台。', bookingNote:'貸切風呂の利用人数・料金と食事処の営業時間は公式案内を確認。', highlights:['自噴57度','駅徒歩約3分','貸切風呂','露天・内風呂'], officialInfoUrl:'https://100kannon.com/guide/', verifiedAt:reviewedAt},
  },
];

for (const addition of additions) {
  const sourceUrl = addition.officialUrl;
  const image = placeholderImage(addition.slug, addition.name, sourceUrl);
  const record = {...addition, image, gallery:[image, image], imageVerified:false};
  const index = site.onsens.findIndex((item) => item.slug === record.slug);
  if (index >= 0) site.onsens[index] = record; else site.onsens.push(record);
  const manifestIndex = manifest.assets.findIndex((item) => item.onsenSlug === record.slug && item.role === 'hero');
  const pending = {id:`${record.slug}-hero`, onsenSlug:record.slug, role:'hero', status:'needs-source', subject:`${record.name}の施設外観または周辺写真`, sourceUrl, license:'未確認', reviewedAt, note:'追加直後。対象・ライセンスを確認した画像を登録するまでページ表示用の直接画像としては使用しない。'};
  if (manifestIndex >= 0) manifest.assets[manifestIndex] = pending; else manifest.assets.push(pending);
}
site.onsens.sort((a,b) => a.prefecture.localeCompare(b.prefecture,'ja') || a.name.localeCompare(b.name,'ja'));
manifest.lastReviewed = reviewedAt;
write('data/directory-site.json',site);
write('data/onsen-image-manifest.json',manifest);
console.log(`Added or updated ${additions.length} verified Saitama day-trip onsen records.`);
