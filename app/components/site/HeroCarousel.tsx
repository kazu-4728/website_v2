'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { SiteImage } from '../../lib/onsen-site';

interface HeroCarouselProps {
  images: SiteImage[];
}

export function HeroCarousel({ images }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const safeImages = images.filter((image, imageIndex, all) => image.src && all.findIndex((item) => item.src === image.src) === imageIndex).slice(0, 6);

  useEffect(() => {
    if (safeImages.length < 2) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % safeImages.length), 6500);
    return () => window.clearInterval(timer);
  }, [safeImages.length]);

  if (!safeImages.length) return null;
  const current = safeImages[index % safeImages.length];

  return (
    <div className="absolute inset-0" aria-label="関東の温泉風景スライド">
      {safeImages.map((image, imageIndex) => (
        <Image
          key={`${image.src}-${imageIndex}`}
          src={image.src}
          alt={image.alt}
          fill
          priority={imageIndex === 0}
          sizes="100vw"
          className={`object-cover transition-opacity duration-1000 ${imageIndex === index ? 'opacity-70' : 'opacity-0'}`}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(213,170,97,0.22),transparent_30%),linear-gradient(115deg,#201710_10%,rgba(36,27,21,0.82)_46%,rgba(36,27,21,0.24)_100%)]" />
      <div className="absolute inset-x-0 bottom-5 z-10 mx-auto flex max-w-7xl items-end justify-between px-5 md:px-8">
        <p className="max-w-[55%] text-[10px] font-semibold leading-5 text-white/75 md:text-xs">{current.alt}</p>
        <div className="flex items-center gap-2" role="group" aria-label="温泉画像スライド操作">
          <button type="button" onClick={() => setIndex((index - 1 + safeImages.length) % safeImages.length)} className="hero-carousel-control" aria-label="前の温泉画像">
            ←
          </button>
          <div className="flex gap-1.5" aria-label={`${index + 1}枚目 / ${safeImages.length}枚`}>
            {safeImages.map((image, imageIndex) => (
              <button key={`${image.src}-dot`} type="button" onClick={() => setIndex(imageIndex)} className={`h-2 rounded-full transition-all ${imageIndex === index ? 'w-8 bg-[#efd092]' : 'w-2 bg-white/55 hover:bg-white'}`} aria-label={`${imageIndex + 1}枚目の温泉画像を表示`} aria-current={imageIndex === index ? 'true' : undefined} />
            ))}
          </div>
          <button type="button" onClick={() => setIndex((index + 1) % safeImages.length)} className="hero-carousel-control" aria-label="次の温泉画像">
            →
          </button>
        </div>
      </div>
    </div>
  );
}
