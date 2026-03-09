'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { useEffect, useState } from 'react';

import { Pill } from '@/src/components/shared/Pill';
import type { ImageAsset } from '@/src/content/schema/site';
import { getImageSrc } from '@/src/lib/images/resolve';
import { cn } from '@/src/lib/utils';

export function PhotoGallery({ title, images }: { title: string; images: ImageAsset[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  return (
    <section className="space-y-5 rounded-[2rem] border border-white/8 bg-[var(--color-panel)] p-5 md:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent)]">Photo Gallery</p>
          <h2 className="mt-2 text-2xl font-semibold text-white md:text-3xl">{title}</h2>
        </div>
        <Pill>{images.length} photos</Pill>
      </div>
      <div className="overflow-hidden rounded-[1.5rem]" ref={emblaRef}>
        <div className="flex">
          {images.map((image) => (
            <div key={image.id} className="min-w-0 flex-[0_0_100%]">
              <img src={getImageSrc(image)} alt={image.alt} className="h-[360px] w-full object-cover md:h-[520px]" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        {images.map((image, index) => (
          <button key={image.id} type="button" onClick={() => emblaApi?.scrollTo(index)} className={cn('overflow-hidden rounded-2xl border transition-colors', index === selectedIndex ? 'border-[var(--color-accent)]' : 'border-white/8')}>
            <img src={getImageSrc(image)} alt={image.alt} className="h-24 w-full object-cover" />
          </button>
        ))}
      </div>
    </section>
  );
}
