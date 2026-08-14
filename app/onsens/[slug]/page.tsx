import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAreaForOnsen, getOnsen, getOnsens, getPurposes, getRelatedOnsens, getSiteData } from '../../lib/onsen-site';
import { ImageCredit } from '../../components/site/ImageCredit';
import { OnsenCard } from '../../components/site/OnsenCard';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getOnsens().map((onsen) => ({ slug: onsen.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const onsen = getOnsen(slug);
  const data = getSiteData();

  if (!onsen) return { title: '温泉が見つかりません' };

  return {
    title: `${onsen.name} | 公式情報付き温泉ガイド`,
    description: onsen.summary,
    openGraph: {
      title: `${onsen.name} | ${data.site.name}`,
      description: onsen.summary,
      images: [{ url: onsen.image.src, width: 1200, height: 630, alt: onsen.image.alt }],
    },
  };
}

export default async function OnsenDetailPage({ params }: Props) {
  const { slug } = await params;
  const onsen = getOnsen(slug);
  if (!onsen) notFound();

  const area = getAreaForOnsen(onsen);
  const purposes = getPurposes();
  const related = getRelatedOnsens(onsen.slug, 3);
  const matchedPurposes = purposes.filter((purpose) => onsen.useCases.includes(purpose.id));

  return (
    <main className="bg-[#f7f3ec]">
      <section className="relative min-h-[70vh] overflow-hidden bg-stone-950 text-white">
        <Image src={onsen.image.src} alt={onsen.image.alt} fill priority sizes="100vw" className="object-cover opacity-75" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/75 to-stone-950/20" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-stone-950 to-transparent" />
        <div className="relative mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-end px-5 pb-14 pt-24 md:px-8 md:pb-20">
          <Link href="/onsens" className="mb-10 inline-flex w-fit rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur hover:bg-white/20">← 温泉一覧へ</Link>
          <p className="text-sm font-bold tracking-[0.28em] text-amber-200">{onsen.prefecture}{area ? ` / ${area.name}` : ''}</p>
          <h1 className="mt-5 max-w-4xl font-serif text-5xl font-bold leading-tight md:text-7xl">{onsen.name}</h1>
          <p className="mt-6 max-w-2xl text-xl font-semibold leading-9 text-stone-100">{onsen.catchcopy}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {matchedPurposes.map((purpose) => <span key={purpose.id} className="rounded-full bg-amber-200 px-4 py-2 text-sm font-bold text-stone-950">{purpose.shortLabel}</span>)}
            {onsen.tags.map((tag) => <span key={tag} className="rounded-full bg-white/12 px-4 py-2 text-sm font-semibold backdrop-blur">{tag}</span>)}
          </div>
          <div className="mt-8"><ImageCredit image={onsen.image} /></div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-[0.78fr_1.22fr] md:px-8">
          <aside className="space-y-5">
            <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-stone-200">
              <p className="text-sm font-bold tracking-[0.2em] text-stone-500">OFFICIAL INFO</p>
              <h2 className="mt-4 font-serif text-3xl font-bold text-stone-950">公式情報</h2>
              <p className="mt-4 text-sm leading-7 text-stone-600">営業時間・料金・休館日・アクセスは変わるため、訪問前に公式サイトで確認してください。</p>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                <Link href={onsen.officialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex justify-center rounded-full bg-[#4b3829] px-5 py-3 text-sm font-bold text-[#fffaf0] hover:bg-[#2f241c]">{onsen.officialName}へ</Link>
                <Link href={onsen.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex justify-center rounded-full border border-[#b99a70] px-5 py-3 text-sm font-bold text-[#4b3829] hover:bg-[#f5ead8]">Googleマップ</Link>
              </div>
              <p className="mt-3 text-xs text-stone-500">情報確認日: {onsen.verifiedAt}</p>
            </div>
            <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-stone-200">
              <p className="text-sm font-bold tracking-[0.2em] text-stone-500">BASIC DATA</p>
              <dl className="mt-5 space-y-5 text-sm">
                <div><dt className="font-bold text-stone-500">種別</dt><dd className="mt-1 font-semibold text-stone-950">{onsen.kind}</dd></div>
                <div><dt className="font-bold text-stone-500">都道府県</dt><dd className="mt-1 font-semibold text-stone-950">{onsen.prefecture}</dd></div>
                <div><dt className="font-bold text-stone-500">エリア</dt><dd className="mt-1 font-semibold text-stone-950">{area?.name ?? onsen.areaId}</dd></div>
                <div><dt className="font-bold text-stone-500">泉質</dt><dd className="mt-2 flex flex-wrap gap-2">{onsen.springTypes.map((type) => <span key={type} className="rounded-full bg-[#f7f3ec] px-3 py-1 text-xs font-bold text-stone-700">{type}</span>)}</dd></div>
              </dl>
            </div>
          </aside>

          <div className="space-y-8">
            <section className="rounded-[2rem] bg-white p-7 shadow-sm ring-1 ring-stone-200 md:p-10">
              <p className="text-sm font-bold tracking-[0.2em] text-stone-500">OVERVIEW</p>
              <h2 className="mt-4 font-serif text-4xl font-bold text-stone-950">候補としての見方</h2>
              <p className="mt-6 text-lg leading-9 text-stone-700">{onsen.summary}</p>
            </section>
            <section className="rounded-[2rem] bg-white p-7 shadow-sm ring-1 ring-stone-200 md:p-10">
              <p className="text-sm font-bold tracking-[0.2em] text-stone-500">ACCESS</p>
              <h2 className="mt-4 font-serif text-3xl font-bold text-stone-950">アクセスの目安</h2>
              <p className="mt-5 text-base leading-8 text-stone-700">{onsen.access}</p>
              <Link href={onsen.mapUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex rounded-full border border-[#b99a70] px-5 py-3 text-sm font-bold text-[#4b3829] hover:bg-[#f5ead8]">Googleマップで周辺を見る</Link>
            </section>
            <section className="rounded-[2rem] bg-[#fffaf0] p-7 shadow-sm ring-1 ring-[#d8c8ae] md:p-10">
              <p className="text-sm font-bold tracking-[0.2em] text-[#9a8062]">FACILITIES</p>
              <h2 className="mt-4 font-serif text-3xl font-bold text-[#33291f]">宿泊・日帰り施設を探す</h2>
              <p className="mt-4 text-sm leading-7 text-[#66594d]">営業日や入浴条件は施設ごとに異なります。公式案内と地図を開いて、訪問前に最新情報を確認してください。</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {onsen.facilities.map((facility) => <div key={facility.name} className="rounded-2xl border border-[#eadfce] bg-white p-4"><p className="text-xs font-bold text-[#9a8062]">{facility.kind}</p><p className="mt-2 min-h-10 text-sm font-bold leading-6 text-[#4b4036]">{facility.name}</p><div className="mt-4 flex gap-3 text-xs font-bold"><Link href={facility.url} target="_blank" rel="noopener noreferrer" className="text-[#8a5b2b] underline underline-offset-2">施設案内</Link><Link href={facility.mapUrl} target="_blank" rel="noopener noreferrer" className="text-[#8a5b2b] underline underline-offset-2">地図</Link></div></div>)}
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-bold tracking-[0.24em] text-stone-500">RELATED</p>
            <h2 className="mt-4 font-serif text-4xl font-bold text-stone-950 md:text-5xl">近い条件の温泉候補</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {related.map((item) => <OnsenCard key={item.slug} onsen={item} area={getAreaForOnsen(item)} purposes={purposes} />)}
          </div>
        </div>
      </section>
    </main>
  );
}
