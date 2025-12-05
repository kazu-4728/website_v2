import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { ArrowRightIcon } from 'lucide-react';
import { ImageCredit } from '../ui/ImageCredit';
import { getImageMetadata } from '../../lib/images';

interface HeroProps {
  data: {
    title: string;
    subtitle: string;
    description: string;
    bgImage: string;
    actions: Array<{
      label: string;
      href: string;
      variant: 'primary' | 'secondary';
    }>;
  };
}

export function CinematicHero({ data }: HeroProps) {
  // 画像のメタデータを取得（著作権情報）
  const imageMetadata = getImageMetadata('hero', 'main');

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={data.bgImage}
          alt="Hero Background"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Darker, more dramatic overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-dark-950" />
        {/* 画像のクレジット表示 */}
        <ImageCredit metadata={imageMetadata} position="bottom-right" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 text-center text-white py-32">
        <p className="text-lg md:text-xl font-light tracking-[0.3em] text-primary-400 mb-8 uppercase animate-fade-in-up">
          {data.subtitle}
        </p>
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-10 leading-[1.1] animate-fade-in-up delay-100">
          {data.title.split('\n').map((line, i) => (
            <span key={i} className="block">{line}</span>
          ))}
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-14 leading-relaxed animate-fade-in-up delay-200">
          {data.description}
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 animate-fade-in-up delay-300">
          {data.actions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Button 
                variant={action.variant === 'primary' ? 'primary' : 'secondary'} 
                size="xl"
                className="min-w-[180px] sm:min-w-[220px] text-base sm:text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                {action.label}
                {action.variant === 'primary' && <ArrowRightIcon className="ml-2 w-5 h-5" />}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block">
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white/60 to-transparent" />
      </div>
    </section>
  );
}
