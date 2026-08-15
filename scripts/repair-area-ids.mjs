import fs from 'node:fs';
const dataPath = new URL('../data/directory-site.json', import.meta.url);
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const ids = new Set(data.areas.map((area) => area.id));
const byName = new Map(data.areas.map((area) => [area.name, area.id]));
for (const onsen of data.onsens) {
  if (ids.has(onsen.areaId)) continue;
  const area = byName.get(onsen.areaId);
  if (area) onsen.areaId = area;
}
fs.writeFileSync(dataPath, `${JSON.stringify(data, null, 2)}\n`);
console.log('Repaired area IDs for expanded onsen records.');
