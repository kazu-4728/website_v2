import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
const write = (relativePath, value) => fs.writeFileSync(path.join(root, relativePath), `${JSON.stringify(value, null, 2)}\n`);
const site = read('data/directory-site.json');
const manifest = read('data/onsen-image-manifest.json');
const verifiedAt = '2026-08-21';
const map = (query) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const additions = [
  {
    slug: 'tokyo-toyosu-manyo-club',
    name: '東京豊洲 万葉倶楽部',
    kind: '温泉施設',
    areaId: 'tokyo-urban-onsen',
    prefecture: '東京都',
    officialName: '東京豊洲 万葉倶楽部',
    officialUrl: 'https://tokyo-toyosu.manyo.co.jp/',
    mapUrl: map('東京豊洲 万葉倶楽部 東京都江東区豊洲6丁目5-1'),
    verifiedAt,
    catchcopy: '豊洲市場に隣接し、都心で長時間の湯休みを組み立てる。',
    summary: '東京都江東区豊洲の「豊洲 千客万来」内にある日帰り・宿泊対応の温浴施設です。豊洲市場に隣接する立地で、入館条件、温泉の供給方式、館内サービスは公式案内で確認してから訪問してください。',
    access: '東京都江東区豊洲6丁目5番1号、豊洲市場に隣接。最寄り駅からの経路、送迎・駐車場の利用条件は公式アクセス案内と地図で確認してください。',
    tags: ['豊洲', '日帰り温浴', '24時間営業', '江東区', '市場周辺'],
    springTypes: ['温浴施設（温泉の供給方式・泉質は公式案内を確認）'],
    useCases: ['day-trip', 'stay'],
    features: [
      '豊洲市場に隣接する「豊洲 千客万来」内の温浴施設です。',
      '公式サイトで日帰り入浴と宿泊の両方を案内しています。',
      '24時間営業の案内がありますが、受付・利用条件・館内サービスは訪問前に公式情報を確認してください。',
    ],
    seasonal: [
      { season: '通年', text: '屋内施設を中心に計画しやすい一方、料金、混雑、深夜滞在、送迎・駐車場の条件は公式案内で確認してください。' },
    ],
    editorialNote: '料金、深夜追加料金、年齢・入館条件、温浴設備の利用条件は変更される場合があります。掲載内容だけで判断せず、公式の料金・注意事項・アクセス案内を確認してください。',
    benefits: [
      { label: '都心で長時間休む', text: '豊洲周辺で食事・散策と入浴を組み合わせ、日帰りまたは宿泊を含む滞在を計画したい場合に向きます。' },
    ],
    facilities: [
      { name: '東京豊洲 万葉倶楽部 料金・営業時間', kind: '公式案内', url: 'https://tokyo-toyosu.manyo.co.jp/price/', mapUrl: map('東京豊洲 万葉倶楽部') },
      { name: '東京豊洲 万葉倶楽部 アクセス', kind: '公式案内', url: 'https://tokyo-toyosu.manyo.co.jp/access/', mapUrl: map('東京豊洲 万葉倶楽部') },
    ],
    dayTrip: {
      summary: '豊洲市場に隣接する温浴施設を日帰りで利用できます。利用時間、深夜滞在、年齢・入館条件は公式案内を確認してください。',
      hours: '24時間営業と公式が案内。受付・浴場・館内サービスの時間は公式の最新案内を確認。',
      closingNote: '年中無休の案内ですが、設備点検・混雑時の利用条件などは公式の告知を確認。',
      feeNote: '大人（中学生以上）3,850円の案内があります。深夜3時以降の追加料金など、料金体系は公式価格表で確認。',
      accessNote: '東京都江東区豊洲6丁目5番1号。豊洲市場に隣接。公共交通・車の経路は公式アクセス案内で確認。',
      bookingNote: '日帰り・宿泊・貸切風呂・年齢および入館条件は公式案内で確認。',
      highlights: ['豊洲市場隣接', '日帰り入浴', '24時間営業案内', '宿泊対応'],
      officialInfoUrl: 'https://tokyo-toyosu.manyo.co.jp/price/',
      verifiedAt,
    },
    media: {
      subject: '「Toyosu fish market-2d2.jpg」— 豊洲市場水産仲卸売場棟。東京豊洲 万葉倶楽部が隣接する豊洲市場の近隣景観であり、施設そのものを写す写真ではありません。',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Toyosu_fish_market-2d2.jpg',
      deliveryUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Toyosu_fish_market-2d2.jpg/1280px-Toyosu_fish_market-2d2.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail',
      license: 'CC BY-SA 4.0',
      credit: '江戸村のとくぞう',
      note: '豊洲市場水産仲卸売場棟の周辺景観として明示。Commonsの説明ページで著作者・CC BY-SA 4.0・出典を確認。画像バイナリはGitリポジトリに保存しない。',
    },
  },
  {
    slug: 'ogikubo-nagominoyu',
    name: '荻窪なごみの湯',
    kind: '温泉施設',
    areaId: 'tokyo-urban-onsen',
    prefecture: '東京都',
    officialName: '荻窪なごみの湯',
    officialUrl: 'https://www.nagomino-yu.com/',
    mapUrl: map('荻窪なごみの湯 東京都杉並区上荻1-10-10'),
    verifiedAt,
    catchcopy: '荻窪駅西口から徒歩2分、終電後まで休める駅前の湯。',
    summary: '東京都杉並区上荻にある日帰り温浴施設です。公式案内では入浴・サウナ、岩盤浴、食事処、リラクゼーションを案内しています。営業時間、深夜の利用条件、年齢条件、料金は変動し得るため訪問前に公式の料金・注意事項を確認してください。',
    access: '東京都杉並区上荻1-10-10。JR・東京メトロ荻窪駅西口から徒歩約2分と公式が案内しています。',
    tags: ['荻窪', '駅近', '日帰り温浴', 'サウナ', '岩盤浴'],
    springTypes: ['温浴施設（温泉の供給方式・泉質は公式案内を確認）'],
    useCases: ['day-trip'],
    features: [
      'JR・東京メトロ荻窪駅西口から徒歩約2分と公式アクセス案内があります。',
      '入浴・サウナに加え、岩盤浴ラウンジ、食事処、リラクゼーションを案内しています。',
      '店舗営業時間は10時30分から翌朝9時まで、最終受付は8時の案内です。',
    ],
    seasonal: [
      { season: '通年', text: '駅近の屋内施設として計画しやすい一方、深夜清掃時間、岩盤浴・食事処の営業時間、工事点検による変更は公式で確認してください。' },
    ],
    editorialNote: '深夜1時から翌朝5時は入館できない案内があります。年齢条件、深夜追加料金、営業時間・休館は変更される場合があるため、公式ページで確認してください。',
    benefits: [
      { label: '駅前で日帰り休憩', text: '荻窪駅から短時間でアクセスし、入浴・サウナ・岩盤浴・食事を組み合わせる休憩に向きます。' },
    ],
    facilities: [
      { name: '荻窪なごみの湯 料金・営業時間', kind: '公式案内', url: 'https://www.nagomino-yu.com/guide/', mapUrl: map('荻窪なごみの湯') },
      { name: '荻窪なごみの湯 アクセス', kind: '公式案内', url: 'https://www.nagomino-yu.com/access/', mapUrl: map('荻窪なごみの湯') },
    ],
    dayTrip: {
      summary: '荻窪駅近くで、入浴・サウナと岩盤浴、食事を日帰りで利用できます。',
      hours: '店舗10:30〜翌9:00、最終受付8:00。深夜1:00〜翌5:00は入館不可。',
      closingNote: '年中無休の案内ですが、工事点検などにより営業時間変更・休館となる場合あり。',
      feeNote: '大人一般は平日2,300円。土日祝は400円、特定日は500円の割増案内があります。岩盤浴は別料金。',
      accessNote: '東京都杉並区上荻1-10-10。JR・東京メトロ荻窪駅西口から徒歩約2分。',
      bookingNote: '深夜滞在の追加料金、未就学児の利用条件、岩盤浴ラウンジ・食事処の時間は公式で確認。',
      highlights: ['荻窪駅徒歩約2分', '入浴・サウナ', '岩盤浴ラウンジ', '翌朝までの営業時間案内'],
      officialInfoUrl: 'https://www.nagomino-yu.com/guide/',
      verifiedAt,
    },
    media: {
      subject: '「Ogikubo sta west north.jpg」— 荻窪駅西口北側（東京都杉並区）。荻窪なごみの湯へのアクセスに関わる近隣・駅前景観であり、施設そのものを写す写真ではありません。',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ogikubo_sta_west_north.jpg',
      deliveryUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Ogikubo_sta_west_north.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail_unscaled',
      license: 'CC BY-SA 4.0',
      credit: 'Oggi',
      note: '荻窪駅西口北側の近隣・アクセス景観として明示。Commonsの説明ページで著作者・CC BY-SA 4.0・出典を確認。画像バイナリはGitリポジトリに保存しない。',
    },
  },
];

