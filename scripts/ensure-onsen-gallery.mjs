import fs from 'node:fs';
const dataPath = new URL('../data/directory-site.json', import.meta.url);
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
for (const onsen of data.onsens) {
  const images = [...(onsen.gallery ?? [])];
  const areaImages = data.onsens.filter((candidate) => candidate.areaId === onsen.areaId && candidate.slug !== onsen.slug).flatMap((candidate) => candidate.gallery ?? []);
  for (const image of areaImages) {
    if (images.some((item) => item.src === image.src)) continue;
    images.push({ ...image, alt: `${onsen.name}周辺の温泉地・自然風景` });
    if (images.length >= 3) break;
  }
  if (images.length < 2 && data.areas.find((area) => area.id === onsen.areaId)?.image) {
    const areaImage = data.areas.find((area) => area.id === onsen.areaId).image;
    if (!images.some((item) => item.src === areaImage.src)) images.push({ ...areaImage, alt: `${onsen.name}のエリア風景` });
  }
  onsen.gallery = images.slice(0, 3);
  onsen.image = onsen.gallery[0];
}
fs.writeFileSync(dataPath, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Ensured multi-image galleries for ${data.onsens.length} onsens.`);
