'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { useEffect, useState } from 'react';

import { ButtonLink } from '@/src/components/shared/ButtonLink';
import { Pill } from '@/src/components/shared/Pill';
import { SiteLink } from '@/src/components/shared/SiteLink';
import type { ImageAsset } from '@/src/content/schema/site';
import { getImageSrc } from '@/src/lib/images/resolve';
import { cn } from '@/src/lib/utils';

interface HeroCarouselProps {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  slides: Array<{
    slug: string;
    kicker: string;
    heading: string;
    description: string;
    image: ImageAsset;
  }>;
}

export function HeroCarousel({ eyebrow, title, description, primaryCta, secondaryCta, slides }: HeroCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on('select', onSelect);

    const interval = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => {
      clearInterval(interval);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  return (
    <section className="relative overflow-hidden border-b border-white/8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(201,167,92,0.16),_transparent_42%),linear-gradient(180deg,rgba(8,11,12,0.12),rgba(8,11,12,0.76))]" />
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end lg:py-24">
        <div className="relative z-10 flex flex-col gap-7 lg:pb-10">
          <Pill className="w-fit border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 text-[var(--color-accent)]">{eyebrow}</Pill>
          <div className="space-y-5">
            <h1 className="max-w-xl text-balance text-5xl font-semibold leading-[1.02] text-white md:text-7xl">{title}</h1>
            <p className="max-w-xl text-base leading-8 text-[var(--color-muted)] md:text-lg">{description}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={primaryCta.href}>{primaryCta.label}</ButtonLink>
            <ButtonLink href={secondaryCta.href} variant="secondary">
              {secondaryCta.label}
            </ButtonLink>
          </div>
        </div>

        <div className="relative z-10 overflow-hidden rounded-[2rem] border border-white/10 bg-black/30 shadow-[0_40px_100px_rgba(0,0,0,0.35)]">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {slides.map((slide) => (
                <article key={slide.slug} className="relative min-w-0 flex-[0_0_100%]">
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(6,8,9,0.9)] via-[rgba(6,8,9,0.15)] to-transparent" />
                  <img src={getImageSrc(slide.image)} alt={slide.image.alt} className="h-[460px] w-full object-cover md:h-[560px]" />
                  <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 md:p-8">
                    <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">{slide.kicker}</span>
                    <h2 className="max-w-xl text-3xl font-semibold leading-tight text-white md:text-5xl">{slide.heading}</h2>
                    <p className="max-w-lg text-sm leading-7 text-[var(--color-fog)] md:text-base">{slide.description}</p>
                    <SiteLink href={`/onsen/${slide.slug}`} className="inline-flex w-fit items-center text-sm font-semibold text-white transition-colors hover:text-[var(--color-accent)]">
                      詳細を見る
                    </SiteLink>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="absolute bottom-6 right-6 z-20 flex gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.slug}
                type="button"
                onClick={() => emblaApi?.scrollTo(index)}
                className={cn(
                  'h-2.5 rounded-full transition-all',
                  index === selectedIndex ? 'w-10 bg-[var(--color-accent)]' : 'w-2.5 bg-white/40'
                )}
                aria-label={`${slide.heading} に移動`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

