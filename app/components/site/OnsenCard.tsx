import Image from 'next/image';
import Link from 'next/link';
import type { Area, Onsen, PurposeGuide } from '../../lib/onsen-site';
import { ImageCredit } from './ImageCredit';

interface OnsenCardProps {
  onsen: Onsen;
  area?: Area;
  purposes?: PurposeGuide[];
  priority?: boolean;
  compact?: boolean;
}

export function OnsenCard({ onsen, area, purposes = [], priority = false, compact = false }: OnsenCardProps) {
  const matchedPurposes = purposes.filter((purpose) => onsen.useCases.includes(purpose.id));

  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-[#d8c8ae] bg-[#fffdf8] shadow-[0_16px_50px_rgba(74,55,35,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(74,55,35,0.16)]">
      <Link href={`/onsens/${onsen.slug}`} className="block">
        <div className={`relative overflow-hidden ${compact ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
          <Image
            src={onsen.image.src}
            alt={onsen.image.alt}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#201a15]/90 via-[#201a15]/25 to-transparent" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-[#fffaf0]/95 px-3 py-1 text-xs font-bold text-[#554331] backdrop-blur">{onsen.prefecture}</span>
            {area && <span className="rounded-full bg-[#47382b]/80 px-3 py-1 text-xs font-bold text-[#fffaf0] backdrop-blur">{area.name}</span>}
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-xs font-bold tracking-[0.18em] text-[#e8c98c]">{onsen.kind}</p>
            <h3 className="mt-1 font-serif text-3xl font-bold leading-tight text-white drop-shadow-sm">{onsen.name}</h3>
          </div>
        </div>
      </Link>

      <div className="space-y-5 p-5 md:p-6">
        <p className="text-base font-semibold leading-7 text-[#2e261f]">{onsen.catchcopy}</p>
        <p className="line-clamp-3 text-sm leading-7 text-[#66594d]">{onsen.summary}</p>

        <div className="flex flex-wrap gap-2">
          {matchedPurposes.slice(0, 3).map((purpose) => <span key={purpose.id} className="rounded-full bg-[#f1e3c7] px-3 py-1 text-xs font-bold text-[#6c4b22]">{purpose.shortLabel}</span>)}
          {onsen.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded-full bg-[#f5efe5] px-3 py-1 text-xs font-semibold text-[#675b50]">{tag}</span>)}
        </div>

        <dl className="grid gap-3 rounded-2xl bg-[#f7f0e4] p-4 text-xs text-[#66594d]">
          <div><dt className="font-bold text-[#9a8062]">泉質</dt><dd className="mt-1 font-semibold text-[#33291f]">{onsen.springTypes.join(' / ')}</dd></div>
          <div><dt className="font-bold text-[#9a8062]">公式情報</dt><dd className="mt-1 font-semibold text-[#33291f]">{onsen.officialName}</dd></div>
        </dl>

        <div className="grid gap-2 border-t border-[#eadfce] pt-4 sm:grid-cols-3">
          <Link href={`/onsens/${onsen.slug}`} className="rounded-full bg-[#4b3829] px-4 py-2.5 text-center text-sm font-bold text-[#fffaf0] transition-colors hover:bg-[#2f241c]">詳細を見る</Link>
          <Link href={onsen.officialUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#b99a70] px-4 py-2.5 text-center text-sm font-bold text-[#4b3829] transition-colors hover:bg-[#f5ead8]">公式サイト</Link>
          <Link href={onsen.mapUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#b99a70] px-4 py-2.5 text-center text-sm font-bold text-[#4b3829] transition-colors hover:bg-[#f5ead8]">Googleマップ</Link>
        </div>

        <div className="space-y-2 rounded-2xl border border-[#eadfce] bg-[#fffaf0] p-4">
          <div className="flex items-center justify-between gap-3"><p className="text-xs font-bold tracking-[0.14em] text-[#9a8062]">周辺施設・探し方</p><span className="text-xs text-[#9a8062]">3 links</span></div>
          <div className="grid gap-2">
            {onsen.facilities.slice(0, 3).map((facility) => <div key={facility.name} className="flex items-center justify-between gap-2 text-sm"><span className="truncate font-semibold text-[#4b4036]">{facility.name}</span><div className="flex shrink-0 gap-2"><Link href={facility.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#8a5b2b] underline underline-offset-2">案内</Link><Link href={facility.mapUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#8a5b2b] underline underline-offset-2">地図</Link></div></div>)}
          </div>
        </div>

        <div className="flex flex-col gap-2 text-xs text-[#8d7d6b]"><span>情報確認日: {onsen.verifiedAt}</span><ImageCredit image={onsen.image} tone="light" /></div>
      </div>
    </article>
  );
}
