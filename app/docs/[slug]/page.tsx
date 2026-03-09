import { redirect } from 'next/navigation';

import { getOnsens } from '@/src/features/onsen';

export async function generateStaticParams() {
  const onsens = await getOnsens();
  return onsens.map((onsen) => ({ slug: onsen.identity.slug }));
}

export default async function DocsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/onsen/${slug}`);
}
