import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sitePath = path.join(root, 'data/directory-site.json');
const guidePath = path.join(root, 'data/onsen-detailed-guides.json');
const site = JSON.parse(fs.readFileSync(sitePath, 'utf8'));

function text(value, fallback) {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function phrase(value, fallback) {
  return text(value, fallback).replace(/[。！？]+$/u, '').trim();
}

function sentence(value, fallback) {
  return `${phrase(value, fallback)}。`;
}

function buildGuide(record) {
  const features = (record.features ?? []).filter(Boolean);
  const primaryFeature = phrase(features[0], `${record.name}ならではの過ごし方`);
  const secondaryFeature = phrase(features[1], `${record.springTypes?.join('・') || '泉質'}の特徴`);
  const thirdFeature = phrase(features[2], '周辺と組み合わせる過ごし方');
  const benefit = phrase(record.benefits?.[0]?.text, '泉質や浴槽の特徴は、公式案内と現地表示で確認してください');
  const access = phrase(record.access, 'アクセスは公式案内と地図で確認してください');
  const editorial = phrase(record.editorialNote, '施設ごとの利用条件、現地の掲示、公式案内を確認して行動してください');
  const facilityNames = (record.facilities ?? []).slice(0, 2).map((facility) => facility.name).join('、');
  const dayTrip = record.dayTrip;
  const seasonalEntries = (record.seasonal ?? []).map((item) => `${item.season}は${phrase(item.text, '現地案内を確認してください')}`).join('。');

  return {
    summary: `${sentence(record.summary, `${record.name}は${record.prefecture}にある${record.kind}です`)} ${sentence(primaryFeature, '')} ${sentence(secondaryFeature, '')} 訪問前には公式案内と現地情報を照合し、移動時間と入浴条件に余裕を持たせると計画しやすくなります。`,
    planning: `${sentence(access, '')} 公式サイトの更新日と施設案内を確認し、${facilityNames ? `${facilityNames}などの導線` : '温泉地の公式導線'}を出発前に開いておくと安心です。`,
    onArrival: `${sentence(access, '')} 到着後は、受付や現地掲示で当日の利用条件を確認してから行動してください。${dayTrip ? `日帰り利用については、${sentence(dayTrip.closingNote, '当日の公式案内を確認してください')}` : '宿泊・日帰りの利用可否は、各施設の公式案内を確認してください。'}`,
    enjoyment: `${sentence(primaryFeature, '')} ${sentence(secondaryFeature, '')} ${sentence(thirdFeature, '')}滞在時間に合わせて、気になる要素を無理なく組み合わせてください。入浴体験については、${sentence(benefit, '')}`,
    caution: `${sentence(editorial, '')} 営業時間、休館日、料金、送迎、予約、道路・運行状況などは変わる場合があるため、掲載確認日だけに依存せず、訪問直前に公式情報を確認してください。`,
    seasonalGuide: seasonalEntries ? `${seasonalEntries}。季節の情報は年により変動するため、見頃や交通状況は公式観光情報で再確認してください。` : '季節を問わず、天候・交通・営業状況の影響を受ける場合があります。訪問日が近づいたら、公式サイトと現地の案内で最新状況を確認してください。',
  };
}

const guides = Object.fromEntries(site.onsens.map((record) => [record.slug, buildGuide(record)]));
const output = {
  schemaVersion: 1,
  generatedAt: '2026-08-17',
  source: 'Existing verified site data only. Generated text does not introduce new destination-specific facts.',
  guides,
  errors: {},
};
fs.writeFileSync(guidePath, `${JSON.stringify(output, null, 2)}\n`);
console.log(`Wrote deterministic detailed guides for ${Object.keys(guides).length} onsen records.`);
