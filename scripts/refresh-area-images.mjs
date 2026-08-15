import fs from 'node:fs';
const dataPath = new URL('../data/directory-site.json', import.meta.url);
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
for (const area of data.areas) {
  const representative = data.onsens.find((onsen) => onsen.areaId === area.id && onsen.image?.src);
  if (representative) {
    area.image = { ...representative.image, alt: `${area.name}の温泉風景` };
  }
}
fs.writeFileSync(dataPath, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Refreshed representative images for ${data.areas.length} areas.`);
