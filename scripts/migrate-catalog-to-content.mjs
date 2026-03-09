import fs from 'fs';
import path from 'path';

const root = process.cwd();
const catalogPath = path.join(root, 'data', 'onsen-catalog.json');
const outputDir = path.join(root, 'content', 'onsen');
const indexPath = path.join(outputDir, 'index.json');

const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

function normalizeSpringTypes(entry) {
  if (Array.isArray(entry.onsen?.springTypes) && entry.onsen.springTypes.length > 0) {
    return entry.onsen.springTypes;
  }
  if (typeof entry.onsen?.springQuality === 'string') {
    return entry.onsen.springQuality.split(/[、,／/]/).map((value) => value.trim()).filter(Boolean);
  }
  return ['単純温泉'];
}

function normalizeEffects(entry) {
  if (Array.isArray(entry.onsen?.effects) && entry.onsen.effects.length > 0) {
    return entry.onsen.effects;
  }
  if (Array.isArray(entry.onsen?.efficacy) && entry.onsen.efficacy.length > 0) {
    return entry.onsen.efficacy;
  }
  return ['疲労回復'];
}

function normalizeCharacteristics(entry) {
  if (Array.isArray(entry.onsen?.characteristics) && entry.onsen.characteristics.length > 0) {
    return entry.onsen.characteristics;
  }
  if (Array.isArray(entry.onsen?.features) && entry.onsen.features.length > 0) {
    return entry.onsen.features;
  }
  return [entry.description].filter(Boolean);
}

function minutesFromText(text) {
  if (!text) return undefined;
  const normalized = String(text).replace(/約|およそ|程度/g, '');
  const hourMinute = normalized.match(/(\d+)\s*時間\s*(\d+)\s*分/);
  if (hourMinute) return Number(hourMinute[1]) * 60 + Number(hourMinute[2]);
  const hoursOnly = normalized.match(/(\d+)\s*時間/);
  if (hoursOnly) return Number(hoursOnly[1]) * 60;
  const minutesOnly = normalized.match(/(\d+)\s*分/);
  if (minutesOnly) return Number(minutesOnly[1]);
  return undefined;
}

function buildTravelLeg(textArray) {
  if (!Array.isArray(textArray) || textArray.length === 0) return undefined;
  const description = textArray.join(' / ');
  const time = minutesFromText(description);
  if (!time) {
    return { time: 120, description };
  }
  return { time, description };
}

