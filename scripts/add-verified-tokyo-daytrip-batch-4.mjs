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
    slug: 'izumi-tenku-ariake-garden', name: '泉天空の湯 有明ガーデン', kind: '温泉施設', areaId: 'tokyo-urban-onsen', prefecture: '東京都',
    officialName: '泉天空の湯 有明ガーデン', officialUrl: 'https://www.shopping-sumitomo-rd.com/ariake/spa-izumi/', mapUrl: map('泉天空の湯 有明ガーデン 東京都江東区有明2-1-7'), verifiedAt,
    catchcopy: '有明ガーデンで、買い物・観劇と湯休みをつなぐ24時間の温浴拠点。',
    summary: '東京都江東区有明の有明ガーデン内にある温浴施設です。公式案内では大浴場・サウナ、岩盤浴、ボディケア、食事を案内しています。設備点検、深夜滞在、年齢・入館条件、料金は変更されるため、訪問前に公式の利用案内を確認してください。',
    access: '東京都江東区有明2丁目の有明ガーデン内。公共交通・車の経路および駐車場条件は有明ガーデンの公式アクセス案内と地図で確認してください。',
    tags: ['有明', '日帰り温浴', '24時間営業', 'サウナ', '岩盤浴'], springTypes: ['温浴施設（温泉の供給方式・泉質は公式案内を確認）'], useCases: ['day-trip'],
    features: ['有明ガーデン内の温浴施設として、大浴場・サウナ・岩盤浴を公式が案内しています。', '施設は24時間営業、入館受付は5:00〜翌1:00の案内です。', '大浴場・サウナは5:00〜翌1:30、清掃のため1:30〜5:00は浴場閉鎖の案内があります。'],
    seasonal: [{ season: '通年', text: '屋内施設として計画しやすい一方、月1回程度の設備点検、深夜料金、館内サービスの時間は公式の最新情報を確認してください。' }],
    editorialNote: '深夜1:00〜5:00に館内滞在する場合は深夜料金が自動加算される案内があります。年齢・おむつ利用・岩盤浴の条件も含め、公式の利用案内で確認してください。',
    benefits: [{ label: '湾岸の一日休憩', text: '有明周辺で買い物、イベント、食事と入浴・サウナを組み合わせたい日帰り計画に向きます。' }],
    facilities: [
      { name: '泉天空の湯 有明ガーデン 営業時間・料金', kind: '公式案内', url: 'https://www.shopping-sumitomo-rd.com/ariake/spa-izumi/userguide.html', mapUrl: map('泉天空の湯 有明ガーデン') },
      { name: '有明ガーデン アクセス', kind: '公式案内', url: 'https://www.shopping-sumitomo-rd.com/ariake/gaikumap/access/', mapUrl: map('泉天空の湯 有明ガーデン') },
    ],
    dayTrip: { summary: '有明ガーデン内で、大浴場・サウナ・岩盤浴を日帰り利用できます。', hours: '施設24時間営業、入館受付5:00〜翌1:00。大浴場・サウナ5:00〜翌1:30。', closingNote: '年中無休の案内ですが、月1回程度の設備点検で休館する場合があるため公式を確認。', feeNote: '大人は平日2,600円、土日祝3,800円。館内着200円、岩盤浴800円。深夜は別料金。', accessNote: '有明ガーデン内。公共交通・車・駐車場の条件は公式アクセス案内で確認。', bookingNote: '深夜料金、年齢・おむつ利用、岩盤浴、混雑時の利用条件は公式で確認。', highlights: ['有明ガーデン内', '24時間営業案内', '大浴場・サウナ', '岩盤浴'], officialInfoUrl: 'https://www.shopping-sumitomo-rd.com/ariake/spa-izumi/userguide.html', verifiedAt },
    media: { subject: '「Ariake Garden 1.jpg」— 東京都江東区有明の有明ガーデン正面。有明ガーデン内にある泉天空の湯 有明ガーデンの近隣・複合施設景観であり、浴場そのものを写す写真ではありません。', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ariake_Garden_1.jpg', deliveryUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Ariake_Garden_1.jpg/1280px-Ariake_Garden_1.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail', license: 'CC BY-SA 4.0', credit: 'NickeldimeC', note: '有明ガーデン正面の複合施設景観として明示。Commonsの説明ページで著作者・CC BY-SA 4.0・出典を確認。画像バイナリはGitリポジトリに保存しない。' },
  },
  {
    slug: 'ofuro-no-osama-tamamogusa', name: 'おふろの王様 多摩百草店', kind: '温泉施設', areaId: 'tokyo-urban-onsen', prefecture: '東京都',
    officialName: 'おふろの王様 多摩百草店', officialUrl: 'https://www.ousama2603.com/tamamogusa/', mapUrl: map('おふろの王様 多摩百草店 東京都多摩市和田1352-1'), verifiedAt,
    catchcopy: '多摩の住宅地で、岩盤浴と日帰り入浴を一日ゆっくり楽しむ。',
    summary: '東京都多摩市和田にある日帰り温浴施設です。公式サイトでは入浴、サウナ、岩盤浴、食事、リラクゼーションを案内しています。天然温泉の供給方式・泉質、営業内容、送迎・駐車場の条件は変動し得るため、出発前に公式情報を確認してください。',
    access: '東京都多摩市和田1352-1。公式は高幡不動駅・多摩センター駅・聖蹟桜ヶ丘駅方面から百草団地南バス停を利用する経路を案内しています。',
    tags: ['多摩市', '日帰り温浴', '岩盤浴', 'サウナ', '送迎案内'], springTypes: ['温浴施設（温泉の供給方式・泉質は公式案内を確認）'], useCases: ['day-trip'],
    features: ['入浴・サウナに加えて4種の岩盤浴を公式が案内しています。', '9:00〜24:00、最終受付23:00の案内です。', '高幡不動駅、多摩センター駅、聖蹟桜ヶ丘駅方面からのバス経路を公式が案内しています。'],
    seasonal: [{ season: '通年', text: '屋内の入浴・岩盤浴を中心に計画できます。営業時間、送迎時刻、特定料金日、館内サービスは公式の最新案内を確認してください。' }],
    editorialNote: '入館料、岩盤浴料金、送迎・バス時刻、年齢条件、館内サービスの営業時間は変更される場合があります。公式案内で確認してください。',
    benefits: [{ label: '多摩で一日休む', text: '多摩市周辺で入浴、サウナ、岩盤浴、食事をまとめて楽しむ日帰り計画に向きます。' }],
    facilities: [
      { name: 'おふろの王様 多摩百草店 料金・アクセス', kind: '公式案内', url: 'https://www.ousama2603.com/tamamogusa/', mapUrl: map('おふろの王様 多摩百草店') },
      { name: 'おふろの王様 多摩百草店 おふろ・サウナ', kind: '公式案内', url: 'https://www.ousama2603.com/tamamogusa/ofuro/', mapUrl: map('おふろの王様 多摩百草店') },
    ],
    dayTrip: { summary: '入浴・サウナ・岩盤浴・食事を日帰りで利用できます。', hours: '9:00〜24:00、最終受付23:00。', closingNote: '年中無休の案内ですが、メンテナンスや館内サービスの変更は公式で確認。', feeNote: '一般大人は平日880円、土日祝1,030円。小学生は平日350円、土日祝400円。岩盤浴は別料金。', accessNote: '東京都多摩市和田1352-1。百草団地南バス停から徒歩約2分の案内。', bookingNote: '送迎・バス時刻、岩盤浴、食事、混雑、利用条件は公式で確認。', highlights: ['日帰り入浴', 'サウナ', '4種の岩盤浴', '多摩市'], officialInfoUrl: 'https://www.ousama2603.com/tamamogusa/', verifiedAt },
    media: { subject: '「Mogusaen st.jpg」— 京王線百草園駅。多摩百草店の周辺・アクセス圏の鉄道景観であり、施設そのものを写す写真ではありません。', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Mogusaen_st.jpg', deliveryUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Mogusaen_st.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail_unscaled', license: 'CC BY-SA 3.0', credit: 'Chabata_k(Japan)', note: '百草園駅の周辺・アクセス景観として明示。Commonsの説明ページで著作者・CC BY-SA 3.0・出典を確認。画像バイナリはGitリポジトリに保存しない。' },
  },
];

