import Image from 'next/image';
import type { SiteImage } from '../../lib/onsen-site';
import { ImageCredit } from './ImageCredit';

interface OnsenGalleryProps {
  images: SiteImage[];
  name: string;
}

export function OnsenGallery({ images, name }: OnsenGalleryProps) {
  const gallery = images.length ? images : [];
  if (!gallery.length) return null;
  return (
    <section aria-label={`${name}の画像ギャラリー`} className="space-y-3">
      <div className="grid gap-3 md:grid-cols-[1.35fr_0.65fr] md:grid-rows-2">
        <div className="relative min-h-[300px] overflow-hidden rounded-[1.5rem] bg-[#221a14] md:row-span-2 md:min-h-[450px]">
          <Image src={gallery[0].src} alt={gallery[0].alt} fill priority sizes="(max-width: 768px) 100vw, 65vw" className="object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5 pt-16"><p className="text-sm font-bold text-white">{name}の景色</p></div>
        </div>
        {gallery.slice(1, 3).map((image) => <div key={image.src} className="relative min-h-[180px] overflow-hidden rounded-[1.5rem] bg-[#221a14]"><Image src={image.src} alt={image.alt} fill sizes="(max-width: 768px) 100vw, 35vw" className="object-cover transition duration-500 hover:scale-105" /></div>)}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-xs font-semibold text-[#76624f]">現地の景観・温泉地の雰囲気を伝える参考画像</p><ImageCredit image={gallery[0]} tone="light" /></div>
    </section>
  );
}
