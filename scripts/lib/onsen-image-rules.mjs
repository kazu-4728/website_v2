const BATH_PATTERNS = [
  /open-air bath/i,
  /outdoor bath/i,
  /public bath/i,
  /bathhouse/i,
  /foot bath/i,
  /rotenburo/i,
  /rotemburo/i,
  /yubatake/i,
  /spa hotel/i,
  /露天風呂/,
  /露天/,
  /共同浴場/,
  /浴場/,
  /浴槽/,
  /湯船/,
  /足湯/,
  /湯畑/,
  /源泉/,
  /外湯/,
  /内湯/,
  /の湯/,
];

const AREA_PATTERNS = [
  /(?:^|[\s_-])onsen(?:$|[\s_-])/i,
  /hot spring/i,
  /温泉/,
  /湯本/,
  /湯元/,
  /温泉街/,
  /源泉/,
];

const NEGATIVE_PATTERNS = [
  /train/i,
  /railway/i,
  /station/i,
  /tram/i,
  /shrine/i,
  /temple/i,
  /garden/i,
  /parade/i,
  /disney/i,
  /tea/i,
  /cup/i,
  /coast/i,
  /coastline/i,
  /beach/i,
  /lake/i,
  /mountain/i,
  /forest/i,
  /waterfall/i,
  /falls/i,
  /sea world/i,
  /aquarium/i,
  /museum/i,
  /park/i,
  /torii/i,
  /dam/i,
  /bridge/i,
  /ropeway/i,
  /cable car/i,
  /bus/i,
  /downtown/i,
  /cityscape/i,
  /street/i,
  /festival/i,
  /market/i,
  /food/i,
  /meal/i,
  /china/i,
  /guangdong/i,
  /turkey/i,
  /pamukkale/i,
  /神社/,
  /寺/,
  /庭園/,
  /海/,
  /湖/,
  /山/,
  /滝/,
  /列車/,
  /駅/,
  /水族館/,
  /美術館/,
  /神磯/,
  /公園/,
  /海岸/,
  /朝市/,
  /鳥居/,
];

function normalizeText(parts) {
  return parts
    .filter(Boolean)
    .join(' ')
    .replace(/[_/.-]+/g, ' ')
    .toLowerCase();
}

function hasPattern(patterns, text) {
  return patterns.some((pattern) => pattern.test(text));
}

export function classifyOnsenImage(parts) {
  const text = normalizeText(parts);
  const hasNegative = hasPattern(NEGATIVE_PATTERNS, text);
  const isBath = hasPattern(BATH_PATTERNS, text);
  const isArea = hasPattern(AREA_PATTERNS, text);

  if (hasNegative && !isBath) {
    return { accepted: false, focus: 'rejected', reason: 'negative-keyword' };
  }

  if (isBath) {
    return { accepted: true, focus: 'bath', reason: 'bath-keyword' };
  }

  if (isArea) {
    return { accepted: true, focus: 'onsen-area', reason: 'onsen-keyword' };
  }

  return { accepted: false, focus: 'rejected', reason: 'missing-onsen-keyword' };
}

export function focusLabel(focus) {
  if (focus === 'bath') return '湯船・浴場写真';
  if (focus === 'onsen-area') return '温泉地の実景';
  return '温泉地周辺の実景';
}
