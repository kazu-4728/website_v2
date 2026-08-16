import fs from 'node:fs';

const source = JSON.parse(fs.readFileSync(new URL('../docs/sources/japan-prefectures.geojson', import.meta.url), 'utf8'));
const wanted = ['群馬県', '栃木県', '茨城県', '埼玉県', '東京都', '千葉県', '神奈川県'];
const extent = { minX: 138.25, maxX: 141.05, minY: 34.85, maxY: 37.3 };
const width = 760;
const height = 560;
const pad = 26;

function collectRings(geometry) {
  if (geometry.type === 'Polygon') return geometry.coordinates;
  if (geometry.type === 'MultiPolygon') return geometry.coordinates.flat();
  return [];
}
function inExtent(point) {
  return point[0] >= extent.minX && point[0] <= extent.maxX && point[1] >= extent.minY && point[1] <= extent.maxY;
}
const selected = source.features.filter((feature) => wanted.includes(feature.properties.nam_ja)).map((feature) => ({
  prefecture: feature.properties.nam_ja,
  id: feature.properties.id,
  rings: collectRings(feature.geometry).filter((ring) => ring.some(inExtent)),
}));
const points = selected.flatMap((feature) => feature.rings).flat().filter(inExtent);
const minX = Math.min(...points.map((p) => p[0]));
const maxX = Math.max(...points.map((p) => p[0]));
const minY = Math.min(...points.map((p) => p[1]));
const maxY = Math.max(...points.map((p) => p[1]));
const scale = Math.min((width - pad * 2) / (maxX - minX), (height - pad * 2) / (maxY - minY));
function project([lon, lat]) {
  return [pad + (lon - minX) * scale, height - pad - (lat - minY) * scale];
}
function pathForRings(rings) {
  return rings.map((ring) => ring.map((point, index) => `${index === 0 ? 'M' : 'L'}${project(point).map((n) => n.toFixed(2)).join(' ')}`).join(' ') + ' Z').join(' ');
}
function labelForRings(rings) {
  const pts = rings.flat();
  const projected = pts.map(project);
  return {
    x: Number((projected.reduce((sum, point) => sum + point[0], 0) / projected.length).toFixed(2)),
    y: Number((projected.reduce((sum, point) => sum + point[1], 0) / projected.length).toFixed(2)),
  };
}
const output = `export interface KantoPrefecturePath { prefecture: string; id: number; path: string; labelX: number; labelY: number; }\n\nexport const kantoPrefecturePaths: KantoPrefecturePath[] = ${JSON.stringify(selected.map((feature) => ({ prefecture: feature.prefecture, id: feature.id, path: pathForRings(feature.rings), ...{ labelX: labelForRings(feature.rings).x, labelY: labelForRings(feature.rings).y } })), null, 2)};\n\nexport const kantoMapViewBox = '0 0 ${width} ${height}';\n`;
fs.writeFileSync(new URL('../app/lib/kanto-map-data.ts', import.meta.url), output);
console.log(`Generated ${selected.length} prefecture paths from GeoJSON.`);
