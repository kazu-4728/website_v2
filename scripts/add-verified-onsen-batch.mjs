import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
const writeJson = (relativePath, value) => fs.writeFileSync(path.join(root, relativePath), `${JSON.stringify(value, null, 2)}\n`);

const siteData = readJson('data/directory-site.json');
const imageManifest = readJson('data/onsen-image-manifest.json');
const candidateRegistry = readJson('data/onsen-coverage-candidates.json');
const reviewedAt = '2026-08-17';

function mapUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function pendingImage(slug, name, sourceUrl) {
  return {
    image: {
      src: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1600&q=80',
      alt: `${name}の画像は確認・差し替え中です`,
      credit: '画像確認中',
      license: '未表示（対象・ライセンス確認中）',
      sourceUrl,
    },
    gallery: [
      {
        src: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1600&q=80',
        alt: `${name}の画像は確認・差し替え中です`,
        credit: '画像確認中',
        license: '未表示（対象・ライセンス確認中）',
        sourceUrl,
      },
      {
        src: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1600&q=80',
        alt: `${name}の画像は確認・差し替え中です`,
        credit: '画像確認中',
        license: '未表示（対象・ライセンス確認中）',
        sourceUrl,
      },
    ],
    imageVerified: false,
    imageManifestEntry: {
      id: `${slug}-hero`,
      onsenSlug: slug,
      role: 'hero',
      status: 'needs-source',
      subject: `${name}の施設外観、温泉地の景観、または日帰り入浴を示す写真`,
      sourceUrl,
      license: '未確認',
      reviewedAt,
      note: '対象との一致と再利用条件を確認できるまで、画像は表示しない。',
    },
  };
}