for (const addition of additions) {
  const image = {
    src: addition.media.deliveryUrl,
    alt: addition.media.subject,
    credit: addition.media.credit,
    license: addition.media.license,
    sourceUrl: addition.media.sourceUrl,
  };
  const { media, ...record } = addition;
  const existingIndex = site.onsens.findIndex((item) => item.slug === record.slug);
  const completeRecord = { ...record, image, gallery: [image, image], imageVerified: true };
  if (existingIndex === -1) site.onsens.push(completeRecord);
  else site.onsens[existingIndex] = completeRecord;

  const asset = {
    id: `${record.slug}-hero`,
    onsenSlug: record.slug,
    role: 'hero',
    status: 'approved',
    subject: media.subject,
    sourceUrl: media.sourceUrl,
    license: media.license,
    credit: media.credit,
    reviewedAt: verifiedAt,
    note: media.note,
    deliveryUrl: media.deliveryUrl,
  };
  const assetIndex = manifest.assets.findIndex((item) => item.onsenSlug === record.slug && item.role === 'hero');
  if (assetIndex === -1) manifest.assets.push(asset);
  else manifest.assets[assetIndex] = asset;
}

site.onsens.sort((left, right) => left.prefecture.localeCompare(right.prefecture, 'ja') || left.name.localeCompare(right.name, 'ja'));
manifest.lastReviewed = verifiedAt;
write('data/directory-site.json', site);
write('data/onsen-image-manifest.json', manifest);
console.log(`Added or updated ${additions.length} Tokyo day-trip records.`);
