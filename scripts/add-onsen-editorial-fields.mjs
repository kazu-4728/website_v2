import fs from 'node:fs';
const dataPath = new URL('../data/directory-site.json', import.meta.url);
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const springProfiles = {
  '単純温泉': { label: 'やさしい入浴感', text: '成分の刺激が比較的穏やかで、さらりとした湯ざわりを楽しみやすい泉質です。' },
  '塩化物泉': { label: '温まりやすさ', text: '塩分を含む泉質で、入浴後も温かさを感じやすいとされます。' },
  '炭酸水素塩泉': { label: 'なめらかな湯ざわり', text: '炭酸水素イオンを含み、肌ざわりのやわらかさを楽しみやすい泉質です。' },
  '硫酸塩泉': { label: 'さっぱりした湯', text: '硫酸イオンを含む泉質で、湯上がりのさっぱりした感覚を楽しめます。' },
  '酸性泉': { label: '個性のある湯', text: '酸性の特徴を持つため、独特の湯ざわりや香りを楽しめます。肌が敏感な方は入浴方法を公式案内で確認してください。' },
  '硫黄泉': { label: '硫黄の香り', text: '硫黄由来の香りや色が特徴です。アクセサリーなどへの影響と入浴上の注意を公式案内で確認してください。' },
  '温泉地の詳細は公式サイトで確認': { label: '現地の分析書を確認', text: '源泉や施設によって泉質が異なる場合があります。現地の温泉分析書と公式案内を訪問前に確認してください。' },
};

const seasonalText = (onsen) => {
  const tags = new Set(onsen.tags);
  if (tags.has('海辺') || tags.has('海景色') || tags.has('朝日') || onsen.prefecture === '千葉県') return [
    { season: '春', text: '花と海風が心地よい季節。海岸線の散策と湯めぐりを組み合わせて。' },
    { season: '夏', text: '海辺の夕景と温泉を楽しむ旅。日差しの強い時間は無理せず休憩を。' },
    { season: '冬', text: '海の幸が豊かな季節。温泉で温まりながら房総・海辺の味覚を。' },
  ];
  if (tags.has('紅葉') || tags.has('森林') || tags.has('渓谷') || tags.has('山旅') || tags.has('自然') || onsen.prefecture === '群馬県' || onsen.prefecture === '栃木県') return [
    { season: '春', text: '芽吹きの山道と渓流を歩いた後に、ゆっくり湯へ。' },
    { season: '秋', text: '紅葉の見頃は公式観光情報で確認し、景色と湯けむりを楽しんで。' },
    { season: '冬', text: '雪見風呂や白い湯けむりが映える季節。道路・運行情報を確認して訪問を。' },
  ];
  if (onsen.prefecture === '東京都') return [
    { season: '春', text: '新緑の奥多摩・島の花景色と一緒に、東京の自然を再発見。' },
    { season: '夏', text: '渓谷や海のアクティビティの後は、水分補給をして湯へ。' },
    { season: '秋', text: '山の色づきと静かな湯を目当てに、混雑と交通情報を確認して。' },
  ];
  return [
    { season: '春', text: '季節の花や新緑をめぐる、軽やかな湯旅に。' },
    { season: '秋', text: '温泉街や周辺の景色が深まる時期。散策と湯をゆっくり楽しんで。' },
    { season: '冬', text: '温泉の魅力が際立つ季節。営業状況と交通情報を確認して訪問を。' },
  ];
};

for (const onsen of data.onsens) {
  const profiles = onsen.springTypes.map((type) => springProfiles[type] ?? springProfiles['温泉地の詳細は公式サイトで確認']);
  const uniqueProfiles = profiles.filter((item, index, list) => list.findIndex((candidate) => candidate.label === item.label) === index);
  onsen.benefits = uniqueProfiles.length ? uniqueProfiles : [springProfiles['温泉地の詳細は公式サイトで確認']];
  onsen.features = [
    `${onsen.name}の${onsen.tags.slice(0, 2).join('と')}を楽しめる温泉地`,
    onsen.summary,
    `公式サイト・地図・施設情報を確認して、自分に合う過ごし方を組み立てやすいエリア`,
  ];
  onsen.seasonal = seasonalText(onsen);
  onsen.editorialNote = '泉質の特徴や入浴体験は一般的な目安です。体調、年齢、持病、妊娠中などの条件により注意点が異なるため、現地の掲示と公式案内を確認してください。';
}
fs.writeFileSync(dataPath, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Added editorial fields to ${data.onsens.length} onsens.`);
