import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArea, getAreas, getOnsensByArea, getPurposes, getSiteData } from '../../lib/onsen-site';
import { ImageCredit } from '../../components/site/ImageCredit';
import { OnsenCard } from '../../components/site/OnsenCard';

interface Props {
  params: Promise<{ areaSlug: string }>;
}

export function generateStaticParams() {
  return getAreas().map((area) => ({ areaSlug: area.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { areaSlug } = await params;
  const area = getArea(areaSlug);
  const data = getSiteData();

  if (!area) return { title: 'エリアが見つかりません' };

  return {
    title: `${area.name}の温泉候補`,
    description: area.summary,
    openGraph: {
      title: `${area.name}の温泉候補 | ${data.site.name}`,
      description: area.summary,
      images: [{ url: area.image.src, width: 1200, height: 630, alt: area.image.alt }],
    },
  };
}

export default async function AreaDetailPage({ params }: Props) {
  const { areaSlug } = await params;
  const area = getArea(areaSlug);
  if (!area) notFound();

  const onsens = getOnsensByArea(area.id);
  const purposes = getPurposes();

  return (
    <main className="bg-[#f7f3ec]">
      <section className="relative min-h-[62vh] overflow-hidden bg-stone-950 text-white">
        <Image src={area.image.src} alt={area.image.alt} fill priority sizes="100vw" className="object-cover opacity-75" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/75 to-stone-950/20" />
        <div className="relative mx-auto flex min-h-[62vh] max-w-7xl flex-col justify-end px-5 pb-14 pt-24 md:px-8 md:pb-20">
          <Link href="/areas" className="mb-10 inline-flex w-fit rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur hover:bg-white/20">← エリア一覧へ</Link>
          <p className="text-sm font-bold tracking-[0.28em] text-amber-200">{area.prefectures.join(' / ')}</p>
          <h1 className="mt-5 max-w-4xl font-serif text-5xl font-bold leading-tight md:text-7xl">{area.name}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-stone-100">{area.summary}</p>
          <div className="mt-8"><ImageCredit image={area.image} /></div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold tracking-[0.24em] text-stone-500">ONSEN CANDIDATES</p>
              <h2 className="mt-4 font-serif text-4xl font-bold text-stone-950 md:text-6xl">このエリアの温泉候補</h2>
            </div>
            <Link href="/onsens" className="rounded-full bg-stone-950 px-6 py-3 text-center text-sm font-bold text-white">全温泉を見る</Link>
          </div>
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {onsens.map((onsen, index) => (
              <OnsenCard key={onsen.slug} onsen={onsen} area={area} purposes={purposes} priority={index < 3} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
