'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { Area, Onsen, PurposeGuide } from '../../lib/onsen-site';
import { OnsenCard } from './OnsenCard';

interface Props { onsens: Onsen[]; purposes: PurposeGuide[]; areas: Area[] }
export function OnsensDirectoryClient({ onsens: allOnsens, purposes, areas }: Props) {
  const searchParams = useSearchParams();
  const prefecture = searchParams.get('prefecture') ?? '';
  const onsens = prefecture ? allOnsens.filter((onsen) => onsen.prefecture === prefecture) : allOnsens;
  const prefectures = Array.from(new Set(allOnsens.map((onsen) => onsen.prefecture)));
  const tags = Array.from(new Set(onsens.flatMap((onsen) => onsen.tags))).slice(0, 12);
  const getArea = (onsen: Onsen) => areas.find((area) => area.id === onsen.areaId);
  return <section className="py-12 md:py-20"><div className="mx-auto max-w-7xl px-5 md:px-8"><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">{prefecture ? `${prefecture} GUIDE` : 'KANTO GUIDE'}</p><h2 className="mt-3 font-serif text-4xl font-bold text-[#33291f]">{onsens.length}件の温泉候補</h2><div className="mt-4 flex flex-wrap gap-2">{tags.map((tag) => <span key={tag} className="rounded-full bg-[#f1e3c7] px-3 py-1 text-xs font-bold text-[#6c4b22]">{tag}</span>)}</div></div><p className="max-w-md text-sm leading-7 text-[#66594d]">泉質、入浴体験、画像枚数、公式サイト、Googleマップ、施設案内をまとめて比較できます。</p></div><div className="mb-8 flex flex-wrap items-center gap-2">{prefectures.map((name) => <Link key={name} href={`/onsens?prefecture=${encodeURIComponent(name)}`} className={`rounded-full border px-4 py-2 text-sm font-bold ${name === prefecture ? 'border-[#4b3829] bg-[#4b3829] text-[#fffaf0]' : 'border-[#cbb18e] bg-white text-[#4b3829] hover:bg-[#f1e3c7]'}`}>{name}</Link>)}{prefecture && <Link href="/onsens" className="portal-button-outline">全件に戻る</Link>}</div><div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">{onsens.map((onsen, index) => <OnsenCard key={onsen.slug} onsen={onsen} area={getArea(onsen)} purposes={purposes} priority={index < 3} />)}</div></div></section>;
}
