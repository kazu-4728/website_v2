import { redirect } from 'next/navigation';

import { getJournalEntries } from '@/src/features/journal';

export async function generateStaticParams() {
  const entries = await getJournalEntries();
  return entries.map((entry) => ({ slug: entry.slug }));
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/journal/${slug}`);
}
