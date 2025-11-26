import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { ArrowRightIcon } from 'lucide-react';

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
  return (
    <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden z-0">
      {/* Background Image with Parallax Effect (simulated with fixed for now) */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <Image
          src={data.bgImage}
          alt="Hero Background"
          fill
          className="object-cover pointer-events-none"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center text-white">
        <p className="text-xl md:text-2xl font-light tracking-[0.2em] text-primary-400 mb-6 uppercase animate-fade-in-up">
          {data.subtitle}
        </p>
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-8 leading-tight animate-fade-in-up delay-100">
          {data.title.split('\n').map((line, i) => (
            <span key={i} className="block">{line}</span>
          ))}
        </h1>
        <p className="text-lg md:text-2xl text-gray-200 max-w-3xl mx-auto mb-12 leading-relaxed font-light animate-fade-in-up delay-200">
          {data.description}
        </p>
        
        <div className="flex flex-wrap justify-center gap-6 animate-fade-in-up delay-300">
          {data.actions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Button 
                variant={action.variant === 'primary' ? 'primary' : 'secondary'} 
                size="xl"
                className="min-w-[200px] text-lg"
              >
                {action.label}
                {action.variant === 'primary' && <ArrowRightIcon className="ml-2 w-5 h-5" />}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-white to-transparent" />
      </div>
    </section>
  );
}
