import fs from 'fs';
import path from 'path';
import { z } from 'zod';

const siteSchema = z.object({
  metadata: z.object({ title: z.string(), description: z.string() }),
  navigation: z.array(z.object({ label: z.string(), href: z.string() })),
  contactPage: z.object({ email: z.string().email() }),
});

const homeSchema = z.object({
  hero: z.object({
    slides: z.array(z.object({ slug: z.string() })).min(1),
  }),
  areaHighlights: z.array(z.object({ slug: z.string() })),
});

const indexSchema = z.object({
  publishedSlugs: z.array(z.string()).min(1),
  featuredSlugs: z.array(z.string()),
  comparisonSlugs: z.array(z.string()),
});

const imageAssetSchema = z.object({
  id: z.string(),
  type: z.literal('photo'),
  localPath: z.string().optional(),
  remoteUrl: z.string().url().optional(),
  sourceUrl: z.string().url(),
  verifiedRealWorld: z.literal(true),
}).refine((value) => Boolean(value.localPath || value.remoteUrl), {
  message: 'Image asset requires localPath or remoteUrl.',
});

const manifestSchema = z.object({
  assets: z.array(imageAssetSchema),
  onsens: z.record(z.string(), z.object({
    hero: z.string(),
    gallery: z.array(z.string()).min(1),
  })),
});

const onsenSchema = z.object({
  identity: z.object({ slug: z.string(), area: z.string(), prefecture: z.string() }),
  summary: z.object({ catchcopy: z.string(), lead: z.string(), shortDescription: z.string() }),
  highlights: z.array(z.string()).min(3),
  spring: z.object({ springTypes: z.array(z.string()).min(1), effects: z.array(z.string()).min(1) }),
  stay: z.object({ dayTripAvailable: z.boolean(), bestFor: z.array(z.string()).min(1) }),
  story: z.object({
    sections: z.array(z.object({ title: z.string(), body: z.array(z.string()).min(1) })).min(1),
    seasonalNotes: z.array(z.object({ season: z.string(), title: z.string(), description: z.string() })),
    modelCourse: z.array(z.string()).min(1),
  }),
});

const journalSchema = z.object({
  slug: z.string(),
  coverSlug: z.string(),
  relatedSlugs: z.array(z.string()),
  sections: z.array(z.object({ title: z.string(), body: z.array(z.string()).min(1) })).min(1),
});

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8'));
}

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

siteSchema.parse(readJson('content/site.json'));
const home = homeSchema.parse(readJson('content/home.json'));
const indexConfig = indexSchema.parse(readJson('content/onsen/index.json'));
const manifest = manifestSchema.parse(readJson('content/images/onsen-images.json'));
const assetIds = new Set(manifest.assets.map((asset) => asset.id));
const onsenDir = path.join(process.cwd(), 'content', 'onsen');
const onsenFiles = fs.readdirSync(onsenDir).filter((file) => file.endsWith('.json') && file !== 'index.json');
const onsenSlugs = new Set();

for (const file of onsenFiles) {
  const data = onsenSchema.parse(readJson(path.join('content/onsen', file)));
  onsenSlugs.add(data.identity.slug);
}

for (const slug of indexConfig.publishedSlugs) {
  ensure(onsenSlugs.has(slug), `Missing content/onsen/${slug}.json`);
  const mapping = manifest.onsens[slug];
  ensure(mapping, `Missing image manifest entry for ${slug}`);
  ensure(assetIds.has(mapping.hero), `Missing hero asset ${mapping.hero} for ${slug}`);
  ensure(mapping.gallery.length >= 1, `${slug} requires at least one gallery image`);
  mapping.gallery.forEach((assetId) => ensure(assetIds.has(assetId), `Missing gallery asset ${assetId} for ${slug}`));
}

home.hero.slides.forEach((slide) => ensure(indexConfig.publishedSlugs.includes(slide.slug), `Home slide references unpublished slug ${slide.slug}`));
home.areaHighlights.forEach((area) => ensure(indexConfig.publishedSlugs.includes(area.slug), `Area highlight references unpublished slug ${area.slug}`));
indexConfig.featuredSlugs.forEach((slug) => ensure(indexConfig.publishedSlugs.includes(slug), `Featured slug ${slug} is not published`));
indexConfig.comparisonSlugs.forEach((slug) => ensure(indexConfig.publishedSlugs.includes(slug), `Comparison slug ${slug} is not published`));

const journalDir = path.join(process.cwd(), 'content', 'journal');
for (const file of fs.readdirSync(journalDir).filter((entry) => entry.endsWith('.json'))) {
  const article = journalSchema.parse(readJson(path.join('content/journal', file)));
  ensure(indexConfig.publishedSlugs.includes(article.coverSlug), `Journal cover slug ${article.coverSlug} is not published`);
  article.relatedSlugs.forEach((slug) => ensure(indexConfig.publishedSlugs.includes(slug), `Journal related slug ${slug} is not published`));
}

for (const asset of manifest.assets) {
  if (asset.localPath) {
    const filePath = path.join(process.cwd(), 'public', asset.localPath.replace(/^\/images\//, 'images/'));
    ensure(fs.existsSync(filePath), `Missing local image asset ${asset.localPath}`);
  }
}

console.log('✅ Content validation passed.');