function parseMarkdownSections(markdown, fallbackTitle) {
  if (!markdown) {
    return [{ title: fallbackTitle, body: ['詳細情報は順次拡充しています。'] }];
  }

  const cleaned = markdown.replace(/\r/g, '').trim();
  const chunks = cleaned.split(/\n(?=##\s+)/).map((chunk) => chunk.trim()).filter(Boolean);
  if (chunks.length === 0) {
    return [{ title: fallbackTitle, body: cleaned.split(/\n\n+/).map((value) => value.replace(/^#+\s*/, '').trim()).filter(Boolean) }];
  }

  return chunks.map((chunk, index) => {
    const lines = chunk.split('\n').map((line) => line.trim()).filter(Boolean);
    const rawTitle = lines[0]?.replace(/^#+\s*/, '') || `${fallbackTitle} ${index + 1}`;
    const body = lines.slice(1).join('\n').split(/\n\n+/).map((value) => value.replace(/^#+\s*/, '').trim()).filter(Boolean);
    return {
      title: rawTitle,
      body: body.length > 0 ? body : ['現地での体験価値を掘り下げた紹介を準備中です。'],
    };
  });
}

function buildSeasonalNotes(entry) {
  const highlights = Array.isArray(entry.content?.highlights) ? entry.content.highlights : [];
  return [
    { season: '春', title: '新緑の季節', description: highlights[0] ? `${highlights[0]}を軸に、軽やかな散策と湯浴みを組み合わせやすい季節です。` : 'やわらかな景色のなかで、温泉街や周辺散策を楽しみやすい季節です。' },
    { season: '夏', title: '高原や渓谷が気持ちいい時期', description: entry.description || '暑い時期でも朝晩の涼しさや水辺の空気が心地よく、滞在の印象が変わります。' },
    { season: '秋', title: '紅葉と湯けむりの相性', description: highlights[1] ? `${highlights[1]}と紅葉を合わせて楽しみたい時期です。` : '色づく景色と湯けむりのコントラストが印象に残りやすい季節です。' },
    { season: '冬', title: '湯の力を感じやすい季節', description: '外気とのコントラストで温泉の心地よさがより強く感じられ、写真映えもしやすくなります。' },
  ];
}

function buildModelCourse(entry) {
  const facilities = entry.accommodation?.dayTripFacilities || [];
  const highlights = entry.content?.highlights || [];
  return [
    `到着後は ${highlights[0] || entry.name} 周辺を歩いて、温泉地全体の空気感をつかむ。`,
    `湯上がりは ${facilities[0] || '日帰り入浴施設'} や街歩きで、その土地らしい過ごし方を味わう。`,
    `${highlights[1] || entry.name} を組み合わせて、写真と温泉の両方が印象に残る一日に仕上げる。`,
  ];
}

function normalizeNearestStation(entry) {
  if (entry.access?.nearestStation) {
    return entry.access.nearestStation;
  }

  const train = Array.isArray(entry.access?.train) ? entry.access.train[0] : undefined;
  if (!train) return undefined;

  const match = String(train).match(/(.+?)\s+(.+?駅)(?:から(.+))?$/);
  return {
    name: match?.[2] || String(train),
    line: match?.[1] || '要確認',
    busTime: minutesFromText(match?.[3]),
  };
}

function normalizePrefecture(entry) {
  return entry.region?.prefecture || entry.location || '要確認';
}

function normalizeArea(entry) {
  if (typeof entry.region === 'string') return entry.region;
  return entry.region?.area || entry.location || entry.name;
}

function toDetail(entry) {
  const shortDescription = entry.content?.shortDescription || entry.description || `${entry.name}の紹介文を整備中です。`;
  const longDescription = entry.content?.longDescription || shortDescription;
  const highlights = Array.isArray(entry.content?.highlights) && entry.content.highlights.length >= 3
    ? entry.content.highlights
    : [
        ...(entry.content?.highlights || []),
        ...(entry.accommodation?.features || []),
        ...(entry.onsen?.features || []),
      ].filter(Boolean).slice(0, 3);

  const finalHighlights = highlights.length >= 3 ? highlights : [
    shortDescription,
    `${entry.name}らしい湯と景色を一緒に味わえる温泉地です。`,
    '日帰りでも宿泊でも旅を組み立てやすい温泉地です。',
  ];

  return {
    identity: {
      slug: entry.slug,
      name: entry.name,
      nameEn: entry.nameEn || entry.slug,
      prefecture: normalizePrefecture(entry),
      area: normalizeArea(entry),
    },
    summary: {
      catchcopy: entry.description || shortDescription,
      lead: shortDescription,
      shortDescription,
    },
    highlights: finalHighlights,
    spring: {
      springTypes: normalizeSpringTypes(entry),
      ph: entry.onsen?.ph,
      temperature: entry.onsen?.temperature,
      flowRate: entry.onsen?.flowRate,
      effects: normalizeEffects(entry),
      characteristics: normalizeCharacteristics(entry),
      waterQuality: entry.onsen?.waterQuality || entry.onsen?.color,
    },
    access: {
      nearestStation: normalizeNearestStation(entry),
      fromTokyo: {
        byTrain: entry.access?.fromTokyo?.byTrain || buildTravelLeg(entry.access?.train),
        byCar: entry.access?.fromTokyo?.byCar || buildTravelLeg(entry.access?.car),
        byBus: entry.access?.fromTokyo?.byBus || buildTravelLeg(entry.access?.bus),
      },
      parking: { available: true, notes: '現地施設ごとに要確認' },
    },
    stay: {
      dayTripAvailable: Boolean(entry.accommodation?.dayTripAvailable),
      dayTripFacilities: entry.accommodation?.dayTripFacilities || [],
      features: entry.accommodation?.features || [],
      style: `${entry.name}は、${entry.description || 'その土地らしい滞在体験'}を楽しみたい旅に向いています。`,
      bestFor: (entry.accommodation?.features || entry.content?.highlights || ['温泉旅']).slice(0, 3),
    },
    story: {
      intro: shortDescription,
      sections: parseMarkdownSections(longDescription, `${entry.name}の魅力`),
      seasonalNotes: buildSeasonalNotes(entry),
      modelCourse: buildModelCourse(entry),
    },
    nearby: (entry.content?.highlights || []).map((item) => ({
      name: item,
      type: 'highlight',
      description: `${entry.name}と合わせて体験価値を高めやすい立ち寄りポイントです。`,
    })).slice(0, 4),
    seoTags: entry.seoTags || [entry.name, normalizePrefecture(entry)],
  };
}

fs.mkdirSync(outputDir, { recursive: true });

const slugs = Object.values(catalog).map((entry) => entry.slug);
for (const entry of Object.values(catalog)) {
  const filePath = path.join(outputDir, `${entry.slug}.json`);
  if (fs.existsSync(filePath)) continue;
  fs.writeFileSync(filePath, `${JSON.stringify(toDetail(entry), null, 2)}\n`);
}

const indexPayload = {
  publishedSlugs: slugs,
  featuredSlugs: ['hakone', 'kusatsu', 'kinugawa', 'ikaho', 'nasu', 'manza'].filter((slug) => slugs.includes(slug)),
  comparisonSlugs: ['hakone', 'kusatsu', 'kinugawa', 'ikaho', 'shima', 'manza'].filter((slug) => slugs.includes(slug)),
  highlights: [
    {
      title: '関東の温泉地を広く掲載',
      description: '主要温泉地から日帰りで立ち寄りやすい温泉地まで、関東圏の温泉地を一覧でたどれる構成に拡張しています。',
    },
    {
      title: '温泉地ごとの実写画像を優先',
      description: 'プレースホルダーではなく、その温泉地や周辺景観を写した再利用可能画像を優先して紐づける構成です。',
    },
    {
      title: 'R2 配信へ移行可能',
      description: '画像 manifest は外部 URL と R2 公開 URL の両方に対応し、配信基盤を段階的に切り替えられます。',
    },
  ],
};

fs.writeFileSync(indexPath, `${JSON.stringify(indexPayload, null, 2)}\n`);
console.log(`Generated ${slugs.length} onsen content entries.`);
