import Image from 'next/image';
import Link from 'next/link';
import type { Area, Onsen } from '../../lib/onsen-site';
import { ImageCredit } from './ImageCredit';

interface AreaCardProps {
  area: Area;
  onsens: Onsen[];
  priority?: boolean;
}

export function AreaCard({ area, onsens, priority = false }: AreaCardProps) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/areas/${area.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={area.image.src}
            alt={area.image.alt}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute left-5 top-5 flex flex-wrap gap-2">
            {area.prefectures.map((prefecture) => (
              <span key={prefecture} className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-stone-900 backdrop-blur">
                {prefecture}
              </span>
            ))}
          </div>
          <div className="absolute bottom-5 left-5 right-5">
            <p className="text-xs font-bold tracking-[0.2em] text-white/70">AREA GUIDE</p>
            <h2 className="mt-2 font-serif text-4xl font-bold leading-tight text-white drop-shadow-sm">{area.name}</h2>
          </div>
        </div>
      </Link>

      <div className="space-y-5 p-6">
        <p className="text-sm leading-7 text-stone-600">{area.summary}</p>
        <div className="flex flex-wrap gap-2">
          {onsens.slice(0, 5).map((onsen) => (
            <Link key={onsen.slug} href={`/onsens/${onsen.slug}`} className="rounded-full bg-[#f7f3ec] px-3 py-1 text-xs font-bold text-stone-700 hover:bg-stone-200">
              {onsen.name}
            </Link>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-stone-100 pt-4">
          <Link href={`/areas/${area.slug}`} className="text-sm font-bold text-stone-950">
            エリアを見る
          </Link>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-stone-950 text-white transition-transform group-hover:translate-x-1">→</span>
        </div>
        <ImageCredit image={area.image} tone="light" />
      </div>
    </article>
  );
}
