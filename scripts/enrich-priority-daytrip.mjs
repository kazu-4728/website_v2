import fs from 'node:fs';

const path = new URL('../data/directory-site.json', import.meta.url);
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const mapUrl = (query) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
const verifiedAt = '2026-08-17';

const updates = {
  'maeno-hara-onsen': {
    summary: '板橋区の前野町にある日帰り温浴施設です。露天風呂、岩盤処、食事処を備え、午前から夜まで一日の予定に合わせて立ち寄れます。',
    hours: '9:00〜24:00（最終入館 23:00）',
    closingNote: '年1〜2回、設備点検による休館あり。おむつ・紙パンツ着用の方は浴室を利用できません。',
    feeNote: '入館料は平日大人970円、土日祝1,300円。岩盤浴は別料金。',
    accessNote: '東京都板橋区前野町3-41-1。',
    bookingNote: '貸切温泉・各種サービスの利用条件は公式案内で確認。',
    highlights: ['露天風呂', '岩盤浴', '食事処', '都内で長時間滞在'],
    officialInfoUrl: 'https://www.sayanoyudokoro.co.jp/guide',
  },
  'jindaiji-yumorinosato': {
    summary: '深大寺近くの天然温泉施設です。周辺の散策や深大寺そばと組み合わせて、都内で半日を過ごす日帰りプランを組み立てやすい立地です。',
    hours: '10:00〜22:00（最終受付は公式案内で確認）',
    closingNote: '営業日・入館条件は変動するため、出発前に公式サイトのお知らせを確認してください。',
    feeNote: '時間制を含む料金体系は公式案内で確認。',
    accessNote: '東京都調布市深大寺元町。調布駅・武蔵境駅方面からの送迎案内は公式サイトで確認。',
    bookingNote: '日帰り利用の受付条件は公式案内で確認。',
    highlights: ['深大寺散策', '黒湯', '送迎案内あり', '日帰り温泉'],
    officialInfoUrl: 'https://yumorinosato.com/',
  },
  'tam境-morinoirodori': {
    summary: '町田市小山ヶ丘の天然温泉施設です。源泉かけ流しの露天風呂、サウナ、食事処を備え、車でも公共交通でも立ち寄りやすい日帰り先です。',
    hours: '平日 9:00〜24:00、土日祝 7:00〜24:00（最終受付 23:00）',
    closingNote: '3・6・9・12月の第2火曜日が休館。',
    feeNote: '入館料・各種料金は公式のご利用案内で確認。',
    accessNote: '東京都町田市小山ヶ丘1-11-5。京王相模原線「多摩境」駅から徒歩約22分、バス利用可。',
    bookingNote: 'イベント・館内サービスは公式案内で確認。',
    highlights: ['源泉かけ流し露天風呂', 'オートロウリュ', 'よもぎ泥塩サウナ', '食事処'],
    officialInfoUrl: 'https://morinoirodori.com/guide/',
  },
  'toshimaen-niwanoyu': {
    summary: '練馬区向山にある、庭園を望む日帰り温浴施設です。天然温泉に加え、バーデゾーン、サウナ、岩盤浴、食事処を備え、静かに長く過ごしたい日に向きます。',
    hours: '10:00〜23:00（最終受付 22:00）',
    closingNote: '営業日・年齢条件・各ゾーンの利用条件は公式案内で確認。',
    feeNote: '入館料は料金・営業案内で確認。',
    accessNote: '東京都練馬区向山3-25-1。駐車場はありません。公共交通機関の利用が案内されています。',
    bookingNote: '予約・利用区分は公式案内で確認。',
    highlights: ['日本庭園', '天然温泉', 'バーデゾーン', 'サウナ・岩盤浴'],
    officialInfoUrl: 'https://www.seibu-leisure.co.jp/niwanoyu/',
  },
  'heiwajima-onsen': {
    summary: '大田区平和島の24時間営業の天然温泉施設です。深夜・早朝の利用、羽田空港前後の休憩、サウナや岩盤浴を組み合わせた長時間滞在に対応しています。',
    hours: '24時間営業（浴室・サウナ・館内施設ごとに利用時間あり）',
    closingNote: '定期休館・浴室清掃時間があるため、公式サイトの最新案内を確認してください。',
    feeNote: '入館料・深夜料金・岩盤浴料金は公式料金ページで確認。',
    accessNote: '東京都大田区平和島1-1-1 ビッグファン平和島2F。平和島駅からワンコインバス約3分、大森駅から約10分。',
    bookingNote: '温泉のみの利用は予約不要。深夜送迎バスは予約案内を確認。',
    highlights: ['24時間営業', '天然温泉', 'サウナ', '羽田空港アクセス', 'リラックスラウンジ'],
    officialInfoUrl: 'https://www.heiwajima-onsen.jp/',
  },
  'musashikoyama-shimizuyu': {
    summary: '武蔵小山の温泉銭湯です。黒湯と源泉かけ流しの黄金の湯という二種類の天然温泉を、銭湯料金で楽しめることが大きな特徴です。',
    hours: '平日・土曜 12:00〜24:00、日曜 8:00〜24:00、祝日 12:00〜24:00',
    closingNote: '平日月曜が定休日。祝日の月曜は営業。',
    feeNote: '大人550円、中学生500円、子供200円。サウナ・女性専用岩盤浴は別料金。',
    accessNote: '東京都品川区小山3-9-1。駐車場10台（2時間無料）。',
    bookingNote: '銭湯・岩盤浴・サウナの利用条件は公式案内で確認。',
    highlights: ['黒湯', '黄金の湯', '源泉かけ流し', '温泉銭湯'],
    officialInfoUrl: 'https://www.shimizuyu.com/',
  },
  'spa-laqua': {
    summary: '東京ドームシティ内の天然温泉スパです。都心での仕事帰り、イベント前後、深夜までの滞在など、公共交通で組み立てやすい日帰り利用に向きます。',
    hours: '11:00〜翌朝9:00（最終入館 翌朝8:00）',
    closingNote: '2026年10月5日〜9日は休館予定。6〜17歳は保護者同伴で18:00まで、0〜5歳は入館不可。',
    feeNote: '大人入館料は日別の変動制で3,500円〜。19時以降はナイト料金の設定あり。',
    accessNote: '東京ドームシティ内。公共交通でアクセスしやすい都心型スパです。',
    bookingNote: '日帰り利用は予約不要。ヒーリング バーデは別料金・年齢条件あり。',
    highlights: ['天然温泉', '深夜・早朝利用', 'サウナ', 'リラクゼーション', '都心アクセス'],
    officialInfoUrl: 'https://www.laqua.jp/spa/information/',
  },
  'otaniyuta-myogin': {
    summary: '足立区大谷田の天然温泉施設です。濃い塩分を含む源泉、露天風呂、サウナを備え、水元公園・亀有周辺と合わせた日帰りに向きます。',
    hours: '9:00〜23:00（最終入館 22:30）',
    closingNote: '毎月第3火曜が休館。祝日の場合は翌日。',
    feeNote: '日帰り入浴料金は公式料金ページで確認。',
    accessNote: '東京都足立区大谷田1-18-1。亀有駅からタクシー約5分、無料駐車場90台。',
    bookingNote: '混雑状況・臨時メンテナンスは公式のお知らせを確認。',
    highlights: ['濃塩源泉', '露天風呂', 'オートロウリュ', '無料駐車場'],
    officialInfoUrl: 'https://dormy-hotels.com/spa/myoujin/',
  },
  'ofuro-no-osama-oimachi': {
    summary: '大井町駅近くの温浴施設です。朝風呂から深夜滞在まで対応し、駅から徒歩数分で寄れるため、仕事帰りや乗り換え前後の短時間利用にも向きます。',
    hours: '9:30〜翌朝8:30（最終受付 翌7:30）。朝風呂は6:30〜8:30。',
    closingNote: '2:00〜6:30は清掃のため入浴不可。1:00〜6:30は入館不可。',
    feeNote: '通常入館料は平日大人1,500円、土日祝1,950円。朝風呂料金・深夜料金は別設定。',
    accessNote: '東京都品川区大井1-50-5。JR大井町駅から徒歩約3分、東急・りんかい線大井町駅から徒歩約2分。',
    bookingNote: '岩盤浴・館内サービスの利用条件は公式案内で確認。',
    highlights: ['駅徒歩約2〜3分', '朝風呂', '深夜滞在', 'ロウリュ体験'],
    officialInfoUrl: 'https://www.ousama2603.com/ooimachi/',
  },
  'kodai-no-yu': {
    summary: '葛飾区の温浴施設です。広い館内と駐車場を備え、車での立ち寄りや、入浴後に館内でゆっくり休みたい日に向きます。',
    hours: '10:00〜23:00（最終入館 21:30）',
    closingNote: '年中無休。ただし臨時の営業変更は公式案内を確認。',
    feeNote: '入館料・各種サービス料金は公式案内で確認。',
    accessNote: '東京都葛飾区。駐車場450台。',
    bookingNote: '利用条件・館内サービスは公式案内で確認。',
    highlights: ['駐車場450台', '広い館内', '日帰り温浴', '年中無休'],
    officialInfoUrl: 'https://kodainoyu.jp/',
  },
  'tokyo-somei-sakura': {
    summary: '駒込の住宅地にある日帰り温浴施設です。地下1,800mから湧出する天然温泉と食事処を備え、都心で落ち着いて過ごしたい日の選択肢になります。',
    hours: '営業時間・最終入館は公式の営業時間・料金ページで確認。',
    closingNote: '最新の営業状況とキャンペーンは公式のお知らせを確認。',
    feeNote: '入館料・各種プランは公式の営業時間・料金ページで確認。',
    accessNote: '東京都豊島区駒込5-4-24。',
    bookingNote: '利用条件・レストラン利用条件は公式案内で確認。',
    highlights: ['天然温泉', '駒込', '食事処', '都心で静かに滞在'],
    officialInfoUrl: 'https://tokyosomeionsensakura.com/plan/',
  },
  'takaido-utsukushinoyu': {
    summary: '高井戸駅近くの天然温泉施設です。露天風呂に加え、土日祝には25mプールも利用できるため、入浴と運動を一緒に楽しみたい日に向きます。',
    hours: '9:30〜23:30（最終受付 23:00）',
    closingNote: '利用時間は一般利用で5時間まで。年齢・プール利用条件は公式案内を確認。',
    feeNote: '一般利用は平日大人1,100円、土日祝1,300円。22時以降は深夜料金あり。',
    accessNote: '東京都杉並区高井戸西2-3-45。高井戸駅から徒歩約2分。',
    bookingNote: '入浴・プールの利用条件、タトゥー等の入館制限は公式案内で確認。',
    highlights: ['駅徒歩約2分', '露天風呂', '土日祝プール利用可', '深夜料金設定'],
    officialInfoUrl: 'https://utsukushi-yu.com/price.html',
  },
  'togoshiginza-onsen': {
    summary: '戸越銀座商店街に近い温泉銭湯です。戸越・戸越銀座・戸越公園の各駅から徒歩圏で、商店街散策と組み合わせて気軽に立ち寄れます。',
    hours: '月〜木・土 15:00〜25:00、日祝 8:00〜12:00／15:00〜25:00',
    closingNote: '金曜定休。臨時営業変更は施設の案内を確認。',
    feeNote: '大人600円、中学生500円、小学生200円、未就学児100円。サウナは入浴料込み750円。',
    accessNote: '東京都品川区戸越2-1-6。戸越駅徒歩3分、戸越銀座駅徒歩5分、戸越公園駅徒歩7分。',
    bookingNote: '温泉銭湯としての利用条件は施設の公式案内で確認。',
    highlights: ['温泉銭湯', '商店街散策', '日祝朝湯', '駅徒歩圏'],
    officialInfoUrl: 'https://shinagawa1010.jp/list/togoshiginza/',
  },
};

for (const onsen of data.onsens) {
  if (updates[onsen.slug]) {
    const info = updates[onsen.slug];
    onsen.dayTrip = { ...info, verifiedAt };
    onsen.imageVerified = false;
    onsen.verifiedAt = verifiedAt;
    onsen.facilities = [
      { name: `${onsen.name}の料金・営業案内`, kind: '日帰り利用', url: info.officialInfoUrl, mapUrl: onsen.mapUrl || mapUrl(`${onsen.name} ${onsen.prefecture}`) },
      { name: `${onsen.name}の公式サイト`, kind: '公式案内', url: onsen.officialUrl, mapUrl: onsen.mapUrl || mapUrl(`${onsen.name} ${onsen.prefecture}`) },
    ];
    onsen.tags = [...new Set(onsen.tags)];
  }
}

fs.writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Added detailed day-trip information to ${Object.keys(updates).length} records.`);
