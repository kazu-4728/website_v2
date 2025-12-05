import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { CtaSection } from '../../lib/content';

interface Props {
  data: CtaSection;
}

export function CtaFullscreen({ data }: Props) {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center text-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={data.bgImage}
          alt="CTA Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950/80 via-primary-900/60 to-dark-950/90 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative z-10 px-6 sm:px-8 max-w-4xl mx-auto py-24">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8 tracking-tight leading-tight">
          {data.title}
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
          {data.description}
        </p>
        <Link href={data.action.href}>
          <Button 
            size="xl" 
            className="bg-white text-dark-950 hover:bg-gray-100 min-w-[200px] sm:min-w-[240px] font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-white/20"
          >
            {data.action.label}
          </Button>
        </Link>
      </div>
    </section>
  );
}