const additions = [
  {
    slug: 'kitaura-horai',
    name: '北浦宝来温泉',
    officialName: '北浦宝来温泉 つるるんの湯宿 北浦湖畔荘',
    prefecture: '茨城県',
    areaId: 'ibaraki-onsen',
    kind: '温泉地',
    catchcopy: '北浦の朝夕を望み、琥珀色の湯でほどける湖畔の一湯。',
    summary: '北浦湖畔に位置する温泉地です。湖面の朝日・夕日と、琥珀色のメタケイ酸含有泉を楽しめる宿を起点に、鹿島・霞ヶ浦周辺の小旅行を組み立てられます。',
    access: '新鉾田駅からタクシー約15分。車は潮来ICから約25分、土浦北ICから約50分。高速バスは東京駅から鉾田駅行きで山田橋下車後徒歩約5分。',
    springTypes: ['メタケイ酸含有泉'],
    tags: ['湖畔', '琥珀色の湯', '宿泊', '日帰り相談'],
    useCases: ['stay', 'day-trip'],
    officialUrl: 'https://kitaura-houraionsen.com/',
    mapUrl: mapUrl('北浦宝来温泉 つるるんの湯宿 北浦湖畔荘 茨城県行方市山田3969'),
    verifiedAt: reviewedAt,
    features: ['北浦の湖面を眺める立地で、朝日・夕日の景観と温泉を合わせて楽しめます。', 'pH9.0の琥珀色のメタケイ酸含有泉として観光情報で案内されています。', '鹿島・霞ヶ浦周辺を車で巡る宿泊・日帰りの拠点として検討できます。'],
    benefits: [{ label: '湖畔で整える', text: '水辺の景観を楽しむ温泉旅向きです。入浴時の注意や成分の詳細は、施設の掲示と公式案内を確認してください。' }],
    seasonal: [{ season: '春〜秋', text: '北浦の湖畔景観や周辺ドライブと合わせるなら、日照時間の長い季節に計画を立てやすいエリアです。' }, { season: '通年', text: '不定休のため、日帰り利用・宿泊ともに出発前に公式案内で受入状況を確認してください。' }],
    editorialNote: '泉質・営業条件は変更される場合があります。医療的な効果を保証するものではなく、体調に合わせて現地の案内に従ってください。',
    facilities: [
      { name: '北浦湖畔荘 日帰り利用・昼御膳案内', kind: '日帰り利用', url: 'https://kitaura-houraionsen.com/dayuse/', mapUrl: mapUrl('北浦宝来温泉 つるるんの湯宿 北浦湖畔荘 茨城県行方市山田3969') },
      { name: '北浦宝来温泉 観光いばらき案内', kind: '観光案内', url: 'https://www.ibarakiguide.jp/spot.php?mode=detail&code=928', mapUrl: mapUrl('北浦宝来温泉 茨城県行方市山田3969') },
    ],
    dayTrip: {
      summary: '北浦を望む温泉宿です。湖畔の景観と食事を組み合わせた日帰り利用が案内されています。利用可否は予約・混雑状況に左右されるため、必ず公式ページまたは電話で確認してください。',
      hours: '受付時間は10:30〜17:30と観光協会に掲載。日帰り入浴・食事利用の時間は公式案内で確認。',
      closingNote: '不定休。日帰り利用の受入条件や最終受付は、出発前に公式案内で確認。',
      feeNote: '料金・昼御膳との組合せは公式の「日帰り」案内で確認。',
      accessNote: '茨城県行方市山田3969。新鉾田駅からタクシー約15分、潮来ICから車で約25分。',
      bookingNote: '食事付き日帰り利用や貸切半露天風呂の条件は、事前に施設へ確認。',
      highlights: ['北浦湖畔', '琥珀色の湯', '日帰り食事', '車旅'],
      officialInfoUrl: 'https://kitaura-houraionsen.com/dayuse/',
      verifiedAt: reviewedAt,
    },
  },
  {
    slug: 'nokogiriyama-kanaya',
    name: '鋸山金谷温泉',
    officialName: '富津市観光協会・鋸山金谷温泉',
    prefecture: '千葉県',
    areaId: 'chiba-boso',
    kind: '温泉地',
    catchcopy: '鋸山と東京湾の海辺を結ぶ、金谷の湯旅。',
    summary: '富津市金谷、浜金谷駅・金谷港周辺に広がる温泉地です。鋸山観光、東京湾フェリー、海辺の食事と組み合わせ、塩化物泉の湯を日帰りまたは宿泊で楽しめます。',
    access: 'JR浜金谷駅から徒歩約5分。車は館山自動車道木更津南ICから国道127号経由で約30分が目安です。',
    springTypes: ['塩化物泉'],
    tags: ['鋸山', '海辺', '日帰り', 'フェリー'],
    useCases: ['day-trip', 'stay', 'onsen-town'],
    officialUrl: 'https://www.spa.or.jp/search_p/detail_p/?F_ID=120780&pg=40',
    mapUrl: mapUrl('鋸山金谷温泉 千葉県富津市金谷'),
    verifiedAt: reviewedAt,
    features: ['鋸山観光の玄関口・浜金谷にあり、海と山の観光を組み合わせやすい温泉地です。', '日本温泉協会は塩化物泉、JR浜金谷駅から徒歩約5分と案内しています。', '日帰り利用の可否・受付時間は宿ごとに異なるため、公式案内の確認が必要です。'],
    benefits: [{ label: '海と山を一日に', text: '鋸山ロープウェー、金谷港、東京湾フェリーと温泉を組み合わせる日帰り計画に向きます。交通の運行状況と日帰り受入は事前に確認してください。' }],
    seasonal: [{ season: '秋〜冬', text: '空気が澄む時期は、金谷の海辺からの景観と鋸山散策を組み合わせやすい季節です。' }, { season: '通年', text: '日帰り利用や船便、ロープウェー等の運行状況は公式サイトで確認してください。' }],
    editorialNote: '日帰り入浴の時間・料金・混雑時の受入条件は施設によって異なります。温泉地全体の条件として扱わず、各施設の公式案内で確認してください。',
    facilities: [
      { name: 'かぢや旅館 日帰り温泉', kind: '日帰り利用', url: 'https://www.kajiyaryokan.com/', mapUrl: mapUrl('かぢや旅館 千葉県富津市金谷3887') },
      { name: '天然温泉 海辺の湯金谷', kind: '宿泊・温泉', url: 'https://www.umibe-4126.com/', mapUrl: mapUrl('天然温泉 海辺の湯 金谷 千葉県富津市金谷525-17') },
      { name: '富津市観光協会', kind: '観光案内', url: 'https://www.futtsu-kanko.info/', mapUrl: mapUrl('鋸山 金谷 千葉県富津市') },
    ],
    dayTrip: {
      summary: '鋸山観光の後に立ち寄りやすい海辺の温泉地です。かぢや旅館では日帰り温泉を案内していますが、浴場の混雑や季節営業で受入条件が変わるため、当日の利用可否を確認してください。',
      hours: '日帰り入浴の時間は施設により異なります。かぢや旅館は混雑時・週末夕方に時間短縮や入場制限の可能性を案内しています。',
      closingNote: '日帰り入浴は混雑・貸切営業・季節営業等で利用できない場合があります。必ず各施設へ確認。',
      feeNote: 'かぢや旅館は2024年7月以降の日帰り入浴料を800円と案内。最新料金は公式サイトで再確認。',
      accessNote: 'JR浜金谷駅から徒歩約5分。車は木更津南ICから国道127号経由で約30分が目安。',
      bookingNote: '食事付き・日帰り利用は、施設の混雑状況と受入条件を事前確認。',
      highlights: ['鋸山', '東京湾', '日帰り温泉', '浜金谷駅近く'],
      officialInfoUrl: 'https://www.kajiyaryokan.com/',
      verifiedAt: reviewedAt,
    },
  },
  {
    slug: 'shiriyaki',
    name: '尻焼温泉',
    officialName: '六合の里温泉郷組合・尻焼温泉',
    prefecture: '群馬県',
    areaId: 'gunma-meito',
    kind: '温泉地',
    catchcopy: '川そのものが湯になる、六合の自然に抱かれた野趣の湯。',
    summary: '中之条町六合地区、花敷温泉の奥にある温泉地です。川底から湯が湧く「川の湯」が知られ、自然条件を理解したうえで、河原の露天と町営の日帰り施設を使い分けられます。',
    access: 'JR長野原草津口駅からバス約35分＋徒歩約10分が目安。尻焼温泉は花敷温泉から約800m奥に位置します。',
    springTypes: ['硫酸塩泉', '塩化物泉'],
    tags: ['川の湯', '自然露天', '日帰り', '六合'],
    useCases: ['day-trip', 'onsen-town'],
    officialUrl: 'https://nakanojo-kanko.jp/kuni/hotsprings/%E5%B0%BB%E7%84%BC%E6%B8%A9%E6%B3%89/',
    mapUrl: mapUrl('尻焼温泉 群馬県吾妻郡中之条町入山'),
    verifiedAt: reviewedAt,
    features: ['長笹沢川の川底から湧く湯で、川の一部が大きな露天風呂になる自然性の高い温泉地です。', '自然河川のため、増水・水温低下など天候の影響で入浴できない場合があります。', '町営「弁天の湯」は営業時間・料金が明示された日帰り入浴の選択肢です。'],
    benefits: [{ label: '自然条件を読んで訪れる', text: '河原の湯は自然環境の影響を受けます。水着の着用推奨、天候・増水・水温といった現地案内を確認して、無理のない計画にしてください。' }],
    seasonal: [{ season: '夏〜秋', text: '河原の湯を目的にする場合も、急な増水や天候変化に備え、当日の状況確認を優先してください。' }, { season: '通年', text: '町営の弁天の湯は定休日・年末年始休業があるため、公式サイトで確認してください。' }],
    editorialNote: '河原の露天は管理された浴場とは異なります。天候・水位・水温、衛生面、着替え・安全面を含め、現地の案内と自己責任を理解したうえで利用してください。',
    facilities: [
      { name: '尻焼温泉 弁天の湯', kind: '日帰り利用', url: 'https://www.town.nakanojo.gunma.jp/soshiki/12/7682.html', mapUrl: mapUrl('尻焼温泉 弁天の湯 群馬県吾妻郡中之条町入山1573-3') },
      { name: '六合の里温泉郷組合 尻焼温泉案内', kind: '観光案内', url: 'https://nakanojo-kanko.jp/kuni/hotsprings/%E5%B0%BB%E7%84%BC%E6%B8%A9%E6%B3%89/', mapUrl: mapUrl('尻焼温泉 群馬県吾妻郡中之条町入山') },
    ],
    dayTrip: {
      summary: '自然河川の「川の湯」と、町営の「弁天の湯」を選べる温泉地です。確実に日帰り入浴を予定するなら、営業時間・料金が明示された弁天の湯を基準にし、河原の湯は当日の自然条件を見て判断してください。',
      hours: '弁天の湯は12:30〜19:30（最終入館19:00）。川の湯は自然河川のため、利用可能時間を固定できません。',
      closingNote: '弁天の湯は月曜（祝日除く）・年末年始休業。川の湯は増水・水温低下等で入浴できない場合あり。',
      feeNote: '弁天の湯は町外一般500円、町外小学生以下300円（2024年7月1日更新の町公式情報）。利用時間は2時間まで。',
      accessNote: '群馬県吾妻郡中之条町入山。長野原草津口駅からバス約35分＋徒歩約10分が目安。',
      bookingNote: '弁天の湯は通常の予約案内を確認。河原の湯は自然条件優先のため、出発前に観光協会・自治体情報を確認。',
      highlights: ['川の湯', '弁天の湯', '自然露天', '水着推奨'],
      officialInfoUrl: 'https://www.town.nakanojo.gunma.jp/soshiki/12/7682.html',
      verifiedAt: reviewedAt,
    },
  },
  {
    slug: 'yunokoya',
    name: '湯の小屋温泉',
    officialName: 'みなかみ町観光協会・湯ノ小屋温泉',
    prefecture: '群馬県',
    areaId: 'gunma-minakami',
    kind: '温泉地',
    catchcopy: '奥利根の渓流と山里で、静かに湯めぐる秘境の温泉地。',
    summary: 'みなかみ町藤原、木根沢渓流沿いにある温泉地です。奥利根の自然、照葉峡、ダム・湖の景観と合わせ、弱アルカリ性のなめらかな湯と貸切露天を楽しめます。',
    access: 'JR水上駅からバス約50分が目安。車はみなかみ・奥利根方面の道路状況、とくに冬季の規制を確認してください。',
    springTypes: ['単純温泉'],
    tags: ['奥利根', '渓流', '貸切露天', '日帰り'],
    useCases: ['day-trip', 'stay'],
    officialUrl: 'https://gunma-kanko.jp/spots/766',
    mapUrl: mapUrl('湯の小屋温泉 群馬県利根郡みなかみ町藤原'),
    verifiedAt: reviewedAt,
    features: ['木根沢渓流沿いの山里にあり、奥利根の自然に浸る温泉旅を組み立てられます。', '群馬県観光公式サイトでは弱アルカリ性の単純温泉、源泉かけ流し・日帰り温泉ありと案内されています。', '龍洞では18カ所の貸切露天と日帰り利用を公式案内しています。'],
    benefits: [{ label: '渓流と湯めぐり', text: '山あいの移動距離と道路状況を考慮し、露天風呂・渓谷散策・ダム観光を無理なく組み合わせるプランに向きます。' }],
    seasonal: [{ season: '春〜秋', text: '新緑、渓流、照葉峡など自然景観と合わせやすい時期です。道路・散策路の状況を確認してください。' }, { season: '冬', text: '降雪・通行規制があり得るため、車で訪問する場合は道路情報と施設営業を必ず確認してください。' }],
    editorialNote: '山間部の温泉地です。気象・道路・日帰り受入条件は変動するため、公式情報を確認して時間に余裕を持った行程にしてください。',
    facilities: [
      { name: '湯の小屋温泉 龍洞 日帰り温泉', kind: '日帰り利用', url: 'https://www.ryuudou.com/', mapUrl: mapUrl('湯の小屋温泉 龍洞 群馬県利根郡みなかみ町藤原6192') },
      { name: '清流の宿 たむら', kind: '宿泊・温泉', url: 'https://www.yado-tamura.com/', mapUrl: mapUrl('清流の宿 たむら 群馬県利根郡みなかみ町藤原') },
      { name: '群馬県観光公式 湯ノ小屋温泉', kind: '観光案内', url: 'https://gunma-kanko.jp/spots/766', mapUrl: mapUrl('湯の小屋温泉 群馬県利根郡みなかみ町藤原') },
    ],
    dayTrip: {
      summary: '奥利根の山中で、貸切露天の湯めぐりを日帰りでも楽しめる温泉地です。龍洞は18カ所の露天風呂を日帰り利用で案内しています。混雑時は入場制限・早期終了があるため、早めの到着と事前確認が安心です。',
      hours: '龍洞の日帰り入浴は10:00〜18:00。混雑時は入場制限や早期終了の可能性があります。',
      closingNote: '日帰り利用の受付・混雑状況は変動します。道路状況と合わせて当日の公式案内を確認してください。',
      feeNote: '龍洞は大人2,500円、子ども（小学生以下）1,500円と公式案内に掲載。料金は変更される場合があります。',
      accessNote: '群馬県利根郡みなかみ町藤原6192。JR水上駅からバス約50分が目安。',
      bookingNote: '日帰り利用は混雑時の入場制限があり得るため、確実に利用したい場合は電話で事前確認。',
      highlights: ['18種の露天', '貸切露天', '奥利根', '日帰り湯めぐり'],
      officialInfoUrl: 'https://www.ryuudou.com/',
      verifiedAt: reviewedAt,
    },
  },
  {
    slug: 'nikko-onsen',
    name: '日光温泉',
    officialName: '日光温泉旅館協同組合',
    prefecture: '栃木県',
    areaId: 'nikko-nasu',
    kind: '温泉地',
    catchcopy: '世界遺産の門前で、社寺めぐりの余韻を温泉へつなぐ。',
    summary: '日光の社寺周辺に広がる温泉地です。世界遺産の門前町を歩いた後、無色透明の湯を楽しめます。宿泊施設のほか、市営温泉施設やしおの湯など日帰りの選択肢もあります。',
    access: 'JR・東武日光駅から日光山内方面へ。市営温泉保養センターは日光宇都宮道路・日光ICから車で約5分です。',
    springTypes: ['アルカリ性単純温泉'],
    tags: ['世界遺産', '門前町', '日帰り', '社寺散策'],
    useCases: ['day-trip', 'stay', 'onsen-town'],
    officialUrl: 'https://www.nikko-kankou.org/spot/15',
    mapUrl: mapUrl('日光温泉 栃木県日光市'),
    verifiedAt: reviewedAt,
    features: ['日光の社寺周辺に広がり、門前町散策と温泉を一日の行程にまとめやすい温泉地です。', '日光旅ナビは宿・日帰り温泉を案内し、利用条件は施設ごとに異なると明示しています。', '市営温泉保養センター「日光温泉」は日光ICから車で約5分、アルカリ性単純温泉と市公式が案内しています。'],
    benefits: [{ label: '社寺と湯をつなぐ', text: '日光山内の観光は歩行距離が長くなりやすいため、入浴施設を行程の終盤に置くと休憩を組み込みやすくなります。' }],
    seasonal: [{ season: '春・秋', text: '社寺と山の景観を楽しむ時期は混雑しやすいため、日帰り温泉の受入・交通情報を早めに確認してください。' }, { season: '通年', text: '冬季は路面状況に注意し、施設ごとの営業時間・休館日を公式情報で確認してください。' }],
    editorialNote: '日帰り入浴を受け入れる宿は状況により変動します。宿泊施設へ直接問い合わせるか、日光旅ナビの関連資料・施設公式サイトを確認してください。',
    facilities: [
      { name: '温泉保養センター 日光温泉', kind: '日帰り利用', url: 'https://www.city.nikko.lg.jp/soshiki/6/1025/5/1089.html', mapUrl: mapUrl('温泉保養センター 日光温泉 栃木県日光市七里680-1') },
      { name: '日光和の代温泉 やしおの湯', kind: '日帰り利用', url: 'https://www.yashionoyu.com/', mapUrl: mapUrl('日光和の代温泉 やしおの湯 栃木県日光市') },
      { name: '日光温泉旅館協同組合', kind: '宿泊案内', url: 'https://www.nikko-spa.org/', mapUrl: mapUrl('日光温泉 栃木県日光市') },
    ],
    dayTrip: {
      summary: '日光山内の社寺散策と組み合わせやすい温泉地です。確実に日帰りで利用するなら、市営の温泉保養センター「日光温泉」またはやしおの湯を軸にし、宿の日帰り利用は施設ごとの受入状況を確認してください。',
      hours: '温泉保養センター「日光温泉」は10:00〜21:00（入館20:30まで）。1月2・3日は12:00〜17:00。',
      closingNote: '温泉保養センターは火曜（祝日の場合は翌水曜）と年末年始12月30日〜1月1日が休業。宿の日帰り受入は施設により変動。',
      feeNote: '市外の中学生以上64歳以下は1,000円など、2026年4月1日改定の市公式料金が案内されています。年齢・市民区分で異なるため公式表を確認。',
      accessNote: '温泉保養センターは栃木県日光市七里680-1、日光ICから車で約5分。',
      bookingNote: '市営施設以外の宿の日帰り利用は、出発前に施設へ直接確認。',
      highlights: ['日光の社寺', '門前町', '市営温泉', '日帰り'],
      officialInfoUrl: 'https://www.city.nikko.lg.jp/soshiki/6/1025/5/1089.html',
      verifiedAt: reviewedAt,
    },
  },
];