for (const addition of additions) {
  const image = { src: addition.media.deliveryUrl, alt: addition.media.subject, credit: addition.media.credit, license: addition.media.license, sourceUrl: addition.media.sourceUrl };
  const { media, ...record } = addition;
  const fullRecord = { ...record, image, gallery: [image, image], imageVerified: true };
  const existing = site.onsens.findIndex((item) => item.slug === record.slug);
  if (existing === -1) site.onsens.push(fullRecord); else site.onsens[existing] = fullRecord;
  const asset = { id: `${record.slug}-hero`, onsenSlug: record.slug, role: 'hero', status: 'approved', subject: media.subject, sourceUrl: media.sourceUrl, license: media.license, credit: media.credit, reviewedAt: verifiedAt, note: media.note, deliveryUrl: media.deliveryUrl };
  const assetIndex = manifest.assets.findIndex((item) => item.onsenSlug === record.slug && item.role === 'hero');
  if (assetIndex === -1) manifest.assets.push(asset); else manifest.assets[assetIndex] = asset;
}
site.onsens.sort((left, right) => left.prefecture.localeCompare(right.prefecture, 'ja') || left.name.localeCompare(right.name, 'ja'));
manifest.lastReviewed = verifiedAt;
write('data/directory-site.json', site);
write('data/onsen-image-manifest.json', manifest);
console.log(`Added or updated ${additions.length} Tokyo day-trip records.`);
