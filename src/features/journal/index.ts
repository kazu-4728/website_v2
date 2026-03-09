import { loadJournalArticleBySlug, loadJournalArticles } from '@/src/content/loaders/journal';

export async function getJournalEntries() {
  return loadJournalArticles();
}

export async function getJournalEntry(slug: string) {
  return loadJournalArticleBySlug(slug);
}
