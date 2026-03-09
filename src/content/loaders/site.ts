import 'server-only';

import { homeSchema, siteSchema, type HomeConfig, type SiteConfig } from '@/src/content/schema/site';
import { readJsonFile } from '@/src/content/loaders/json';

let cachedSite: SiteConfig | null = null;
let cachedHome: HomeConfig | null = null;

export async function loadSiteConfig(): Promise<SiteConfig> {
  if (cachedSite) return cachedSite;
  cachedSite = await readJsonFile('content/site.json', siteSchema);
  return cachedSite;
}

export async function loadHomeConfig(): Promise<HomeConfig> {
  if (cachedHome) return cachedHome;
  cachedHome = await readJsonFile('content/home.json', homeSchema);
  return cachedHome;
}
