import Image from 'next/image';
import Link from 'next/link';
import type { OnsenSpot } from '../../lib/onsen-site';
import { ImageCredit } from './ImageCredit';

interface OnsenCardProps {
  spot: OnsenSpot;
  priority?: boolean;
  size?: 'default' | 'large';
}

export function OnsenCard({ spot, priority = false, size = 'default' }: OnsenCardProps) {
  return (
    <Link
      href={`/docs/${spot.slug}`}
      className="group block overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-stone-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className={`relative overflow-hidden ${size === 'large' ? 'aspect-[4/3]' : 'aspect-[5/4]'}`}>
        <Image
          src={spot.image.src}
          alt={spot.image.alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-stone-900 backdrop-blur">
          {spot.prefecture}
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-xs font-bold tracking-[0.18em] text-white/75">{spot.area}</p>
          <h3 className="mt-1 font-serif text-3xl font-bold leading-tight text-white drop-shadow-sm">
            {spot.name}
          </h3>
        </div>
      </div>

      <div className="space-y-5 p-5 md:p-6">
        <p className="text-base font-semibold leading-7 text-stone-900">{spot.catchcopy}</p>
        <p className="line-clamp-3 text-sm leading-7 text-stone-600">{spot.summary}</p>

        <div className="flex flex-wrap gap-2">
          {spot.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-stone-100 pt-4">
          <span className="text-sm font-bold text-stone-950">詳しく見る</span>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-stone-950 text-white transition-transform group-hover:translate-x-1">
            →
          </span>
        </div>

        <ImageCredit image={spot.image} tone="light" />
      </div>
    </Link>
  );
}