for (const addition of additions) {
  const { imageManifestEntry, ...onsen } = addition;
  const pending = pendingImage(onsen.slug, onsen.name, onsen.officialUrl);
  const record = { ...onsen, image: pending.image, gallery: pending.gallery, imageVerified: pending.imageVerified };
  const index = siteData.onsens.findIndex((item) => item.slug === record.slug);
  if (index === -1) siteData.onsens.push(record);
  else siteData.onsens[index] = record;

  const manifestIndex = imageManifest.assets.findIndex((asset) => asset.onsenSlug === record.slug && asset.role === 'hero');
  const manifestEntry = pending.imageManifestEntry;
  if (manifestIndex === -1) imageManifest.assets.push(manifestEntry);
  else imageManifest.assets[manifestIndex] = manifestEntry;
}

siteData.onsens.sort((a, b) => a.prefecture.localeCompare(b.prefecture, 'ja') || a.name.localeCompare(b.name, 'ja'));
const resolvedIds = new Set(additions.map((item) => ({ 'kitaura-horai': 'ibaraki-kitaura-horai', 'nokogiriyama-kanaya': 'chiba-nokogiriyama-kanaya', shiriyaki: 'gunma-shiriyaki', yunokoya: 'gunma-yunokoya', 'nikko-onsen': 'tochigi-nikko-onsen' }[item.slug])));
candidateRegistry.candidates = candidateRegistry.candidates.filter((candidate) => !resolvedIds.has(candidate.id));
candidateRegistry.lastReviewed = reviewedAt;
candidateRegistry.resolved = [...(candidateRegistry.resolved ?? []), ...additions.map((item) => ({ name: item.name, slug: item.slug, resolvedAt: reviewedAt, note: '公式・自治体・観光協会の情報を照合して掲載済み温泉地として登録。' }))];
imageManifest.lastReviewed = reviewedAt;

writeJson('data/directory-site.json', siteData);
writeJson('data/onsen-image-manifest.json', imageManifest);
writeJson('data/onsen-coverage-candidates.json', candidateRegistry);
console.log(`Added or refreshed ${additions.length} onsen records and matching pending image-manifest entries.`);
