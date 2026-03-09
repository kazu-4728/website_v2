import 'server-only';

import { journalArticleSchema, type JournalArticle } from '@/src/content/schema/site';
import { readJsonDirectory } from '@/src/content/loaders/json';

let cachedArticles: JournalArticle[] | null = null;

export async function loadJournalArticles() {
  if (cachedArticles) return cachedArticles;

  const entries = await readJsonDirectory('content/journal', journalArticleSchema);
  cachedArticles = entries.map((entry) => entry.value).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return cachedArticles;
}

export async function loadJournalArticleBySlug(slug: string) {
  const articles = await loadJournalArticles();
  return articles.find((article) => article.slug === slug) ?? null;
}
