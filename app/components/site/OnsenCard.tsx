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
    <article className="group overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-stone-900 backdrop-blur">
              {onsen.prefecture}
            </span>
            {area && (
              <span className="rounded-full bg-stone-950/75 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                {area.name}
              </span>
            )}
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-xs font-bold tracking-[0.18em] text-white/70">{onsen.kind}</p>
            <h3 className="mt-1 font-serif text-3xl font-bold leading-tight text-white drop-shadow-sm">
              {onsen.name}
            </h3>
          </div>
        </div>
      </Link>

      <div className="space-y-5 p-5 md:p-6">
        <p className="text-base font-semibold leading-7 text-stone-950">{onsen.catchcopy}</p>
        <p className="line-clamp-3 text-sm leading-7 text-stone-600">{onsen.summary}</p>

        <div className="flex flex-wrap gap-2">
          {matchedPurposes.slice(0, 3).map((purpose) => (
            <span key={purpose.id} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">
              {purpose.shortLabel}
            </span>
          ))}
          {onsen.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
              {tag}
            </span>
          ))}
        </div>

        <dl className="grid gap-3 rounded-2xl bg-[#f7f3ec] p-4 text-xs text-stone-700">
          <div>
            <dt className="font-bold text-stone-500">泉質</dt>
            <dd className="mt-1 font-semibold text-stone-900">{onsen.springTypes.join(' / ')}</dd>
          </div>
          <div>
            <dt className="font-bold text-stone-500">公式情報</dt>
            <dd className="mt-1 font-semibold text-stone-900">{onsen.officialName}</dd>
          </div>
        </dl>

        <div className="grid gap-2 border-t border-stone-100 pt-4 sm:grid-cols-2">
          <Link href={`/onsens/${onsen.slug}`} className="rounded-full bg-stone-950 px-4 py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-stone-800">
            詳細を見る
          </Link>
          <Link href={onsen.officialUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-stone-300 px-4 py-2.5 text-center text-sm font-bold text-stone-900 transition-colors hover:bg-stone-100">
            公式サイト
          </Link>
        </div>

        <div className="flex flex-col gap-2 text-xs text-stone-500">
          <span>情報確認日: {onsen.verifiedAt}</span>
          <ImageCredit image={onsen.image} tone="light" />
        </div>
      </div>
    </article>
  );
}
