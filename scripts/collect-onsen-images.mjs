import fs from 'node:fs';

const dataPath = new URL('../data/directory-site.json', import.meta.url);
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const api = 'https://commons.wikimedia.org/w/api.php';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function request(params) {
  const url = `${api}?${new URLSearchParams({ ...params, format: 'json', origin: '*' })}`;
  const response = await fetch(url, { headers: { 'User-Agent': 'KantoOnsenDirectory/1.0 (https://github.com/kazu-4728/website_v2)' }, signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function findImage(onsen) {
  const terms = [`${onsen.name} 温泉`, `${onsen.name} ${onsen.prefecture} 温泉`, `${onsen.name} onsen`];
  for (const term of terms) {
    const search = await request({ action: 'query', list: 'search', srsearch: term, srnamespace: '6', srlimit: '6' });
    const titles = (search.query?.search ?? []).map((item) => item.title);
    if (!titles.length) continue;
    const info = await request({ action: 'query', titles: titles.join('|'), prop: 'imageinfo', iiprop: 'url|extmetadata', iiurlwidth: '1600' });
    const pages = Object.values(info.query?.pages ?? {});
    const page = pages.find((item) => item.imageinfo?.[0]?.thumburl && /\.(jpe?g|png|webp)$/i.test(item.imageinfo[0].thumburl));
    if (!page) continue;
    const image = page.imageinfo[0];
    const meta = image.extmetadata ?? {};
    const get = (key) => meta[key]?.value ?? '';
    return {
      src: image.thumburl,
      alt: `${onsen.name}の温泉風景`,
      credit: `${get('Artist') || 'Wikimedia Commons'} / Wikimedia Commons`,
      license: get('LicenseShortName') || 'Wikimedia Commons license',
      sourceUrl: image.descriptionurl || image.url,
    };
  }
  return null;
}

let found = 0;
for (const onsen of data.onsens) {
  try {
    const image = await findImage(onsen);
    if (image) {
      onsen.image = image;
      found += 1;
      console.log(`FOUND\t${onsen.slug}\t${image.sourceUrl}`);
    } else {
      console.log(`MISS\t${onsen.slug}`);
    }
  } catch (error) {
    console.log(`ERROR\t${onsen.slug}\t${error instanceof Error ? error.message : String(error)}`);
  }
  await sleep(250);
}
fs.writeFileSync(dataPath, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Updated ${found}/${data.onsens.length} onsen images.`);
