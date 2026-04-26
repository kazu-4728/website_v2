import Link from 'next/link';
import { notFound } from 'next/navigation';
import { OnsenCard } from '../../components/site/OnsenCard';
import { getAreaForOnsen, getPurpose, getPurposeOnsens, getPurposes, getSiteData } from '../../lib/onsen-site';

interface Props {
  params: Promise<{ purposeSlug: string }>;
}

export function generateStaticParams() {
  return getPurposes().map((purpose) => ({ purposeSlug: purpose.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { purposeSlug } = await params;
  const purpose = getPurpose(purposeSlug);
  const data = getSiteData();
  if (!purpose) return { title: '目的が見つかりません' };
  return {
    title: `${purpose.name}の温泉候補`,
    description: purpose.description,
    openGraph: { title: `${purpose.name}の温泉候補 | ${data.site.name}`, description: purpose.description },
  };
}

export default async function PurposeDetailPage({ params }: Props) {
  const { purposeSlug } = await params;
  const purpose = getPurpose(purposeSlug);
  if (!purpose) notFound();

  const onsens = getPurposeOnsens(purpose);
  const purposes = getPurposes();

  return (
    <main className="bg-[#f7f3ec]">
      <section className="border-b border-stone-200 bg-stone-950 py-20 text-white md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Link href="/purposes" className="text-sm font-bold text-stone-300 hover:text-white">← 目的別一覧へ戻る</Link>
          <div className="mt-8 max-w-4xl">
            <p className="text-sm font-bold tracking-[0.24em] text-amber-200">PURPOSE</p>
            <h1 className="mt-4 font-serif text-5xl font-bold leading-tight md:text-7xl">{purpose.name}</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-300 md:text-lg">{purpose.description}</p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 md:grid-cols-2 lg:grid-cols-3 md:px-8">
          {onsens.map((onsen, index) => (
            <OnsenCard key={onsen.slug} onsen={onsen} area={getAreaForOnsen(onsen)} purposes={purposes} priority={index < 3} />
          ))}
        </div>
      </section>
    </main>
  );
}
